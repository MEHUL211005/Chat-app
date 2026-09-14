import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { getAllUsers } from "../../services/userService";
import { subscribeToUserChats } from "../../services/chatService";

import ChatSidebarItem from "./ChatSidebarItem";

const areChatsEqual = (prevChats, nextChats) => {
  if (prevChats.length !== nextChats.length) {
    return false;
  }

  return prevChats.every((chat, index) => {
    const nextChat = nextChats[index];

    if (!nextChat || chat.id !== nextChat.id) {
      return false;
    }

    const prevUpdatedAt = chat.updatedAt?.toMillis?.() ?? 0;
    const nextUpdatedAt = nextChat.updatedAt?.toMillis?.() ?? 0;

    return (
      chat.lastMessage === nextChat.lastMessage &&
      prevUpdatedAt === nextUpdatedAt
    );
  });
};

const mergeChatsPreservingOrder = (prevChats, nextChats) => {
  if (!prevChats.length) {
    return nextChats;
  }

  if (areChatsEqual(prevChats, nextChats)) {
    return prevChats;
  }

  const prevOrder = prevChats.map((chat) => chat.id);
  const nextOrder = nextChats.map((chat) => chat.id);

  const sameOrder =
    prevOrder.length === nextOrder.length &&
    prevOrder.every((chatId, index) => chatId === nextOrder[index]);

  if (sameOrder) {
    return prevChats.map((chat) => {
      const nextChat = nextChats.find((item) => item.id === chat.id);

      if (!nextChat) {
        return chat;
      }

      const prevUpdatedAt = chat.updatedAt?.toMillis?.() ?? 0;
      const nextUpdatedAt = nextChat.updatedAt?.toMillis?.() ?? 0;

      if (
        chat.lastMessage === nextChat.lastMessage &&
        prevUpdatedAt === nextUpdatedAt
      ) {
        return chat;
      }

      return {
        ...chat,
        ...nextChat,
      };
    });
  }

  return nextChats;
};

