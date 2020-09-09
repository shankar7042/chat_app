import React from "react";
import classNames from "classnames";
import { useAuthState } from "../../context/auth";

const Message = ({ message }) => {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const received = !sent;
  return (
    <div
      className={classNames("d-flex my-2", {
        "justify-content-start": received,
        "justify-content-end": sent,
      })}
    >
      <div
        className={classNames("rounded-pill py-2 px-3", {
          "bg-primary": sent,
          "bg-gray": received,
        })}
      >
        <p
          className={classNames({
            "text-white": sent,
          })}
        >
          {message.content}
        </p>
      </div>
    </div>
  );
};

export default Message;
