import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

function AdminDashboard({ authToken, authUser }) {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = authUser && authUser.role?.toLowerCase() === "admin";

  useEffect(() => {
    if (!authToken || !isAdmin) return;

    const fetchData = async () => {
      try {
        const [oRes, uRes] = await Promise.all([
          fetch(`${API_BASE}/admin/overview`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          fetch(`${API_BASE}/admin/users`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
        ]);

        const oJson = await oRes.json();
        const uJson = await uRes.json();
        setOverview(oJson);
        setUsers(uJson);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="mt-6 text-sm text-amber-300">
        You are logged in as <b>{authUser?.role}</b>. Admin dashboard is only visible for{" "}
        <b>ADMIN</b> role.
      </div>
    );
  }

  if (loading) {
    return <div className="mt-6 text-sm text-slate-300">Loading admin analytics…</div>;
  }

  return (
    <div className="mt-4">
      <h3 className="font-semibold text-sm mb-3">Admin Dashboard</h3>

      {/* Metric cards */}
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm">
          <div className="text-xs text-slate-400 mb-1">Active Users (Tenant)</div>
          <div className="text-2xl font-bold text-sky-400">
            {overview?.user_count ?? 0}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm">
          <div className="text-xs text-slate-400 mb-1">Payments Recorded</div>
          <div className="text-2xl font-bold text-emerald-400">
            {overview?.payment_count ?? 0}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm">
          <div className="text-xs text-slate-400 mb-1">Total Revenue (Demo)</div>
          <div className="text-2xl font-bold text-amber-300">
            ₹{(overview?.total_revenue ?? 0).toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 text-xs overflow-x-auto">
        <div className="mb-2 font-semibold text-slate-200">Tenant Users</div>
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="py-1 pr-3">ID</th>
              <th className="py-1 pr-3">Email</th>
              <th className="py-1 pr-3">Role</th>
              <th className="py-1 pr-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-800">
                <td className="py-1 pr-3">{u.id}</td>
                <td className="py-1 pr-3">{u.email}</td>
                <td className="py-1 pr-3 uppercase text-sky-300">{u.role}</td>
                <td className="py-1 pr-3 text-slate-400">
                  {new Date(u.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="py-2 text-slate-400">
                  No users yet for this tenant.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
