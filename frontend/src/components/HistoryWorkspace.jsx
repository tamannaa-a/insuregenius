import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

function HistoryWorkspace() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("Enter a search term or leave blank and click Search.");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("ig_token");
  const email = localStorage.getItem("ig_email");

  const handleSearch = async () => {
    if (!token) {
      setMessage("Please log in from the 'Login / Register' tab to view your history.");
      setResults([]);
      return;
    }
    setLoading(true);
    setMessage("");

    const params = new URLSearchParams();
    if (query) params.append("query", query);
    if (typeFilter) params.append("type", typeFilter);

    try {
      const res = await fetch(`${API_BASE}/activity/search?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const err = await res.json();
        setMessage(err.detail || "Error while searching history.");
        setResults([]);
        return;
      }
      const data = await res.json();
      setResults(data);
      if (data.length === 0) {
        setMessage("No matching activities found.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error contacting server.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Optionally auto-load on mount
  useEffect(() => {
    // auto search once if logged in
    if (token) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h3 className="font-semibold text-sm mb-1">History & Search</h3>
      <p className="text-xs text-slate-400 mb-3">
        Search across your saved AI outputs. Right now, policy summaries are logged here when you&apos;re signed in.
        You can extend this pattern to claims, fraud checks, etc.
      </p>

      <div className="flex flex-wrap gap-2 items-center text-xs mb-3">
        <input
          type="text"
          placeholder="Search text..."
          className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 flex-1 min-w-[160px]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All types</option>
          <option value="policy_summary">Policy summaries</option>
          {/* In future: claim_normalization, fraud_check, etc. */}
        </select>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-3 py-1.5 rounded-full bg-sky-500 text-slate-950 font-medium hover:bg-sky-400 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {!token && (
        <p className="text-xs text-amber-300 mb-2">
          You are not logged in. Login to see your personal history.
        </p>
      )}

      {message && (
        <p className="text-xs text-slate-400 mb-2">
          {message}
        </p>
      )}

      <div className="space-y-2 max-h-72 overflow-auto">
        {results.map((r) => (
          <div
            key={r.id}
            className="border border-slate-800 rounded-xl p-2 text-[11px] bg-slate-950/60"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200">
                {r.type}
              </span>
              <span className="text-slate-400">
                {new Date(r.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-slate-300 font-semibold mb-1">Input</p>
            <p className="whitespace-pre-wrap text-slate-200">
              {r.input_text?.slice(0, 300) || "(no input)"}{r.input_text && r.input_text.length > 300 ? "…" : ""}
            </p>
            <p className="text-slate-300 font-semibold mt-2 mb-1">Output</p>
            <p className="whitespace-pre-wrap text-slate-200">
              {r.output_text?.slice(0, 400) || "(no output)"}{r.output_text && r.output_text.length > 400 ? "…" : ""}
            </p>
          </div>
        ))}
      </div>

      {email && (
        <p className="mt-3 text-[11px] text-slate-500">
          Showing results for <span className="font-semibold">{email}</span>.
        </p>
      )}
    </div>
  );
}

export default HistoryWorkspace;
