"use client";
import { useState } from "react";
import OrderBook from "@/components/OrderBook";
import Chart from "@/components/Chart";
import OrderForm from "@/components/OrderForm";
import OpenOrders from "@/components/OpenOrders";
import Assets from "@/components/Assets";
import TradeHistory from "@/components/TradeHistory";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"orders" | "funds" | "trades">("orders");

  return (
    <main className="min-h-screen bg-[#0b0e11] text-gray-300 flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-gray-800 flex items-center px-6 bg-[#181a20]">
        <div className="font-bold text-xl text-yellow-500 tracking-wider mr-8">
          BINANCE <span className="text-xs text-gray-500 ml-1">CLONE</span>
        </div>
        <div className="text-sm font-medium text-white">BTC/USDT</div>
        <div className="text-xs text-green-500 ml-4 font-mono">$49,200.00</div>
        <div className="ml-auto text-xs text-gray-500">
          Engine: <span className="text-orange-500">Rust</span> • Gateway: <span className="text-cyan-500">Go</span>
        </div>
      </header>

      {/* Main Content: Chia 3 cột */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Cột 1: Chart (Chiếm phần lớn) */}
        <div className="flex-1 flex flex-col border-r border-gray-800">
          <div className="flex-1 relative">
            {/* Chart Component - Set absolute positioning */}
            <div className="absolute inset-0 p-2">
              <Chart />
            </div>
          </div>
          
          {/* Khu vực Bottom với Tabs */}
          <div className="h-64 border-t border-gray-800 bg-[#1e2026] flex flex-col">
            {/* Tab Header */}
            <div className="flex border-b border-gray-800">
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-4 py-2 text-sm font-bold transition-colors ${
                  activeTab === "orders"
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                Open Orders
              </button>
              <button
                onClick={() => setActiveTab("funds")}
                className={`px-4 py-2 text-sm font-bold transition-colors ${
                  activeTab === "funds"
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                Funds
              </button>
              <button
                onClick={() => setActiveTab("trades")}
                className={`px-4 py-2 text-sm font-bold transition-colors ${
                  activeTab === "trades"
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                History
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden relative">
              {activeTab === "orders" && <OpenOrders />}
              {activeTab === "funds" && <Assets />}
              {activeTab === "trades" && <TradeHistory />}
            </div>
          </div>
        </div>

        {/* Cột 2: OrderBook */}
        <div className="w-[280px] border-r border-gray-800 bg-[#1e2026] flex flex-col">
          <OrderBook />
        </div>

        {/* Cột 3: Order Form (Đặt lệnh) */}
        <div className="w-[320px] bg-[#1e2026] p-2">
          <OrderForm />
        </div>

      </div>
    </main>
  );
}
