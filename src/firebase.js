import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCVmwUu6nQNEisQosNyegRci3Sp6qREJEQ",
    authDomain: "clone--drive-644ba.firebaseapp.com",
    projectId: "clone--drive-644ba",
    storageBucket: "clone--drive-644ba.appspot.com",
    messagingSenderId: "364484080228",
    appId: "1:364484080228:web:863d660cc2e1cacaf06571"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

const storage = firebase.storage();

const provider = new firebase.auth.GoogleAuthProvider();

export {auth, provider, db, storage};

