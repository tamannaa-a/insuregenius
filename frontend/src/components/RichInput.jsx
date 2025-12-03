import React, { useState } from "react";

export default function RichInput({ label, placeholder, value, onChange }) {
  const [chars, setChars] = useState(value?.length || 0);

  const handleChange = (e) => {
    setChars(e.target.value.length);
    onChange(e.target.value);
  };

  const suggestions = [
    "Summarize coverage & exclusions.",
    "Explain this policy in simple language.",
    "Highlight risks & fraud indicators.",
  ];

  return (
    <div>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-slate-200">{label}</span>
          <span className="text-[0.65rem] text-slate-500">{chars} chars</span>
        </div>
      )}

      <div className="rounded-2xl border border-slate-700 bg-slate-950/50 overflow-hidden shadow-inner">
        <textarea
          className="w-full min-h-[160px] resize-y bg-transparent px-3 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-600"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
        <div className="border-t border-slate-800 bg-slate-950/80 px-3 py-2 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleChange({ target: { value: s } })}
              className="text-[0.65rem] px-2 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
