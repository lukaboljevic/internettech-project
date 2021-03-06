const algoliasearch = require("algoliasearch");
const path = require("path");
require("dotenv").config({
    path: path.resolve(process.cwd(), ".env.local"),
});

const adminKey = process.env.ALGOLIA_ADMIN_KEY;
const appId = process.env.ALGOLIA_APP_ID;

let itemsIndex;
const getItemsIndex = async () => {
    // Return the index containing all the items we can search
    // Only invoke the Algolia API for initializing the index once

    if (!itemsIndex) {
        const application = algoliasearch(appId, adminKey);
        itemsIndex = await application.initIndex(`dev-items`);

        await itemsIndex.setSettings({
            // We can search by name, games and city, in that order of importance
            searchableAttributes: ["name", "games", "city"],
        });
    }
    return itemsIndex;
};

const search = async (query, limit) => {
    // Perform a search with the given query and return the results

    const index = await getItemsIndex(); // in case it wasn't set up before searching
    const { hits } = await index.search(query, { hitsPerPage: limit });
    return hits;
};

module.exports = {
    getItemsIndex,
    search,
};
