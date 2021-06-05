import { useState } from "react";
import { Link } from "react-router-dom";
import { useOrder } from "../contexts/OrderContext";
import { useAuth } from "../contexts/AuthContext";

const ReviewOrder = () => {
    const { currentUser } = useAuth();
    const { itemToOrder, orderInformation, paymentType } = useOrder();

    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false); // whether the order was submitted

    /*
    If there is order information AND an item to order, there will be no error.
    A situation when this not the case is when we manually came from, for example,
    /items, to /order-context/review-order - in this scenario, both itemToOrder and 
    orderInformation from OrderContext.js have not been set and are still null
    A similar scenario is if we manually came from /order to /review-order - the
    "Review order" button has not been clicked, hence the orderInformation has not been set,
    thus this is registered as an 'error'.
    */
    const thereIsNoError = itemToOrder && orderInformation;
    const [error, setError] = useState(
        thereIsNoError
            ? ""
            : "There is no item to order and/or no order information. You must have come to this page " +
                  " in the way you are not supposed to. Please return to the items page, select " +
                  "your item and try again. If you aren't logged in, be sure to do so."
    );

    // Map the attributes from the order information to what is shown on the page
    const mapOrderKey = {
        nameSurname: "Name and surname",
        cityAddress: "City and address",
        phone: "Phone number",
        email: "Email",
        cardNumber: "Credit card number",
        expirationDate: "Card expiration date",
        cvv: "CVV (Card Verification Value)",
        cardholderName: "Cardholder name",
    };

    // Map month ordinal to its string representation
    const mapMonth = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
    };

    const submitOrder = async () => {
        // Submit the order when the "Submit order" button is clicked

        try {
            setError("");
            setMessage("");

            // Update in items table and delete from Algolia
            const response = await fetch("http://localhost:5000/rent-item", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(itemToOrder),
            });
            if (!response.ok) {
                throw new Error(
                    `Error while submitting your order. Fetch returned status ${response.status}`
                );
            }
            const updatedItem = await response.json();

            // Put this item in the rent history table for this user
            const rentInfo = {
                user: currentUser.email,
                item: updatedItem,
                paymentType: paymentType, // "Credit card" or "On arrival"
            };
            const responseHistory = await fetch("http://localhost:5000/rent-item", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rentInfo),
            });
            if (!responseHistory.ok) {
                throw new Error(
                    `Error while adding the order to your rent history. Fetch returned status ${responseHistory.status}`
                );
            }
            await responseHistory.json();

            // Finish up
            setMessage(
                "Order successfully submitted. View it on your profile, or continue searching."
            );
            setSubmitted(true);
        } catch (error) {
            setError(error.message);
        }
    };

    const getMonthAndYear = () => {
        // Transform YYYY-MM, coming from card's expiration date, to "Month Year"

        const [year, month] = orderInformation.expirationDate.split("-");
        return mapMonth[parseInt(month)] + " " + year;
    };

    return (
        <div>
            <div className="general-wrapper component-wrapper border">
                <h1 className="component-name">Review your order</h1>
                {error && <div className="message error">{error}</div>}
                {message && <div className="message success">{message}</div>}
                <div className="component-info">
                    {orderInformation && (
                        <>
                            {Object.keys(orderInformation).map(key => {
                                return (
                                    <div key={key} className="review-order-wrapper">
                                        <h2 className="review-order-attribute">
                                            {mapOrderKey[key]}
                                        </h2>
                                        <span>
                                            {/* If the key is the expiration date of the credit card,
                                            convert the current format the month and year are in (YYYY-MM)
                                            to something "more readable" so to say */}
                                            {key === "expirationDate"
                                                ? getMonthAndYear()
                                                : orderInformation[key]}
                                        </span>
                                    </div>
                                );
                            })}
                            <button
                                className="general-button component-button"
                                onClick={submitOrder}
                                disabled={submitted}
                            >
                                Submit order
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="after-component-wrapper-text">
                {!thereIsNoError ? ( // so, there was an error
                    <Link to="/items">Back to the items page</Link>
                ) : submitted ? (
                    <Link to="/items">Continue searching</Link>
                ) : (
                    <Link to="/order-context/order">Back to the order screen</Link>
                )}
            </div>
        </div>
    );
};

export default ReviewOrder;
