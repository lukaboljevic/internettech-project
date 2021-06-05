import { useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ForgotPassword = props => {
    const { currentUser, resetPassword } = useAuth();

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const emailRef = useRef();

    const handleSubmit = async event => {
        event.preventDefault(); // prevent from refreshing
        setMessage("");
        setError("");
        if (currentUser) {
            setError(
                "You can change your password through your profile page. Click " +
                    'the "Profile" button in the navigation bar.'
            );
            return;
        }

        try {
            setLoading(true);
            await resetPassword(emailRef.current.value);
            setMessage("Check your inbox for further instructions.");
        } catch {
            setError("Failed to reset password.");
        }

        setLoading(false);
    };

    // props.location.data is sent from login
    // If there is no one logged in, and we are not on the login page
    // (i.e. we didn't come from there), redirect to the login page
    if (!currentUser && props.location?.data !== "came from login") {
        return <Redirect to="/login" />;
    }

    return (
        <div>
            <div className="general-wrapper component-wrapper border">
                <h1 className="component-name">Password reset</h1>
                {message && <div className="message success">{message}</div>}
                {error && <div className="message error">{error}</div>}
                <form className="component-info" onSubmit={handleSubmit}>
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
                        className="general-button component-button"
                        disabled={loading}
                    >
                        Reset password
                    </button>
                </form>
                <div className="password-text got-password">
                    Got your password? <Link to="/login">Log in</Link>
                </div>
            </div>
            <div className="after-component-wrapper-text">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;
