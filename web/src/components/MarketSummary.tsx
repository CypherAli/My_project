"use client";
import Link from "next/link";

interface MarketData {
  symbol: string;
  name: string;
  price: string;
  currency: string;
  change: string;
  isPositive: boolean;
}

const majorIndices: MarketData[] = [
  { symbol: "SPX", name: "S&P 500", price: "6,946.93", currency: "USD", change: "+0.04%", isPositive: true },
  { symbol: "NDX", name: "Nasdaq 100", price: "25,533.80", currency: "USD", change: "−0.05%", isPositive: false },
  { symbol: "NI225", name: "Japan 225", price: "53,936.12", currency: "JPY", change: "−0.32%", isPositive: false },
  { symbol: "000001", name: "SSE Composite", price: "4,101.91", currency: "CNY", change: "−0.26%", isPositive: false },
  { symbol: "UKX", name: "FTSE 100", price: "10,225.78", currency: "GBP", change: "−0.13%", isPositive: false },
  { symbol: "DAX", name: "DAX", price: "25,258.84", currency: "EUR", change: "−0.37%", isPositive: false },
];

const cryptoMarket = {
  marketCap: { value: "3.17 T", change: "+7.32%", period: "1 month" },
  btc: { symbol: "BTCUSD", name: "Bitcoin", price: "94,776", change: "−0.84%", isPositive: false },
  eth: { symbol: "ETHUSD", name: "Ethereum", price: "3,271.5", change: "−1.40%", isPositive: false },
};

const commodities: MarketData[] = [
  { symbol: "DXY", name: "US Dollar index", price: "99.318", currency: "USD", change: "+1.13%", isPositive: true },
  { symbol: "CL1!", name: "Crude oil", price: "59.60", currency: "USD/barrel", change: "+0.88%", isPositive: true },
  { symbol: "NG1!", name: "Natural gas", price: "3.067", currency: "USD/MMBTUs", change: "−1.95%", isPositive: false },
  { symbol: "GC1!", name: "Gold", price: "4,584.4", currency: "USD/oz", change: "−0.85%", isPositive: false },
];

export default function MarketSummary() {
  return (
    <div className="relative z-10 py-12 border-t border-white/5">
      <div className="container mx-auto px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Market summary</h2>
          </div>

          {/* Major Indices */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Major indices</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {majorIndices.map((item) => (
                <Link
                  key={item.symbol}
                  href="#"
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all"
                >
                  <div className="text-xs text-gray-400 mb-1">{item.name}</div>
                  <div className="text-xs font-mono text-gray-500 mb-2">{item.symbol}</div>
                  <div className="text-lg font-semibold text-white mb-1">{item.price}</div>
                  <div className="text-xs text-gray-400 mb-1">{item.currency}</div>
                  <div className={`text-sm font-medium ${item.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {item.change}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Crypto Market */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Cryptocurrency</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="text-xs text-gray-400 mb-1">Crypto market cap</div>
                <div className="text-xs font-mono text-gray-500 mb-2">TOTAL</div>
                <div className="text-lg font-semibold text-white mb-1">{cryptoMarket.marketCap.value}</div>
                <div className="text-xs text-gray-400 mb-1">USD</div>
                <div className="text-sm font-medium text-green-400">
                  {cryptoMarket.marketCap.change} <span className="text-gray-500">{cryptoMarket.marketCap.period}</span>
                </div>
              </div>

              <Link href="#" className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all">
                <div className="text-xs text-gray-400 mb-1">{cryptoMarket.btc.name}</div>
                <div className="text-xs font-mono text-gray-500 mb-2">{cryptoMarket.btc.symbol}</div>
                <div className="text-lg font-semibold text-white mb-1">{cryptoMarket.btc.price}</div>
                <div className="text-xs text-gray-400 mb-1">USD</div>
                <div className="text-sm font-medium text-red-400">{cryptoMarket.btc.change}</div>
              </Link>

              <Link href="#" className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all">
                <div className="text-xs text-gray-400 mb-1">{cryptoMarket.eth.name}</div>
                <div className="text-xs font-mono text-gray-500 mb-2">{cryptoMarket.eth.symbol}</div>
                <div className="text-lg font-semibold text-white mb-1">{cryptoMarket.eth.price}</div>
                <div className="text-xs text-gray-400 mb-1">USD</div>
                <div className="text-sm font-medium text-red-400">{cryptoMarket.eth.change}</div>
              </Link>
            </div>
          </div>

          {/* Commodities */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Commodities & Currencies</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {commodities.map((item) => (
                <Link
                  key={item.symbol}
                  href="#"
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all"
                >
                  <div className="text-xs text-gray-400 mb-1">{item.name}</div>
                  <div className="text-xs font-mono text-gray-500 mb-2">{item.symbol}</div>
                  <div className="text-lg font-semibold text-white mb-1">{item.price}</div>
                  <div className="text-xs text-gray-400 mb-1">{item.currency}</div>
                  <div className={`text-sm font-medium ${item.isPositive ? 'text-green-400' : 'text-red-400'}`}>
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
