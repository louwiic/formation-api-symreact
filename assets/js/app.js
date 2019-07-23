import React, { useContext, useState } from 'react';
import ReactDOM from "react-dom";
import { HashRouter, Redirect, Route, Switch, withRouter } from "react-router-dom";
import Navbar from './components/navbar';
import AuthContext from './context/AuthContext';
import CustomersPage from './pages/customersPage';
import Homepage from './pages/homepage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/loginPage';
import AuthAPI from "./services/authAPI";
import CustomerPage from "./pages/customerPage";
import InvoicePage from './pages/invoicePage';
import RegisterPage from './pages/registerPage';


//import le css
require('../css/app.css');

//AuthAPI.verifAccess(); //Récupére l

/**
 * Permet de créer une route privée 
 * Si authentifié (true)  renvoi la route, sinon redirige vers le login page
 * @param {*} param0 
 */
const PrivateRoute = ({ path, component }) => {
    const { isAuthenticated } = useContext(AuthContext);    

    return isAuthenticated ? (
        <Route path={path} component={component} />
    ) : (
            <Redirect to="/login" />
        );
}

const App = () => {
    //state qui gére l'etat de connexon 
    const [isAuthenticated, setAuthenticated] = useState(AuthAPI.isAuthenticated());
    //Passe les propriétés de (history..pour redirection de route) à la navbar
    const NavBarWithRouter = withRouter(Navbar) //Param la navbar

    //Valeur définie pour context
    const contextValue = {
        isAuthenticated: isAuthenticated,
        setIsAuthenticated: setAuthenticated
    }
    return (
        <AuthContext.Provider value={contextValue}> {/* Permet d'avoir accés aux valeurs du context definie dans toute les props */}
            <HashRouter>
                <NavBarWithRouter />
                <main className="container pt-5">
                    <Switch>
                        <PrivateRoute path="/customers/:id" component={CustomerPage} />
                        <PrivateRoute path="/invoices/:id" component={InvoicePage} />
                        <PrivateRoute path="/customers" component={CustomersPage} />
                        <PrivateRoute path="/invoices" component={InvoicesPage} />
                        <Route path="/register" component={RegisterPage} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/" component={Homepage} />
                    </Switch>
                </main>
            </ HashRouter>
        </AuthContext.Provider>
    )
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);