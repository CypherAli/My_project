"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import OrderBook from "@/components/OrderBook";
import Chart from "@/components/Chart";
import OrderForm from "@/components/OrderForm";
import OpenOrders from "@/components/OpenOrders";
import Assets from "@/components/Assets";
import TradeHistory from "@/components/TradeHistory";
import Link from "next/link";

export default function DOMPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "funds" | "trades">("orders");
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [showPairDropdown, setShowPairDropdown] = useState(false);
  const { token, logout } = useAuth();
  const router = useRouter();

  const tradingPairs = [
    { symbol: "BTC/USDT", price: "$49,200.00", change: "+2.5%" },
    { symbol: "ETH/USDT", price: "$2,450.00", change: "+1.8%" },
    { symbol: "BNB/USDT", price: "$320.50", change: "-0.5%" },
    { symbol: "SOL/USDT", price: "$98.75", change: "+5.2%" },
  ];

  const handleAuthClick = () => {
    if (token) {
      logout();
    } else {
      router.push('/login');
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0e11] text-gray-300 flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-gray-800 flex items-center px-6 bg-[#181a20]">
        <Link href="/" className="font-bold text-xl text-yellow-500 tracking-wider mr-8 hover:text-yellow-400 transition">
          BINANCE Ali
        </Link>
        
        {/* Navigation Menu */}
        <nav className="flex items-center gap-6 mr-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
            Home
          </Link>
          <Link href="/dom" className="text-sm text-white font-semibold">
            DOM
          </Link>
        </nav>
        
        {/* Trading Pair Selector */}
        <div className="relative">
          <button
            onClick={() => setShowPairDropdown(!showPairDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#2B3139] hover:bg-[#3B4048] rounded transition"
          >
            <span className="text-sm font-medium text-white">{selectedPair}</span>
            <span className="text-xs text-green-500 font-mono">
              {tradingPairs.find(p => p.symbol === selectedPair)?.price}
            </span>
            <span className="text-xs">▼</span>
          </button>
          
          {/* Dropdown */}
          {showPairDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-[#1E2329] border border-gray-700 rounded shadow-lg z-50 min-w-[200px]">
              {tradingPairs.map(pair => (
                <button
                  key={pair.symbol}
                  onClick={() => {
                    setSelectedPair(pair.symbol);
                    setShowPairDropdown(false);
                  }}
                  className="w-full px-4 py-2 hover:bg-[#2B3139] text-left flex justify-between items-center transition"
                >
                  <span className="text-sm text-white">{pair.symbol}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{pair.price}</span>
                    <span className={`text-xs ${pair.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {pair.change}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Login/Logout Button */}
        <div className="ml-auto flex items-center gap-4">
          <div className="text-xs text-gray-500">
            Engine: <span className="text-orange-500">Rust</span> • Gateway: <span className="text-cyan-500">Go</span>
          </div>
          
          {token ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">Logged In</span>
              </div>
              <button
                onClick={handleAuthClick}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleAuthClick}
              className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-bold rounded transition"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 flex gap-4">
        {/* Left Column - OrderBook */}
        <div className="w-80 flex-shrink-0">
          <OrderBook />
        </div>

        {/* Middle Column - Chart + Bottom Tabs */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Chart */}
          <div className="flex-1">
            <Chart />
          </div>

          {/* Bottom Tabs */}
          <div className="h-80 bg-[#1e2026] rounded-lg border border-gray-800">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-800">
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-4 py-2 text-sm font-medium transition ${
                  activeTab === "orders"
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Open Orders
              </button>
              <button
                onClick={() => setActiveTab("funds")}
                className={`px-4 py-2 text-sm font-medium transition ${
                  activeTab === "funds"
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Assets
              </button>
              <button
                onClick={() => setActiveTab("trades")}
                className={`px-4 py-2 text-sm font-medium transition ${
                  activeTab === "trades"
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Trade History
              </button>
            </div>

            {/* Tab Content */}
            <div className="overflow-auto h-[calc(100%-41px)]">
              {activeTab === "orders" && <OpenOrders />}
              {activeTab === "funds" && <Assets />}
              {activeTab === "trades" && <TradeHistory />}
            </div>
          </div>
        </div>

        {/* Right Column - Order Form */}
        <div className="w-96 flex-shrink-0">
          <OrderForm />
        </div>
      </div>
    </main>
  );
}
