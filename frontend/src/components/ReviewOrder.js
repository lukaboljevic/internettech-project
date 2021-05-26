import { useState } from "react";
import { Link /*, useHistory*/ } from "react-router-dom";
import { useOrder } from "../contexts/OrderContext";

const ReviewOrder = () => {
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    // const history = useHistory();
    const { itemToOrder, orderInformation } = useOrder();
    console.log(itemToOrder);
    // TODO: uncomment this when I'm done with testing
    // if (!data) {
    //     history.goBack();
    // }

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

    const submitOrder = event => {
        // TODO: actually submit the order
        setMessage(
            "Order successfully submitted. View it on your profile, or continue searching."
        );
        setSubmitted(true);
        // setItemToOrder(null);
        // setOrderInformation(null);
        // TODO: delete itemToOrder from the database
    };

    return (
        <div>
            <div className="form-wrapper">
                <h1 className="form-name">Review your order</h1>
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
                                        <span>{orderInformation[key]}</span>
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
                {submitted ? (
                    <Link to="/items">Continue searching</Link>
                ) : (
                    <Link to="/order-context/order">Back to the order screen</Link>
                )}
            </div>
        </div>
    );
};

export default ReviewOrder;
