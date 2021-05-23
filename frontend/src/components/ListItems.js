import { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { performSearch } from "../performSearch";

const ListItems = () => {
    // item - id, name, games list, hour price, image(s), city, phone number
    const [items, setItems] = useState([
        {
            city: "Herceg Novi",
            games: [],
            hourPrice: 5,
            id: "0cbf4d56-a581-4651-b6e1-55c75b30ff79",
            name: "Xbox updated",
            phone: "+38267123123",
        },
        {
            city: "Pljevlja",
            games: [],
            hourPrice: 6,
            id: "3734651a-ca3f-4abe-ba96-8661b99d6db6",
            name: "PS4",
            phone: "+38267123123",
        },
        {
            city: "Danilovgrad",
            games: [],
            hourPrice: 1,
            id: "61fd24ae-d489-4a82-b17a-a5380867fbdc",
            name: "Gaming chair",
            phone: "+38267123123",
        },
        {
            city: "Herceg Novi",
            games: [],
            hourPrice: 5,
            id: "79ec3079-c79e-43be-9720-ad657c9ec02e",
            name: "PS4",
            phone: "+38267123123",
        },
    ]);
    const [loading, setLoading] = useState(false); // TODO: change to true when you uncomment useEffect
    // const [searchQuery, setSearchQuery] = useState(null);
    const [newItem, setNewItem] = useState(false);

    // useEffect(() => {
    //     const endpoint = "http://localhost:5000/items";
    //     fetch(endpoint, {
    //         method: "GET",
    //     })
    //         .then(response => {
    //             return response.json();
    //         })
    //         .then(data => {
    //             setItems(data);
    //             setLoading(false);
    //         });
    // }, []);
    // useEffect(() => {
    //     performSearch();
    // }, [searchQuery]);

    const handleTextChange = async event => {
        // setSearchQuery(event.target.value);
        if (loading) {
            return;
        }
        try {
            const hits = await performSearch(event.target.value);
            console.log("hits!", hits);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleClick = event => {
        setNewItem(true);
    };

    if (newItem) {
        return <Redirect to="/new-item" />;
    }

    if (loading) {
        return (
            <div className="list-items-wrapper">
                <div className="search-wrapper">
                    <span style={{ fontSize: "2em" }}>Search </span>
                    <input
                        type="text"
                        className="general-text-input list-items-search-box"
                        onChange={handleTextChange}
                    />
                    <button
                        className="general-button add-item-button"
                        disabled
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
        <div className="list-items-wrapper">
            <div className="search-wrapper">
                <span style={{ fontSize: "2em" }}>Search </span>
                <input
                    type="text"
                    className="general-text-input list-items-search-box"
                    onChange={handleTextChange}
                />
                <button className="general-button add-item-button" onClick={handleClick}>
                    Add a new item
                </button>
            </div>
            <div className="all-items">
                {items &&
                    items.map(item => (
                        <Link key={item.id} className="item-box" to={`/items/${item.id}`}>
                            {/* TODO: not how I will add images probably but it's okay for now */}
                            <img
                                src={item.images ? item.images[0] : "images/noimage.png"}
                                alt=""
                            />
                            <div className="item-info">
                                <h2>{item.name}</h2>
                                <h4>
                                    Some games :{" "}
                                    {item.games.slice(0, 3).map((game, index) => {
                                        if (index === item.games.length - 1) {
                                            return game;
                                        }
                                        return game + ", ";
                                    })}
                                    {"..."}
                                </h4>
                                <h4>Price per hour: {item.hourPrice + " euros"}</h4>
                                <h4>City: {item.city}</h4>
                            </div>
                        </Link>
                    ))}
            </div>
        </div>
    );
};

export default ListItems;
