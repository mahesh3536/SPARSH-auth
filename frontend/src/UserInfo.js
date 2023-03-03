import axios from "axios";
import React from "react";
import useAuth from "./hooks/useAuth";

function UserInfo() {
  const { user, login, emailLogin, loading, logout, resetPassword, token } =
    useAuth();
  if (!user) return "Login first";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      uid: user.uid,
      name: e.target[0].value,
      email: e.target[1].value,
      gender: e.target[2].value,
      college_name: e.target[3].value,
      phone_no: e.target[4].value,
    };
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKENDURL}api/userinfo/`,
        data,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={user?.displayName} required />
          <br />
        </label>
        <label>
          Email:
          <input type="email" value={user?.email} disabled />
          <br />
        </label>
        <label>
          Gender:
          <select>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="undisclosed">Prefer not to say</option>
          </select>
          <br />
        </label>
        <label>
          College Name:
          <input type="text" />
          <br />
        </label>
        <label>
          Phone Number (Whatsapp):
          <input type="text" />
          <br />
        </label>
        <input type={"submit"} />
      </form>
    </div>
  );
}

export default UserInfo;
