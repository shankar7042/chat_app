import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Switch } from "react-router-dom";
import ApolloProvider from "./ApolloProvider";

import Register from "./pages/Register";
import Home from "./pages/home/Home";
import Login from "./pages/Login";
import "./App.scss";
import DynamicRoute from "./util/DynamicRoute";
import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <Container className="mt-5">
              <Switch>
                <DynamicRoute exact path="/" component={Home} authenticated />
                <DynamicRoute path="/register" component={Register} guest />
                <DynamicRoute path="/login" component={Login} guest />
              </Switch>
            </Container>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
