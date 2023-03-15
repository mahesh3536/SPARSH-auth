import { useEffect, useState } from "react";
import "./App.css";
import useAuth from "./hooks/useAuth";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import ResetPassword from "./ResetPassword";
import UserInfo from "./UserInfo";

function App() {
  const { user, login, emailLogin, loading, logout, resetPassword, token } =
    useAuth();
  const [data, setData] = useState(null);
  const [event, setEvent] = useState(null);

  const showEvent = (event) => {
    if (event) {
      const getRegisteredUsers = async () => {
        console.log(event);
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_BACKENDURL}api/events/${event}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          if (res) {
            setData(res.data?.data);
            setEvent(event);
          } else console.log("error");
        } catch (err) {
          console.log("error", err);
        }
      };
      getRegisteredUsers();
    }
  };

  const registerLogin = async (event) => {
    console.log(process.env.REACT_APP_BACKENDURL);
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
      console.log("error", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    emailLogin(e.target[0].value, e.target[1].value);
  };

  return (
    <div className="App">
      <div className="buttonRow">
        {!user && (
          <form onSubmit={handleSubmit}>
            <label>
              Email:
              <input type="email" />
            </label>
            <br />
            <label>
              Password:
              <input type="password" />
            </label>
            <label>
              <button type="submit">Submit</button>
            </label>
            <a href="/reset-password">Reset Password?</a>
          </form>
        )}
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
        {user && (
          <>
            <button onClick={() => showEvent("singing")}>
              Show Singing Event Registrations
            </button>
            <button onClick={() => showEvent("dancing")}>
              Show Dancing Event Registrations
            </button>
          </>
        )}
      </div>
      <div>
        {data && (
          <>
            <h1>Registered Users For Event {event}</h1>
            {data.map((item) => (
              <p>{item?.name}</p>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default function AppExport() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/user-info" element={<UserInfo />} />
    </Routes>
  );
}
