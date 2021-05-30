import { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const { login, currentUser } = useAuth();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const emailRef = useRef();
    const passwordRef = useRef();
    const history = useHistory();

    // TODO: there's a bug with Login:
    /*
    Can't perform a React state update on an unmounted component. 
    This is a no-op, but it indicates a memory leak in your application. 
    To fix, cancel all subscriptions and asynchronous tasks in a useEffect 
    cleanup function.

    But there is no useEffect? and it's saying the error is on the line "const emailRef = useRef()"
    */

    const handleSubmit = async event => {
        event.preventDefault(); // prevent from refreshing
        setError("");
        if (currentUser) {
            setError("You are already logged in.");
            return;
        }

        try {
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
            <div className="general-wrapper component-wrapper border">
                <h1 className="component-name">Log in</h1>
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
                        className="general-button component-button"
                        disabled={loading}
                    >
                        Log in
                    </button>
                </form>
                <Link
                    to={{ pathname: "/forgot-password", data: "came from login" }}
                    className="password-text forgot-password"
                >
                    Forgot password?
                </Link>
            </div>
            <div className="after-component-wrapper-text">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </div>
        </div>
    );
};

export default Login;
