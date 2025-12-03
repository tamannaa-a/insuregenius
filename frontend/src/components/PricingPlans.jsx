import React from "react";

export default function PricingPlans() {
  const plans = [
    {
      name: "Starter",
      price: "₹999 / month",
      features: ["Basic Claim Summary", "Document Classifier", "Email Support"],
      popular: false,
    },
    {
      name: "Pro",
      price: "₹4999 / month",
      features: ["All AI Tools", "Fraud Detector", "Code Assistant", "Priority Support"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Contact Us",
      features: ["Multi-tenant", "Admin Dashboard", "Custom Models", "Dedicated Support"],
      popular: false,
    }
  ];

  return (
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-6">Choose Your Plan</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">

        {plans.map((p) => (
          <div
            key={p.name}
            className={`
              p-8 rounded-2xl border shadow-xl backdrop-blur-xl
              ${p.popular 
                ? "bg-blue-500/30 border-blue-400/40 scale-105" 
                : "bg-white/10 border-white/10"
              }
            `}
          >
            <h3 className="text-xl font-bold mb-2">{p.name}</h3>
            <p className="text-2xl font-semibold mb-4">{p.price}</p>

            <ul className="text-gray-300 space-y-2 mb-6">
              {p.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>

            <button className="px-5 py-2 rounded-lg bg-blue-500/40 hover:bg-blue-600 transition-all">
              Select Plan
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}
