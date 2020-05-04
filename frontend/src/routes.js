import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Info from "./pages/Info";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' component={Home} exact />
        <Route path='/info' component={Info} exact />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
