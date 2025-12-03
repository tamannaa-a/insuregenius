import React, { useState } from "react";
import { addInsight } from "../utils/history";

const API_BASE = "http://localhost:8000";

function ClaimsAssistant({ authToken }) {
  const [text, setText] = useState("");
  const [decision, setDecision] = useState("approved");
  const [lossDescription, setLossDescription] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const process = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", text);

      const res = await fetch(`${API_BASE}/claims/normalize`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const data = await res.json();
      setLossDescription(data.summary);
      setDetails(
        `Loss Type: ${data.lossType}\nSeverity: ${data.severity}\nAsset: ${data.asset}\n\nDecision: ${decision.toUpperCase()}`
      );

      addInsight({
        type: "claim",
        title: "Claim Normalization",
        summary: data.summary,
        details: text.slice(0, 300),
      });
    } catch (e) {
      console.error(e);
      setDetails("Error processing claim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold text-sm mb-1">Claims Assistant</h3>
        <p className="text-xs text-slate-400 mb-2">
          Converts free-form claim notes into structured loss details.
        </p>

        <textarea
          className="w-full h-40 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs"
          placeholder="Paste raw claim notes here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <select
          className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs"
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
        >
          <option value="approved">Approved</option>
          <option value="reduced">Reduced</option>
          <option value="denied">Denied</option>
        </select>

        <button
          onClick={process}
          disabled={loading}
          className="mt-3 px-4 py-1.5 bg-sky-500 text-black rounded-full text-xs"
        >
          {loading ? "Processing..." : "Normalize & Explain"}
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-1">Output</h4>
        <pre className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs whitespace-pre-wrap overflow-auto">
          {details || "Explanation will appear here"}
        </pre>
      </div>
    </div>
  );
}

export default ClaimsAssistant;
