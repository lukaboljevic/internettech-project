import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { getFiles } from "../helper-functions";
import { useOrder } from "../contexts/OrderContext";

const ItemPage = () => {
    const { currentUser } = useAuth();
    const { itemId } = useParams();
    const history = useHistory();
    const [item, setItem] = useState(null);
    const [downloadedImages, setDownloadedImages] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [toUpdate, setToUpdate] = useState(false);

    const { setItemToOrder } = useOrder();

    const fetchItem = async abortController => {
        try {
            setLoading(true);
            setError("");
            const endpoint = `http://localhost:5000/items/${itemId}`;
            const response = await fetch(endpoint, {
                method: "GET",
                signal: abortController.signal,
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
            setItemToOrder(item);
        } catch (error) {
            if (error.name !== "AbortError") {
                setError(error.message);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        const abortController = new AbortController();
        fetchItem(abortController);
        return () => abortController.abort();
    }, []);

    const handleRentClick = () => {
        if (!currentUser) history.push("/login");
        else {
            if (currentUser.email === item.user) {
                alert("You cannot rent your own item.")
            }
            else {
                history.push("/order-context/order");
            }
        }
    };

    const handleUpdateClick = () => {
        setToUpdate(true)
    };

    const checkHidden = () => {
        if (!currentUser) {
            return true;
        }
        if (currentUser.email !== item.user) {
            return true;
        }
        return false;
    }

    if (toUpdate) {
        return <Redirect to={{ pathname: "/update-item", item: item}} />
    }

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
                    <img
                        src={
                            downloadedImages?.length > 0
                                ? downloadedImages[0]
                                : "/images/noimage.png"
                        }
                        alt=""
                    />
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
                            onClick={handleRentClick}
                        >
                            Rent now
                        </button>
                        <button
                            className="general-button item-page-button"
                            style={{ width: "200px", marginLeft: "20px" }}
                            hidden={checkHidden()}
                            onClick={handleUpdateClick}
                        >
                            Update listing
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ItemPage;
