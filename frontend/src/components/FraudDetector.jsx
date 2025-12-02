import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

function FraudDetector() {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState(100000);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("amount", String(amount));

      const res = await fetch(`${API_BASE}/fraud/check`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ risk: "Error", reasons: ["Could not run fraud check."] });
    } finally {
      setLoading(false);
    }
  };

  const riskColor =
    result?.risk === "High"
      ? "bg-red-500/20 text-red-300 border-red-500/60"
      : result?.risk === "Medium"
      ? "bg-amber-500/20 text-amber-200 border-amber-500/60"
      : "bg-emerald-500/20 text-emerald-200 border-emerald-500/60";

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold text-sm mb-1">Fraud Detection Copilot</h3>
        <p className="text-xs text-slate-400 mb-2">
          Enter claim description and claimed amount. The backend applies simple explainable
          rules to flag High / Medium / Low risk — a placeholder for a full ML fraud engine.
        </p>
        <textarea
          className="w-full h-40 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs outline-none focus:border-sky-500"
          placeholder="Example: Customer urgently requests immediate approval for a large claim amount with no documents..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex items-center gap-2 text-xs mt-2">
          <span className="text-slate-300">Claimed amount (₹)</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-32 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs"
          />
        </div>
        <button
          onClick={handleCheck}
          disabled={loading}
          className="mt-2 px-4 py-1.5 rounded-full text-xs font-medium bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-50"
        >
          {loading ? "Checking..." : "Run Fraud Check"}
        </button>
      </div>

      <div className="space-y-3">
        <div className="border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-xs mb-1">Risk Level</h4>
            <p className="text-sm">
              {result ? result.risk : "Not evaluated yet"}
            </p>
          </div>
          {result && (
            <span className={`px-3 py-1 border rounded-full text-xs font-semibold ${riskColor}`}>
              {result.risk} Risk
            </span>
          )}
        </div>
        <div className="border border-slate-800 rounded-xl p-3">
          <h4 className="font-semibold text-xs mb-1">Why this was flagged</h4>
          <ul className="text-[11px] text-slate-200 list-disc list-inside space-y-1">
            {result
              ? result.reasons.map((r, i) => <li key={i}>{r}</li>)
              : "Explanations for fraud signals will appear here."}
          </ul>
        </div>
        <div className="border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400">
          In a real deployment, this module would combine:
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li>Historical claim patterns and peer group analysis</li>
            <li>Network analysis for shared addresses, phone numbers, garages</li>
            <li>ML classification models and anomaly detection</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FraudDetector;
