import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

function ClaimsAssistant() {
  const [text, setText] = useState("");
  const [decision, setDecision] = useState("approved");
  const [normalized, setNormalized] = useState(null);
  const [lossDescription, setLossDescription] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const buildExplanation = (d) => {
    if (d === "approved") {
      return "Your claim has been approved as the loss type and severity fall within the covered events of your policy, and required documentation has been provided.";
    }
    if (d === "reduced") {
      return "Your claim has been partially approved. Some items are not fully covered due to deductibles, depreciation, or specific exclusions in your policy terms.";
    }
    return "Your claim could not be approved because the reported loss does not fall under covered events, or the documentation doesn't satisfy policy conditions.";
  };

  const handleProcess = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setNormalized(null);
    setLossDescription("");
    setExplanation("");

    try {
      const formData = new FormData();
      formData.append("text", text);

      const res = await fetch(`${API_BASE}/claims/normalize`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setNormalized(data);

      const desc = `The insured reported ${data.lossType.toLowerCase()} with severity assessed as ${data.severity.toLowerCase()} on the insured asset (${data.asset}). This structured description helps claim handlers and downstream fraud/underwriting checks.`;
      setLossDescription(desc);
      setExplanation(buildExplanation(decision));
    } catch (err) {
      console.error(err);
      setExplanation("Error while processing claim text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold text-sm mb-1">Claims Normalization & Explanation</h3>
        <p className="text-xs text-slate-400 mb-2">
          Paste messy claim notes (from customers or adjusters). The backend converts them
          into structured attributes while we also generate a loss description and customer-friendly explanation.
        </p>
        <textarea
          className="w-full h-40 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs outline-none focus:border-sky-500"
          placeholder="Example: Customer met with a severe accident yesterday night. Rear bumper and trunk of the car are heavily damaged. Similar incident happened last month..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex items-center gap-2 text-xs mt-2">
          <span className="text-slate-300">Claim Decision:</span>
          <select
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs"
          >
            <option value="approved">Approved</option>
            <option value="reduced">Reduced</option>
            <option value="denied">Denied</option>
          </select>
        </div>
        <button
          onClick={handleProcess}
          disabled={loading}
          className="mt-2 px-4 py-1.5 rounded-full text-xs font-medium bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Normalize & Explain"}
        </button>
      </div>

      <div className="space-y-3">
        <div className="border border-slate-800 rounded-xl p-2">
          <h4 className="font-semibold text-xs mb-1">Structured JSON</h4>
          <pre className="bg-slate-950 rounded-lg px-2 py-2 text-[11px] max-h-32 overflow-auto">
            {normalized ? JSON.stringify(normalized, null, 2) : "// Result will appear here"}
          </pre>
        </div>
        <div className="border border-slate-800 rounded-xl p-2">
          <h4 className="font-semibold text-xs mb-1">Loss Description (Internal)</h4>
          <p className="text-[11px] text-slate-200 min-h-[56px]">
            {lossDescription || "Generated loss description will appear here."}
          </p>
        </div>
        <div className="border border-slate-800 rounded-xl p-2">
          <h4 className="font-semibold text-xs mb-1">Customer Explanation</h4>
          <p className="text-[11px] text-slate-200 min-h-[56px]">
            {explanation || "Customer-friendly explanation will appear here."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClaimsAssistant;
