// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCB2Fe8gzmcX1S_4K1Qo7xWajq1ZxbDF3c",
  authDomain: "sparsh-546ec.firebaseapp.com",
  projectId: "sparsh-546ec",
  storageBucket: "sparsh-546ec.appspot.com",
  messagingSenderId: "379560169652",
  appId: "1:379560169652:web:49a9734e389498c70c07e1",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth(app);

export default app;
export { auth, db };
