const AWS = require("aws-sdk");
const uuid = require("uuid");
const algolia = require("./algolia");
const path = require("path");
require("dotenv").config({
    path: path.resolve(process.cwd(), ".env.local")
});

AWS.config.update({
    accessKeyId: process.env.AWS_ACCOUNT_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCOUNT_SECRET_ACCESS_KEY,
    region: "eu-central-1",
});
const client = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.ITEMS_TABLE_NAME;

const getAllItems = async () => {
    const params = {
        TableName: tableName,
    };
    const items = await client.scan(params).promise();
    return items;
};

const getItem = async id => {
    const params = {
        TableName: tableName,
        Key: {
            id,
        },
    };
    const item = await client.get(params).promise();
    return item;
};

const insertItem = async item => {
    const itemId = uuid.v4();
    const params = {
        TableName: tableName,
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

const deleteItem = async id => {
    const params = {
        TableName: tableName,
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
    const params = {
        TableName: tableName,
        Key: {
            id: updatedItem.id,
        },
        ReturnValues: "ALL_NEW",
        // TODO: improve update logic
        UpdateExpression:
            "SET #city = :city, hourPrice = :hourPrice, #name = :name, #phone = :phone",
        ExpressionAttributeNames: {
            "#city": "city",
            "#name": "name",
            "#phone": "phone",
        },
        ExpressionAttributeValues: {
            ":city": updatedItem.city,
            ":hourPrice": updatedItem.hourPrice,
            ":name": updatedItem.name,
            ":phone": updatedItem.phone,
        },
    };
    // TODO: update in algolia too.
    const result = client.update(params).promise();
    return result;
};

module.exports = {
    getAllItems,
    getItem,
    insertItem,
    deleteItem,
    updateItem,
};
