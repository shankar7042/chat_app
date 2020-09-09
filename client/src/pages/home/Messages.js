import React, { Fragment, useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useMessageState, useMessageDispatch } from "../../context/message";
import Message from "./Message";

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      content
      from
      to
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

const Messages = () => {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected === true);
  const messages = selectedUser?.messages;
  const [content, setContent] = useState("");

  const [
    getMessages,
    { loading: messageLoading, data: messageData },
  ] = useLazyQuery(GET_MESSAGES);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) =>
      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          username: selectedUser.username,
          message: data.sendMessage,
        },
      }),
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser, getMessages]);

  useEffect(() => {
    if (messageData) {
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser.username,
          messages: messageData.getMessages,
        },
      });
    }
  }, [messageData]);

  let chatMarkUp;
  if (!messages && !messageLoading) {
    chatMarkUp = <p className="info">Select a Friend</p>;
  } else if (messageLoading) {
    chatMarkUp = <p>Loading...</p>;
  } else if (messages.length === 0) {
    chatMarkUp = (
      <p className="info">You are now connected! Send the first message</p>
    );
  } else if (messages.length > 0) {
    chatMarkUp = messages.map((msg, index) => (
      <Fragment key={msg.uuid}>
        <Message message={msg} />
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="mr-0" />
          </div>
        )}
      </Fragment>
    ));
  }

  const messageSubmitHandler = (e) => {
    e.preventDefault();
    if (content.trim() === "" || !selectedUser) return;
    sendMessage({ variables: { to: selectedUser.username, content } });
    setContent("");
  };

  return (
    <Col xs={10} md={8}>
      <div className="d-flex flex-column-reverse message-box">{chatMarkUp}</div>
      <div>
        <Form onSubmit={messageSubmitHandler}>
          <Form.Group className="d-flex align-items-center mr-3">
            <Form.Control
              type="text"
              placeholder="😎 Type a message..."
              className="rounded-pill bg-gray border-0 message-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <i
              className="fas fa-paper-plane text-primary fa-2x ml-2"
              onClick={messageSubmitHandler}
            ></i>
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
};

export default Messages;
