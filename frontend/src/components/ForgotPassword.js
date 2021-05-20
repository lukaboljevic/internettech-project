import { useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ForgotPassword = () => {
    const emailRef = useRef();
    const { currentUser, resetPassword } = useAuth();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async event => {
        event.preventDefault(); // prevent from refreshing

        try {
            setMessage("");
            setError("");
            setLoading(true);
            await resetPassword(emailRef.current.value);
            setMessage("Check your inbox for further instructions.")
        } catch {
            setError("Failed to reset password.");
        }

        setLoading(false);
    };

    if (!currentUser) {
        return <Redirect to="/login" />
    }

    return (
        <div>
            <div className="signup-login-wrapper">
                <h1 className="signup-login-name">Password reset</h1>
                {message && <div className="message success">{message}</div>}
                {error && <div className="message error">{error}</div>}
                <form className="signup-login-form" onSubmit={handleSubmit}>
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
                        className="general-button signup-login-button"
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
