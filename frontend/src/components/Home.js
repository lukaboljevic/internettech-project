import { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
    const [error, setError] = useState("");
    const { logout, currentUser } = useAuth();
    const history = useHistory();

    const handleLogout = async () => {
        setError("");

        try {
            await logout();
            // TODO: don't alert, do something else
            alert("Successfully logged out!");
            history.push("/login");
        } catch {
            setError("Failed to log out.");
        }
    };

    if (!currentUser) {
        return <Redirect to="/login" />
    }

    return (
        <div className="home">
            Home!
            <br></br>
            {error + "\n"}
            {currentUser && currentUser.email}
            <br></br>
            <button className="general-button" onClick={handleLogout}>
                Log out
            </button>
        </div>
    );
};

export default Home;
