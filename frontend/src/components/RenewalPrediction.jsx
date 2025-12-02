import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

function RenewalPrediction() {
  const [premium, setPremium] = useState(12000);
  const [claims, setClaims] = useState(1);
  const [late, setLate] = useState(0);
  const [probability, setProbability] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    setProbability(null);
    try {
      const formData = new FormData();
      formData.append("premium", String(premium));
      formData.append("claims", String(claims));
      formData.append("late", String(late));

      const res = await fetch(`${API_BASE}/renewal/predict`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setProbability(data.probability);
    } catch (err) {
      console.error(err);
      setProbability(-1);
    } finally {
      setLoading(false);
    }
  };

  const percent = probability !== null && probability >= 0 ? (probability * 100).toFixed(1) : null;

  const barColor =
    probability !== null && probability >= 0.8
      ? "bg-emerald-400"
      : probability !== null && probability >= 0.6
      ? "bg-amber-400"
      : "bg-red-400";

  return (
    <div className="grid md:grid-cols-[1.2fr,1fr] gap-4">
      <div>
        <h3 className="font-semibold text-sm mb-1">Renewal Prediction Model</h3>
        <p className="text-xs text-slate-400 mb-2">
          This form hits a real ML model (logistic regression) trained on synthetic data.
          It predicts the probability that a customer will renew their policy.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex flex-col gap-1">
            <label className="text-slate-300">Annual Premium (₹)</label>
            <input
              type="number"
              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1"
              value={premium}
              onChange={(e) => setPremium(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-slate-300">Number of Claims</label>
            <input
              type="number"
              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1"
              value={claims}
              onChange={(e) => setClaims(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-slate-300">Late Payments</label>
            <input
              type="number"
              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1"
              value={late}
              onChange={(e) => setLate(Number(e.target.value))}
            />
          </div>
        </div>
        <button
          onClick={handlePredict}
          disabled={loading}
          className="mt-3 px-4 py-1.5 rounded-full text-xs font-medium bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-50"
        >
          {loading ? "Predicting..." : "Predict Renewal Probability"}
        </button>
      </div>

      <div className="space-y-3">
        <div className="border border-slate-800 rounded-xl p-3">
          <h4 className="font-semibold text-xs mb-1">Renewal Probability</h4>
          {percent ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-2 ${barColor}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-sm">{percent}%</span>
              </div>
              <p className="text-[11px] text-slate-200">
                This probability can be used by retention and cross-sell teams to
                prioritize outreach, discounts or policy upgrades.
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400">
              Enter inputs and click &quot;Predict&quot; to see the renewal likelihood.
            </p>
          )}
        </div>
        <div className="border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400">
          In a production model you would:
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li>Train on historical renewals and churn labels</li>
            <li>Use richer features like NPS, engagement, agent channel</li>
            <li>Explain predictions using SHAP or feature importance</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RenewalPrediction;
