import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import Navbar from "./components/layouts/Navbar";
import AthletsPage from "./components/athlet/Page";
import Main from "./components/main";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="">
          <Navbar />
          <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/athlets" component={AthletsPage} />
            <Route path="/login" component={LoginForm} />
            <Route path="/register" component={RegisterForm} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
