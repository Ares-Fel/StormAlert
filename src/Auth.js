import React, { useEffect, useState } from "react";
import app from "./firebase-config";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      localStorage.setItem("usuario", user.uid);
      setCurrentUser(user);
      app
        .firestore()
        .collection("users")
        .doc(user.uid)
        .onSnapshot((snap) => {
          setUserData(snap.data());
        });
      app
        .messaging()
        .getToken()
        .then((token) => {
          app
            .firestore()
            .collection("users")
            .doc(user.uid)
            .update({ token: token, connected: true });
        });
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userData }}>
      {children}
    </AuthContext.Provider>
  );
};
