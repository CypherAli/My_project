"use client";
import Link from "next/link";

const currencies = ["EUR", "USD", "GBP", "JPY", "CHF", "AUD", "CAD", "CNY"];

// Heatmap data (row vs column)
const heatmapData: { [key: string]: { [key: string]: string } } = {
  EUR: { USD: "−0.02", GBP: "−0.07", JPY: "−0.43", CHF: "−0.09", AUD: "+0.24", CAD: "+0.12", CNY: "−0.02" },
  USD: { EUR: "+0.05", GBP: "−0.04", JPY: "−0.38", CHF: "−0.02", AUD: "+0.25", CAD: "+0.13", CNY: "+0.03" },
  GBP: { EUR: "+0.08", USD: "+0.08", JPY: "−0.32", CHF: "0.00", AUD: "+0.32", CAD: "+0.19", CNY: "+0.07" },
  JPY: { EUR: "+0.44", USD: "+0.43", GBP: "+0.32", CHF: "+0.32", AUD: "+0.66", CAD: "+0.50", CNY: "+0.39" },
  CHF: { EUR: "+0.18", USD: "+0.12", GBP: "+0.10", JPY: "−0.29", AUD: "+0.37", CAD: "+0.22", CNY: "+0.14" },
  AUD: { EUR: "−0.19", USD: "−0.26", GBP: "−0.28", JPY: "−0.59", CHF: "−0.27", CAD: "−0.03", CNY: "−0.22" },
  CAD: { EUR: "−0.03", USD: "−0.07", GBP: "−0.15", JPY: "−0.50", CHF: "−0.12", AUD: "+0.15", CNY: "−0.06" },
  CNY: { EUR: "+0.02", USD: "−0.03", GBP: "−0.07", JPY: "−0.40", CHF: "−0.17", AUD: "+0.48", CAD: "+0.10" },
};

const getColorClass = (value: string) => {
  if (value === "0.00") return "bg-gray-800 text-gray-400";
  const num = parseFloat(value);
  if (num > 0.3) return "bg-green-600/80 text-white font-semibold";
  if (num > 0.15) return "bg-green-600/60 text-white";
  if (num > 0) return "bg-green-600/40 text-green-200";
  if (num < -0.3) return "bg-red-600/80 text-white font-semibold";
  if (num < -0.15) return "bg-red-600/60 text-white";
  return "bg-red-600/40 text-red-200";
};

export default function ForexHeatmap() {
  return (
    <div className="relative z-10 py-20 border-t border-white/5">
      <div className="container mx-auto px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="text-2xl">💱</span> Forex & currencies
              </h2>
              <p className="text-gray-400">Currency strength and forex pairs performance</p>
            </div>
            <Link
              href="#"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 transition group"
            >
              See all forex
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Forex Heatmap */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Forex heatmap</h3>
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                  {/* Header Row */}
                  <div className="grid grid-cols-9 gap-2 mb-2">
                    <div className="text-center text-sm font-bold text-gray-400"></div>
                    {currencies.map((curr) => (
                      <div key={curr} className="text-center text-sm font-bold text-white">
                        {curr}
                      </div>
                    ))}
                  </div>

                  {/* Data Rows */}
                  {currencies.map((rowCurrency) => (
                    <div key={rowCurrency} className="grid grid-cols-9 gap-2 mb-2">
                      <div className="flex items-center justify-center text-sm font-bold text-white bg-white/[0.05] rounded-lg py-3">
                        {rowCurrency}
                      </div>
                      {currencies.map((colCurrency) => {
                        if (rowCurrency === colCurrency) {
                          return (
                            <div key={colCurrency} className="bg-gray-900 rounded-lg flex items-center justify-center py-3">
                              <span className="text-gray-600 text-xs">—</span>
                            </div>
                          );
                        }
                        const value = heatmapData[rowCurrency]?.[colCurrency] || "0.00";
                        return (
                          <div
                            key={colCurrency}
                            className={`${getColorClass(value)} rounded-lg flex items-center justify-center py-3 text-xs font-medium transition-transform hover:scale-105 cursor-pointer`}
                          >
                            {value}%
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Popular Pairs */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Popular forex pairs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { pair: "EUR/USD", price: "1.0295", change: "+0.05%", isPositive: true },
                { pair: "GBP/USD", price: "1.2185", change: "+0.08%", isPositive: true },
                { pair: "USD/JPY", price: "158.52", change: "+0.43%", isPositive: true },
                { pair: "AUD/USD", price: "0.6127", change: "−0.26%", isPositive: false },
              ].map((item) => (
                <Link
                  key={item.pair}
                  href="#"
                  className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all"
                >
                  <div className="text-sm text-gray-400 mb-2">FX</div>
                  <div className="text-lg font-bold text-white mb-3">{item.pair}</div>
                  <div className="text-2xl font-bold text-white mb-2">{item.price}</div>
                  <div className={`text-sm font-semibold ${item.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {item.change}
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
