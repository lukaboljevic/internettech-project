import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getFiles } from "../helper-functions";

const ItemPage = () => {
    const { currentUser } = useAuth();
    const { itemId } = useParams();
    const history = useHistory();
    const [item, setItem] = useState(null);
    const [downloadedImages, setDownloadedImages] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchItem = async () => {
        try {
            setLoading(true);
            setError("");
            const endpoint = `http://localhost:5000/items/${itemId}`;
            const response = await fetch(endpoint, {
                method: "GET",
            });
            if (!response.ok) {
                throw new Error(
                    `There was an error getting the item with id ${itemId} from the database. Fetch returned status ${response.status}`
                );
            }
            const item = await response.json();
            const urls = await getFiles(item.images, itemId);
            setDownloadedImages(urls);
            setItem(item);
        } catch (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItem();
        // TODO: cleanup!
    }, []);

    // TODO: useEffect to the endpoint to fetch the item
    // useEffect cleanup too
    // TODO: if the item does not exist (look at the corresponding function in app.js)
    // send him to the error page

    const handleClick = event => {
        // TODO: I'll probably use a state later, to see if the form was submitted
        // and if so, I'll return a Redirect with this product's data to order
        // 'cause I'll have to know what item to 'submit'
        // maybe I could use a context too
        if (!currentUser) history.push("/login");
        else history.push("/order");
    };

    if (loading) {
        return (
            <div className="item-page-wrapper" style={{ fontSize: "3em" }}>
                Loading...
            </div>
        );
    }

    return (
        <div className="item-page-wrapper">
            {error && (
                <div
                    className="message error"
                    style={{
                        width: "45%",
                        fontWeight: "700",
                        fontSize: "2em",
                        marginTop: "20px",
                    }}
                >
                    {error}
                </div>
            )}
            {item && (
                <>
                    <img src={downloadedImages[0]} alt="" />
                    <div className="item-information">
                        <h1>{item.name}</h1>
                        <h2>
                            City: <span>{item.city}</span>
                        </h2>
                        <h2 style={{ paddingRight: "30px" }}>
                            Offered games:{" "}
                            {item.games.map((game, index) => {
                                if (index === item.games.length - 1)
                                    return <span key={index}>{game}</span>;
                                return <span key={index}>{game + ", "}</span>;
                            })}
                        </h2>
                        <h2>
                            Price per hour: <span>{item.hourPrice}</span>
                        </h2>
                        <h2>
                            Phone number: <span>{item.phone}</span>
                        </h2>
                        <button
                            className="general-button item-page-button"
                            onClick={handleClick}
                        >
                            Rent now
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ItemPage;
