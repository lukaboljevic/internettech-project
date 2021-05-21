import { useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Order = () => {
    const { currentUser } = useAuth();
    const [credit, setCredit] = useState(false);
    const [arrival, setArrival] = useState(false);
    const [review, setReview] = useState(false);
    const [formData, setFormData] = useState(null);

    const nameSurnameRef = useRef();
    const cityAddressRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const cardNumberRef = useRef();
    const expirationRef = useRef();
    const cvvRef = useRef();
    const cardholderRef = useRef();

    const handleCreditClick = event => {
        setCredit(true);
        setArrival(false);
    };

    const handleArrivalClick = event => {
        setArrival(true);
        setCredit(false);
    };

    const handleSubmit = event => {
        event.preventDefault();
        setReview(true);
        let formData = {
            "Name and surname": nameSurnameRef.current.value,
            "City and address": cityAddressRef.current.value,
            "Phone number": phoneRef.current.value,
            Email: emailRef.current.value,
        };
        if (credit) {
            // if we want to pay with a credit card
            formData = {
                ...formData,
                "Credit card number": cardNumberRef.current.value,
                "Card expiration date": expirationRef.current.value,
                "CVV (Card Verification Value)": cvvRef.current.value,
                "Cardholder name": cardholderRef.current.value,
            };
        }
        setFormData(formData);
    };

    if (review) {
        return <Redirect to={{ pathname: "/review-order", formData }} />;
    }

    // TODO: order needs to be a private route

    return (
        <div>
            <div className="form-wrapper">
                <h1 className="form-name">Your data and payment</h1>
                {/* {error && <div className="message error">{error}</div>} */}
                <form className="actual-form" onSubmit={handleSubmit}>
                    <label htmlFor="name-surname">Name and surname</label>
                    <input
                        type="text"
                        className="general-text-input"
                        id="name-surname"
                        ref={nameSurnameRef}
                        required
                    />
                    <label htmlFor="address-city">Address and city</label>
                    <input
                        type="text"
                        className="general-text-input"
                        id="address-city"
                        ref={cityAddressRef}
                        required
                    />
                    <label htmlFor="phone-number">Phone number</label>
                    <input
                        // make this type="tel" and add pattern or smt
                        type="text"
                        className="general-text-input"
                        id="phone-number"
                        ref={phoneRef}
                        required
                        pattern="[0-9]+"
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="general-text-input"
                        id="email"
                        defaultValue={currentUser && currentUser.email}
                        ref={emailRef}
                        required
                    />
                    <h2 className="payment-type">Choose your payment option</h2>
                    <div className="two-elements-one-row">
                        <button
                            type="button"
                            className="general-button form-button"
                            onClick={handleCreditClick}
                        >
                            Credit card
                        </button>
                        <button
                            type="button"
                            className="general-button form-button"
                            onClick={handleArrivalClick}
                        >
                            On arrival
                        </button>
                    </div>
                    {credit && (
                        <>
                            <h2 className="payment-type">
                                Fill in your credit card information
                            </h2>
                            <label
                                htmlFor="card-number"
                                title="This number is a 16 digit long number at the face of your credit card."
                            >
                                Credit card number
                            </label>
                            <input
                                type="text"
                                className="general-text-input"
                                id="card-number"
                                required
                                title="This number is a 16 digit long number at the face of your credit card."
                                pattern="[0-9]{16}"
                                ref={cardNumberRef}
                            />
                            <label htmlFor="expiry-date">Card expiration date</label>
                            <input
                                type="month"
                                className="general-text-input"
                                id="expiry-date"
                                required
                                ref={expirationRef}
                                // get today's date in YYYY-MM format
                                min={new Date().toISOString().split("T")[0].slice(0, -3)}
                            />
                            <label
                                htmlFor="cvv"
                                title="This number is the 3 digit number at the back of your card."
                            >
                                Card verification value
                            </label>
                            <input
                                type="text"
                                className="general-text-input"
                                id="cvv"
                                required
                                pattern="[0-9]{3}"
                                title="This number is the 3 digit number at the back of your card."
                                ref={cvvRef}
                            />
                            <label htmlFor="cardholder-name">Cardholder name</label>
                            <input
                                type="text"
                                className="general-text-input"
                                id="cardholder-name"
                                required
                                ref={cardholderRef}
                            />
                            <button type="submit" className="general-button form-button">
                                Review order
                            </button>
                        </>
                    )}
                    {arrival && (
                        <>
                            <h2 className="payment-type">
                                You will pay upon the arrival of your item
                            </h2>
                            <button type="submit" className="general-button form-button">
                                Review order
                            </button>
                        </>
                    )}
                </form>
            </div>
            <div
                className="after-form-text two-elements-one-row"
                // the form inside its wrapper has max width of 65% of 600px
                // so this has the same max width as that
                style={{ maxWidth: "365px" }}
            >
                <Link to="/">Back to home</Link>
                <Link to="/items">Search page</Link>
            </div>
        </div>
    );
};

export default Order;
