//rename this file to firebase.js

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"; // <- needed if using firestore
// import 'firebase/functions' // <- needed if using httpsCallable
const fbConfig = {
  apiKey: "xxxxx",
  authDomain: "xxxxx",
  databaseURL: "xxxxx",
  projectId: "xxxxx",
  storageBucket: "xxxxx",
  messagingSenderId: "xxxxxx"
};

// Initialize firebase instance
firebase.initializeApp(fbConfig);

firebase.firestore(); // <- needed if using firestore
// firebase.functions() // <- needed if using httpsCallable

export default firebase;
