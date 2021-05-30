import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { getFiles } from "../helper-functions";
import { useOrder } from "../contexts/OrderContext";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ItemPage = () => {
    const { currentUser } = useAuth();
    const { setItemToOrder } = useOrder();

    const [item, setItem] = useState(null);
    const [downloadedImages, setDownloadedImages] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [toUpdate, setToUpdate] = useState(false);
    const { itemId } = useParams();
    const history = useHistory();

    useEffect(() => {
        const abortController = new AbortController();

        const fetchItem = async () => {
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

        fetchItem();
        return () => abortController.abort();
    }, [itemId, setItemToOrder]); // React said add these two as dependencies

    const handleRentClick = () => {
        if (!currentUser) history.push("/login");
        else {
            if (currentUser.email === item.createdBy) {
                alert("You cannot rent your own item.");
            } else {
                history.push("/order-context/order");
            }
        }
    };

    const handleUpdateClick = () => {
        setToUpdate(true);
    };

    const checkHidden = () => {
        // Check if the "Update listing" button is hidden or not
        if (!currentUser) {
            return true;
        }
        if (currentUser.email !== item.createdBy) {
            return true;
        }
        return false;
    };

    if (toUpdate) {
        return <Redirect to={{ pathname: "/update-item", item: item }} />;
    }

    if (loading) {
        return (
            <div className="general-wrapper loading" style={{ textAlign: "center" }}>
                Loading...
            </div>
        );
    }

    return (
        <div className="general-wrapper item-page-wrapper">
            {error && <div className="message error item-or-items-error">{error}</div>}
            {item && (
                <>
                    <div className="item-images border box-shadow">
                        <Carousel
                            infiniteLoop={true}
                            // try setting showThumbs to true lmao
                            showThumbs={false}
                            showStatus={false}
                        >
                            {downloadedImages && downloadedImages.length > 0 ? (
                                downloadedImages.map((image, index) => (
                                    <img key={index} src={image} alt="" />
                                ))
                            ) : (
                                <img src="/images/noimage.png" alt="" />
                            )}
                        </Carousel>
                    </div>
                    <div className="item-information border box-shadow">
                        <h1>{item.name}</h1>
                        <h2>City</h2>
                        <span>{item.city}</span>
                        <h2>Offered games</h2>
                        <div style={{ paddingRight: "30px" }}>
                            {item.games.map((game, index) => {
                                if (index === item.games.length - 1)
                                    return <span key={index}>{game}</span>;
                                return <span key={index}>{game + ", "}</span>;
                            })}
                        </div>
                        <h2>Price per hour</h2>
                        <span>{item.hourPrice}&euro;</span>
                        <h2>Phone number</h2>
                        <span>{item.phone}</span>
                        <br />
                        <button
                            className="general-button item-page-button"
                            onClick={handleRentClick}
                        >
                            Rent now
                        </button>
                        <button
                            className="general-button item-page-button"
                            style={{ width: "200px" }}
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
