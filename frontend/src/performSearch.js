export const performSearch = async query => {
    if (!query) {
        return undefined;
    }
    // TODO: searching when query === ""?
    console.log("Searching for", query);
    const response = await fetch(
        `http://localhost:5000/search/query=${query}&limit=${1000}`
    );
    if (!response.ok) {
        throw new Error("There was an error fetching the items from Algolia.");
    }
    const jsonResponse = await response.json();
    return jsonResponse.hits;
};
