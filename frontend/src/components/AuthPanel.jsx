import React, { useState } from "react";

export default function AuthPanel({ setAuthToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [message, setMessage] = useState("");

  const API = "http://127.0.0.1:8000";

  async function handleSubmit() {
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      let endpoint =
        mode === "login" ? "/auth/login" : "/auth/register";

      const res = await fetch(API + endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.access_token) {
        setAuthToken(data.access_token);
      }

      setMessage("Success!");
    } catch (e) {
      setMessage("Error logging in.");
    }
  }

  return (
    <div className="text-white flex flex-col gap-4">
      <div className="flex gap-2 mb-2">
        <button
          className={`px-4 py-2 rounded-lg ${mode === "login" ? "bg-teal-500" : "bg-gray-700"}`}
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${mode === "register" ? "bg-purple-500" : "bg-gray-700"}`}
          onClick={() => setMode("register")}
        >
          Register
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label>Email</label>
        <input
          className="px-3 py-2 rounded bg-gray-800 border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          className="px-3 py-2 rounded bg-gray-800 border border-gray-700"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-teal-600 hover:bg-teal-700 py-2 rounded-lg mt-3"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>

        <p className="text-green-400">{message}</p>
      </div>
    </div>
  );
}
