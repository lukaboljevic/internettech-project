import { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Signup = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSubmit = async event => {
        event.preventDefault(); // prevent from refreshing
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match.");
        }

        try {
            setError("");
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            history.push("/");
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
