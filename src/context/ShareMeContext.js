import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebase";
import { signOut } from "firebase/auth";

export const ShareMeContext = createContext();

const ShareMeContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersDetails, setUserDetails] = useState([]);
  const [pins,setPins] = useState([]);

  const sighnOut = () => {
    signOut(auth)
      .then(() => {
        setUser("");
      })
      .catch((error) => {
        alert(error);
      });
  };


  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      const docRef = doc(db, "users", `${user?.displayName}`);
      onSnapshot(docRef, (snapshot) => {
        setUser(snapshot.data());
      });
    });
  }, []);

  useEffect(() => {
    const userRef = collection(db, "users");
    onSnapshot(userRef, (snapshot) => {
      setUsers(snapshot.docs.map((doc) => doc.id));
    });
  }, []);

  useEffect(() => {
    const userRef = collection(db, "users");
    onSnapshot(userRef, (snapshot) => {
      setUserDetails(
        snapshot.docs.map((doc) => ({ name: doc.id, data: doc.data() }))
      );
    });
  }, []);


  const value = { user, users,usersDetails , pins,sighnOut,setPins ,setUserDetails, setUser, setUsers };

  return (
    <ShareMeContext.Provider value={value}>{children}</ShareMeContext.Provider>
  );
};

export default ShareMeContextProvider;
