import React, { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function LoginPage({ setToken }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [tenant] = useState("demo-tenant");
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "register") {
        const form = new FormData();
        form.append("email", email);
        form.append("password", pw);
        form.append("tenant_name", tenant);
        form.append("role", "AGENT");
        await fetch(`${API_BASE}/auth/register`, { method: "POST", body: form });
      }

      const form = new FormData();
      form.append("username", email);
      form.append("password", pw);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        body: form,
      });

      const json = await res.json();
      if (json.access_token) {
        localStorage.setItem("token", json.access_token);
        setToken(json.access_token);
      } else {
        setError(json.detail || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/70 shadow-2xl shadow-sky-500/10 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-50">ClaimAxis</h1>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access the AI claim workbench.
          </p>
        </div>

        <div className="flex mb-6 text-xs bg-slate-900 rounded-full p-1 border border-slate-700">
          <button
            onClick={() => setMode("login")}
            className={
              "flex-1 py-2 rounded-full font-medium " +
              (mode === "login"
                ? "bg-sky-500 text-white"
                : "text-slate-300")
            }
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={
              "flex-1 py-2 rounded-full font-medium " +
              (mode === "register"
                ? "bg-sky-500 text-white"
                : "text-slate-300")
            }
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block mb-1 text-slate-300">Email</label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-300">Password</label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              type="password"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Authenticating..." : mode === "login" ? "Login" : "Register & Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
