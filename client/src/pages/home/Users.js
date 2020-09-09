import React from "react";
import { Col, Image } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import { useMessageState, useMessageDispatch } from "../../context/message";
import classNames from "classnames";

const GET_USERS = gql`
  query {
    getUsers {
      username
      createdAt
      imageUrl
      latestMessage {
        uuid
        content
        from
        to
        createdAt
      }
    }
  }
`;

const Users = () => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected === true)?.username;

  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) =>
      dispatch({ type: "SET_USERS", payload: data.getUsers }),
    onError: (error) => console.log(error),
  });

  let usersMarkup = null;
  if (loading || !users) {
    usersMarkup = <p>Loading...</p>;
  } else if (users.length === 0) {
    usersMarkup = (
      <p>
        No users available...
        <span role="img" aria-label="sad face">
          🙁🙁
        </span>
      </p>
    );
  } else if (users.length > 0) {
    usersMarkup = users.map((user) => {
      const selected = selectedUser === user.username;
      return (
        <div
          role="button"
          className={classNames(
            "d-flex p-2 user-div justify-content-center justify-content-md-start",
            {
              "bg-white": selected,
            }
          )}
          key={user.username}
          onClick={() =>
            dispatch({ type: "SET_SELECTED_USER", payload: user.username })
          }
        >
          <Image src={user.imageUrl} className="user-image " />
          <div className="d-none d-md-block ml-3">
            <p className="text-success">{user.username}</p>
            <p className="font-weight-light">
              {user.latestMessage
                ? user.latestMessage.content
                : "You are now connected!"}
            </p>
          </div>
        </div>
      );
    });
  }

  return (
    <Col
      xs={2}
      md={4}
      className="p-0"
      style={{ backgroundColor: "rgb(245, 245, 245)" }}
    >
      {usersMarkup}
    </Col>
  );
};

export default Users;
