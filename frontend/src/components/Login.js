import { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleSubmit = async event => {
        event.preventDefault(); // prevent from refreshing

        try {
            setError("");
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            history.push("/");
        } catch {
            setError("Failed to log in.");
        }

        setLoading(false);
    };

    return (
        <div>
            <div className="form-wrapper">
                <h1 className="form-name">Log in</h1>
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
                    <button
                        type="submit"
                        className="general-button form-button"
                        disabled={loading}
                    >
                        Log in
                    </button>
                </form>
                <Link to="/forgot-password" className="forgot-password">
                    Forgot password?
                </Link>
            </div>
            <div className="after-form-text">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
        </div>
    );
};

export default Login;
