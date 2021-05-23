import { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login, currentUser } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    // there's a bug with Login:
    /*
    Can't perform a React state update on an unmounted component. 
    This is a no-op, but it indicates a memory leak in your application. 
    To fix, cancel all subscriptions and asynchronous tasks in a useEffect 
    cleanup function.

    But there is no useEffect? and it's saying the error is on the line "const emailRef = useRef()"
    */

    // /login isn't accessible if we're logged in
    // TODO: maybe make another version of PrivateRoute
    // if (currentUser) {
    //     history.goBack();
    // }

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
                <Link
                    to={{ pathname: "/forgot-password", data: "came from login" }}
                    className="forgot-password"
                >
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
