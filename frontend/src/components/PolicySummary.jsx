import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

function PolicySummary() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setSummary("");

    try:
      const formData = new FormData();
      formData.append("text", text);

      const res = await fetch(`${API_BASE}/policy/summary`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setSummary(data.summary || "No summary returned.");
    } catch (err) {
      console.error(err);
      setSummary("Error while summarizing policy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold text-sm mb-1">Policy Summary Assistant</h3>
        <p className="text-xs text-slate-400 mb-2">
          Paste any insurance policy wording or clause. The backend extracts coverage,
          exclusions and limits using heuristics (ready to swap with an LLM later).
        </p>
        <textarea
          className="w-full h-48 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs outline-none focus:border-sky-500"
          placeholder="Paste policy terms here..."
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
      <div>
        <h4 className="font-semibold text-sm mb-1">Summary Output</h4>
        <pre className="w-full h-48 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs whitespace-pre-wrap overflow-auto">
          {summary || "Summary will appear here once you submit text."}
        </pre>
        <div className="mt-2 text-[11px] text-slate-400 border border-slate-800 rounded-xl p-2">
          In production, this API would call a fine-tuned LLM for:
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li>Customer-facing summaries in plain language</li>
            <li>Underwriter-focused technical summaries</li>
            <li>Compliance checks for regulatory terms</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PolicySummary;
