import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="error-page">
            <h1 style={{ fontSize: "8em" }}>404</h1>
            <h2 style={{ fontSize: "3em" }}>The page doesn't exist</h2>
            <p>
                The page you are trying to access doesn't exist, is deleted or currently
                doesn't work.
                <br />
                Go back to the home page and try again, or contant the administrator of
                the website.
            </p>
            <Link to="/">
                <button className="general-button error-page-button">
                    Back to the home page
                </button>
            </Link>
            {/* the proper (!) way to have two buttons in two rows */}
            <br />
            <br />
            <Link to="/">
                <button className="general-button error-page-button">
                    Contact the administrator
                </button>
            </Link>
        </div>
    );
};

export default ErrorPage;
