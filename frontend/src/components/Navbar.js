import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { performSearch } from "../performSearch";

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
            const hits = await performSearch(event.target.value);
            console.log("hits!", hits);
        }
        catch (error) {
            alert(error.message);
        }
    };

    const handleClick = async () => {
        try {
            const hits = await performSearch(document.querySelector(".navbar-search").value);
            console.log("hits!", hits);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="navbar-wrapper">
            <nav className="navbar-links">
                <ul>
                    <li>
                        <h1 className="navbar-title">
                            <Link to="/">Renting</Link>
                        </h1>
                    </li>
                    <li>
                        <Link to="/items">Items</Link>
                    </li>
                    <li>
                        <input
                            type="text"
                            className="general-text-input navbar-search"
                            placeholder="Search right away"
                            onKeyDown={handleKeyDown}
                        />
                    </li>
                    <li>
                        <button
                            className="general-button navbar-button"
                            onClick={handleClick}
                        >
                            Go
                        </button>
                    </li>
                    <div className="navbar-spacer"></div>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    {currentUser ? (
                        // if there's a current user, show Profile and Log out
                        <>
                            <li>
                                {/* is this only /profile ? */}
                                <Link to="/profile">Profile</Link>
                            </li>
                            <li>
                                <button
                                    className="navbar-logout-button"
                                    style={{ cursor: "pointer" }}
                                    onClick={handleLogout}
                                >
                                    Log out
                                </button>
                            </li>
                        </>
                    ) : (
                        // otherwise show Log in and Signup
                        <>
                            <li>
                                <Link to="/login">Log in</Link>
                            </li>
                            <li>
                                <Link to="/signup">Sign up</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
