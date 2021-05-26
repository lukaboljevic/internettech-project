const express = require("express");
const cors = require("cors");
const dynamoOperations = require("./dynamo");
const algolia = require("./algolia");

const app = express();
const router = express.Router();

app.use(cors({
    origin: "http://localhost:3000"
}));
app.use(express.json());

// Good explanation of the difference between POST and PUT: https://stackoverflow.com/a/18243587

// TODO: better error handling, right now I'm just sending error code 500 every time

router.get("/items", async (request, response) => {
    try {
        const items = await dynamoOperations.getAllItems();
        response.status(200).json(items.Items);
    } catch (error) {
        // console.error(error);
        response.status(500).json({ error });
    }
});

router.get("/items/:itemId", async (request, response) => {
    try {
        const itemId = request.params.itemId;
        const item = await dynamoOperations.getItem(itemId);
        if (!item.Item) {
            response
                .status(404)
                .json({ message: "Item with the id " + itemId + " not found!" });
            return;
        }
        response.status(200).json(item.Item);
    } catch (error) {
        // console.error(error);
        response.status(500).json({ error });
    }
});

router.post("/items", async (request, response) => {
    try {
        const item = request.body;
        const newItem = await dynamoOperations.insertItem(item);
        response.status(200).json(newItem);
    } catch (error) {
        // console.error(error);
        response.status(500).json({ error });
    }
});

router.delete("/items/:itemId", async (request, response) => {
    try {
        const itemId = request.params.itemId;
        const result = await dynamoOperations.deleteItem(itemId);
        const message = result.Attributes
            ? "Item " + itemId + " found and deleted"
            : "Item " + itemId + " was not found but I won't throw an error for now";
        response.status(200).json({ message });
    } catch (error) {
        // console.error(error);
        response.status(500).json({ error });
    }
});

router.put("/items", async (request, response) => {
    try {
        const updatedItem = request.body;
        const result = await dynamoOperations.updateItem(updatedItem);
        response.status(200).json(result);
    } catch (error) {
        // console.error(error);
        response.status(500).json({ error });
    }
});

router.get("/search/query=:query&limit=:limit", async (request, response) => {
    try {
        const { query, limit } = request.params;
        const hits = await algolia.search(query, limit);
        response.status(200).json({ hits });
    } catch (error) {
        // console.error(error);
        // console.log("entered catch");
        response.status(500).json({ error });
    }
});

app.use(router);

app.listen(5000, () => {
    console.log("Listening on port 5000");
});
