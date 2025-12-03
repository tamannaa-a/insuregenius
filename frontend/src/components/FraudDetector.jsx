import React, { useState } from "react";
import { addInsight } from "../utils/history";

const API_BASE = "http://localhost:8000";

function FraudDetector({ authToken }) {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!text.trim() || !amount) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("amount", amount);

      const res = await fetch(`${API_BASE}/fraud/check`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const data = await res.json();
      setResult(data);

      addInsight({
        type: "fraud",
        title: "Fraud Check",
        summary: `Risk Level: ${data.risk}`,
        details: `Reasons:\n- ${data.reasons.join("\n- ")}`,
      });
    } catch (e) {
      console.error(e);
      setResult({ risk: "Error", reasons: ["Failed to check fraud."] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold text-sm mb-1">Fraud Detection Copilot</h3>

        <textarea
          className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs"
          placeholder="Describe the claim scenario..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="number"
          className="mt-2 w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs"
          placeholder="Enter claimed amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          onClick={check}
          disabled={loading}
          className="mt-3 px-4 py-1.5 bg-sky-500 text-slate-950 rounded-full text-xs"
        >
          {loading ? "Checking..." : "Analyze Fraud Risk"}
        </button>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-1">Fraud Result</h4>
        <pre className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs whitespace-pre-wrap overflow-auto">
          {result
            ? `Risk: ${result.risk}\n\nReasons:\n- ${result.reasons.join("\n- ")}`
            : "Risk results will appear here."}
        </pre>
      </div>
    </div>
  );
}

export default FraudDetector;
