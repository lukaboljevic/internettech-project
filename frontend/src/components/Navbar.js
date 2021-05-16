import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="navbar-wrapper">
            <h1 className="navbar-title">
                <Link to="/">Renting</Link>
            </h1>
            <nav className="navbar-links">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/items">Items</Link>
                    </li>
                    <li>
                        <input
                            type="text"
                            className="navbar-input-text"
                            placeholder="Search right away"
                        />
                    </li>
                </ul>
            </nav>
            <nav className="navbar-links">
                <ul>
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
