import { useState, useEffect } from "react";

const ListItems = () => {
    // item - id, name, games list, hour price, image(s), city, phone number
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const endpoint = "http://localhost:5000/items";
        fetch(endpoint, {
            method: "GET",
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                setItems(data);
                setLoading(false);
            });
    }, []);

    return (
        <div className="all-items">
            {loading &&
                [1, 2, 3].map(number => {
                    if (number !== 2) return <div key={number}></div>;
                    else
                        return (
                            <div key={number} className="loading">
                                Loading...
                            </div>
                        );
                })}
            {items &&
                items.map(item => (
                    <div key={item.id} className="item">
                        {/* not how I will add images probably but it's okay for now */}
                        <img src={item.images ? item.images[0] : "images/noimage.png"} alt="" />
                        <div className="item-info">
                            <h2>{item.name}</h2>
                            <h4>
                                U ponudi:{" "}
                                {item.games.slice(0, 3).map((game, index) => {
                                    if (index === item.games.length - 1) {
                                        return game;
                                    }
                                    return game + ", ";
                                })}
                                {"..."}
                            </h4>
                            <h4>Cijena po satu: {item.hourPrice + " eura"}</h4>
                            <h4>Grad: { item.city }</h4>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default ListItems;
