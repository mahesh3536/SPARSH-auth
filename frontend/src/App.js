import { useEffect } from "react";
import "./App.css";
import useAuth from "./hooks/useAuth";
import axios from "axios";

function App() {
  const { user, login, loading, logout, token } = useAuth();
  useEffect(() => {
    if (token) fetchData(token);
  }, [token]);
  const fetchData = async (token) => {
    const res = await axios.get("http://localhost:5000/api/hello", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  };
  return (
    <div className="App">
      {!user && <button onClick={login}>Sign in with google</button>}
      {user && <button onClick={logout}>Logout</button>}
    </div>
  );
}

export default App;
