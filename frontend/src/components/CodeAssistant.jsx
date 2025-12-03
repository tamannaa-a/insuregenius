import React, { useState } from "react";
import { addInsight } from "../utils/history";

const API_BASE = "http://localhost:8000";

function CodeAssistant({ authToken }) {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setCode("");

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);

      const res = await fetch(`${API_BASE}/code/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const data = await res.json();
      setCode(data.code || "# No code returned.");

      addInsight({
        type: "code",
        title: "Generated Python Code",
        summary: prompt,
        details: data.code
      });
    } catch (e) {
      console.error(e);
      setCode("Error generating code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">

      <div>
        <h3 className="font-semibold text-sm mb-1">Actuarial Code Assistant</h3>
        <p className="text-xs text-slate-400 mb-2">
          Converts high-level actuarial requests into executable Python code.
        </p>

        <textarea
          className="w-full h-36 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs"
          placeholder="Describe what code you need..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={generate}
          disabled={loading}
          className="mt-3 px-4 py-1.5 text-xs bg-sky-500 text-black rounded-full"
        >
          {loading ? "Generating..." : "Generate Code"}
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-1">Generated Code</h4>
        <pre className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs whitespace-pre-wrap overflow-auto">
          {code || "Code will appear here"}
        </pre>
      </div>

    </div>
  );
}

export default CodeAssistant;
