export default function Sidebar({ activeTab, setActiveTab, theme, setTheme }) {
  const tabs = [
    { id: "documents", label: "Document Classifier" },
    { id: "policy", label: "Policy Summary" },
    { id: "claims", label: "Claims Assistant" },
    { id: "fraud", label: "Fraud Detector" },
    { id: "quote", label: "Quote Comparison" },
    { id: "renewal", label: "Renewal Prediction" },
  ];

  return (
    <aside className="w-64 bg-[#0b1120]/70 backdrop-blur-xl border-r border-gray-800 h-screen p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg">
          ClaimAxis
        </h1>
        <p className="text-gray-400 text-xs mt-1">
          AI-Powered Claim Intelligence
        </p>
      </div>

      {/* Tabs */}
      <nav className="flex flex-col gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-left transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Theme Switch */}
      <div className="mt-auto">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full mt-8 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
        >
          Toggle Theme
        </button>
      </div>
    </aside>
  );
}
