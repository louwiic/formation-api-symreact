import React from 'react';
import ReactDOM from "react-dom";
import Navbar from './components/navbar';
import Homepage from './pages/homepage';
import CustomersPage from './pages/customersPage';
import { HashRouter, Switch, Route} from "react-router-dom";
import InvoicesPage from './pages/InvoicesPage';


//import le css
require('../css/app.css');

const App = () => {
    return <HashRouter>
        <Navbar />
        <main className="container pt-5">
            <Switch>
                <Route path="/customers" component={CustomersPage} />
                <Route path="/invoices" component={InvoicesPage} />
                <Route path="/" component={Homepage} /> 
            </Switch>
        </main>

    </ HashRouter>
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);