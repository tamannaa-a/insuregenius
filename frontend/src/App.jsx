import React, { useState } from "react";
import PolicySummary from "./components/PolicySummary";
import ClaimsAssistant from "./components/ClaimsAssistant";
import FraudDetector from "./components/FraudDetector";
import QuoteBot from "./components/QuoteBot";
import RenewalPrediction from "./components/RenewalPrediction";
import DocumentClassifier from "./components/DocumentClassifier";
import CodeAssistant from "./components/CodeAssistant";

function App() {
  const [activeTab, setActiveTab] = useState("policy");

  return (
    <div className="min-h-screen">

      {/* HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">InsureGenius Copilot</h1>
          <p className="hidden sm:block text-xs text-slate-400">
            AI-Powered Insurance Intelligence Suite
          </p>
        </div>
      </header>

      {/* NAVIGATION */}
      <div className="max-w-6xl mx-auto mt-4 px-3 flex flex-wrap gap-2">
        {[
          ["policy", "Policy Summary"],
          ["claims", "Claims Assistant"],
          ["fraud", "Fraud Detector"],
          ["quotes", "Quote Comparison"],
          ["renewal", "Renewal Prediction"],
          ["docs", "Document Classifier"],
          ["code", "Actuarial Code Assistant"],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-3 py-2 rounded-lg text-sm border transition ${
              activeTab === id
                ? "bg-sky-500 text-black border-sky-500"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-sky-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ACTIVE SECTION */}
      <main className="max-w-6xl mx-auto p-4 mt-4">
        {activeTab === "policy" && <PolicySummary />}
        {activeTab === "claims" && <ClaimsAssistant />}
        {activeTab === "fraud" && <FraudDetector />}
        {activeTab === "quotes" && <QuoteBot />}
        {activeTab === "renewal" && <RenewalPrediction />}
        {activeTab === "docs" && <DocumentClassifier />}
        {activeTab === "code" && <CodeAssistant />}
      </main>

      {/* FOOTER */}
      <footer className="mt-10 p-4 text-center text-xs text-slate-500 border-t border-slate-800">
        © 2025 InsureGenius Copilot — Built for ValueMomentum AI/ML Hiring
      </footer>
    </div>
  );
}

export default App;
