import { useEffect } from "react";
import "./App.css";
import useAuth from "./hooks/useAuth";
import axios from "axios";

function App() {
  const { user, login, loading, logout, token } = useAuth();

  const registerLogin = async (event) => {
    console.log(process.env.REACT_APP_BACKENDURL)
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKENDURL}api/events/register`,
        {
          user: user,
          event: event,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (res) console.log(res);
      else console.log("error");
    } catch (err) {
      console.log("error");
    }
  };

  return (
    <div className="App">
      {!user && <button onClick={login}>Sign in with google</button>}
      {user && <button onClick={logout}>Logout</button>}
      {user && (
        <>
          <button onClick={() => registerLogin("singing")}>
            register for singing event
          </button>
          <button onClick={() => registerLogin("dancing")}>
            register for dancing event
          </button>
        </>
      )}
    </div>
  );
}

export default App;
