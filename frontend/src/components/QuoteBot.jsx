import React from "react";

const quotes = [
  {
    id: "q1",
    insurer: "InsureSafe",
    premium: 12000,
    deductible: 5000,
    focus: "Motor – zero dep, roadside assistance",
    bestFor: "Balanced coverage and price",
  },
  {
    id: "q2",
    insurer: "SecureShield",
    premium: 10000,
    deductible: 7500,
    focus: "Budget-friendly, fewer add-ons",
    bestFor: "Price-sensitive customers",
  },
  {
    id: "q3",
    insurer: "FamilyGuard",
    premium: 14000,
    deductible: 4000,
    focus: "Higher medical & personal accident cover",
    bestFor: "Families with dependents",
  },
];

function QuoteBot() {
  const recommended = quotes[2]; // FamilyGuard as best for family of 4

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold text-sm mb-1">Quote Comparison Assistant</h3>
        <p className="text-xs text-slate-400 mb-2">
          Below are three example motor/health quotes. A conversational AI could reason
          about coverage, exclusions and premiums from raw quote documents and answer
          questions like &quot;Which is best for a family of four?&quot;
        </p>
        <div className="space-y-2">
          {quotes.map((q) => (
            <div
              key={q.id}
              className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{q.insurer}</p>
                <p className="text-slate-300">
                  ₹{q.premium.toLocaleString()}/year
                </p>
              </div>
              <p className="text-[11px] text-slate-400">
                Deductible: ₹{q.deductible.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-200 mt-1">{q.focus}</p>
              <p className="text-[11px] text-slate-400 mt-1 italic">
                Best for: {q.bestFor}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="border border-slate-800 rounded-xl p-3">
          <h4 className="font-semibold text-sm mb-1">AI Recommendation</h4>
          <p className="text-xs text-slate-200">
            For a <span className="font-semibold">family of four</span>, the suggested
            quote is:
          </p>
          <p className="mt-1 text-sm font-semibold text-sky-300">
            {recommended.insurer}
          </p>
          <p className="text-xs text-slate-200 mt-1">
            It offers stronger protection for medical and personal accident needs, with
            a lower deductible of ₹{recommended.deductible.toLocaleString()} compared to
            cheaper options. This reduces out-of-pocket cost at the time of claim,
            which is important for families with dependents.
          </p>
        </div>
        <div className="border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400">
          In a real RAG-based chatbot:
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li>Users upload quote PDFs or screenshots</li>
            <li>Backend extracts coverage tables & limits</li>
            <li>LLM answers questions in plain language</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default QuoteBot;
