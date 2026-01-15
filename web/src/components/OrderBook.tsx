// web/src/components/OrderBook.tsx
"use client"; // Bắt buộc vì có dùng useState/useEffect

import { useEffect, useState } from "react";

interface OrderBookData {
  symbol: string;
  bids: [string, string][]; // [Price, Amount]
  asks: [string, string][]; // [Price, Amount]
}

// Mock data for initial state
const mockData: OrderBookData = {
  symbol: "BTC/USDT",
  asks: [
    ["49250.00", "0.5234"],
    ["49245.00", "1.2345"],
    ["49240.00", "0.8921"],
    ["49235.00", "2.1234"],
    ["49230.00", "0.6543"],
    ["49225.00", "1.4567"],
    ["49220.00", "0.9876"],
    ["49215.00", "1.7654"],
  ],
  bids: [
    ["49200.00", "1.2345"],
    ["49195.00", "0.8765"],
    ["49190.00", "2.3456"],
    ["49185.00", "0.5432"],
    ["49180.00", "1.6789"],
    ["49175.00", "0.9876"],
    ["49170.00", "1.3456"],
    ["49165.00", "0.7654"],
  ],
};

export default function OrderBook() {
  const [data, setData] = useState<OrderBookData | null>(mockData);

  useEffect(() => {
    // Try to connect to WebSocket in background
    // Throttle để tránh update quá nhanh (gây nhấp nháy)
    let lastUpdate = 0;
    const THROTTLE_MS = 200; // Update tối đa mỗi 200ms

    // 1. Kết nối WebSocket
    let ws: WebSocket;
    try {
      ws = new WebSocket("ws://localhost:8080/ws");
    } catch {
      console.log("WebSocket not available, using mock data");
      return;
    }

    ws.onopen = () => {
      console.log("Connected to WebSocket - Real data");
    };

    ws.onmessage = (event) => {
      try {
        // Throttle check
        const now = Date.now();
        if (now - lastUpdate < THROTTLE_MS) {
          return; // Skip update này
        }
        lastUpdate = now;
        
        const parsedData = JSON.parse(event.data);
        const finalData = typeof parsedData === 'string' ? JSON.parse(parsedData) : parsedData;

        setData(finalData);
      } catch (error) {
        console.error("Parse Error:", error);
      }
    };

    ws.onerror = () => {
      console.log("WebSocket error, keeping mock data");
      // Don't set error - just keep using mock data
    };

    ws.onclose = () => {
      console.log("⚠️ WS Disconnected - Using mock data");
      // Keep mock data active
    };

    // Cleanup khi component unmount
    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Always show data (mock or real)
  if (!data) {
    return (
      <div className="text-gray-500 text-center py-4">
        <div className="animate-pulse">Loading order book...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#1e2026] p-4 rounded-lg shadow-lg w-full max-w-md border border-gray-800">
      <h2 className="text-xl font-bold mb-4 text-gray-200 border-b border-gray-700 pb-2">
        Order Book <span className="text-yellow-500 text-sm ml-2">{data.symbol}</span>
      </h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        {/* Cột Mua (Bids) - Màu Xanh */}
        <div>
          <div className="flex justify-between text-gray-400 mb-2 text-xs uppercase">
            <span>Price</span>
            <span>Amount</span>
          </div>
          <div className="space-y-1">
            {(data.bids || []).map(([price, amount], i) => (
              <div key={i} className="flex justify-between relative group cursor-pointer hover:bg-green-900/30 p-1 rounded">
                <span className="text-green-500 font-mono">{parseFloat(price).toFixed(2)}</span>
                <span className="text-gray-300 font-mono">{parseFloat(amount).toFixed(4)}</span>
                {/* Thanh volume ảo phía sau */}
                <div 
                  className="absolute right-0 top-0 bottom-0 bg-green-500/10 z-[-1]" 
                  style={{ width: `${Math.min(parseFloat(amount) * 100, 100)}%` }} // Giả lập width
                />
              </div>
            ))}
          </div>
        </div>

        {/* Cột Bán (Asks) - Màu Đỏ */}
        <div>
          <div className="flex justify-between text-gray-400 mb-2 text-xs uppercase">
            <span>Price</span>
            <span>Amount</span>
          </div>
          <div className="space-y-1">
            {(data.asks || []).map(([price, amount], i) => (
              <div key={i} className="flex justify-between relative group cursor-pointer hover:bg-red-900/30 p-1 rounded">
                <span className="text-red-500 font-mono">{parseFloat(price).toFixed(2)}</span>
                <span className="text-gray-300 font-mono">{parseFloat(amount).toFixed(4)}</span>
                 <div 
                  className="absolute right-0 top-0 bottom-0 bg-red-500/10 z-[-1]" 
                  style={{ width: `${Math.min(parseFloat(amount) * 100, 100)}%` }} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
