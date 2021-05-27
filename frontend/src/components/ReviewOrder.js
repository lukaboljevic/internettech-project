import { useState } from "react";
import { Link } from "react-router-dom";
import { useOrder } from "../contexts/OrderContext";

const ReviewOrder = () => {
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const { itemToOrder, orderInformation } = useOrder();
    const [error, setError] = useState(
        itemToOrder || orderInformation
            ? ""
            : "There is no item to order and/or no order information. You must have come to this page " +
                  " in the way you are not supposed to. Please return to the items page, select " +
                  "your item and try again. If you aren't logged in, be sure to do so."
    );

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

    const submitOrder = event => {
        // TODO: actually submit the order
        setError("");
        setMessage(
            "Order successfully submitted. View it on your profile, or continue searching."
        );
        setSubmitted(true);
        // TODO: delete itemToOrder from the database
    };

    const getMonthAndYear = () => {
        const [year, month] = orderInformation.expirationDate.split("-");
        return mapMonth[month] + " " + year;
    };

    return (
        <div>
            <div className="form-wrapper">
                <h1 className="form-name">Review your order</h1>
                {error && <div className="message error">{error}</div>}
                {message && <div className="message success">{message}</div>}
                <div className="actual-form">
                    {orderInformation && (
                        <>
                            {Object.keys(orderInformation).map(key => {
                                return (
                                    <div key={key} className="review-order-wrapper">
                                        <h2 className="review-order-attribute">
                                            {mapOrderKey[key]}
                                        </h2>
                                        <span>
                                            {key === "expirationDate"
                                                ? getMonthAndYear()
                                                : orderInformation[key]}
                                        </span>
                                    </div>
                                );
                            })}
                            <button
                                className="general-button form-button"
                                onClick={submitOrder}
                                disabled={submitted}
                            >
                                Submit order
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="after-form-text">
                {/* !(itemToOrder || orderInformation) is the negation of the condition
                used for determining if there is an error when we initially come to this page */}
                {!(itemToOrder || orderInformation) ? (
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
