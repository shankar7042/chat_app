import React from "react";
import { useAuthState } from "../context/auth";
import { Redirect, Route } from "react-router-dom";

const DynamicRoute = (props) => {
  const { user } = useAuthState();

  if (props.authenticated && !user) {
    return <Redirect to="/login" />;
  } else if (props.guest && user) {
    return <Redirect to="/" />;
  } else {
    return <Route {...props} />;
  }
};

export default DynamicRoute;
