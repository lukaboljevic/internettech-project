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
import Order from "./Order";
import ReviewOrder from "./ReviewOrder";
import PrivateRoute from "./PrivateRoute";
import NewItem from "./NewItem";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/items" component={ListItems} />
                    <Route exact path="/items/:itemId" component={ItemPage} />
                    <PrivateRoute path="/new-item" component={NewItem} />
                    <Route path="/about" component={About} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/login" component={Login} />
                    <PrivateRoute path="/profile" component={Profile} />
                    <PrivateRoute path="/order" component={Order} />
                    <PrivateRoute path="/review-order" component={ReviewOrder} />
                    <Route exact path="/forgot-password" component={ForgotPassword} />
                    <Route path="*" component={ErrorPage} />
                </Switch>
                <Footer />
            </AuthProvider>
        </Router>
    );
}

export default App;
