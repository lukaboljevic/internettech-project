import "../index.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { OrderProvider } from "../contexts/OrderContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ListItems from "./ListItems";
import Home from "./Home";
import About from "./About";
import ItemPage from "./ItemPage";
import ErrorPage from "./ErrorPage";
import Signup from "./Signup";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import Profile from "./Profile";
import Order from "./Order";
import ReviewOrder from "./ReviewOrder";
import PrivateRoute from "./PrivateRoute";
import NewItem from "./NewItem";
import UpdateItem from "./UpdateItem";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/items" component={ListItems} />
                    <Route
                        path="/order-context"
                        render={({ match: { url } }) => {
                            // url is /order-context
                            return (
                                <OrderProvider>
                                    <Route
                                        exact
                                        path={`${url}/items/:itemId`}
                                        component={ItemPage}
                                    />
                                    <PrivateRoute
                                        path={`${url}/order`}
                                        component={Order}
                                    />
                                    <PrivateRoute
                                        path={`${url}/review-order`}
                                        component={ReviewOrder}
                                    />
                                </OrderProvider>
                            );
                        }}
                    />
                    <PrivateRoute path="/new-item" component={NewItem} />
                    <PrivateRoute path="/update-item" component={UpdateItem} />
                    <Route path="/about" component={About} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/login" component={Login} />
                    <PrivateRoute path="/profile" component={Profile} />
                    <Route exact path="/forgot-password" component={ForgotPassword} />
                    <Route path="*" component={ErrorPage} />
                </Switch>
                <Footer />
            </AuthProvider>
        </Router>
    );
}

export default App;
