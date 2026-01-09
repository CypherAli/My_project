// web/src/components/OrderBook.tsx
"use client"; // Bắt buộc vì có dùng useState/useEffect

import { useEffect, useState } from "react";

interface OrderBookData {
  symbol: string;
  bids: [string, string][]; // [Price, Amount]
  asks: [string, string][]; // [Price, Amount]
}

export default function OrderBook() {
  const [data, setData] = useState<OrderBookData | null>(null);

  useEffect(() => {
    // Throttle để tránh update quá nhanh (gây nhấp nháy)
    let lastUpdate = 0;
    const THROTTLE_MS = 200; // Update tối đa mỗi 200ms

    // 1. Kết nối WebSocket
    const ws = new WebSocket("ws://localhost:8080/ws");

    ws.onopen = () => {
      console.log("✅ Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        // Throttle check
        const now = Date.now();
        if (now - lastUpdate < THROTTLE_MS) {
          return; // Skip update này
        }
        lastUpdate = now;
        // 2. Parse dữ liệu nhận được
        // Server Go gửi string JSON, ta parse ra Object
        // Lưu ý: data từ Redis là string dạng "{\"symbol\":...}", cần parse 1 lần
        // Tuy nhiên websocket hub của ta broadcast byte array, kiểm tra kỹ log.
        // Nếu bot gửi JSON string, parse bình thường.
        
        const parsedData = JSON.parse(event.data);
        
        // Đôi khi Redis pub/sub gửi string lồng trong string, 
        // nếu parsedData vẫn là string thì parse thêm phát nữa (tùy format backend)
        const finalData = typeof parsedData === 'string' ? JSON.parse(parsedData) : parsedData;

        setData(finalData);
      } catch (err) {
        console.error("❌ Parse Error:", err);
      }
    };

    ws.onclose = () => console.log("⚠️ WS Disconnected");

    // Cleanup khi component unmount
    return () => ws.close();
  }, []);

  if (!data) return <div className="text-gray-500 animate-pulse">Waiting for data...</div>;

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
