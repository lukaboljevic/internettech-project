import { storage } from "./firebase";

export const performSearch = async query => {
    if (!query) {
        // if it's empty/null, just set it to " " cause we want to get all results
        query = " ";
    }
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

export const uploadFiles = async (files, itemId) => {
    if (files.length === 0) {
        return;
    }
    const storageRef = storage.ref();
    for (const file of files) {
        try {
            const fileRef = storageRef.child(`${itemId}/${file.name}`);
            await fileRef.put(file);
        } catch (error) {
            throw new Error(
                "There was an error uploading your images.\n" + error.message
            );
        }
    }
    // console.log("Image uploading successful.");
};

export const getFiles = async (imageNames, itemId) => {
    if (!imageNames || imageNames.length === 0) {
        return [];
    }
    const urls = [];
    for (const name of imageNames) {
        try {
            const imageDownload = storage.ref(`${itemId}/${name}`);
            const url = await imageDownload.getDownloadURL();
            urls.push(url);
        } catch (error) {
            throw new Error(
                `There was an error retrieving the image ${name} for the item ${itemId}`
            );
        }
    }
    return urls;
};
