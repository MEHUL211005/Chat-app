import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ChatHeader from "../../components/chat/ChatHeader";
import ChatSidebar from "../../components/chat/ChatSidebar";
import ChatWindow from "../../components/chat/ChatWindow";
import BottomBar from "../../components/chat/BottomBar";

import { useAuth } from "../../context/AuthContext";
import { getOrCreateChat } from "../../services/chatService";

export const Chat = () => {
  const { user } = useAuth();

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatLoading, setChatLoading] = useState(false);

  const handleSelectUser = (userItem) => {
    setSelectedUser((prev) => {
      if (prev?.uid === userItem?.uid) {
        return prev;
      }

      return userItem;
    });
  };

  useEffect(() => {
    const openChat = async () => {
      if (!user?.uid || !selectedUser?.uid) {
        setSelectedChat(null);
        return;
      }

      try {
        setChatLoading(true);

        const chat = await getOrCreateChat(user.uid, selectedUser.uid);

        setSelectedChat(chat);
      } catch (error) {
        console.error(error);

        toast.error("Unable to open conversation.");
        setSelectedChat(null);
      } finally {
        setChatLoading(false);
      }
    };

    openChat();
  }, [user?.uid, selectedUser?.uid]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top,#f8fafc_0%,#f1f5f9_42%,#eef2ff_100%)] text-slate-800">
      {/* Header */}
      <ChatHeader />

      {/* Main Content */}
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <ChatSidebar
          onSelectUser={handleSelectUser}
          selectedUser={selectedUser}
        />

        {/* Chat Window */}
        <ChatWindow
          selectedUser={selectedUser}
          selectedChat={selectedChat}
          loading={chatLoading}
        />
      </div>

      {/* Bottom Bar */}
      <BottomBar />
    </div>
  );
};

export default Chat;
