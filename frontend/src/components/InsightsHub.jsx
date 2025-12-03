import React, { useEffect, useState } from "react";
import { getInsights } from "../utils/history";

const TYPE_LABELS = {
  policy: "Policy Summary",
  claim: "Claim Normalization",
  fraud: "Fraud Check",
  renewal: "Renewal Prediction",
  document: "Document Classification",
  code: "Code Generation",
  quote: "Quote Comparison",
};

function InsightsHub() {
  const [insights, setInsights] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    setInsights(getInsights());
  }, []);

  const filtered = insights.filter((item) => {
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const text =
      `${item.title || ""} ${item.summary || ""} ${item.details || ""}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">Insights Hub</h3>
          <p className="text-xs text-slate-400">
            Search across all your past analyses — policy summaries, claim explanations,
            fraud checks, renewal predictions, document types and generated code.
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-2 md:items-end">
          <input
            type="text"
            placeholder="Search insights (e.g. 'fire damage', 'high risk', 'renewal')"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 bg-slate-950 border border-slate-700 rounded-full px-3 py-1.5 text-xs outline-none focus:border-sky-500"
          />
          <div className="flex flex-wrap gap-1 justify-end">
            {[
              ["all", "All"],
              ["policy", "Policy"],
              ["claim", "Claims"],
              ["fraud", "Fraud"],
              ["renewal", "Renewal"],
              ["document", "Docs"],
              ["code", "Code"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTypeFilter(value)}
                className={`px-2 py-1 rounded-full text-[11px] border ${
                  typeFilter === value
                    ? "bg-sky-500 text-slate-950 border-sky-500"
                    : "bg-slate-900 text-slate-300 border-slate-700 hover:border-sky-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-xs text-slate-500">
          No insights stored yet. Use any tool (Policy, Claims, Fraud, etc.) and results
          will automatically appear here.
        </p>
      ) : (
        <div className="grid gap-2 md:grid-cols-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="border border-slate-800 rounded-xl bg-slate-950/80 p-3 text-xs"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-200">
                  {item.title || TYPE_LABELS[item.type] || "Insight"}
                </span>
                <span className="text-[10px] text-slate-400">
                  {TYPE_LABELS[item.type] || item.type}
                </span>
              </div>
              {item.summary && (
                <p className="text-[11px] text-slate-200 whitespace-pre-wrap mb-1">
                  {item.summary}
                </p>
              )}
              {item.details && (
                <p className="text-[11px] text-slate-400 whitespace-pre-wrap">
                  {item.details}
                </p>
              )}
              <p className="text-[10px] text-slate-500 mt-2">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InsightsHub;
