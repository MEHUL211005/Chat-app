import React from "react";

import { useAuth } from "../../context/AuthContext";

export const MessageBubble = ({ message }) => {
  const { user } = useAuth();

  const isOwnMessage = message.senderId === user?.uid;

  const messageTime = message.createdAt?.toDate
    ? message.createdAt.toDate().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`flex ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm sm:max-w-[70%] ${
          isOwnMessage
            ? "rounded-br-md bg-indigo-600 text-white"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
        }`}
      >
        <p className="break-words leading-6">
          {message.text}
        </p>

        {message.createdAt && (
          <p
            className={`mt-1 text-[10px] ${
              isOwnMessage
                ? "text-indigo-100"
                : "text-slate-400"
            }`}
          >
            {messageTime}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;