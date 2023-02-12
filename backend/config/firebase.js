// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCB2Fe8gzmcX1S_4K1Qo7xWajq1ZxbDF3c",
  authDomain: "sparsh-546ec.firebaseapp.com",
  projectId: "sparsh-546ec",
  storageBucket: "sparsh-546ec.appspot.com",
  messagingSenderId: "379560169652",
  appId: "1:379560169652:web:49a9734e389498c70c07e1",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);

module.exports = { db };
