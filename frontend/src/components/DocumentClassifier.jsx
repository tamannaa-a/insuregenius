import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

function DocumentClassifier() {
  const [text, setText] = useState("");
  const [docType, setDocType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClassify = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setDocType("");

    try {
      const formData = new FormData();
      formData.append("text", text);

      const res = await fetch(`${API_BASE}/docs/classify`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setDocType(data.type || "Unknown");
    } catch (err) {
      console.error(err);
      setDocType("Error while classifying document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold text-sm mb-1">Document Classification Agent</h3>
        <p className="text-xs text-slate-400 mb-2">
          Paste sample text extracted from a PDF (claim form, inspection report, invoice).
          The backend uses keyword heuristics but is structured to swap in a real classifier.
        </p>
        <textarea
          className="w-full h-40 rounded-xl bg-slate-950 border border-slate-700 px-3 py-2 text-xs outline-none focus:border-sky-500"
          placeholder="Example: Claim form for motor policy number XXXX including accident description..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleClassify}
          disabled={loading}
          className="mt-2 px-4 py-1.5 rounded-full text-xs font-medium bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-50"
        >
          {loading ? "Classifying..." : "Classify Document"}
        </button>
      </div>

      <div className="space-y-3">
        <div className="border border-slate-800 rounded-xl p-3">
          <h4 className="font-semibold text-xs mb-1">Predicted Document Type</h4>
          <p className="text-sm text-slate-200">
            {docType || "No prediction yet."}
          </p>
        </div>
        <div className="border border-slate-800 rounded-xl p-3 text-[11px] text-slate-400">
          To turn this into a production-grade classifier:
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li>Run OCR on scanned PDFs (e.g., Tesseract or AWS Textract)</li>
            <li>Generate embeddings for text chunks</li>
            <li>Train a classifier on document labels (claim form, invoice, proposal, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DocumentClassifier;
