import React, { useState } from "react";
import { addInsight } from "../utils/history";

const API_BASE = "http://localhost:8000";

function RenewalPrediction({ authToken }) {
  const [premium, setPremium] = useState("");
  const [claims, setClaims] = useState("");
  const [late, setLate] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const predict = async () => {
    if (!premium || !claims || !late) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("premium", premium);
      formData.append("claims", claims);
      formData.append("late", late);

      const res = await fetch(`${API_BASE}/renewal/predict`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });

      const data = await res.json();
      const prob = (data.probability * 100).toFixed(1) + "%";
      setResult(prob);

      addInsight({
        type: "renewal",
        title: "Renewal Prediction",
        summary: `Renewal Probability: ${prob}`,
        details: `Premium: ₹${premium}\nClaims: ${claims}\nLate Payments: ${late}`
      });
    } catch (e) {
      console.error(e);
      setResult("Error predicting renewal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold text-sm mb-1">Renewal Prediction Model</h3>
        <p className="text-xs text-slate-400 mb-2">
          Predicts how likely a customer is to renew based on past behavior.
        </p>

        <input
          type="number"
          placeholder="Premium"
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs mb-2"
          value={premium}
          onChange={(e) => setPremium(e.target.value)}
        />

        <input
          type="number"
          placeholder="Past Claims Count"
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs mb-2"
          value={claims}
          onChange={(e) => setClaims(e.target.value)}
        />

        <input
          type="number"
          placeholder="Late Payments"
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs"
          value={late}
          onChange={(e) => setLate(e.target.value)}
        />

        <button
          onClick={predict}
          disabled={loading}
          className="mt-3 px-4 py-1.5 bg-sky-500 rounded-full text-xs text-black"
        >
          {loading ? "Processing..." : "Predict Renewal"}
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-1">Prediction Output</h4>
        <pre className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs">
          {result || "Prediction will appear here"}
        </pre>
      </div>
    </div>
  );
}

export default RenewalPrediction;
