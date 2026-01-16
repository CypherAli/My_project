"use client";
import Link from "next/link";

interface Story {
  id: string;
  source: string;
  sourceLogo: string;
  title: string;
  timestamp: string;
  category: string;
}

const mockStories: Story[] = [
  {
    id: "1",
    source: "Gold Stocks Now",
    sourceLogo: "📊",
    title: "Gold Stocks Now: $25,480 After Record Run Pushing to $26K; New Month?",
    timestamp: "3 days ago",
    category: "Gold"
  },
  {
    id: "2",
    source: "CNE",
    sourceLogo: "📈",
    title: "CNE: Dollar Index Report for a Third Weekly Gain Boosting Pullback",
    timestamp: "3 days ago",
    category: "Forex"
  },
  {
    id: "3",
    source: "AAG",
    sourceLogo: "💹",
    title: "AAG: USD: Silver Sees Two 3% Traders back Despite Pullback",
    timestamp: "4 days ago",
    category: "Commodities"
  },
  {
    id: "4",
    source: "BTC",
    sourceLogo: "₿",
    title: "BTC: USD: Bitcoin Jumps Past $95,480 Before Pullback December Inflation...",
    timestamp: "4 days ago",
    category: "Crypto"
  },
  {
    id: "5",
    source: "GBP",
    sourceLogo: "💷",
    title: "GBP / USD: Pound Secures $1.340 at UK Growth",
    timestamp: "5 days ago",
    category: "Forex"
  },
  {
    id: "6",
    source: "SPX",
    sourceLogo: "📊",
    title: "S&P 500: Gains 0.6% in Growth",
    timestamp: "5 days ago",
    category: "Stocks"
  },
  {
    id: "7",
    source: "USD",
    sourceLogo: "💵",
    title: "USD: JPY: Yen Plunges to 1.5 Year Low at Japan Weak Yen Concerns",
    timestamp: "5 days ago",
    category: "Forex"
  },
  {
    id: "8",
    source: "GOOGLE",
    sourceLogo: "🔍",
    title: "GOOGLE: Alphabet Stock Hits $175 on Q4 Profit at Split Earnings",
    timestamp: "7 days ago",
    category: "Tech"
  },
  {
    id: "9",
    source: "BTC",
    sourceLogo: "₿",
    title: "BTC: Nvidia Companies Stock to an MegaCorp Expec Halts from as Bitcoin Jump",
    timestamp: "7 days ago",
    category: "Crypto"
  },
  {
    id: "10",
    source: "LA",
    sourceLogo: "🌴",
    title: "LA WTF: Wildfires Destruction Bitcoin $111B in Blue Jump Estimates...",
    timestamp: "7 days ago",
    category: "News"
  }
];

export default function TopStories() {
  return (
    <div className="relative z-10 py-20 border-t border-white/5">
      <div className="container mx-auto px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-white mb-2">Top stories</h2>
            <p className="text-gray-400">Latest market news and analysis</p>
          </div>

          {/* Stories Grid - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockStories.map((story) => (
              <Link
                key={story.id}
                href="#"
                className="group flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all"
              >
                {/* Source Logo */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-2xl border border-white/10">
                  {story.sourceLogo}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-blue-400">{story.source}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-xs text-gray-500">{story.timestamp}</span>
                    <span className="text-gray-600">·</span>
                    <span className="text-xs text-gray-500">{story.category}</span>
                  </div>
                  
                  <h3 className="text-white font-medium group-hover:text-blue-400 transition line-clamp-2">
                    {story.title}
                  </h3>
                </div>

                {/* Arrow Icon */}
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Keep Reading Button */}
          <div className="flex justify-center mt-10">
            <Link
              href="#"
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-all border border-white/10 hover:border-white/20"
            >
              Keep reading →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
