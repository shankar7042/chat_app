import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { useAuthDispatch } from "../context/auth";

const LOGIN_USER = gql`
  query loginUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`;

const Login = (props) => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useAuthDispatch();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted: (data) => {
      dispatch({ type: "LOGIN", payload: data.login });
      window.location.href = "/";
    },
  });

  const submitHandler = (event) => {
    event.preventDefault();
    loginUser({
      variables: values,
    });
  };

  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col xs={8} sm={6} lg={5}>
        <h1 className="text-center">Login</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              className={errors.username && "is-invalid"}
              value={values.username}
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              className={errors.password && "is-invalid"}
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "loading..." : "Login"}
            </Button>
          </div>
          <br />
          <small>
            Don't have an account? <Link to="/register">Register</Link>
          </small>
          {errors && (
            <ul className="text-danger mt-3">
              {Object.keys(errors).map((err, index) => (
                <li key={index}>{errors[err]}</li>
              ))}
            </ul>
          )}
        </Form>
      </Col>
    </Row>
  );
};

export default Login;
