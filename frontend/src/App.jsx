import React, { useState, useEffect } from "react";

import AuthBar from "./components/AuthBar";

import PolicySummary from "./components/PolicySummary";
import ClaimsAssistant from "./components/ClaimsAssistant";
import FraudDetector from "./components/FraudDetector";
import QuoteBot from "./components/QuoteBot";
import RenewalPrediction from "./components/RenewalPrediction";
import DocumentClassifier from "./components/DocumentClassifier";
import CodeAssistant from "./components/CodeAssistant";
import InsightsHub from "./components/InsightsHub";

function App() {
  // ======================
  // SPLASH SCREEN
  // ======================
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1500); // 1.5 seconds
    return () => clearTimeout(t);
  }, []);

  // ======================
  // AUTH
  // ======================
  const [authToken, setAuthToken] = useState("");
  const [authUser, setAuthUser] = useState(null);

  const handleAuthChange = (token, user) => {
    setAuthToken(token || "");
    setAuthUser(user || null);
  };

  // ======================
  // ACTIVE TAB
  // ======================
  const [activeTab, setActiveTab] = useState("policy");

  const tabs = [
    { id: "policy", label: "Policy Summary" },
    { id: "claims", label: "Claims Assistant" },
    { id: "fraud", label: "Fraud Detector" },
    { id: "quotes", label: "Quote Comparison" },
    { id: "renewal", label: "Renewal Prediction" },
    { id: "docs", label: "Document Classifier" },
    { id: "code", label: "Actuarial Code Assistant" },
    { id: "insights", label: "Insights Hub" },
  ];

  // ======================
  // LOGIN MESSAGE
  // ======================
  const requireLoginMessage = (
    <div className="text-center text-sm text-slate-400 mt-10 animate-fadeIn">
      <p className="mb-2">Please log in to access AI tools.</p>
      <p>Your plan, tenant, permissions, and activity history are saved per account.</p>
    </div>
  );

  // ======================
  // SPLASH SCREEN VIEW
  // ======================
  if (showSplash) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="text-center animate-splashZoom">
          <h1
            className="text-5xl font-extrabold tracking-wider 
                       bg-gradient-to-r from-sky-400 to-cyan-300 
                       text-transparent bg-clip-text"
          >
            ClaimAxis
          </h1>
          <p className="text-slate-400 mt-3 text-lg">
            AI-Powered Enterprise Claims Automation
          </p>
        </div>
      </div>
    );
  }

  // ======================
  // MAIN APP SHELL (same structure as the working version)
  // ======================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">

      {/* HEADER – premium, but only visual changes */}
      <header className="bg-slate-900 border-b border-slate-800 py-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
          <h1
            className="text-4xl md:text-5xl font-extrabold tracking-wide 
                       bg-gradient-to-r from-sky-400 via-blue-300 to-cyan-400 
                       text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(56,189,248,0.25)]
                       animate-fadeIn"
          >
            ClaimAxis
          </h1>
          <div className="h-1 w-24 mt-2 rounded-full bg-gradient-to-r from-sky-500/60 to-cyan-400/60 blur-[2px]" />
          <p className="text-sm md:text-lg text-slate-300 mt-3 max-w-2xl leading-relaxed">
            Enterprise-Grade AI Platform for Automated Claims Processing, Fraud Detection and Policy Intelligence.
          </p>
        </div>
      </header>

      {/* AUTH BAR (unchanged behaviour) */}
      <AuthBar onAuthChange={handleAuthChange} />

      {/* TAB NAVIGATION – same pattern as your working UI */}
      <div className="max-w-6xl mx-auto mt-4 px-3 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-lg text-sm border transition ${
              activeTab === tab.id
                ? "bg-sky-500 text-black border-sky-500 shadow-md"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-sky-400 hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT – no extra wrappers that can hide content */}
      <main className="max-w-6xl mx-auto p-4 w-full flex-1 animate-fadeIn">
        {!authToken ? (
          requireLoginMessage
        ) : (
          <>
            {activeTab === "policy" && <PolicySummary authToken={authToken} />}
            {activeTab === "claims" && <ClaimsAssistant authToken={authToken} />}
            {activeTab === "fraud" && <FraudDetector authToken={authToken} />}
            {activeTab === "quotes" && <QuoteBot authToken={authToken} />}
            {activeTab === "renewal" && <RenewalPrediction authToken={authToken} />}
            {activeTab === "docs" && <DocumentClassifier authToken={authToken} />}
            {activeTab === "code" && <CodeAssistant authToken={authToken} />}
            {activeTab === "insights" && <InsightsHub authUser={authUser} />}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-10 p-4 text-center text-xs text-slate-500 border-t border-slate-800">
        © 2025 ClaimAxis — AI-Driven Claim Automation Platform
      </footer>
    </div>
  );
}

export default App;
