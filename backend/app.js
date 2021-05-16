const express = require("express");
const cors = require("cors");
const dynamoOperations = require("./dynamo");

const app = express();
const router = express.Router();

app.use(cors()); // I'll leave the default settings for cors for now
app.use(express.json());

// Good explanation of the difference between POST and PUT: https://stackoverflow.com/a/18243587

router.get("/items", async (request, response) => {
    try {
        const items = await dynamoOperations.getAllItems();
        response.status(200).json(items.Items);
    } catch (error) {
        console.error(error);
        response.json({ error });
    }
});

router.get("/items/:itemId", async (request, response) => {
    const itemId = request.params.itemId;
    try {
        const item = await dynamoOperations.getItem(itemId);
        if (!item.Item) {
            response.status(404).json({ message: "Item with the id " + itemId + " not found!" });
            return;
        }
        response.status(200).json(item.Item);
    } catch (error) {
        console.error(error);
        response.json({ error });
    }
});

router.post("/items", async (request, response) => {
    const item = request.body;
    try {
        const newItem = await dynamoOperations.insertItem(item);
        if (!newItem) {
            // if it returned undefined after it tried x times
            response
                .status(500)
                .json({ message: "Tried inserting the item multiple times, but failed every single time" });
        }
        response.status(200).json(newItem);
    } catch (error) {
        console.error(error);
        response.json({ error });
    }
});

router.delete("/items/:itemId", async (request, response) => {
    const itemId = request.params.itemId;
    try {
        const result = await dynamoOperations.deleteItem(itemId);
        const message = result.Attributes
            ? "Item " + itemId + " found and deleted"
            : "Item " + itemId + " was not found but I won't throw an error for now";
        response.status(200).json({ message });
    } catch (error) {
        console.error(error);
        response.json({ error });
    }
});

router.put("/items", async (request, response) => {
    const updatedItem = request.body;
    try {
        const result = await dynamoOperations.updateItem(updatedItem);
        response.status(200).json(result.Attributes);
    }
    catch (error) {
        console.error(error);
        response.json({ error });
    }
});

app.use(router);

app.listen(5000, () => {
    console.log("Listening on port 5000");
});
