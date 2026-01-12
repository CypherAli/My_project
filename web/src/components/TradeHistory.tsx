"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Trade {
  id: number;
  symbol: string;
  side: string;
  price: string;
  amount: string;
  created_at: string;
}

export default function TradeHistory() {
  const { token } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrades = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8080/api/v1/trades", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTrades(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch trades:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
    // Refresh mỗi 5s để thấy lệnh vừa khớp
    const interval = setInterval(fetchTrades, 5000);
    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <div className="h-full p-4 flex items-center justify-center">
        <p className="text-gray-500">Loading trades...</p>
      </div>
    );
  }

  return (
    <div className="h-full p-4 overflow-auto">
      <h3 className="text-sm font-bold text-gray-400 mb-4">Trade History</h3>
      <table className="w-full text-xs text-left text-gray-400">
        <thead className="text-gray-500 border-b border-gray-800">
          <tr>
            <th className="py-2">Time</th>
            <th>Symbol</th>
            <th>Side</th>
            <th className="text-right">Price</th>
            <th className="text-right">Amount</th>
            <th className="text-right">Total (USDT)</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => {
            const total = parseFloat(trade.price) * parseFloat(trade.amount);
            const isBuy = trade.side === "Bid";
            
            return (
              <tr 
                key={trade.id} 
                className="border-b border-gray-800/50 hover:bg-gray-800/30 transition"
              >
                <td className="py-2">
                  {new Date(trade.created_at).toLocaleTimeString()}
                </td>
                <td className="text-gray-300 font-medium">{trade.symbol}</td>
                <td className={isBuy ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                  {isBuy ? "BUY" : "SELL"}
                </td>
                <td className="text-right">{parseFloat(trade.price).toFixed(2)}</td>
                <td className="text-right">{parseFloat(trade.amount).toFixed(4)}</td>
                <td className="text-right text-gray-300 font-medium">
                  {total.toFixed(2)}
                </td>
              </tr>
            );
          })}
          {trades.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-600">
                No trades yet. Place an order to get started!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
