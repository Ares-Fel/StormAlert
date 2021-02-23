import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/messaging"

const app = firebase.initializeApp({
  apiKey: "AIzaSyDWHENiD-V6YesEbjyRI4b0z-QFimV0gRA",
  authDomain: "storm-alert-afe2b.firebaseapp.com",
  projectId: "storm-alert-afe2b",
  storageBucket: "storm-alert-afe2b.appspot.com",
  messagingSenderId: "1043047014245",
  appId: "1:1043047014245:web:2a22c4b1569bf2f43a4b8c",
  measurementId: "G-E8S5WX1FLY",
});



export default app;
