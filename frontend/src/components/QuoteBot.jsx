import React from "react";
import { addInsight } from "../utils/history";

function QuoteBot({ authToken }) {
  const sampleQuotes = [
    { name: "Basic Plan", premium: 12000, deductible: 5000, coverage: "Standard Motor OD + TP" },
    { name: "Family Plan", premium: 15000, deductible: 3000, coverage: "Enhanced OD + Zero Dep Add-on" },
    { name: "Premium Plan", premium: 18000, deductible: 2000, coverage: "Zero Dep + Return to Invoice + Roadside" }
  ];

  const recommended = sampleQuotes[1]; // simple logic

  const saveInsight = () => {
    addInsight({
      type: "quote",
      title: "Quote Comparison",
      summary: `Recommended Plan: ${recommended.name}`,
      details: JSON.stringify(sampleQuotes, null, 2)
    });
  };

  return (
    <div className="text-sm">
      <h3 className="font-semibold mb-2">Quote Comparison Assistant</h3>

      <p className="text-xs text-slate-400 mb-3">
        Compares example quotes and recommends the best for a family of 4.
      </p>

      <div className="grid md:grid-cols-3 gap-3">
        {sampleQuotes.map((q, i) => (
          <div key={i} className="border border-slate-700 rounded-xl p-3 bg-slate-950">
            <h4 className="font-bold text-sky-300 mb-1">{q.name}</h4>
            <p>Premium: ₹{q.premium}</p>
            <p>Deductible: ₹{q.deductible}</p>
            <p className="text-xs text-slate-400 mt-1">{q.coverage}</p>
          </div>
        ))}
      </div>

      <button
        onClick={saveInsight}
        className="mt-4 px-4 py-1.5 bg-sky-500 text-black rounded-full text-xs"
      >
        Save Recommended Plan
      </button>

      <div className="mt-3 text-xs text-slate-400">
        Recommended Plan: <span className="text-sky-300">{recommended.name}</span>
      </div>
    </div>
  );
}

export default QuoteBot;
