import firebase from "firebase";
import "firebase/auth";
import "firebase/storage";

var config = {
  apiKey: "AIzaSyAzlImvUMCiKQqxQ4p7Z8NmhdiABk-wF8g",
  authDomain: "community-zooz-1546632699030.firebaseapp.com",
  databaseURL: "https://community-zooz-1546632699030.firebaseio.com",
  projectId: "community-zooz-1546632699030",
  storageBucket: "community-zooz-1546632699030.appspot.com",
  messagingSenderId: "186239359065"
};

firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
export default firebase;
