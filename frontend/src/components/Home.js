import { useAuth } from "../contexts/AuthContext";

const Home = () => {
    const { currentUser } = useAuth();

    return (
        <div className="home">
            Home!
            <br />
            {currentUser && currentUser.email}
        </div>
    );
};

export default Home;
