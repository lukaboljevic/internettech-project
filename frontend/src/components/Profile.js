import { useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { currentUser, changeEmail, changePassword } = useAuth();
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = event => {
        event.preventDefault(); // prevent from refreshing
        setError("");
        setMessage("");
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match.");
        }

        const promises = [];
        setLoading(true);
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
                setLoading(false);
            });
    };

    if (!currentUser) {
        return <Redirect to="/login" />;
    }

    return (
        <div>
            <div className="form-wrapper">
                <h1 className="form-name">Profile</h1>
                {message && (
                    <div className="message success" style={{ minHeight: "60px" }}>
                        {message}
                    </div>
                )}
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
                    <button
                        type="submit"
                        className="general-button form-button"
                        disabled={loading}
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
