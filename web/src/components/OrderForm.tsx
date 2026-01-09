"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function OrderForm() {
  const { token } = useAuth();
  const [side, setSide] = useState<"Bid" | "Ask">("Bid");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      alert("⚠️ Please login first!");
      window.location.href = "/login";
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          symbol: "BTC/USDT",
          side: side,
          price: price,
          amount: amount
        })
      });
      
      if (res.ok) {
        alert("✅ Order Placed Successfully!");
        setAmount("");
        setPrice("");
      } else {
        const err = await res.json();
        alert("❌ Error: " + err.error);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to place order. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1e2026] p-4 rounded-lg w-full border border-gray-800 h-fit">
      {/* Tabs Mua/Bán */}
      <div className="flex bg-gray-900 rounded p-1 mb-4">
        <button 
          onClick={() => setSide("Bid")}
          className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${side === "Bid" ? "bg-green-600 text-white" : "text-gray-400 hover:text-white"}`}
        >
          BUY
        </button>
        <button 
          onClick={() => setSide("Ask")}
          className={`flex-1 py-2 rounded text-sm font-bold transition-colors ${side === "Ask" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"}`}
        >
          SELL
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Giá */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Price (USDT)</label>
          <div className="flex bg-gray-900 border border-gray-700 rounded overflow-hidden">
            <input 
              type="number" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-transparent p-2 text-white w-full outline-none text-right font-mono"
              placeholder="0.00"
              step="0.01"
              required
            />
            <span className="p-2 text-gray-500 text-sm flex items-center">USDT</span>
          </div>
        </div>

        {/* Input Số lượng */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Amount (BTC)</label>
          <div className="flex bg-gray-900 border border-gray-700 rounded overflow-hidden">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent p-2 text-white w-full outline-none text-right font-mono"
              placeholder="0.00"
              step="0.0001"
              required
            />
            <span className="p-2 text-gray-500 text-sm flex items-center">BTC</span>
          </div>
        </div>

        {/* Tổng giá trị */}
        <div className="text-xs text-gray-500 flex justify-between">
          <span>Total:</span>
          <span className="text-white font-mono">
            {price && amount ? (parseFloat(price) * parseFloat(amount)).toFixed(2) : "0.00"} USDT
          </span>
        </div>

        {/* Nút Submit */}
        <button 
          disabled={loading || !token}
          type="submit"
          className={`w-full py-3 rounded font-bold text-lg mt-4 transition-colors ${
            side === "Bid" 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-red-500 hover:bg-red-600 text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {!token ? "Login Required" : loading ? "Processing..." : side === "Bid" ? "Buy BTC" : "Sell BTC"}
        </button>
      </form>

      {!token && (
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded text-xs text-yellow-500">
          <strong>⚠️ Not logged in:</strong> Please <a href="/login" className="underline font-bold">login</a> to place orders
        </div>
      )}
    </div>
  );
}
