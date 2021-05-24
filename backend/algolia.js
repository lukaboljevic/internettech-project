const algoliasearch = require("algoliasearch");
const path = require("path");
require("dotenv").config({
    path: path.resolve(process.cwd(), ".env.local"),
});

const adminKey = process.env.ALGOLIA_ADMIN_KEY;
const appId = process.env.ALGOLIA_APP_ID;

let itemsIndex;
const getItemsIndex = async () => {
    if (!itemsIndex) {
        console.log("THIS MESSAGE SHOULD NOT SHOW MORE THAN ONCE");
        const application = algoliasearch(appId, adminKey);
        itemsIndex = await application.initIndex(`dev-items`);

        await itemsIndex.setSettings({
            searchableAttributes: ["name", "games", "city"],
            // TODO: further modifications required? good for now though.
        });
    }
    return itemsIndex;
};

const search = async (query, limit) => {
    // TODO: don't think I'll need to do it like this in the future
    // this is only like this for testing purposes.
    const index = await getItemsIndex();
    const { hits } = await index.search(query, { hitsPerPage: limit });
    return hits;
};

module.exports = {
    getItemsIndex,
    search,
};
