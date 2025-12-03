import { useState } from "react";

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (email === "admin@claimaxis.com" && password === "admin123") {
      onLoginSuccess();
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="bg-[#111827] border border-gray-700 p-10 rounded-xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold text-center mb-6">ClaimAxis Login</h2>

        <input
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white mb-4"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white mb-4"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium"
        >
          Login
        </button>
      </div>
    </div>
  );
}
