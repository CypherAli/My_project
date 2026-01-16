"use client";
import Link from "next/link";

interface Stock {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
  logo?: string;
}

const trendingStocks: Stock[] = [
  { symbol: "ASTS", name: "AST SpaceMobile, Inc.", price: "113.83", change: "+12.42%", isPositive: true, logo: "🚀" },
  { symbol: "HOOD", name: "Robinhood Markets, Inc.", price: "108.25", change: "−1.90%", isPositive: false, logo: "🏹" },
  { symbol: "MU", name: "Micron Technology, Inc.", price: "353.99", change: "+5.16%", isPositive: true, logo: "💾" },
  { symbol: "ONDS", name: "Ondas Holdings Inc.", price: "12.60", change: "−1.76%", isPositive: false, logo: "📡" },
  { symbol: "CRCL", name: "Circle Internet Group", price: "77.19", change: "+0.77%", isPositive: true, logo: "⭕" },
  { symbol: "SMCI", name: "Super Micro Computer", price: "31.48", change: "+6.99%", isPositive: true, logo: "🖥️" },
  { symbol: "AMD", name: "Advanced Micro Devices", price: "233.16", change: "+2.30%", isPositive: true, logo: "🎮" },
  { symbol: "COIN", name: "Coinbase Global, Inc.", price: "238.59", change: "−0.29%", isPositive: false, logo: "💰" },
];

const highVolumeStocks: Stock[] = [
  { symbol: "NVDA", name: "NVIDIA Corporation", price: "187.91", change: "+0.46%", isPositive: true },
  { symbol: "TSLA", name: "Tesla, Inc.", price: "438.00", change: "−0.13%", isPositive: false },
  { symbol: "MU", name: "Micron Technology", price: "353.99", change: "+5.16%", isPositive: true },
  { symbol: "AAPL", name: "Apple Inc.", price: "256.67", change: "−0.60%", isPositive: false },
  { symbol: "MSFT", name: "Microsoft Corporation", price: "459.48", change: "+0.62%", isPositive: true },
];

const stockGainers: Stock[] = [
  { symbol: "VERO", name: "Venus Concept Inc.", price: "10.83", change: "+657.34%", isPositive: true },
  { symbol: "LCFY", name: "Locafy Limited", price: "4.96", change: "+58.47%", isPositive: true },
  { symbol: "BIYA", name: "Baiya International Group", price: "6.64", change: "+47.23%", isPositive: true },
  { symbol: "AFJK", name: "Aimei Health Technology", price: "63.75", change: "+38.56%", isPositive: true },
];

const stockLosers: Stock[] = [
  { symbol: "SPHL", name: "Springview Holdings Ltd", price: "9.00", change: "−48.31%", isPositive: false },
  { symbol: "ANPA", name: "Rich Sparkle Holdings", price: "106.50", change: "−32.55%", isPositive: false },
  { symbol: "MLEC", name: "Moolec Science SA", price: "5.68", change: "−26.23%", isPositive: false },
  { symbol: "RAYA", name: "Erayak Power Solution", price: "2.90", change: "−26.21%", isPositive: false },
];

export default function USStocks() {
  return (
    <div className="relative z-10 py-20 border-t border-white/5">
      <div className="container mx-auto px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <span className="text-2xl">🇺🇸</span> US stocks
              </h2>
            </div>
            <Link
              href="#"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 transition group"
            >
              See all stocks
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Community Trends */}
          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-4">Community trends</h3>
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-max">
                {trendingStocks.map((stock) => (
                  <Link
                    key={stock.symbol}
                    href="#"
                    className="flex-shrink-0 w-48 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-lg border border-white/10">
                        {stock.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{stock.symbol}</div>
                        <div className="text-xs text-gray-400 truncate">{stock.name}</div>
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-white mb-1">{stock.price}</div>
                    <div className="text-xs text-gray-400 mb-2">USD</div>
                    <div className={`text-sm font-medium ${stock.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {stock.change}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Stock Categories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Highest Volume */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Highest volume stocks</h3>
                <Link href="#" className="text-sm text-blue-400 hover:text-blue-300">
                  See all →
                </Link>
              </div>
              <div className="space-y-2">
                {highVolumeStocks.map((stock) => (
                  <Link
                    key={stock.symbol}
                    href="#"
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all"
                  >
                    <div>
                      <div className="font-semibold text-white mb-1">{stock.name}</div>
                      <div className="text-xs font-mono text-gray-400">{stock.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold mb-1">{stock.price}</div>
                      <div className={`text-sm ${stock.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Most Volatile - Combined Gainers & Losers */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Most volatile stocks</h3>
                <Link href="#" className="text-sm text-blue-400 hover:text-blue-300">
                  See all →
                </Link>
              </div>
              <div className="space-y-2">
                {[...stockGainers.slice(0, 2), ...stockLosers.slice(0, 3)].map((stock) => (
                  <Link
                    key={stock.symbol}
                    href="#"
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all"
                  >
                    <div>
                      <div className="font-semibold text-white mb-1">{stock.name}</div>
                      <div className="text-xs font-mono text-gray-400">{stock.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold mb-1">{stock.price}</div>
                      <div className={`text-sm font-bold ${stock.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
