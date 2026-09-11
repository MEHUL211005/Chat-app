import {
  collection,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export const createUserProfile = async (user, name) => {
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email: user.email,
    photoURL: user.photoURL || "",
    createdAt: serverTimestamp(),
  });
};

export const getAllUsers = async (currentUserId) => {
  const usersSnapshot = await getDocs(collection(db, "users"));

  return usersSnapshot.docs
    .map((userDoc) => ({
      id: userDoc.id,
      ...userDoc.data(),
    }))
    .filter((user) => user.uid !== currentUserId);
};