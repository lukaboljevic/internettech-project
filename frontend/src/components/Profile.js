import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { currentUser, changeEmail, changePassword } = useAuth();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [rentHistory, setRentHistory] = useState(null);

    const handleSubmit = event => {
        event.preventDefault(); // prevent from refreshing
        setError("");
        setMessage("");
        if (!passwordRef.current.value) {
            return;
        }
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match.");
        }

        const promises = [];
        setLoadingSubmit(true);
        if (emailRef.current.value !== currentUser.email) {
            // if we've changed the email
            promises.push(changeEmail(emailRef.current.value));
        }
        if (passwordRef.current.value) {
            promises.push(changePassword(passwordRef.current.value));
        }

        Promise.all(promises)
            .then(() => {
                if (promises.length > 0) {
                    setMessage("Profile update successful.");
                }
            })
            .catch(() => {
                setError("Failed to update profile.");
            })
            .finally(() => {
                setLoadingSubmit(false);
            });
    };

    const fetchRentHistory = async abortController => {
        try {
            setError("");
            const endpoint = `http://localhost:5000/rent-history/${currentUser.email}`;
            const response = await fetch(endpoint, {
                method: "GET",
                signal: abortController.signal,
            });
            if (!response.ok) {
                throw new Error(
                    `There was an error getting the renting history from the database. Fetch returned status ${response.status}`
                );
            }
            const history = await response.json();
            setRentHistory(history);
        } catch (error) {
            if (error.name !== "AbortError") {
                setError(error.message);
            }
        }
        setLoadingInitial(false);
    };

    useEffect(() => {
        const abortController = new AbortController();
        fetchRentHistory(abortController);
        return () => abortController.abort();
    }, []);

    if (loadingInitial) {
        return (
            <div className="item-page-wrapper" style={{ fontSize: "3em" }}>
                Loading...
            </div>
        );
    }

    return (
        <div>
            <div className="form-wrapper">
                <h1 className="form-name">Profile</h1>
                {message && <div className="message success">{message}</div>}
                {error && <div className="message error">{error}</div>}
                <form className="actual-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="general-text-input"
                        id="email"
                        ref={emailRef}
                        defaultValue={currentUser.email}
                        required
                    />
                    <label htmlFor="password">Change password</label>
                    <input
                        type="password"
                        className="general-text-input"
                        id="password"
                        ref={passwordRef}
                        placeholder="Leave blank to keep your password"
                    />
                    <label htmlFor="confirm">Confirm changed password</label>
                    <input
                        type="password"
                        className="general-text-input"
                        id="confirm"
                        ref={passwordConfirmRef}
                        placeholder="Leave blank to keep your password"
                    />
                    <label>Renting history</label>
                    <div className="rent-history-wrapper">
                        {rentHistory && rentHistory.length > 0 ? (
                            rentHistory.map(item => {
                                return (
                                    <>
                                        <div className="dot"></div>
                                        <span className="rent-history-info" key={item.id}>
                                            &nbsp;Name: <strong>{item.name}</strong>,
                                            phone: <strong>{item.phone}</strong>
                                        </span>
                                        <br />
                                    </>
                                );
                            })
                        ) : (
                            <>
                                <span className="rent-history-info">
                                    You have not rented any items.
                                </span>
                            </>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="general-button form-button"
                        disabled={loadingSubmit}
                    >
                        Update profile
                    </button>
                </form>
            </div>
            <div className="after-form-text">
                <Link to="/">Cancel</Link>
            </div>
        </div>
    );
};

export default Profile;
