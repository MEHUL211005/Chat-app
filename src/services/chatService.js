import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export const findExistingChat = async (currentUserId, selectedUserId) => {
  const chatsRef = collection(db, "chats");

  const q = query(
    chatsRef,
    where("participants", "array-contains", currentUserId),
  );

  const snapshot = await getDocs(q);

  const existingChat = snapshot.docs.find((chatDoc) => {
    const data = chatDoc.data();

    return data.participants?.includes(selectedUserId);
  });

  if (!existingChat) {
    return null;
  }

  return {
    id: existingChat.id,
    ...existingChat.data(),
  };
};

export const createChat = async (currentUserId, selectedUserId) => {
  const existingChat = await findExistingChat(
    currentUserId,
    selectedUserId,
  );

  if (existingChat) {
    return existingChat;
  }

  const chatRef = await addDoc(collection(db, "chats"), {
    participants: [currentUserId, selectedUserId],
    lastMessage: "",
    updatedAt: serverTimestamp(),
  });

  return {
    id: chatRef.id,
    participants: [currentUserId, selectedUserId],
    lastMessage: "",
  };
};

export const getOrCreateChat = async (
  currentUserId,
  selectedUserId,
) => {
  return createChat(currentUserId, selectedUserId);
};

export const subscribeToMessages = (chatId, onMessages) => {
  if (!chatId) {
    return () => {};
  }

  const messagesRef = collection(
    db,
    "chats",
    chatId,
    "messages",
  );

  const messagesQuery = query(
    messagesRef,
    orderBy("createdAt", "asc"),
  );

  const unsubscribe = onSnapshot(
    messagesQuery,
    (snapshot) => {
      const messages = snapshot.docs.map((messageDoc) => ({
        id: messageDoc.id,
        ...messageDoc.data(),
      }));

      onMessages(messages);
    },
    (error) => {
      console.error("Messages listener error:", error);
    },
  );

  return unsubscribe;
};

export const sendMessage = async (chatId, senderId, text) => {
  const trimmedText = text.trim();

  if (!chatId || !senderId || !trimmedText) {
    throw new Error("Invalid message data");
  }

  const messagesRef = collection(
    db,
    "chats",
    chatId,
    "messages",
  );

  await addDoc(messagesRef, {
    senderId,
    text: trimmedText,
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: trimmedText,
    updatedAt: serverTimestamp(),
  });
};

export const subscribeToUserChats = (currentUserId, onChats) => {
  if (!currentUserId) {
    return () => {};
  }

  const chatsRef = collection(db, "chats");

  const chatsQuery = query(
    chatsRef,
    where("participants", "array-contains", currentUserId),
  );

  const unsubscribe = onSnapshot(
    chatsQuery,
    (snapshot) => {
      const chats = snapshot.docs
        .map((chatDoc) => ({
          id: chatDoc.id,
          ...chatDoc.data(),
        }))
        .sort((a, b) => {
          const aTime = a.updatedAt?.toMillis?.() || 0;
          const bTime = b.updatedAt?.toMillis?.() || 0;

          return bTime - aTime;
        });

      onChats(chats);
    },
    (error) => {
      console.error("Chats listener error:", error);
    },
  );

  return unsubscribe;
};