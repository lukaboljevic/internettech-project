import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    // remove currentUser later
    const { signup, currentUser } = useAuth();
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
            <div className="signup-wrapper">
                <h1 className="signup-name">Sign Up</h1>
                {currentUser.email}
                {/* make this alert show up in the form as a div */}
                {error && <div>{error}</div>}
                <form className="signup-form" onSubmit={handleSubmit}>
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
                        className="general-button signup-button"
                        disabled={loading}
                    >
                        Submit
                    </button>
                </form>
            </div>
            <div className="after-signup-text">
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </div>
    );
};

export default Signup;
