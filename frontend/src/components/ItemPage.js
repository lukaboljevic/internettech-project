import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

const ItemPage = () => {
    // const { itemId } = useParams(); // Grab the item id from the URL/route
    const { currentUser } = useAuth();
    const history = useHistory();

    // TODO: useEffect to the endpoint to fetch the item
    // useEffect cleanup too
    // TODO: if the item does not exist (look at the corresponding function in app.js)
    // send him to the error page
    const item = {
        city: "Herceg Novi",
        games: [
            "Shadow of the Colossus",
            "Middle Earth: Shadow of Mordor",
            "Rise of the Tomb Raider",
            "FIFA 2021",
            "NBA 2K20",
            "God of War 3",
            "DOOM Eternal",
            "DOOM 2016",
            "God of War 3",
            "DOOM Eternal",
            "DOOM 2016",
        ],
        hourPrice: 5,
        id: "0cbf4d56-a581-4651-b6e1-55c75b30ff79",
        name: "PS4 konzola",
        phone: "+38267123123",
    };

    const handleClick = event => {
        // TODO: I'll probably use a state later, to see if the form was submitted
        // and if so, I'll return a Redirect with this product's data to order
        // 'cause I'll have to know what item to 'submit'
        // maybe I could use a context too
        if (!currentUser) history.push("/login");
        else history.push("/order");
    };

    return (
        <div className="item-page-wrapper">
            <img src="/images/ps4.png" alt="" />
            <div className="item-information">
                <h1>{item.name}</h1>
                <h2>
                    City: <span>{item.city}</span>
                </h2>
                <h2 style={{ paddingRight: "30px" }}>
                    Offered games:{" "}
                    {item.games.map((game, index) => {
                        if (index === item.games.length - 1)
                            return <span key={index}>{game}</span>;
                        return <span key={index}>{game + ", "}</span>;
                    })}
                </h2>
                <h2>
                    Price per hour: <span>{item.hourPrice}</span>
                </h2>
                <h2>
                    Phone number: <span>{item.phone}</span>
                </h2>
                <button className="general-button item-page-button" onClick={handleClick}>
                    Rent now
                </button>
            </div>
        </div>
    );
};

export default ItemPage;
