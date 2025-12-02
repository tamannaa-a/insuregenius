import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

function CodeAssistant() {
  const [prompt, setPrompt] = useState(
    "Generate Python code to calculate combined ratio and plot trend."
  );
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setCode("");

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);

      const res = await fetch(`${API_BASE}/code/generate`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setCode(data.code || "# No code returned.");
    } catch (err) {
      console.error(err);
      setCode("# Error while generating code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold text-sm mb-1">GenAI Code Assistant for Actuaries</h3>
        <p className="text-xs text-slate-400 mb-2">
          Describe what analysis you want (e.g., loss ratio, pricing model, trend plot).
          The backend returns a ready-to-run Python script template.
        </p>
        <textarea
          className="w-full h-32 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs outline-none focus:border-sky-500"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-2 px-4 py-1.5 rounded-full text-xs font-medium bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Code"}
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-1">Generated Python Code</h4>
        <pre className="w-full h-64 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-[11px] overflow-auto">
          {code || "# Code will appear here..."}
        </pre>
      </div>
    </div>
  );
}

export default CodeAssistant;
