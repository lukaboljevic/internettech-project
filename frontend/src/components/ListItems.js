import { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { getFiles, performSearch } from "../helper-functions";

const ListItems = () => {
    const [items, setItems] = useState([]);
    const [itemImages, setItemImages] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [addNewItem, setAddNewItem] = useState(false);

    const fetchItems = async abortController => {
        try {
            setLoading(true);
            setError("");
            const endpoint = "http://localhost:5000/items";
            const response = await fetch(endpoint, {
                method: "GET",
                signal: abortController.signal,
            });
            if (!response.ok) {
                throw new Error(
                    "There was an error getting the items from the database. Fetch returned status " +
                        response.status
                );
            }
            const items = await response.json(); // items is a list
            items.sort((a, b) => {
                // sort the items by item name
                if (a.name < b.name) {
                    return -1;
                } else if (a.name > b.name) {
                    return 1;
                } else return 0;
            });

            // Get the images for all items
            const images = {};
            for (const item of items) {
                const itemId = item.id;
                const urls = await getFiles(item.images, itemId);
                images[itemId] = urls; // itemId: [downloadURL1, downloadURL2, ...]
            }
            setItemImages(images);
            setItems(items);
        } catch (error) {
            if (error.name !== "AbortError") {
                setError(error.message);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        const abortController = new AbortController();
        fetchItems(abortController);
        return () => abortController.abort();
    }, []);

    const handleTextChange = async event => {
        if (loading) {
            return;
        }
        try {
            setError("");
            const hits = await performSearch(event.target.value);
            console.log(hits);
            hits.sort((a, b) => {
                // sort the hits by item name
                if (a.name < b.name) {
                    return -1;
                } else if (a.name > b.name) {
                    return 1;
                } else return 0;
            });
            setItems(hits);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleClick = () => {
        setAddNewItem(true);
    };

    if (addNewItem) {
        return <Redirect to="/new-item" />;
    }

    if (loading) {
        return (
            <div className="general-wrapper">
                <div className="search-wrapper">
                    <span style={{ fontSize: "2em" }}>Search </span>
                    <input
                        type="text"
                        className="general-text-input search-box"
                        onChange={handleTextChange}
                    />
                    <button
                        className="general-button add-item-button"
                        onClick={handleClick}
                    >
                        Add a new item
                    </button>
                </div>
                <div className="all-items">
                    <div></div>
                    <div className="loading">Loading...</div>
                    <div></div>
                </div>
            </div>
        );
    }

    return (
        <div className="general-wrapper">
            <div className="search-wrapper">
                <span style={{ fontSize: "2em" }}>Search </span>
                <input
                    type="text"
                    className="general-text-input search-box"
                    onChange={handleTextChange}
                />
                <button className="general-button add-item-button" onClick={handleClick}>
                    Add a new item
                </button>
            </div>
            {error && <div className="message error item-or-items-error">{error}</div>}
            <div className="all-items">
                {items &&
                    items.map(item => (
                        <Link
                            key={item.id}
                            className="item-box border box-shadow"
                            to={`/order-context/items/${item.id}`}
                        >
                            <img
                                src={
                                    itemImages[item.id].length > 0
                                        ? itemImages[item.id][0]
                                        : "images/noimage.png"
                                }
                                alt=""
                            />
                            <div className="item-info">
                                <h2>{item.name}</h2>
                                <h4>
                                    Some games:{" "}
                                    {item.games.slice(0, 3).map((game, index) => {
                                        if (index === item.games.length - 1) {
                                            return game;
                                        }
                                        return game + ", ";
                                    })}
                                </h4>
                                <h4>Price per hour: {item.hourPrice}&euro;</h4>
                                <h4>City: {item.city}</h4>
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
};

export default ListItems;
