"use client";
import { useState } from "react";
import Link from "next/link";

interface Strategy {
  id: string;
  title: string;
  description: string;
  author: string;
  timestamp: string;
  image: string;
  likes: number;
  views: number;
  category: string;
  badge?: string;
}

const mockStrategies: Strategy[] = [
  {
    id: "1",
    title: "Donchian - Quantitative Backtest Library for Pine Script",
    author: "ProTraders",
    timestamp: "Dec 11, 2025",
    image: "https://images.unsplash.com/photo-1642790595397-7047dc98fa72?w=400&q=80",
    likes: 7,
    views: 145,
    category: "Strategy",
    badge: "Featured",
    description: "⚙️ Quantitative (example): A Pine Script library that provides a backtest for a Donchian Channel strategy."
  },
  {
    id: "2",
    title: "Arbitrage Detector [LuxAlgo]",
    author: "LuxAlgo",
    timestamp: "Dec 17, 2025",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&q=80",
    likes: 6,
    views: 1900,
    category: "Indicator",
    description: "The Arbitrage Detector provides traders spreads in the crypto and forex markets. It compares the same pair on the chart crypto exchanges and helps detect potential arbitrage opportunities."
  },
  {
    id: "3",
    title: "Multi-Distribution Volume Profile (Ziterman)",
    author: "Ziterman",
    timestamp: "Dec 19, 2025",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
    likes: 10,
    views: 1400,
    category: "Indicator",
    description: "📈 Overview: Multi Distribution Volume Profile that lets you overlay profiles from crypto exchanges, market phases, and technical analysis."
  },
  {
    id: "4",
    title: "Multi Ticker Anchored Candles",
    author: "HamRiRus",
    timestamp: "Nov 30, 2025",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=400&q=80",
    likes: 1,
    views: 348,
    category: "Indicator",
    description: "Multi Ticker Anchored Candles is a simple tool for overlaying up to 3 tickers onto the same chart, with anchored start and end times for time cycle analysis."
  }
];

export default function IndicatorsStrategies() {
  const [activeTab, setActiveTab] = useState<"editors" | "following" | "popular">("editors");

  return (
    <div className="relative z-10 py-20 border-t border-white/5">
      <div className="container mx-auto px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Indicators and strategies</h2>
              <p className="text-gray-400">Discover powerful tools from the community</p>
            </div>
            <Link
              href="#"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 transition group"
            >
              See all scripts
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mb-8 border-b border-white/10">
            <button
              onClick={() => setActiveTab("editors")}
              className={`pb-3 px-1 font-medium transition relative ${
                activeTab === "editors"
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Editors&apos; picks
              {activeTab === "editors" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`pb-3 px-1 font-medium transition relative ${
                activeTab === "following"
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Following
              {activeTab === "following" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("popular")}
              className={`pb-3 px-1 font-medium transition relative ${
                activeTab === "popular"
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Popular
              {activeTab === "popular" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
              )}
            </button>
          </div>

          {/* Strategies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockStrategies.map((strategy) => (
              <Link
                key={strategy.id}
                href="#"
                className="group rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-gray-900">
                  <img
                    src={strategy.image}
                    alt={strategy.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badge */}
                  {strategy.badge && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-yellow-500/90 text-black text-xs font-bold rounded-full">
                        {strategy.badge}
                      </span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-3 py-1 bg-blue-500/90 text-white text-xs font-semibold rounded-full">
                      {strategy.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition">
                    {strategy.title}
                  </h3>
                  
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                    {strategy.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <span className="font-medium text-gray-300">by {strategy.author}</span>
                    <span>·</span>
                    <span>{strategy.timestamp}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{strategy.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{strategy.views}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
