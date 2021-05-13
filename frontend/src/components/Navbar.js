const Navbar = () => {
    return (
        <div className="navbar-div">
            <h1 className="navbar-title">Renting</h1>
            <nav className="navbar-links">
                <ul>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/about">About</a>
                    </li>
                    <li>
                        <input type="text" placeholder=" Search" name="" id="" />
                    </li>
                </ul>
            </nav>
            <nav className="navbar-links">
                <ul>
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
