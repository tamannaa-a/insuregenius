import React, { useState } from "react";
import { addInsight } from "../utils/history";

const API_BASE = "http://localhost:8000";

function PolicySummary({ authToken }) {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setSummary("");

    try {
      const formData = new FormData();
      formData.append("text", text);

      const res = await fetch(`${API_BASE}/policy/summary`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const data = await res.json();
      setSummary(data.summary || "No summary returned.");

      // Save insight
      addInsight({
        type: "policy",
        title: "Policy Summary",
        summary: data.summary || "",
        details: text.slice(0, 300) + (text.length > 300 ? "..." : ""),
      });
    } catch (err) {
      console.error(err);
      setSummary("Error while summarizing policy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* LEFT */}
      <div>
        <h3 className="font-semibold text-sm mb-1">Policy Summary Assistant</h3>
        <p className="text-xs text-slate-400 mb-2">
          Paste any insurance policy wording. Backend extracts coverage, exclusions and limits.
        </p>
        <textarea
          className="w-full h-48 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs outline-none focus:border-sky-500"
          placeholder="Paste policy text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleSummarize}
          disabled={loading}
          className="mt-2 px-4 py-1.5 rounded-full text-xs font-medium bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-50"
        >
          {loading ? "Summarizing..." : "Generate Summary"}
        </button>
      </div>

      {/* RIGHT */}
      <div>
        <h4 className="font-semibold text-sm mb-1">Summary Output</h4>
        <pre className="w-full h-48 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs whitespace-pre-wrap overflow-auto">
          {summary || "Summary will appear here"}
        </pre>
      </div>
    </div>
  );
}

export default PolicySummary;
