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
// const firebaseConfig = {
//   apiKey: "AIzaSyAM40dAArC96r9KKNvOzM7g2WQQqDJka10",
//   authDomain: "fir-basics-35bef.firebaseapp.com",
//   projectId: "fir-basics-35bef",
//   storageBucket: "fir-basics-35bef.appspot.com",
//   messagingSenderId: "342966114039",
//   appId: "1:342966114039:web:8bcbdaf7ec54a729f765f2",
//   measurementId: "G-BHZDSN09D5",
//   storageBucket: "gs://fir-basics-35bef.appspot.com"
// };


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);

module.exports = { db };
