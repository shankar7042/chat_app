import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ApolloProvider from "./ApolloProvider";

import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import "./App.scss";

function App() {
  return (
    <ApolloProvider>
      <BrowserRouter>
        <Container className="mt-5">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
          </Switch>
        </Container>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
