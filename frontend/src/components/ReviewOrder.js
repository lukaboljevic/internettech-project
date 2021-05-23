import { useState } from "react";
import { Link /*, useHistory*/ } from "react-router-dom";

const ReviewOrder = ({ location }) => {
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    // const history = useHistory();
    const data = location.formData;

    // TODO: uncomment this when I'm done with testing
    // if (!data) {
    //     history.goBack();
    // }

    // TODO: preserve the order information when going back to /order

    const submitOrder = event => {
        // TODO: actually submit the order
        setMessage(
            "Order successfully submitted. View it on your profile, or continue searching."
        );
        setSubmitted(true);
    };

    return (
        <div>
            <div className="form-wrapper">
                <h1 className="form-name">Review your order</h1>
                {message && <div className="message success">{message}</div>}
                <div className="actual-form">
                    {data && (
                        <>
                            {Object.keys(data).map(key => {
                                return (
                                    <div className="review-order-wrapper">
                                        <h2 className="review-order-attribute">{key}</h2>
                                        <span>{data[key]}</span>
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
                <Link to="/order">Back to the order screen</Link>
            </div>
        </div>
    );
};

export default ReviewOrder;
