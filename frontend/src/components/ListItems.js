import { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { getFiles, performSearch } from "../helper-functions";
import { dropdownStyles, dropdownOptions } from "../dropdown";
import Select from "react-select";

const ListItems = () => {
    const [items, setItems] = useState([]);
    const [itemImages, setItemImages] = useState(null); // the images of all the items
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [addNewItem, setAddNewItem] = useState(false); // state for the "Add a new item" button
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchItems = async () => {
            // Fetch all the items from the database

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
                const retrievedItems = await response.json(); // retrievedItems is a list

                // Get the images for all items
                const images = {};
                for (const item of retrievedItems) {
                    const itemId = item.id;
                    const urls = await getFiles(item.images, itemId);
                    images[itemId] = urls; // urls is a list of download urls for each image assigned to the item (i.e. item id)
                }
                setItemImages(images);
                // sort by name in ascending order by default
                setItems(sortArray(retrievedItems, dropdownOptions[0]));
            } catch (error) {
                if (error.name !== "AbortError") {
                    setError(error.message);
                }
            }
            setLoading(false);
        };

        fetchItems();
        return () => abortController.abort();
    }, []);

    const sortArray = (array, option) => {
        // Sort the given array with the value from the given option

        // value is "name ascending", "price ascending", ...
        const { value } = option;

        // attribute is name, price, createdAt or hourPrice
        // order is ascending or descending
        const [attribute, order] = value.split(" ");

        // Arrays.prototype.sort() sorts the elements in ascending order if
        // a negative value is returned when "a < b", a positive value is returned
        // when "a > b" and 0 is returned when "a = b". If we want to sort in descending
        // order, we just have to multiply what the function returns by -1.
        const multiply = order === "ascending" ? 1 : -1;

        array.sort((a, b) => {
            let first, second;
            if (attribute === "hourPrice") {
                // If we are sorting by price, transform the values into integers
                first = parseInt(a[attribute]);
                second = parseInt(b[attribute]);
            } else {
                // Leave as is
                first = a[attribute];
                second = b[attribute];
            }
            if (first < second) return multiply * -1;
            else if (first > second) return multiply * 1;
            else return 0;
        });

        return array;
    };

    const handleOptionChange = option => {
        // An option was selected from the dropdown menu

        if (loading) {
            // Disallow doing anything while the items are loading
            return;
        }
        setSelectedOption(option);
        setItems(sortArray(items, option));
    };

    const handleTextChange = async event => {
        // Search every time the text inside the text input is changed

        if (loading) {
            // Disallow searching while we are loading
            return;
        }
        try {
            setError("");
            const hits = await performSearch(event.target.value);
            // sort by the selected option or the default option, if there is no selected option
            setItems(sortArray(hits, selectedOption || dropdownOptions[0]));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleClick = () => {
        // "Add a new item" button was clicked
        setAddNewItem(true);
    };

    const Dropdown = () => {
        // The dropdown menu
        return (
            <Select
                options={dropdownOptions}
                value={selectedOption}
                styles={dropdownStyles}
                onChange={handleOptionChange}
                placeholder="Sort by..."
            ></Select>
        );
    };

    if (addNewItem) {
        // If "Add a new item" button was clicked, redirect
        return <Redirect to="/new-item" />;
    }

    if (loading) {
        // If we are fetching the items, show it's loading
        return (
            <div className="general-wrapper">
                <div className="search-wrapper">
                    <span style={{ fontSize: "2em" }}>Search </span>
                    <input
                        type="text"
                        className="general-text-input search-box"
                        onChange={handleTextChange}
                    />
                    <Dropdown />
                    <button
                        className="general-button add-item-button"
                        onClick={handleClick}
                    >
                        Add a new item
                    </button>
                </div>
                <div className="all-items">
                    <div></div>
                    <div className="loading" style={{ marginBottom: "0" }}>
                        Loading...
                    </div>
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
                <Dropdown />
                <button className="general-button add-item-button" onClick={handleClick}>
                    Add a new item
                </button>
            </div>
            {error && (
                <div
                    className="message error item-or-items-error"
                    style={{ marginBottom: "0" }}
                >
                    {error}
                </div>
            )}
            <div className="all-items">
                {items &&
                    items.map(item => (
                        <Link
                            key={item.id}
                            className="item-box border box-shadow"
                            to={`/order-context/items/${item.id}`}
                        >
                            {/* Show the first image if it exists, else show noimage.png */}
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
                                    {/* "Showcase" some games (first three games) */}
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
