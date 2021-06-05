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

    const [item, setItem] = useState(null); // the item to showcase
    const [downloadedImages, setDownloadedImages] = useState(null); // images for the item
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [toUpdate, setToUpdate] = useState(false); // whether the "Update listing" button was clicked
    const { itemId } = useParams();
    const history = useHistory();

    useEffect(() => {
        const abortController = new AbortController();

        const fetchItem = async () => {
            // Fetch the items with the given itemId

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
                const urls = await getFiles(item.images, itemId); // get the images for the item
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
        // Process what happens when the "Rent now" button is clicked

        if (!currentUser) history.push("/login");
        else {
            if (currentUser.email === item.createdBy) {
                alert("You cannot rent your own item.");
            } else {
                history.push("/order-context/order");
            }
        }
    };

    const checkHidden = () => {
        // Check if the "Update listing" button is hidden or not

        if (!currentUser) {
            return true;
        }
        if (currentUser.email !== item.createdBy) {
            // If the current user didn't create the item
            return true;
        }
        return false;
    };

    if (toUpdate) {
        // "Update listing" button was clicked

        return <Redirect to={{ pathname: "/update-item", item: item }} />;
    }

    if (loading) {
        // We're fetching the item

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
                            {/* Set the images for the Carousel, or show noimage.png if there are no images */}
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
                            {/* Show the games if there are any */}
                            {item.games.length > 0 ? (
                                item.games.map((game, index) => {
                                    if (index === item.games.length - 1)
                                        return <span key={index}>{game}</span>;
                                    return <span key={index}>{game + ", "}</span>;
                                })
                            ) : (
                                <span>No games available</span>
                            )}
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
                            onClick={() => {
                                setToUpdate(true);
                            }}
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
