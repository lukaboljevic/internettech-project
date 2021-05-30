import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
    const { signup, currentUser } = useAuth();

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    
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
            <div className="general-wrapper component-wrapper border">
                <h1 className="component-name">Sign Up</h1>
                {error && <div className="message error">{error}</div>}
                {message && <div className="message success">{message}</div>}
                <form className="component-info" onSubmit={handleSubmit}>
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
                        className="general-button component-button"
                        disabled={loading}
                    >
                        Sign up
                    </button>
                </form>
            </div>
            <div className="after-component-wrapper-text">
                Already have an account? <Link to="/login">Log in</Link>
            </div>
        </div>
    );
};

export default Signup;
