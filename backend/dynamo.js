const AWS = require("aws-sdk");
const uuid = require("uuid");
const algolia = require("./algolia");
const path = require("path");
require("dotenv").config({
    path: path.resolve(process.cwd(), ".env.local"),
});

AWS.config.update({
    accessKeyId: process.env.AWS_ACCOUNT_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCOUNT_SECRET_ACCESS_KEY,
    region: "eu-central-1",
});
const client = new AWS.DynamoDB.DocumentClient();

const getAllItems = async () => {
    const params = {
        TableName: process.env.ITEMS_TABLE_NAME,
        FilterExpression: "#status = :status",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":status": "published",
        },
    };
    const items = await client.scan(params).promise();
    return items;
};

const getItem = async id => {
    const params = {
        TableName: process.env.ITEMS_TABLE_NAME,
        Key: {
            id,
        },
    };
    const item = await client.get(params).promise();
    return item;
};

const getRentingHistory = async user => {
    const params = {
        TableName: process.env.RENT_HISTORY_TABLE_NAME,
        KeyConditionExpression: "#user = :user",
        ExpressionAttributeNames: {
            "#user": "user",
        },
        ExpressionAttributeValues: {
            ":user": user,
        },
    };
    const result = await client.query(params).promise();
    return result.Items;
};

const insertItem = async item => {
    const itemId = uuid.v4();
    const params = {
        TableName: process.env.ITEMS_TABLE_NAME,
        Item: {
            ...item,
            id: itemId,
        },
        ConditionExpression: "attribute_not_exists(id)",
    };
    await client.put(params).promise();

    // Save the same item in Algolia so we can search it later
    const itemsIndex = await algolia.getItemsIndex();
    await itemsIndex.saveObjects([
        {
            ...params.Item,
            objectID: itemId, // Algolia records are required to have an objectID parameter
        },
    ]);

    return params.Item;
};

const insertRentHistory = async rentInfo => {
    const params = {
        TableName: process.env.RENT_HISTORY_TABLE_NAME,
        Item: {
            user: rentInfo.user, // hash key
            itemId: rentInfo.item.id, // range key
            ...rentInfo.item, // rest of the item
        },
    };
    delete params.Item.id; // but remove the id property cause we set itemId
    await client.put(params).promise();
};

const deleteItem = async id => {
    const params = {
        TableName: process.env.ITEMS_TABLE_NAME,
        Key: {
            id,
        },
        ReturnValues: "ALL_OLD",
    };
    const result = await client.delete(params).promise();

    // Delete it from Algolia as well
    const itemsIndex = await algolia.getItemsIndex();
    await itemsIndex.deleteObjects([id]);

    return result;
};

const updateItem = async updatedItem => {
    /*
    Yes, I will send the entire updated item, but if I change the item attributes 
    at any point, I don't have to change this function too.
    */
    let updateExpr = "SET ";
    let exprAttrNames = {};
    let exprAttrValues = {};
    const keys = Object.keys(updatedItem);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key === "id") {
            continue;
        }
        updateExpr += `#${key} = :${key}`;
        if (i < keys.length - 1) {
            updateExpr += ", ";
        }
        exprAttrNames[`#${key}`] = key;
        exprAttrValues[`:${key}`] = updatedItem[key];
    }

    const params = {
        TableName: process.env.ITEMS_TABLE_NAME,
        Key: {
            id: updatedItem.id,
        },
        ReturnValues: "ALL_NEW",
        UpdateExpression: updateExpr,
        ExpressionAttributeNames: exprAttrNames,
        ExpressionAttributeValues: exprAttrValues,
    };

    const result = await client.update(params).promise();

    // Update in algolia too
    const itemsIndex = await algolia.getItemsIndex();
    await itemsIndex.saveObjects([
        {
            ...updatedItem,
            objectID: updatedItem.id,
        },
    ]);

    return result.Attributes;
};

const rentItem = async itemToRent => {
    const params = {
        TableName: process.env.ITEMS_TABLE_NAME,
        Key: {
            id: itemToRent.id,
        },
        ReturnValues: "ALL_NEW",
        UpdateExpression: "SET #status = :status, #updatedAt = :updatedAt",
        ExpressionAttributeNames: {
            "#status": "status",
            "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
            ":status": "rented",
            ":updatedAt": new Date().toISOString(),
        },
    };
    const result = await client.update(params).promise();

    // Delete from algolia because we can't search for it anymore
    const itemsIndex = await algolia.getItemsIndex();
    await itemsIndex.deleteObjects([itemToRent.id]);

    return result.Attributes;
};

module.exports = {
    getAllItems,
    getItem,
    getRentingHistory,
    insertItem,
    deleteItem,
    updateItem,
    rentItem,
    insertRentHistory,
};
