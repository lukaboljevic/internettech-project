import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async event => {
        event.preventDefault(); // prevent from refreshing
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match.");
        }

        try {
            setError("");
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
        } catch {
            setError("Failed to create an account.");
        }

        setLoading(false);
    };

    return (
        <div>
            <div className="signup-login-wrapper">
                <h1 className="signup-login-name">Sign Up</h1>
                {error && <div className="error">{error}</div>}
                <form className="signup-login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        className="general-text-input"
                        id="email"
                        ref={emailRef}
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="general-text-input"
                        id="password"
                        ref={passwordRef}
                    />
                    <label htmlFor="confirm">Confirm password</label>
                    <input
                        type="password"
                        className="general-text-input"
                        id="confirm"
                        ref={passwordConfirmRef}
                    />
                    <button
                        type="submit"
                        className="general-button signup-login-button"
                        disabled={loading}
                    >
                        Sign up
                    </button>
                </form>
            </div>
            <div className="after-form-text">
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </div>
    );
};

export default Signup;
