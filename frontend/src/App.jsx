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

  const tabs = [
    { id: "policy", label: "Policy Summary", description: "Summarize complex policy documents into clear coverage, exclusions & limits." },
    { id: "claims", label: "Claims Assistant", description: "Normalize messy claim notes into structured attributes & explanations." },
    { id: "fraud", label: "Fraud Detector", description: "Flag suspicious claims with simple, explainable risk indicators." },
    { id: "quotes", label: "Quote Comparison", description: "Compare sample quotes and see AI-backed recommendations." },
    { id: "renewal", label: "Renewal Prediction", description: "Predict likelihood of policy renewal using a real ML model." },
    { id: "docs", label: "Document Classifier", description: "Classify insurance documents like claims, invoices & reports." },
    { id: "code", label: "Actuarial Code Assistant", description: "Generate Python snippets for loss ratio & pricing analysis." },
  ];

  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-sky-500 flex items-center justify-center text-slate-950 font-bold">
              IG
            </div>
            <div>
              <h1 className="text-lg font-semibold">InsureGenius Copilot</h1>
              <p className="text-xs text-slate-400">
                AI/ML Insurance Workbench — Portfolio project for ValueMomentum
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-xs text-slate-400">
            React · Vite · Tailwind · FastAPI · ML
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 md:px-4 py-4">
        {/* HERO / OVERVIEW */}
        <section className="mb-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="md:w-2/3">
              <h2 className="text-xl md:text-2xl font-semibold mb-1">
                End-to-End AI Suite for Insurance Teams
              </h2>
              <p className="text-sm text-slate-300">
                This web app integrates multiple GenAI & ML problem statements into one cohesive
                experience — from policy summarization and claims triage to fraud detection,
                renewal prediction and actuarial code generation.
              </p>
            </div>
            <div className="md:w-1/3 text-xs text-slate-300 bg-slate-950/60 border border-slate-700 rounded-xl p-3 mt-2 md:mt-0">
              <p className="font-semibold mb-1">How to explore:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Switch between tabs for each capability.</li>
                <li>Enter realistic insurance data (policies, claims, amounts).</li>
                <li>See structured outputs, risk flags, summaries and generated code.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* TABS */}
        <section>
          <div className="flex flex-wrap gap-2 mb-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm border transition ${
                  activeTab === tab.id
                    ? "bg-sky-500 text-slate-950 border-sky-500"
                    : "bg-slate-900 text-slate-300 border-slate-700 hover:border-sky-400"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active tab description */}
          {activeTabData && (
            <p className="text-xs text-slate-400 mb-3">
              {activeTabData.description}
            </p>
          )}

          {/* TAB CONTENT */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3 md:p-4">
            {activeTab === "policy" && <PolicySummary />}
            {activeTab === "claims" && <ClaimsAssistant />}
            {activeTab === "fraud" && <FraudDetector />}
            {activeTab === "quotes" && <QuoteBot />}
            {activeTab === "renewal" && <RenewalPrediction />}
            {activeTab === "docs" && <DocumentClassifier />}
            {activeTab === "code" && <CodeAssistant />}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 text-[11px] text-slate-500 py-3 px-4 mt-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>InsureGenius Copilot · AI/ML Insurance Use-Case Showcase</p>
          <p>Designed & implemented as a hiring portfolio project.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
