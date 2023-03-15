import React from "react";
import useAuth from "./hooks/useAuth";

function ResetPassword() {
  const { user, login, emailLogin, loading, logout, resetPassword, token } =
    useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(e.target[0].value);
  };
  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" />
        </label>
        <label>
          <button type="submit">Submit</button>
        </label>
        <a href="/reset-password">Reset Password?</a>
      </form>
    </div>
  );
}

export default ResetPassword;
