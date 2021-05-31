import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { performSearch } from "../helper-functions";

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

    const handleKeyDown = async event => {
        if (event.code !== "Enter") {
            return;
        }
        try {
            // TODO: navbar search
            const hits = await performSearch(event.target.value);
            console.log("hits!", hits);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleClick = async () => {
        try {
            // TODO: navbar search
            const hits = await performSearch(
                document.querySelector(".navbar-search").value
            );
            console.log("hits!", hits);
        } catch (error) {
            alert(error.message);
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
                    <input
                        type="text"
                        className="general-text-input navbar-search"
                        placeholder="Search right away"
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="general-button navbar-button"
                        onClick={handleClick}
                    >
                        Go
                    </button>
                </div>
                {/* <div className="navbar-spacer"></div> */}
                <div>
                    <Link to="/about">About</Link>
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