export const ChatSidebar = ({ onSelectUser, selectedUser }) => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);

  const [showNewUsers, setShowNewUsers] = useState(false);
  const [search, setSearch] = useState("");

  /*
   * Fetch all users
   */
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.uid) {
        return;
      }

      try {
        setLoadingUsers(true);

        const data = await getAllUsers(user.uid);

        setUsers(data);
      } catch (error) {
        console.error(error);

        toast.error("Unable to load users.");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [user?.uid]);

  /*
   * Listen to current user's conversations
   */
  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    setLoadingChats(true);

    const unsubscribe = subscribeToUserChats(user.uid, (data) => {
      setChats((prevChats) => {
        return mergeChatsPreservingOrder(prevChats, data);
      });

      setLoadingChats(false);
    });

    return unsubscribe;
  }, [user?.uid]);

  /*
   * Convert chats into conversation users
   *
   * Empty chats are excluded.
   */
  const conversations = useMemo(() => {
    return chats
      .filter((chat) => {
        const messageText = (chat.lastMessage || "").trim();

        return messageText.length > 0;
      })
      .map((chat) => {
        const otherUserId = chat.participants?.find(
          (participantId) => participantId !== user?.uid,
        );

        const otherUser = users.find(
          (userItem) => userItem.uid === otherUserId,
        );

        if (!otherUser) {
          return null;
        }

        return {
          user: otherUser,
          chat,
        };
      })
      .filter(Boolean);
  }, [chats, users, user?.uid]);

  /*
   * Select user
   */
  const handleSelectUser = useCallback(
    (userItem) => {
      onSelectUser(userItem);

      setShowNewUsers(false);
      setSearch("");
    },
    [onSelectUser],
  );

  /*
   * Search users for New conversation
   */
  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return users;
    }

    return users.filter((userItem) => {
      return (
        userItem.name?.toLowerCase().includes(searchValue) ||
        userItem.email?.toLowerCase().includes(searchValue)
      );
    });
  }, [users, search]);

  /*
   * Search existing conversations
   */
  const filteredConversations = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return conversations;
    }

    return conversations.filter(({ user: conversationUser, chat }) => {
      return (
        conversationUser.name?.toLowerCase().includes(searchValue) ||
        conversationUser.email?.toLowerCase().includes(searchValue) ||
        chat.lastMessage?.toLowerCase().includes(searchValue)
      );
    });
  }, [conversations, search]);

  /*
   * Stable click handlers for users
   */
  const filteredUserHandlers = useMemo(() => {
    return filteredUsers.reduce((acc, userItem) => {
      acc[userItem.uid] = () => handleSelectUser(userItem);

      return acc;
    }, {});
  }, [filteredUsers, handleSelectUser]);

  /*
   * Stable click handlers for conversations
   */
  const conversationHandlers = useMemo(() => {
    return conversations.reduce((acc, { user: conversationUser }) => {
      acc[conversationUser.uid] = () =>
        handleSelectUser(conversationUser);

      return acc;
    }, {});
  }, [conversations, handleSelectUser]);

  /*
   * Toggle New users
   */
  const handleNewClick = () => {
    setShowNewUsers((prev) => !prev);
    setSearch("");
  };

  return (
    <aside className="flex min-h-0 w-full shrink-0 flex-col border-b border-slate-200 bg-slate-50 md:w-72 md:border-b-0 md:border-r lg:w-80">
      {/* Header */}
      <div className="shrink-0 border-b border-slate-200 bg-white/80 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-slate-800">
              {showNewUsers ? "New conversation" : "Conversations"}
            </h2>

            <p className="mt-1 truncate text-xs text-slate-500">
              {showNewUsers
                ? "Choose someone to chat with"
                : "Your recent conversations"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleNewClick}
            className="shrink-0 cursor-pointer rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
          >
            {showNewUsers ? "Back" : "New"}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="shrink-0 p-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            showNewUsers
              ? "Search users..."
              : "Search conversations..."
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
        />
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {showNewUsers ? (
          <>
            {/* New users loading */}
            {loadingUsers ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
              </div>
            ) : filteredUsers.length === 0 ? (
              /* No users found */
              <div className="flex min-h-32 items-center justify-center px-4 text-center">
                <p className="text-sm text-slate-500">
                  No users found.
                </p>
              </div>
            ) : (
              /* Users */
              <div className="space-y-1">
                {filteredUsers.map((userItem) => (
                  <ChatSidebarItem
                    key={userItem.uid}
                    name={userItem.name}
                    lastMessage={userItem.email}
                    time=""
                    onClick={filteredUserHandlers[userItem.uid]}
                    isActive={false}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Conversations loading */}
            {loadingChats || loadingUsers ? (
              <div className="flex h-32 items-center justify-center">
                <div className="h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
              </div>
            ) : filteredConversations.length === 0 ? (
              /* Empty / no search results */
              <div className="flex min-h-40 flex-col items-center justify-center px-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl shadow-sm">
                  💬
                </div>

                <p className="mt-3 text-sm font-medium text-slate-600">
                  {search.trim()
                    ? "No conversations found"
                    : "No conversations yet"}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {search.trim()
                    ? "Try a different name or message."
                    : "Click New to start chatting with someone."}
                </p>
              </div>
            ) : (
              /* Conversations */
              <div className="space-y-1">
                {filteredConversations.map(
                  ({ user: conversationUser, chat }) => (
                    <ChatSidebarItem
                      key={chat.id}
                      name={conversationUser.name}
                      lastMessage={
                        chat.lastMessage || "No messages yet"
                      }
                      time=""
                      onClick={
                        conversationHandlers[conversationUser.uid]
                      }
                      isActive={
                        selectedUser?.uid ===
                        conversationUser.uid
                      }
                    />
                  ),
                )}
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;