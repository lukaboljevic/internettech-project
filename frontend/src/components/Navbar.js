import { Link } from "react-router-dom";

const Navbar = () => {
    // TODO: add search functionality here
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
                        />
                    </li>
                    <li>
                        <button className="general-button navbar-button">Go</button>
                    </li>
                    <div className="navbar-spacer"></div>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/signup">Sign up</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
