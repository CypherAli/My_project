"use client";
import { useState } from "react";
import Link from "next/link";

interface IdeaCard {
  id: string;
  title: string;
  author: string;
  timestamp: string;
  image: string;
  likes: number;
  comments: number;
  category: string;
}

const mockIdeas: IdeaCard[] = [
  {
    id: "1",
    title: "BTC/USD Made a Reversal Pattern - Short Setup for next 100 Pips",
    author: "CryptoTrader_Lab",
    timestamp: "5 hours ago",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&q=80",
    likes: 12,
    comments: 162,
    category: "Technical Analysis"
  },
  {
    id: "2",
    title: "Bullish continuation?",
    author: "MrWinter",
    timestamp: "12 hours ago",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
    likes: 5,
    comments: 127,
    category: "Market Analysis"
  },
  {
    id: "3",
    title: "Silver Prices Stabilize Near Record Highs",
    author: "ProTrader",
    timestamp: "1 day ago",
    image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=400&q=80",
    likes: 8,
    comments: 58,
    category: "Commodities"
  },
  {
    id: "4",
    title: "Litecoin: The Next Pump",
    author: "VertiX",
    timestamp: "2 days ago",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&q=80",
    likes: 6,
    comments: 192,
    category: "Crypto Analysis"
  }
];

export default function CommunityIdeas() {
  const [activeTab, setActiveTab] = useState<"editors" | "popular" | "following">("editors");

  return (
    <div className="relative z-10 py-20 border-t border-white/5">
      <div className="container mx-auto px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Community ideas</h2>
              <p className="text-gray-400">See what traders are thinking</p>
            </div>
            <Link
              href="#"
              className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 transition group"
            >
              See all ideas
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
          </div>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockIdeas.map((idea) => (
              <Link
                key={idea.id}
                href="#"
                className="group rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-gray-900">
                  <img
                    src={idea.image}
                    alt={idea.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition">
                    {idea.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <span className="font-medium text-gray-300">by {idea.author}</span>
                    <span>·</span>
                    <span>{idea.timestamp}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{idea.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{idea.comments}</span>
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
