const express = require("express");
const dynamo = require("./dynamo");
const algolia = require("./algolia");

const router = express.Router();

// Good explanation of the difference between POST and PUT: https://stackoverflow.com/a/18243587
// TODO: better error handling, right now I'm just sending error code 500 every time

router.get("/items", async (request, response) => {
    // Get all the items from the database

    try {
        const items = await dynamo.getAllItems();
        response.status(200).json(items.Items);
    } catch (error) {
        response.status(500).json({ error });
    }
});

router.get("/items/:itemId", async (request, response) => {
    // Get the item with id 'itemId' from the database

    try {
        const itemId = request.params.itemId;
        const item = await dynamo.getItem(itemId);
        if (!item.Item) {
            response
                .status(404)
                .json({ message: "Item with the id " + itemId + " not found!" });
            return;
        }
        response.status(200).json(item.Item);
    } catch (error) {
        response.status(500).json({ error });
    }
});

router.get("/rent-history/:user", async (request, response) => {
    // Get the entire rent history for the given user

    try {
        const user = request.params.user;
        const history = await dynamo.getRentingHistory(user);
        response.status(200).json(history);
    } catch (error) {
        response.status(500).json({ error });
    }
});

router.get("/search/query=:query&limit=:limit", async (request, response) => {
    // Get the search results for the given query and limit from Algolia

    try {
        const { query, limit } = request.params;
        const hits = await algolia.search(query, limit);
        response.status(200).json({ hits });
    } catch (error) {
        response.status(500).json({ error });
    }
});

router.post("/items", async (request, response) => {
    // Insert an item in the database

    try {
        const item = request.body;
        const newItem = await dynamo.insertItem(item);
        response.status(200).json(newItem);
    } catch (error) {
        response.status(500).json({ error });
    }
});

router.post("/rent-item", async (request, response) => {
    // Insert the item as the given user's rent history
    // Body contains the item and the user (see frontend/src/components/ReviewOrder.js)

    try {
        const rentInfo = request.body;
        await dynamo.insertRentHistory(rentInfo);
        response.status(200).json({
            message: `User ${rentInfo.user} successfully rented the item ${rentInfo.item.id}`,
        });
    } catch (error) {
        response.status(500).json({ error });
    }
});

router.put("/items", async (request, response) => {
    // Update the item sent through the body. The item is sent in its entirety

    try {
        const updatedItem = request.body;
        const result = await dynamo.updateItem(updatedItem);
        response.status(200).json(result);
    } catch (error) {
        response.status(500).json({ error });
    }
});

router.put("/rent-item", async (request, response) => {
    // Similar to PUT to /items, but we are only updating the status to
    // 'rented' and the updatedAt attribute to 'now'. Instead of updating
    // to Algolia, we are deleting the item because we can't search it anymore.

    try {
        const itemToRent = request.body;
        const result = await dynamo.rentItem(itemToRent);
        response.status(200).json(result);
    } catch (error) {
        response.status(500).json({ error });
    }
});

router.delete("/items/:itemId", async (request, response) => {
    // Delete an item with id 'itemId' from the database

    try {
        const itemId = request.params.itemId;
        const result = await dynamo.deleteItem(itemId);
        const message = result.Attributes
            ? "Item " + itemId + " found and deleted"
            : "Item " + itemId + " was not found but no need for an error";
        response.status(200).json({ message });
    } catch (error) {
        response.status(500).json({ error });
    }
});

module.exports = router;
