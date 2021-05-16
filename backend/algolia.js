const AWS = require("aws-sdk");
const algoliasearch = require("algoliasearch");

const ssm = new AWS.SSM({
    region: "eu-central-1",
});

const getParameters = async () => {
    const response = await ssm
        .getParameters({
            Names: ["/itproject/dev/algoliaAdminKey", "/itproject/dev/algoliaAppID"],
            WithDecryption: true,
        })
        .promise();
    return {
        adminKey: response.Parameters[0].Value,
        appId: response.Parameters[1].Value,
    };
};

let itemsIndex;
const getItemsIndex = async () => {
    if (!itemsIndex) {
        console.log("THIS MESSAGE SHOULD NOT SHOW MORE THAN ONCE");
        const keys = await getParameters();
        const application = algoliasearch(keys.appId, keys.adminKey);
        itemsIndex = await application.initIndex(`dev-items`);

        await itemsIndex.setSettings({
            searchableAttributes: ["name", "games", "city"],
            // TODO: further modifications required? good for now though.
        });
    }
    return itemsIndex;
};

module.exports = {
    getParameters,
    getItemsIndex,
};
