import React from 'react';
import { Switch, Route } from "react-router-dom";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Details from "./components/Details";
import Cart from "./components/Cart";
import Default from "./components/Default";
import Modal from './components/Modal';
import Footer from './components/Footer'; // Импортируем Footer

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        <Switch>
          <Route exact path="/" component={ProductList} />
          <Route path="/details" component={Details} />
          <Route path="/cart" component={Cart} />
          <Route component={Default} />
        </Switch>
      </div>
      <Footer /> {/* Добавляем Footer */}
      <Modal />
    </div>
  );
}

export default App;
