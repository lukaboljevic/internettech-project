import { useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useOrder } from "../contexts/OrderContext";

const Order = () => {
    const { currentUser } = useAuth();
    const { itemToOrder, orderInformation, setOrderInformation } = useOrder();

    const [credit, setCredit] = useState(false);
    const [arrival, setArrival] = useState(false);
    const [review, setReview] = useState(false);
    // eslint-disable-next-line
    const [error, setError] = useState(
        itemToOrder
            ? ""
            : "There is no item to order. You must have come to this page in the way you are " +
                  "not supposed to. Please return to the items page, select " +
                  "your item and try again. If you aren't logged in, be sure to do so."
    );

    const nameSurnameRef = useRef();
    const cityAddressRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const cardNumberRef = useRef();
    const expirationRef = useRef();
    const cvvRef = useRef();
    const cardholderRef = useRef();

    const handleCreditClick = () => {
        setCredit(true);
        setArrival(false);
    };

    const handleArrivalClick = () => {
        setArrival(true);
        setCredit(false);
    };

    const handleSubmit = event => {
        event.preventDefault();
        let formData = {
            nameSurname: nameSurnameRef.current.value,
            cityAddress: cityAddressRef.current.value,
            phone: phoneRef.current.value,
            email: emailRef.current.value,
        };
        if (credit) {
            // if we want to pay with a credit card
            formData = {
                ...formData,
                cardNumber: cardNumberRef.current.value,
                expirationDate: expirationRef.current.value,
                cvv: cvvRef.current.value,
                cardholderName: cardholderRef.current.value,
            };
        }
        setOrderInformation(formData);
        setReview(true);
    };

    if (review) {
        return <Redirect to="/order-context/review-order" />;
    }

    return (
        <div>
            <div className="form-wrapper">
                <h1 className="form-name">Your data and payment</h1>
                {error ? (
                    <div className="message error">{error}</div>
                ) : (
                    <form className="actual-form" onSubmit={handleSubmit}>
                        <label htmlFor="name-surname">Name and surname</label>
                        <input
                            type="text"
                            className="general-text-input"
                            id="name-surname"
                            ref={nameSurnameRef}
                            required
                            defaultValue={
                                orderInformation && orderInformation.nameSurname
                            }
                        />
                        <label htmlFor="city-address">City and address</label>
                        <input
                            type="text"
                            className="general-text-input"
                            id="city-address"
                            ref={cityAddressRef}
                            required
                            defaultValue={
                                orderInformation && orderInformation.cityAddress
                            }
                        />
                        <label htmlFor="phone-number">Phone number</label>
                        <input
                            // make this type="tel" and add pattern or smt
                            type="tel"
                            className="general-text-input"
                            id="phone-number"
                            ref={phoneRef}
                            required
                            pattern="06[789][0-9]{6}"
                            defaultValue={orderInformation && orderInformation.phone}
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
                                    defaultValue={
                                        orderInformation && orderInformation.cardNumber
                                    }
                                />
                                <label htmlFor="expiry-date">Card expiration date</label>
                                <input
                                    type="month"
                                    className="general-text-input"
                                    id="expiry-date"
                                    required
                                    ref={expirationRef}
                                    // get today's date in YYYY-MM format
                                    min={new Date()
                                        .toISOString()
                                        .split("T")[0]
                                        .slice(0, -3)}
                                    defaultValue={
                                        orderInformation &&
                                        orderInformation.expirationDate
                                    }
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
                                    defaultValue={
                                        orderInformation && orderInformation.cvv
                                    }
                                />
                                <label htmlFor="cardholder-name">Cardholder name</label>
                                <input
                                    type="text"
                                    className="general-text-input"
                                    id="cardholder-name"
                                    required
                                    ref={cardholderRef}
                                    defaultValue={
                                        orderInformation &&
                                        orderInformation.cardholderName
                                    }
                                />
                                <button
                                    type="submit"
                                    className="general-button form-button"
                                >
                                    Review order
                                </button>
                            </>
                        )}
                        {arrival && (
                            <>
                                <h2 className="payment-type">
                                    You will pay upon the arrival of your item
                                </h2>
                                <button
                                    type="submit"
                                    className="general-button form-button"
                                >
                                    Review order
                                </button>
                            </>
                        )}
                    </form>
                )}
            </div>
            <div
                className="after-form-text two-elements-one-row"
                // the form inside its wrapper has max width of 65% of 600px
                // so this has the same max width as that
                style={{ maxWidth: "365px" }}
            >
                <Link to="/">Home page</Link>
                <Link to="/items">Items page</Link>
            </div>
        </div>
    );
};

export default Order;
