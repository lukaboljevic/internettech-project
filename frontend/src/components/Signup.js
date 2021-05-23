import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup, currentUser } = useAuth();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async event => {
        event.preventDefault(); // prevent from refreshing
        setError("");
        setMessage("");
        if (currentUser) {
            setError("Please log out of your current account.");
            return;
        }
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            setMessage("You have successfully signed up. You can now login.");
        } catch {
            setError("Failed to create an account.");
        }

        setLoading(false);
    };

    return (
        <div>
            <div className="form-wrapper">
                <h1 className="form-name">Sign Up</h1>
                {error && <div className="message error">{error}</div>}
                {message && <div className="message success">{message}</div>}
                <form className="actual-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="general-text-input"
                        id="email"
                        ref={emailRef}
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="general-text-input"
                        id="password"
                        ref={passwordRef}
                        required
                    />
                    <label htmlFor="confirm">Confirm password</label>
                    <input
                        type="password"
                        className="general-text-input"
                        id="confirm"
                        ref={passwordConfirmRef}
                        required
                    />
                    <button
                        type="submit"
                        className="general-button form-button"
                        disabled={loading}
                    >
                        Sign up
                    </button>
                </form>
            </div>
            <div className="after-form-text">
                Already have an account? <Link to="/login">Log in</Link>
            </div>
        </div>
    );
};

export default Signup;
