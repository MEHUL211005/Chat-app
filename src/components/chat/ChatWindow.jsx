import React, { useEffect, useState } from "react";

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import { subscribeToMessages } from "../../services/chatService";

export const ChatWindow = ({
  selectedUser,
  selectedChat,
  loading,
}) => {
  const [messages, setMessages] = useState([]);
  const [drafts, setDrafts] = useState({});

  const currentDraft = selectedChat?.id
    ? drafts[selectedChat.id] ?? ""
    : "";

  const handleDraftChange = (value) => {
    if (!selectedChat?.id) {
      return;
    }

    setDrafts((prev) => ({
      ...prev,
      [selectedChat.id]: value,
    }));
  };

  const handleDraftClear = () => {
    if (!selectedChat?.id) {
      return;
    }

    setDrafts((prev) => ({
      ...prev,
      [selectedChat.id]: "",
    }));
  };

  useEffect(() => {
    if (!selectedChat?.id) {
      setMessages([]);
      return;
    }

    const unsubscribe = subscribeToMessages(
      selectedChat.id,
      (newMessages) => {
        setMessages(newMessages);
      },
    );

    return unsubscribe;
  }, [selectedChat?.id]);

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-slate-50/80">
      {/* Conversation Header */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white/90 px-4 shadow-[0_1px_0_rgba(15,23,42,0.04)] sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-indigo-200 bg-indigo-100 text-sm font-semibold text-indigo-700">
            {selectedUser?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>

          {/* User Info */}
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-800 sm:text-base">
              {selectedUser?.name || "Select a conversation"}
            </h2>

            <p className="truncate text-xs text-slate-500">
              {selectedUser?.email ||
                "Choose someone to start chatting"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
        </div>
      ) : (
        <MessageList messages={messages}   chatId={selectedChat?.id}/>
      )}

      {/* Message Input */}
      <MessageInput
        chatId={selectedChat?.id}
        disabled={!selectedChat}
        value={currentDraft}
        onChange={handleDraftChange}
        onClear={handleDraftClear}
      />
    </section>
  );
};

export default ChatWindow;