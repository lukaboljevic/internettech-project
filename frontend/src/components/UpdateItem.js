import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { uploadFiles } from "../helper-functions";

const UpdateItem = props => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [item, setItem] = useState(props.location.item ? props.location.item : null); // check if there is an item to update
    const [error, setError] = useState(
        item
            ? ""
            : "There is no item to update. You must have come to this page in the way you are " +
                  "not supposed to. Please return to the items page, select your item and try again. " +
                  "If you aren't logged in, be sure to do so."
    );
    const itemNameRef = useRef();
    const cityRef = useRef();
    const phoneRef = useRef();
    const gamesRef = useRef();
    const rentPriceRef = useRef();
    const imagesRef = useRef();

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            setError("");
            setMessage("");
            setLoading(true);

            // Same check as in NewItem.js, maybe unnecessary but it's okay
            const games = /\S/.test(gamesRef.current.value)
                ? gamesRef.current.value.split("\n")
                : [];
            const imageNames = [];
            for (const file of imagesRef.current.files) {
                imageNames.push(file.name);
            }
            const itemToUpdate = {
                id: item.id,
                city: cityRef.current.value,
                games: games,
                hourPrice: rentPriceRef.current.value,
                name: itemNameRef.current.value,
                phone: phoneRef.current.value,
                createdAt: item.createdAt,
                updatedAt: new Date().toISOString(),
                images: item.images.concat(imageNames),
                createdBy: item.createdBy, // or currentUser.email, same deal
                status: item.status, // will be published
            };

            const response = await fetch(`http://localhost:5000/items`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(itemToUpdate),
            });
            if (!response.ok) {
                throw new Error(
                    "Error while updating the item. Fetch returned status " +
                        response.status
                );
            }
            const updatedItem = await response.json();
            if (imageNames.length > 0)
                // Upload any new images
                await uploadFiles(imagesRef.current.files, updatedItem.id);
            setMessage("Successfully updated your item. Check it out on this link: ");
            setItem(updatedItem);
        } catch (error) {
            setError("Failed to update your item :(\nError: " + error.message);
        }

        setLoading(false);
    };

    const defaultGames = () => {
        let result = "";
        item.games.forEach((game, index) => {
            if (index < item.games.length - 1) result += `${game}\n`;
            else result += `${game}`;
        });
        return result;
    };

    return (
        <>
            <div className="general-wrapper component-wrapper border">
                <h1 className="component-name">Update item</h1>
                {error && <div className="message error">{error}</div>}
                {message && item && (
                    <div className="message success">
                        {message}
                        <Link
                            to={`/order-context/items/${item.id}`}
                            className="link-to-item"
                        >
                            Click
                        </Link>
                    </div>
                )}
                {item && (
                    <form className="component-info" onSubmit={handleSubmit}>
                        <label
                            htmlFor="item-name"
                            title="Name of the item you want to rent."
                        >
                            Item name
                        </label>
                        <input
                            type="text"
                            id="item-name"
                            title="Name of the item you want to rent."
                            className="general-text-input"
                            required
                            ref={itemNameRef}
                            defaultValue={item.name}
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
                            defaultValue={item.city}
                        />
                        <label htmlFor="phone" title="Your phone number.">
                            Phone number
                        </label>
                        <input
                            type="text"
                            id="phone"
                            title="Your phone number."
                            className="general-text-input"
                            pattern="06[789][0-9]{6}"
                            required
                            ref={phoneRef}
                            defaultValue={item.phone}
                        />
                        <label
                            htmlFor="games"
                            title="(Optional) The list of games you are offering, with each game being in a new line."
                        >
                            List of games (new line for each game)
                        </label>
                        <textarea
                            id="games"
                            title="(Optional) The list of games you are offering, with each game being in a new line."
                            className="general-text-input"
                            ref={gamesRef}
                            defaultValue={defaultGames()}
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
                            defaultValue={item.hourPrice}
                        />
                        <label
                            htmlFor="images"
                            title="(Optional) Upload the images of your item."
                        >
                            Images
                        </label>
                        <input
                            type="file"
                            id="images"
                            title="(Optional) Upload the images of your item."
                            ref={imagesRef}
                            multiple
                            accept="image/*"
                        />
                        <button
                            type="submit"
                            className="general-button component-button"
                            disabled={loading}
                        >
                            Update your listing
                        </button>
                    </form>
                )}
            </div>
            <div className="after-component-wrapper-text">
                <Link to="/items">Back to the items page</Link>
            </div>
        </>
    );
};

export default UpdateItem;
