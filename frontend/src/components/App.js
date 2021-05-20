import "../index.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ListItems from "./ListItems";
import Home from "./Home";
import About from "./About";
import ItemPage from "./ItemPage";
import ErrorPage from "./ErrorPage";
import Signup from "./Signup";
import Login from "./Login";
import { AuthProvider } from "../contexts/AuthContext";
import ForgotPassword from "./ForgotPassword";

function App() {
    return (
        <Router>
            <Navbar />
            {/* TODO: maybe I need to configure these paths, not sure if AuthProvider
                should go here */}
            <AuthProvider>
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
                    <Route exact path="/signup">
                        <Signup />
                    </Route>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <Route exact path="/forgot-password">
                        <ForgotPassword />
                    </Route>
                    <Route path="*">
                        <ErrorPage />
                    </Route>
                </Switch>
            </AuthProvider>
            <Footer />
        </Router>
    );
}

export default App;
