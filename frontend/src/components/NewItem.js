import { useRef, useState } from "react";

const NewItem = () => {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const itemNameRef = useRef();
    const cityRef = useRef();
    const phoneRef = useRef();
    const gamesRef = useRef();
    const rentPriceRef = useRef();

    const handleSubmit = async event => {
        // TODO: add item
        event.preventDefault();

        try {
            setError("");
            setMessage("");
            setLoading(true);
            const games = gamesRef.current.value.split("\n");
            const item = {
                city: cityRef.current.value,
                games: games,
                hourPrice: rentPriceRef.current.value,
                name: itemNameRef.current.value,
                phone: phoneRef.current.value,
            };
            const response = await fetch(`http://localhost:5000/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
            });
            const jsonResponse = await response.json();
            console.log("json response:", jsonResponse);
            // TODO: check out the item
            setMessage("Successfully inserted your item. Check it out here");
        }
        catch (error) {
            setError("Failed to add your item :(\nError: " + error);
        }

        setLoading(false);
    };

    return (
        // TODO: CSS refactor required
        <div className="form-wrapper">
            <h1 className="form-name">New item</h1>
            {error && <div className="message error" style={{minHeight: "80px"}}>{error}</div>}
            {message && <div className="message success">{message}</div>}
            <form className="actual-form" onSubmit={handleSubmit}>
                <label htmlFor="item-name" title="Name of the item you want to rent.">
                    Item name
                </label>
                <input
                    type="text"
                    id="item-name"
                    title="Name of the item you want to rent."
                    className="general-text-input"
                    required
                    ref={itemNameRef}
                />
                <label htmlFor="city" title="The city you are located in.">
                    City
                </label>
                <input
                    type="text"
                    id="city"
                    title="The city you are located in."
                    className="general-text-input"
                    required
                    ref={cityRef}
                />
                <label htmlFor="phone" title="Your phone number.">
                    Phone number
                </label>
                <input
                    type="text"
                    id="phone"
                    title="Your phone number."
                    className="general-text-input"
                    // TODO: pattern
                    required
                    ref={phoneRef}
                />
                <label
                    htmlFor="games"
                    title="The list of games you are offering, with each game being in a new line."
                >
                    List of games (new line for each game)
                </label>
                <textarea
                    id="games"
                    title="The list of games you are offering, with each game being in a new line."
                    className="general-text-input"
                    ref={gamesRef}
                />
                <label
                    htmlFor="rent-price"
                    title="The amount, in euros, you will charge for each hour your item is rented/used."
                >
                    Renting price (per hour, in euros)
                </label>
                <input
                    type="text"
                    id="rent-price"
                    title="The amount, in euros, you will charge for each hour your item is rented/used."
                    className="general-text-input"
                    required
                    pattern="[1-9][0-9]*"
                    ref={rentPriceRef}
                />
                <button
                    type="submit"
                    className="general-button form-button"
                    disabled={loading}
                >
                    Start renting now!
                </button>
            </form>
        </div>
    );
};

export default NewItem;
