"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

interface Balance {
  currency: string;
  available: string;
  locked: string;
}

export default function OrderForm() {
  const { token } = useAuth();
  const [side, setSide] = useState<"Bid" | "Ask">("Bid");
  const [orderType, setOrderType] = useState<"Limit" | "Market" | "StopLimit">("Limit");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [triggerPrice, setTriggerPrice] = useState(""); // MỚI: Giá kích hoạt cho Stop-Limit
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState<{ usdt: string; btc: string }>({
    usdt: "0",
    btc: "0",
  });

  // Set mounted state to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch balance when component loads or token changes
  useEffect(() => {
    if (!mounted || !token) return;
    
    const fetchBalance = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data: Balance[] = await res.json();
          const usdtBalance = data.find((b) => b.currency === "USDT");
          const btcBalance = data.find((b) => b.currency === "BTC");
          setBalance({
            usdt: usdtBalance?.available || "0",
            btc: btcBalance?.available || "0",
          });
        }
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    };

    fetchBalance();
    // Refresh balance every 10 seconds
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [token, mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      alert("Please login first!");
      window.location.href = "/login";
      return;
    }
    
    // Validate Trigger Price cho Stop-Limit
    if (orderType === "StopLimit" && (!triggerPrice || parseFloat(triggerPrice) <= 0)) {
      alert("Please enter a valid Trigger Price!");
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
          type: orderType,
          price: orderType === "Market" ? 0 : parseFloat(price) || 0,
          amount: parseFloat(amount) || 0,
          trigger_price: orderType === "StopLimit" ? parseFloat(triggerPrice) || 0 : 0
        })
      });
      
      if (res.ok) {
        alert("Order Placed Successfully!");
        setAmount("");
        setPrice("");
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to place order. Check console for details.");
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
        {/* Toggle Loại lệnh - Limit/Market/StopLimit */}
        <div className="flex gap-4 text-sm font-bold text-gray-400 mb-2 border-b border-gray-800 pb-2">
          <button 
            type="button"
            onClick={() => setOrderType("Limit")}
            className={`transition-colors ${orderType === "Limit" ? "text-yellow-500" : "hover:text-gray-300"}`}
          >
            Limit
          </button>
          <button 
            type="button"
            onClick={() => setOrderType("Market")}
            className={`transition-colors ${orderType === "Market" ? "text-yellow-500" : "hover:text-gray-300"}`}
          >
            Market
          </button>
          <button 
            type="button"
            onClick={() => setOrderType("StopLimit")}
            className={`transition-colors ${orderType === "StopLimit" ? "text-yellow-500" : "hover:text-gray-300"}`}
          >
            🛡️ Stop-Limit
          </button>
        </div>

        {/* Input Trigger Price (chỉ hiện khi chọn Stop-Limit) */}
        {orderType === "StopLimit" && (
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Trigger Price (USDT)
            </label>
            <div className="flex bg-gray-900 border border-yellow-700/50 rounded overflow-hidden">
              <input 
                type="number"
                value={triggerPrice}
                onChange={(e) => setTriggerPrice(e.target.value)}
                className="bg-transparent p-2 text-white w-full outline-none text-right font-mono"
                placeholder="0.00"
                step="0.01"
                required
              />
              <span className="p-2 text-gray-500 text-sm flex items-center">USDT</span>
            </div>
            <p className="text-[10px] text-yellow-500 mt-1">
              {side === "Bid" 
                ? "Buy order activates when market price reaches or exceeds this level" 
                : "Sell order activates when market price reaches or falls below this level (Stop-Loss)"}
            </p>
          </div>
        )}

        {/* Input Giá */}
        <div>
          <label className="text-xs text-gray-500 mb-1 flex justify-between">
            <span>
              {orderType === "StopLimit" ? "Limit Price (USDT)" : "Price (USDT)"}
              {orderType === "StopLimit" && <span className="text-yellow-500 ml-1">*</span>}
            </span>
            {mounted && token && (
              <span className="text-gray-400">
                Avail: <span className="text-white font-mono">{parseFloat(balance.usdt).toFixed(2)}</span>
              </span>
            )}
          </label>
          <div className={`flex bg-gray-900 border ${orderType === "StopLimit" ? "border-yellow-700/50" : "border-gray-700"} rounded overflow-hidden ${orderType === "Market" ? "opacity-50 cursor-not-allowed" : ""}`}>
            <input 
              type={orderType === "Market" ? "text" : "number"}
              value={orderType === "Market" ? "Market Price" : price}
              onChange={(e) => orderType !== "Market" && setPrice(e.target.value)}
              disabled={orderType === "Market"}
              className="bg-transparent p-2 text-white w-full outline-none text-right font-mono disabled:cursor-not-allowed"
              placeholder="0.00"
              step="0.01"
              required={orderType !== "Market"}
            />
            <span className="p-2 text-gray-500 text-sm flex items-center">USDT</span>
          </div>
          {orderType === "Market" && (
            <p className="text-xs text-yellow-500 mt-1">Will execute at best available price</p>
          )}
          {orderType === "StopLimit" && (
            <p className="text-[10px] text-gray-500 mt-1">
              * Order will be placed at this price when trigger is hit
            </p>
          )}
        </div>

        {/* Input Số lượng */}
        <div>
          <label className="text-xs text-gray-500 mb-1 flex justify-between">
            <span>Amount (BTC)</span>
            {mounted && token && (
              <span className="text-gray-400">
                Avail: <span className="text-white font-mono">{parseFloat(balance.btc).toFixed(4)}</span>
              </span>
            )}
          </label>
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
          disabled={loading || (mounted && !token)}
          type="submit"
          className={`w-full py-3 rounded font-bold text-lg mt-4 transition-colors ${
            side === "Bid" 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-red-500 hover:bg-red-600 text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {!mounted ? "Loading..." : !token ? "Login Required" : loading ? "Processing..." : side === "Bid" ? "Buy BTC" : "Sell BTC"}
        </button>
      </form>

      {mounted && !token && (
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded text-xs text-yellow-500">
          <strong>Not logged in:</strong> Please <a href="/login" className="underline font-bold">login</a> to place orders
        </div>
      )}
    </div>
  );
}
