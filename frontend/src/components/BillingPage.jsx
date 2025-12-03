import React from "react";

export default function BillingPage() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl p-8 rounded-2xl max-w-5xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">Billing & Subscription</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="p-6 rounded-xl bg-white/10 border border-white/10 shadow">
          <h3 className="text-lg font-semibold mb-2">Current Plan</h3>
          <p className="text-gray-300">You are currently on the <strong>Pro Plan</strong></p>
        </div>

        <div className="p-6 rounded-xl bg-white/10 border border-white/10 shadow">
          <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
          <p className="text-gray-300">Visa •••• 4321</p>
          <button className="mt-3 px-4 py-2 bg-blue-500/40 hover:bg-blue-600 rounded-lg">
            Update Card
          </button>
        </div>

      </div>

      <h3 className="text-xl font-semibold mt-10 mb-4">Billing History</h3>

      <div className="bg-white/10 rounded-xl border border-white/10 p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-300 border-b border-white/10">
              <th className="py-2">Date</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="py-2">Feb 2025</td>
              <td>₹4999</td>
              <td className="text-green-400">Paid</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2">Jan 2025</td>
              <td>₹4999</td>
              <td className="text-green-400">Paid</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
