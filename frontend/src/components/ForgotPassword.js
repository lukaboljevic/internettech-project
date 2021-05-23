import { useRef, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ForgotPassword = (props) => {
    const emailRef = useRef();
    const { currentUser, resetPassword } = useAuth();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    
    const handleSubmit = async event => {
        event.preventDefault(); // prevent from refreshing

        try {
            setMessage("");
            setError("");
            setLoading(true);
            await resetPassword(emailRef.current.value);
            setMessage("Check your inbox for further instructions.");
        } catch {
            setError("Failed to reset password.");
        }

        setLoading(false);
    };

    // with these two checks below, I make forgot-password not accessible if we have a
    // current user, or if we don't and we didn't come from /login, then redirect to /login

    // /forgot-password isn't accessible if we're logged in
    // TODO: maybe make another version of PrivateRoute
    // if (currentUser) {
    //     history.goBack();
    // }

    // props.location.data is sent from login
    if (!currentUser && props.location?.data !== "came from login") {
        return <Redirect to="/login" />;
    }

    return (
        <div>
            <div className="form-wrapper">
                <h1 className="form-name">Password reset</h1>
                {message && <div className="message success">{message}</div>}
                {error && <div className="message error">{error}</div>}
                <form className="actual-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="general-text-input"
                        id="email"
                        ref={emailRef}
                        required
                    />
                    <button
                        type="submit"
                        className="general-button form-button"
                        disabled={loading}
                    >
                        Reset password
                    </button>
                </form>
                <div className="remembered-password">
                    Remembered your password? <Link to="/login">Log in</Link>
                </div>
            </div>
            <div className="after-form-text">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
