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
    // Perform a scan on the items table, returning all the items

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
    // Get a single item from the database, with the given id

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
    // Get the entire renting history for the given user

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
    // Insert an item into the database

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
    // Insert the given item into the given user's history.
    // Both the email and the item are sent through the 'rentInfo' parameter,
    // as well as the payment type.
    // Check frontend/src/components/ReviewOrder.js

    const params = {
        TableName: process.env.RENT_HISTORY_TABLE_NAME,
        Item: {
            user: rentInfo.user, // hash key
            itemId: rentInfo.item.id, // range key
            ...rentInfo.item, // rest of the item
            paymentType: rentInfo.paymentType,
        },
    };
    delete params.Item.id; // but remove the id property cause we set itemId
    await client.put(params).promise();
};

const updateItem = async updatedItem => {
    // Update the given item. The updated item is sent in its entirety
    // I could have checked for/sent only the changes, but eh. =)

    let updateExpr = "SET ";
    let exprAttrNames = {};
    let exprAttrValues = {};
    const keys = Object.keys(updatedItem);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key === "id") {
            // skip the id as that remains the same
            continue;
        }
        // Construct the UpdateExpression, ExpressionAttributeNames and
        // ExpressionAttributeValues in the required format
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

    // Update the same item in algolia too
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
    // Update the given item, setting it's status to 'rented' and
    // it's updatedAt attribute to 'now'. Delete the item from
    // Algolia as we can't search it anymore

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

    // Delete from Algolia
    const itemsIndex = await algolia.getItemsIndex();
    await itemsIndex.deleteObjects([itemToRent.id]);

    return result.Attributes;
};

const deleteItem = async id => {
    // Delete the item with the given id from the database

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

module.exports = {
    getAllItems,
    getItem,
    getRentingHistory,
    insertItem,
    insertRentHistory,
    updateItem,
    rentItem,
    deleteItem,
};
