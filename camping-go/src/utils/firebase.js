import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  //:process.env.REACT_APP_FIREBASE_APP_KEY
  apiKey: "AIzaSyAcjKT79s2sfxjX0t2jLw0qCZrOQTaknZs",
  authDomain: "camping-go-14942.firebaseapp.com",
  projectId: "camping-go-14942",
  storageBucket: "camping-go-14942.appspot.com",
  messagingSenderId: "220736180139",
  appId: "1:220736180139:web:05e45d67381c4b1767ccee",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
