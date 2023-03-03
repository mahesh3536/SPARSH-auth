import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../config/firebase";

// useAuth hook exports { user, login, error, loading, logout, token}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [token, setToken] = useState(null);
  const googleAuth = new GoogleAuthProvider();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        user.getIdToken().then((token) => setToken(token));
        setLoading(false);
      } else {
        setUser(null);
        setLoading(true);
      }
      setInitialLoading(false);
    });
  }, [auth]);

  const createUser = async (user) => {
    try {
      const colRef = collection(db, "userInfo");
      let email = user.email || "";
      let check = email.endsWith("svnit.ac.in");
      const resource = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        isSvnitian: check,
      };

      const q = query(colRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      let docs = [];
      querySnapshot.forEach((doc) => {
        docs.push(doc.data());
      });
      if (docs.length) return;
      await setDoc(doc(colRef, user.uid), resource);
      window.location.href = "/user-info";
    } catch (err) {
      console.log(err);
    }
  };

  const login = async () => {
    await signInWithPopup(auth, googleAuth)
      .then((userCredential) => {
        setUser(userCredential.user);
        createUser(userCredential.user);
        console.log(userCredential.user);
        setLoading(false);
        console.log(userCredential.user);
      })
      .catch((err) => (setError(err.message), alert(err.message)))
      .finally(() => setLoading(false));
  };

  const emailLogin = async (email, password) => {
    const colRef = collection(db, "userInfo");
    const q = query(colRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    let docs = [];
    querySnapshot.forEach((doc) => {
      docs.push(doc.data());
    });

    let check = false;
    if (docs.length) check = true;
    if (check) {
      await signinWithEmail(email, password);
    } else {
      await createUserWithEmail(email, password);
    }
  };

  const signinWithEmail = async (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  const createUserWithEmail = async (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        createUser(user).then(() => {
          sendEmailVerification(user).then(() => {
            window.location.href = "/user-info";
          });
        });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  const logout = async () => {
    setLoading(true);
    signOut(auth)
      .then(() => setUser(null))
      .catch((err) => (setError(err.message), alert(err.message)))
      .finally(() => setLoading(false));
  };

  const resetPassword = async (email) => {
    console.log(email);
    sendPasswordResetEmail(auth, email);
  };

  const memoedValue = useMemo(
    () => ({
      user,
      login,
      emailLogin,
      error,
      loading,
      logout,
      resetPassword,
      token,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
