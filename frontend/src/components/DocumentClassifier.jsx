import React, { useState } from "react";
import { addInsight } from "../utils/history";

const API_BASE = "http://localhost:8000";

function DocumentClassifier({ authToken }) {
  const [text, setText] = useState("");
  const [docType, setDocType] = useState("");
  const [loading, setLoading] = useState(false);

  const classify = async () => {
    if (!text.trim()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("text", text);

      const res = await fetch(`${API_BASE}/docs/classify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      const data = await res.json();
      setDocType(data.type || "Unknown");

      addInsight({
        type: "document",
        title: "Document Classification",
        summary: `Predicted: ${data.type}`,
        details: text.slice(0, 250)
      });
    } catch (e) {
      console.error(e);
      setDocType("Error classifying document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">

      <div>
        <h3 className="font-semibold text-sm mb-1">Document Classification</h3>
        <p className="text-xs text-slate-400 mb-2">
          Paste any claim, invoice, inspection, or application text below.
        </p>

        <textarea
          className="w-full h-40 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs"
          placeholder="Paste document text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={classify}
          disabled={loading}
          className="mt-3 px-4 py-1.5 bg-sky-500 rounded-full text-xs text-black"
        >
          {loading ? "Classifying..." : "Classify Document"}
        </button>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-1">Classification Result</h4>
        <pre className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs whitespace-pre-wrap overflow-auto">
          {docType || "Document type will appear here"}
        </pre>
      </div>

    </div>
  );
}

export default DocumentClassifier;
