const AWS = require("aws-sdk");
const path = require("path");
require("dotenv").config({
    path: path.resolve(process.cwd(), ".env.local"),
});

// This script needs only be executed once, with the command
// `node make-tables.js`
// That will create both the tables required for this project

AWS.config.update({
    accessKeyId: process.env.AWS_ACCOUNT_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCOUNT_SECRET_ACCESS_KEY,
    region: process.env.AWS_ACCOUNT_REGION,
});

const dynamoDB = new AWS.DynamoDB();

// Parameters to create the items table
const itemsParams = {
    TableName: process.env.ITEMS_TABLE_NAME,
    KeySchema: [
        {
            AttributeName: "id",
            KeyType: "HASH",
        },
    ],
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [
        {
            AttributeName: "id",
            AttributeType: "S",
        },
    ],
};

// Parameters to create the table for renting history
const rentParams = {
    TableName: process.env.RENT_HISTORY_TABLE_NAME,
    KeySchema: [
        {
            AttributeName: "user",
            KeyType: "HASH",
        },
        {
            AttributeName: "itemId",
            KeyType: "RANGE",
        },
    ],
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [
        {
            AttributeName: "user",
            AttributeType: "S",
        },
        {
            AttributeName: "itemId",
            AttributeType: "S",
        },
    ],
};

const main = async () => {
    await dynamoDB.createTable(itemsParams).promise();
    await dynamoDB.createTable(rentParams).promise();
};

main().then(() => {
    console.log("Tables created!");
});
