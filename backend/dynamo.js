const AWS = require("aws-sdk");
const uuid = require("uuid");

AWS.config.update({
    region: "eu-central-1",
});
const client = new AWS.DynamoDB.DocumentClient();
const tableName = "ITProject-Renting";

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
    let insertSuccess = false;
    let retry = 5;
    while (!insertSuccess) {
        try {
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
            insertSuccess = true;
            // console.log(params.Item);
            console.log("successfully inserted!");
            return params.Item;
        } catch (error) {
            console.error(error);
            if (retry === 0) {
                // I think this will work?
                return undefined;
            }
            retry--;
            console.log("Retries left for inserting:", retry);
        }
    }
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
    return result;
};

const updateItem = async updatedItem => {
    const params = {
        TableName: tableName,
        Key: {
            id: updatedItem.id,
        },
        ReturnValues: "ALL_NEW",
        // TODO: games are missing rn
        UpdateExpression: "SET #city = :city, hourPrice = :hourPrice, #name = :name, #phone = :phone",
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
