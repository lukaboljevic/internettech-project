import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
    const { currentUser, logout } = useAuth();

    const history = useHistory();

    const handleLogout = async () => {
        try {
            await logout();
            alert("Successfully logged out!");
            history.push("/login");
        } catch {
            alert("Failed to log out.");
        }
    };

    return (
        <div className="navbar-wrapper">
            <nav className="navbar-links">
                <div>
                    <Link to="/" className="navbar-title">
                        Home
                    </Link>
                    <Link to="/items">Items</Link>
                </div>
                <div>
                    <Link to="/about">About me</Link>
                    {currentUser ? (
                        // if there's a current user, show Profile and Log out
                        <>
                            <Link to="/profile">Profile</Link>
                            <button
                                className="general-button navbar-logout-button"
                                onClick={handleLogout}
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        // otherwise show Log in and Signup
                        <>
                            <Link to="/login">Log in</Link>
                            <Link to="/signup">Sign up</Link>
                        </>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
