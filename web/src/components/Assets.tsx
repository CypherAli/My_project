"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface Asset {
  currency: string;
  available: string;
  locked: string;
}

export default function Assets() {
  const { token } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBalance = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8080/api/v1/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAssets(data || []);
      }
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
    // Cập nhật mỗi 5 giây
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <div className="h-full p-4 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading balance...</p>
      </div>
    );
  }

  return (
    <div className="h-full p-4 overflow-auto">
      <h3 className="text-sm font-bold text-gray-400 mb-4">Your Assets</h3>
      <table className="w-full text-xs text-left text-gray-400">
        <thead className="text-gray-500 border-b border-gray-800">
          <tr>
            <th className="py-2">Coin</th>
            <th>Available</th>
            <th>In Order (Locked)</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {assets.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-4 text-center text-gray-500">
                No assets found. Please deposit funds to start trading.
              </td>
            </tr>
          ) : (
            assets.map((asset) => {
              const available = parseFloat(asset.available) || 0;
              const locked = parseFloat(asset.locked) || 0;
              const total = available + locked;
              return (
                <tr
                  key={asset.currency}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30"
                >
                  <td className="py-2 font-bold text-white">{asset.currency}</td>
                  <td className="text-green-500">{available.toFixed(4)}</td>
                  <td className="text-red-400">{locked.toFixed(4)}</td>
                  <td className="text-gray-300">{total.toFixed(4)}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
