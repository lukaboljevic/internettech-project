import "../index.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ListItems from "./ListItems";
import Home from "./Home";
import About from "./About";
import ItemPage from "./ItemPage";

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/items">
                        <ListItems />
                    </Route>
                    <Route exact path="/items/:itemId">
                        <ItemPage />
                    </Route>
                    <Route exact path="/about">
                        <About />
                    </Route>
                </Switch>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
