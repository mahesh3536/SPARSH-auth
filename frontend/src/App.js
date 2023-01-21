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
  const registerLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/events/register", { user: user, event: 'singing' });
      if(res) console.log(res)
      else console.log("error")
    } catch (err) {
      console.log("error")
    }
  }
  return (
    <div className="App">
      {!user && <button onClick={login}>Sign in with google</button>}
      {user && <button onClick={logout}>Logout</button>}
      {user && <button onClick={registerLogin}>register for singing event</button>}
    </div>
  );
}

export default App;
