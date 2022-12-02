import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "sharme-de5b8.firebaseapp.com",
  projectId: "sharme-de5b8",
  storageBucket: "sharme-de5b8.appspot.com",
  messagingSenderId: "2601000200",
  appId: "1:2601000200:web:855b1cf4036adb7f4ea0bd"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();
const storage = getStorage(firebaseApp);

export { db, storage, auth, provider };
