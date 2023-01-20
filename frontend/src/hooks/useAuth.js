import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
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
        console.log(user);
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
      const resource = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      };

      const q = query(colRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      let docs = [];
      querySnapshot.forEach((doc) => {
        docs.push(doc.data());
      });
      if (docs.length) return;
      await setDoc(doc(colRef, user.uid), resource);
    } catch (err) {
      console.log(err);
    }
  };

  const login = async () => {
    console.log("Hello");
    await signInWithPopup(auth, googleAuth)
      .then((userCredential) => {
        setUser(userCredential.user);
        createUser(userCredential.user);
        console.log(userCredential.user);
        setLoading(false);
      })
      .catch((err) => (setError(err.message), alert(err.message)))
      .finally(() => setLoading(false));
  };

  const logout = async () => {
    setLoading(true);
    signOut(auth)
      .then(() => setUser(null))
      .catch((err) => (setError(err.message), alert(err.message)))
      .finally(() => setLoading(false));
  };

  const memoedValue = useMemo(
    () => ({
      user,
      login,
      error,
      loading,
      logout,
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
