"use client";
import Link from "next/link";

interface Future {
  symbol: string;
  name: string;
  price: string;
  unit: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

const energyFutures: Future[] = [
  { symbol: "CL1!", name: "Crude Oil Futures", price: "59.60", unit: "USD/BLL", change: "+0.88%", isPositive: true, icon: "🛢️" },
  { symbol: "NG1!", name: "Natural Gas Futures", price: "3.067", unit: "USD/MMBTU", change: "−1.95%", isPositive: false, icon: "🔥" },
  { symbol: "BRN1!", name: "Brent Crude Futures", price: "64.36", unit: "USD/BLL", change: "+0.94%", isPositive: true, icon: "⚫" },
  { symbol: "RB1!", name: "RBOB Gasoline Futures", price: "1.8188", unit: "USD/GLL", change: "+0.47%", isPositive: true, icon: "⛽" },
];

const metalsFutures: Future[] = [
  { symbol: "GC1!", name: "Gold Futures", price: "4,584.4", unit: "USD/oz", change: "−0.85%", isPositive: false, icon: "🥇" },
  { symbol: "SI1!", name: "Silver Futures", price: "88.300", unit: "USD/oz", change: "−4.38%", isPositive: false, icon: "🥈" },
  { symbol: "HG1!", name: "Copper Futures", price: "5.8045", unit: "USD/lb", change: "−3.12%", isPositive: false, icon: "🔶" },
  { symbol: "PL1!", name: "Platinum Futures", price: "2,294.6", unit: "USD/oz", change: "−4.78%", isPositive: false, icon: "⚪" },
];

export default function FuturesCommodities() {
  return (
    <div className="relative z-10 py-20 border-t border-white/5">
      <div className="container mx-auto px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="text-2xl">📦</span> Futures and commodities
              </h2>
              <p className="text-gray-400">Energy, metals, and agricultural futures</p>
            </div>
            <Link
              href="#"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 transition group"
            >
              See all futures
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Energy Futures */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-4">Energy futures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {energyFutures.map((item) => (
                <Link
                  key={item.symbol}
                  href="#"
                  className="group p-5 rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/20 hover:border-amber-400/40 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center text-2xl border border-amber-400/20 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-gray-400">{item.symbol}</div>
                      <div className="text-sm font-semibold text-white truncate">{item.name}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{item.price}</div>
                  <div className="text-xs text-gray-400 mb-3">{item.unit}</div>
                  <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                    item.isPositive 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.isPositive ? '▲' : '▼'} {item.change}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Metals Futures */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Metals futures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metalsFutures.map((item) => (
                <Link
                  key={item.symbol}
                  href="#"
                  className="group p-5 rounded-xl bg-gradient-to-br from-yellow-500/5 to-yellow-600/5 border border-yellow-500/20 hover:border-yellow-400/40 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center text-2xl border border-yellow-400/20 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-gray-400">{item.symbol}</div>
                      <div className="text-sm font-semibold text-white truncate">{item.name}</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{item.price}</div>
                  <div className="text-xs text-gray-400 mb-3">{item.unit}</div>
                  <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold ${
                    item.isPositive 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.isPositive ? '▲' : '▼'} {item.change}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
