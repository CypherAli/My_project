"use client";
import Link from "next/link";

interface Broker {
  name: string;
  description: string;
  rating: string;
  ratingText: string;
  features: string[];
  logo: string;
  badge?: string;
}

const brokers: Broker[] = [
  {
    name: "Capital.com",
    description: "Trade CFDs on 3,000+ markets with tight spreads",
    rating: "4.8",
    ratingText: "Excellent",
    features: ["Forex", "CFDs", "0% Commission"],
    logo: "💹",
    badge: "Best Overall"
  },
  {
    name: "Interactive Brokers",
    description: "Low-cost trading with global market access",
    rating: "4.7",
    ratingText: "Excellent",
    features: ["Stocks", "Options", "Futures", "Forex"],
    logo: "🏦",
    badge: "Best for Active Traders"
  },
  {
    name: "IC Markets",
    description: "Leading forex broker with tight spreads",
    rating: "4.6",
    ratingText: "Excellent",
    features: ["Forex", "CFDs", "Raw Spreads"],
    logo: "📊",
  },
  {
    name: "Pepperstone",
    description: "Award-winning forex and CFD broker",
    rating: "4.6",
    ratingText: "Excellent",
    features: ["Forex", "CFDs", "Copy Trading"],
    logo: "🌶️",
  },
];

export default function BrokerSection() {
  return (
    <div className="relative z-10 py-20 border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.01]">
      <div className="container mx-auto px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-3">Trade directly on our platform</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Connect with fully-verified, user-reviewed brokers and trade directly from your charts
            </p>
          </div>

          {/* Brokers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {brokers.map((broker) => (
              <div
                key={broker.name}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-blue-400/30 transition-all hover:scale-105"
              >
                {/* Badge */}
                {broker.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold rounded-full">
                    {broker.badge}
                  </div>
                )}

                {/* Logo */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform border border-blue-400/20">
                  {broker.logo}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{broker.name}</h3>
                <p className="text-sm text-gray-400 mb-4 min-h-[40px]">{broker.description}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-white">{broker.rating}</span>
                    <span className="text-yellow-400">★</span>
                  </div>
                  <span className="text-sm font-medium text-green-400">{broker.ratingText}</span>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {broker.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full border border-blue-400/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href="#"
                  className="block w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-center font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  Open account
                </Link>
              </div>
            ))}
          </div>

          {/* See all brokers */}
          <div className="text-center">
            <Link
              href="#"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all border border-white/10 hover:border-white/20 group"
            >
              See all brokers
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
