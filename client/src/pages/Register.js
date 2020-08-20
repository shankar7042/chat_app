import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

const REGISTER_USER = gql`
  mutation registerUser(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`;

const Register = (props) => {
  const [values, setValues] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, __) => {
      props.history.push("/login");
    },
    onError: (err) => {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const submitHandler = (event) => {
    event.preventDefault();
    registerUser({
      variables: values,
    });
  };

  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col xs={8} sm={6} lg={5}>
        <h1 className="text-center">Register</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              className={errors.email && "is-invalid"}
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </Form.Group>
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
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              className={errors.confirmPassword && "is-invalid"}
              value={values.confirmPassword}
              onChange={(e) =>
                setValues({ ...values, confirmPassword: e.target.value })
              }
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "loading..." : "Register"}
            </Button>
          </div>
          <br />
          <small>
            Already have an account? <Link to="/login">Login</Link>
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

export default Register;
