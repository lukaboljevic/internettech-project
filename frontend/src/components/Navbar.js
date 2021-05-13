const Navbar = () => {
    return (
        <div className="navbar-div">
            <h1 className="navbar-title">
                <a href="/">Renting</a>
            </h1>
            <nav className="navbar-links">
                <ul>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/items">Items</a>
                    </li>
                    <li>
                        <input
                            type="text"
                            className="navbar-text"
                            placeholder="Search right away"
                            name=""
                            id=""
                        />
                    </li>
                </ul>
            </nav>
            <nav className="navbar-links">
                <ul>
                    <li>
                        <a href="/about">About</a>
                    </li>
                    <li>
                        <a href="/login">Login</a>
                    </li>
                    <li>
                        <a href="/signup">Sign up</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
