import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

function AuthBar({ onAuthChange }) {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantName, setTenantName] = useState("demo-tenant");
  const [role, setRole] = useState("customer");
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("ig_token");
    const savedUser = localStorage.getItem("ig_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      const parsed = JSON.parse(savedUser);
      setUserInfo(parsed);
      onAuthChange && onAuthChange(savedToken, parsed);
    }
  }, [onAuthChange]);

  const handleRegister = async () => {
    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("tenant_name", tenantName);
      formData.append("role", role);

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Registration failed");
      }
      const data = await res.json();
      setMessage(`Registered for tenant "${data.tenant_name}". Now log in.`);
      setMode("login");
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Login failed");
      }
      const data = await res.json();
      setToken(data.access_token);
      setUserInfo(data.user);
      localStorage.setItem("ig_token", data.access_token);
      localStorage.setItem("ig_user", JSON.stringify(data.user));
      onAuthChange && onAuthChange(data.access_token, data.user);
      setMessage("Logged in successfully.");
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    setUserInfo(null);
    localStorage.removeItem("ig_token");
    localStorage.removeItem("ig_user");
    onAuthChange && onAuthChange("", null);
  };

  if (userInfo && token) {
    return (
      <div className="w-full bg-slate-900/80 border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-slate-300 mr-2">
            Logged in as <span className="font-semibold">{userInfo.email}</span>
          </span>
          <span className="text-slate-400">
            Tenant: <span className="font-semibold">{userInfo.tenant_name}</span> · Role:{" "}
            <span className="font-semibold uppercase">{userInfo.role}</span>
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded-full border border-slate-700 text-slate-300 hover:border-red-400 hover:text-red-300"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/80 border-b border-slate-800 px-4 py-2 text-xs flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div className="flex items-center gap-2">
        <button
          className={`px-2 py-1 rounded-full border ${
            mode === "login"
              ? "border-sky-400 text-sky-300"
              : "border-slate-700 text-slate-400"
          }`}
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          className={`px-2 py-1 rounded-full border ${
            mode === "register"
              ? "border-sky-400 text-sky-300"
              : "border-slate-700 text-slate-400"
          }`}
          onClick={() => setMode("register")}
        >
          Register
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2 flex-1">
        <input
          type="email"
          placeholder="Email"
          className="bg-slate-950 border border-slate-700 rounded-full px-2 py-1 flex-1 min-w-[120px]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="bg-slate-950 border border-slate-700 rounded-full px-2 py-1 flex-1 min-w-[120px]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === "register" && (
          <>
            <input
              type="text"
              placeholder="Tenant name"
              className="bg-slate-950 border border-slate-700 rounded-full px-2 py-1 flex-1 min-w-[120px]"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
            />
            <select
              className="bg-slate-950 border border-slate-700 rounded-full px-2 py-1"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="agent">Agent</option>
              <option value="underwriter">Underwriter</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}
        <button
          onClick={mode === "login" ? handleLogin : handleRegister}
          disabled={loading}
          className="px-3 py-1 rounded-full bg-sky-500 text-slate-950 font-semibold disabled:opacity-50"
        >
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
        </button>
      </div>
      {message && <div className="text-[11px] text-slate-300">{message}</div>}
    </div>
  );
}

export default AuthBar;
