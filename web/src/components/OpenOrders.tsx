"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

interface Order {
  id: number;
  symbol: string;
  side: string;
  price: string;
  amount: string;
  created_at: string;
}

export default function OpenOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm fetch dữ liệu
  const fetchOrders = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch("http://localhost:8080/api/v1/orders/open", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Orders API Response Status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Orders Data:", data);
        // API có thể trả về null hoặc undefined nếu không có lệnh nào
        // Đảm bảo luôn set một array
        const ordersArray = Array.isArray(data) ? data : [];
        setOrders(ordersArray);
        setError(null);
        console.log(`Set ${ordersArray.length} orders`);
      } else {
        const errorText = await res.text();
        console.error("Failed to fetch orders:", res.status, errorText);
        setError(`API Error: ${res.status}`);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(`Network Error: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Set mounted state to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch khi component load
  useEffect(() => {
    if (!mounted) return;
    fetchOrders();
    // Set interval 3s fetch 1 lần để cập nhật realtime đơn giản
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [token, fetchOrders, mounted]);

  const handleCancel = async (orderId: number) => {
    if (!confirm("Cancel this order?")) return;
    
    try {
      const res = await fetch("http://localhost:8080/api/v1/orders/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      if (res.ok) {
        alert("Cancel request sent! Order will be removed shortly.");
        fetchOrders(); // Reload lại bảng
      } else {
        const error = await res.json();
        alert("Failed to cancel: " + (error.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel order");
    }
  };

  // Show loading state during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="h-full p-4 overflow-auto">
        <h3 className="text-sm font-bold text-gray-400 mb-4">Open Orders</h3>
        <div className="text-center text-gray-600 text-sm py-8">Loading...</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="h-full p-4 overflow-auto">
        <h3 className="text-sm font-bold text-gray-400 mb-4">Open Orders</h3>
        <div className="text-center text-gray-600 text-sm py-8">
          Please <a href="/login" className="text-yellow-500 underline">login</a> to view your orders
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-4 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-400">Open Orders</h3>
        {mounted && token && (
          <button 
            onClick={() => fetchOrders()}
            className="text-xs text-yellow-500 hover:text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded hover:bg-yellow-500/10 transition"
          >
            🔄 Refresh
          </button>
        )}
      </div>
      
      {error && (
        <div className="text-center text-red-500 text-sm py-4 bg-red-900/20 rounded mb-2">
          ⚠️ {error}
        </div>
      )}
      
      {!loading && !error && orders.length > 0 && (
        <div className="text-xs text-gray-500 mb-2">
          Found {orders.length} order(s)
        </div>
      )}
      
      {loading ? (
        <div className="text-center text-gray-600 text-sm py-8">Loading...</div>
      ) : (
        <table className="w-full text-xs text-left text-gray-400">
          <thead className="text-gray-500 border-b border-gray-800">
            <tr>
              <th className="py-2">Time</th>
              <th>Symbol</th>
              <th>Type</th>
              <th>Side</th>
              <th>Price</th>
              <th>Amount</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="py-2">
                  {new Date(order.created_at).toLocaleTimeString()}
                </td>
                <td>{order.symbol}</td>
                <td>Limit</td>
                <td className={order.side === "Bid" ? "text-green-500" : "text-red-500"}>
                  {order.side === "Bid" ? "BUY" : "SELL"}
                </td>
                <td className="font-mono">{parseFloat(order.price).toFixed(2)}</td>
                <td className="font-mono">{parseFloat(order.amount).toFixed(4)}</td>
                <td className="text-right">
                  <button 
                    onClick={() => handleCancel(order.id)}
                    className="text-yellow-500 hover:text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded hover:bg-yellow-500/10 transition text-xs"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-600">
                  No open orders. Place your first order!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
