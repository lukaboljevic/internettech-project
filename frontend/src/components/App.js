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
import Profile from "./Profile";

function App() {
    return (
        <Router>
            <AuthProvider>
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
                    <Route path="/about">
                        <About />
                    </Route>
                    <Route path="/signup">
                        <Signup />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/profile">
                        <Profile />
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
