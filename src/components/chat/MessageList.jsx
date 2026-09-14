import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export const MessageList = ({ messages = [] , chatId }) => {
  const messagesEndRef = useRef(null);
 const isInitialLoad = useRef(true);

  useEffect(() => {
    isInitialLoad.current = true;
  }, [chatId]);

  useEffect(() => {
    if (!messages.length) return;

    messagesEndRef.current?.scrollIntoView({
      behavior: isInitialLoad.current ? "auto" : "smooth",
    });

    isInitialLoad.current = false;
  }, [messages]);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden overflow-y-auto overflow-x-hidden p-4 sm:p-6">
      {messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl shadow-sm">
              💬
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-800">
              No messages yet
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Send a message to start the conversation.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-auto flex w-full min-w-0 flex-col space-y-3">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;