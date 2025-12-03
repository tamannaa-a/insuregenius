import React from "react";

export default function SkeletonCard({ lines = 4 }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3 rounded bg-slate-700/70 mb-2 ${
            i === lines - 1 ? "w-1/2" : "w-full"
          }`}
        />
      ))}
    </div>
  );
}
