"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import PremiumBackground from "@/components/PremiumBackground";
import LuxuryHero from "@/components/LuxuryHero";
import PremiumFeatures from "@/components/PremiumFeatures";
import PremiumStats from "@/components/PremiumStats";
import TechnologyStack from "@/components/TechnologyStack";
import SecurityCompliance from "@/components/SecurityCompliance";
import LiveMarketData from "@/components/LiveMarketData";
import InstitutionalTestimonials from "@/components/InstitutionalTestimonials";
import InstitutionalPricing from "@/components/InstitutionalPricing";
import LanguageSelector from "@/components/LanguageSelector";
import MarketSummary from "@/components/MarketSummary";
import USStocks from "@/components/USStocks";
import LiveTradingFeed from "@/components/LiveTradingFeed";
import TradingPhilosophy from "@/components/TradingPhilosophy";
import TradingWisdom from "@/components/TradingWisdom";
import MarketMoodIndicator from "@/components/MarketMoodIndicator";
import CommunityIdeas from "@/components/CommunityIdeas";
import IndicatorsStrategies from "@/components/IndicatorsStrategies";
import TopStories from "@/components/TopStories";
import CryptoSection from "@/components/CryptoSection";
import ForexHeatmap from "@/components/ForexHeatmap";
import FuturesCommodities from "@/components/FuturesCommodities";
import CalendarSection from "@/components/CalendarSection";
import BrokerSection from "@/components/BrokerSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import Chart from "@/components/Chart";
import OrderBook from "@/components/OrderBook";
import OrderForm from "@/components/OrderForm";
import OpenOrders from "@/components/OpenOrders";
import Assets from "@/components/Assets";
import TradeHistory from "@/components/TradeHistory";

export default function Home() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "assets" | "trades">("orders");

  useEffect(() => {
    // Use setTimeout to defer state update
    const timer = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleAuthClick = () => {
    if (token) {
      logout();
    } else {
      router.push('/login');
    }
  };

  return (
    <main className="min-h-screen bg-black text-gray-100 relative">
      {/* Premium Canvas Background */}
      <PremiumBackground />
      
      {/* Header */}
      <header className="relative z-20 h-16 border-b border-white/5 flex items-center px-8 bg-black/40 backdrop-blur-2xl">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl text-white tracking-tight mr-8 flex items-center gap-2 hover:opacity-80 transition group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition" />
            <div className="relative w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">A</span>
            </div>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
            APEX
          </span>
        </Link>
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl mr-12 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-cyan-600/50 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition" />
          <input
            type="text"
            placeholder="Search markets, assets, strategies..."
            className="relative w-full h-10 px-4 pl-11 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* Navigation */}
        <nav className="flex items-center gap-10 flex-1">
          <Link href="/" className="text-sm text-white/90 hover:text-white transition font-medium relative group">
            Products
            <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform" />
          </Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition font-medium relative group">
            Community
            <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform" />
          </Link>
          <Link href="/dom" className="text-sm text-gray-400 hover:text-white transition font-medium relative group">
            Markets
            <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform" />
          </Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition font-medium relative group">
            Brokers
            <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform" />
          </Link>
        </nav>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Language Selector */}
          <LanguageSelector />

          {/* User/Auth Section */}
          <div suppressHydrationWarning>
            {!isClient ? (
              <div className="w-32 h-10 bg-transparent"></div>
            ) : token ? (
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-white/5 rounded-lg transition group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition" />
                  <svg className="relative w-5 h-5 text-gray-300 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <button
                  onClick={handleAuthClick}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg transition border border-white/20 hover:border-white/30"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuthClick}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition animate-gradient-x" />
                <div className="relative px-7 py-2.5 bg-white hover:bg-gray-50 text-black text-sm font-bold rounded-lg transition-all">
                  Get started
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Luxury Hero Section */}
      <LuxuryHero isClient={isClient} token={token} />

      {/* Quick Access Dashboard - NEW */}
      <div className="relative z-10 py-20 border-t border-white/5">
        <div className="container mx-auto px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-sm font-medium text-blue-400 tracking-wider uppercase">
                  Quick Access
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Everything You Need <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">In One Place</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Access all trading tools, market data, and analytics instantly
              </p>
            </div>

            {/* Quick Access Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Trading Terminal Card */}
              <Link
                href="/dom"
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all hover:scale-[1.02] overflow-hidden"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <svg className="w-5 h-5 text-blue-400 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
                    Trading Terminal
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Advanced order book, real-time charts, and instant execution
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400">Order Book</span>
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400">Charts</span>
                    <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400">Orders</span>
                  </div>
                </div>
              </Link>

              {/* Market Data Card */}
              <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-[1.02] overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-gray-500">Live</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition">
                    Market Data
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Real-time prices, volume, and market analysis across all assets
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400">Crypto</span>
                    <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400">Stocks</span>
                    <span className="px-2 py-1 rounded bg-purple-500/10 text-purple-400">Forex</span>
                  </div>
                </div>
              </div>

              {/* Account Management Card */}
              <Link
                href={token ? "#" : "/login"}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-all hover:scale-[1.02] overflow-hidden"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-orange-500/20 group-hover:bg-orange-500/30 transition">
                      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <svg className="w-5 h-5 text-orange-400 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition">
                    {token ? "Your Dashboard" : "Create Account"}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {token ? "Manage your portfolio, track performance, and view history" : "Start trading in seconds. No credit card required."}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-400">
                      {token ? "Portfolio" : "Free"}
                    </span>
                    <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-400">
                      {token ? "History" : "Instant"}
                    </span>
                    <span className="px-2 py-1 rounded bg-orange-500/10 text-orange-400">
                      {token ? "Analytics" : "Secure"}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Market Preview Card - Shows OrderBook */}
              <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 transition-all overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition">
                      Order Book Preview
                    </h3>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-gray-500">Live</span>
                    </div>
                  </div>
                  <div className="h-48 overflow-hidden rounded-lg bg-black/20 border border-green-500/10">
                    <div className="scale-[0.6] origin-top-left transform w-[166%]">
                      <OrderBook symbol="BTC/USDT" height={300} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Chart Card */}
              <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition">
                      Live Chart
                    </h3>
                    <span className="text-xs px-2 py-1 rounded bg-cyan-500/10 text-cyan-400">BTC/USDT</span>
                  </div>
                  <div className="h-48 overflow-hidden rounded-lg bg-black/20 border border-cyan-500/10">
                    <div className="scale-[0.7] origin-top-left transform w-[142%]">
                      <Chart symbol="BTC/USDT" height={280} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Card */}
              <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all hover:scale-[1.02] overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 transition">
                      <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition">
                    Market Analytics
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Advanced indicators, strategies, and market sentiment analysis
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400">Indicators</span>
                    <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400">Strategies</span>
                    <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400">AI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Features Section */}
      <PremiumFeatures />

      {/* Complete Trading Dashboard Section - FULL DOM FUNCTIONALITY */}
      <div className="relative z-10 border-t border-white/5 py-20 bg-gradient-to-b from-transparent to-black/20">
        <div className="container mx-auto px-8">
          <div className="max-w-[1800px] mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-medium text-green-400 tracking-wider uppercase">
                  Live Trading Dashboard
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Professional</span> Trading Interface
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-4">
                Full-featured trading terminal with real-time order book, advanced charting, and instant execution
              </p>
              <Link 
                href="/dom"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
              >
                <span>Open Full Trading Terminal</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Full Trading Layout - Mimics DOM Page */}
            <div className="grid grid-cols-12 gap-4">
              {/* Left: Order Book */}
              <div className="col-span-12 lg:col-span-3">
                <div className="sticky top-4">
                  <div className="bg-[#0b0e11]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">Order Book</h3>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-xs text-gray-400">Real-time</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">BTC/USDT</p>
                    </div>
                    <div className="h-[600px]">
                      <OrderBook symbol="BTC/USDT" height={600} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle: Chart + Trading History Tabs */}
              <div className="col-span-12 lg:col-span-6 space-y-4">
                {/* Chart */}
                <div className="bg-[#0b0e11]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="p-4 border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white">Price Chart</h3>
                        <p className="text-xs text-gray-500 mt-1">TradingView Integration</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-green-400">$49,234.50</span>
                        <span className="text-xs text-green-400">+2.5%</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[400px]">
                    <Chart symbol="BTC/USDT" height={400} />
                  </div>
                </div>

                {/* Trading Activity Tabs */}
                <div className="bg-[#0b0e11]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Tab Headers */}
                  <div className="flex border-b border-white/10 bg-black/20">
                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`flex-1 px-6 py-3 text-sm font-medium transition-all relative ${
                        activeTab === "orders"
                          ? "text-blue-400"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {activeTab === "orders" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500" />
                      )}
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>Open Orders</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("assets")}
                      className={`flex-1 px-6 py-3 text-sm font-medium transition-all relative ${
                        activeTab === "assets"
                          ? "text-purple-400"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {activeTab === "assets" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
                      )}
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Assets</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab("trades")}
                      className={`flex-1 px-6 py-3 text-sm font-medium transition-all relative ${
                        activeTab === "trades"
                          ? "text-green-400"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {activeTab === "trades" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500" />
                      )}
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>Trade History</span>
                      </div>
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="h-[320px] overflow-auto">
                    {activeTab === "orders" && (
                      <div className="p-1">
                        <OpenOrders />
                      </div>
                    )}
                    {activeTab === "assets" && (
                      <div className="p-1">
                        <Assets />
                      </div>
                    )}
                    {activeTab === "trades" && (
                      <div className="p-1">
                        <TradeHistory />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Order Form */}
              <div className="col-span-12 lg:col-span-3">
                <div className="sticky top-4">
                  <div className="bg-[#0b0e11]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">Place Order</h3>
                        {!token && (
                          <Link 
                            href="/login"
                            className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition border border-blue-500/30"
                          >
                            Login to Trade
                          </Link>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Market, Limit & Stop Orders</p>
                    </div>
                    <div>
                      <OrderForm />
                    </div>
                  </div>

                  {/* Trading Tips */}
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-yellow-500/20">
                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-yellow-400 mb-1">Pro Tip</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Use stop-loss orders to manage risk. Always define your exit strategy before entering a trade.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-white">Instant Execution</span>
                </div>
                <p className="text-xs text-gray-500">Orders execute in microseconds</p>
              </div>
              
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-white">Secure Trading</span>
                </div>
                <p className="text-xs text-gray-500">Bank-grade security protocols</p>
              </div>
              
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-white">Advanced Charts</span>
                </div>
                <p className="text-xs text-gray-500">Professional-grade analysis</p>
              </div>
              
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-white">Low Fees</span>
                </div>
                <p className="text-xs text-gray-500">Competitive maker/taker rates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Stats Section - NEW */}
      <PremiumStats />

      {/* Technology Stack Section - NEW */}
      <TechnologyStack />

      {/* Security & Compliance Section - NEW */}
      <SecurityCompliance />

      {/* Tech Stack Section - Redesigned */}
      <div className="relative z-10 border-t border-white/5 py-20">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-sm font-medium text-purple-400 tracking-wider uppercase">
                  Technology Stack
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Built with <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">World-Class</span> Technology
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Leveraging the most advanced and battle-tested technologies in the industry
              </p>
            </div>

            {/* Tech Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "Rust", color: "orange", desc: "Blazing Fast Engine" },
                { name: "Go", color: "cyan", desc: "Scalable Gateway" },
                { name: "Next.js", color: "blue", desc: "Modern UI/UX" },
                { name: "PostgreSQL", color: "green", desc: "Reliable Database" },
                { name: "Redis", color: "red", desc: "Lightning Cache" },
                { name: "NATS", color: "purple", desc: "Message Streaming" }
              ].map((tech, index) => (
                <div
                  key={index}
                  className="group relative p-6 rounded-xl bg-white/[0.02] border border-white/[0.05] 
                           hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300
                           hover:scale-105 hover:-translate-y-1"
                >
                  {/* Hover Glow */}
                  <div className={`absolute -inset-1 bg-${tech.color}-500/20 rounded-xl blur-lg opacity-0 
                                 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative text-center">
                    <div className={`w-3 h-3 rounded-full bg-${tech.color}-500 mx-auto mb-3 
                                   group-hover:scale-125 transition-transform`} />
                    <h3 className={`text-lg font-bold text-gray-300 mb-1 group-hover:text-${tech.color}-400 transition-colors`}>
                      {tech.name}
                    </h3>
                    <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                      {tech.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market Summary Section - FIRST: Show overall market */}
      <MarketSummary />

      {/* Crypto Section - Popular section */}
      <CryptoSection />

      {/* US Stocks Section */}
      <USStocks />

      {/* Forex Heatmap Section */}
      <ForexHeatmap />

      {/* Futures & Commodities Section */}
      <FuturesCommodities />

      {/* Live Trading Feed - Real action happening now */}
      <LiveTradingFeed />

      {/* Market Mood Indicator - Psychology */}
      <MarketMoodIndicator />

      {/* Trading Philosophy - Art of Trading */}
      <TradingPhilosophy />

      {/* Trading Wisdom - Quotes from legends */}
      <TradingWisdom />

      {/* Community Ideas Section */}
      <CommunityIdeas />

      {/* Indicators and Strategies Section */}
      <IndicatorsStrategies />

      {/* Top Stories Section */}
      <TopStories />

      {/* Calendar Section */}
      <CalendarSection />

      {/* Live Market Data Section - NEW */}
      <LiveMarketData />

      {/* Institutional Testimonials Section - NEW */}
      <InstitutionalTestimonials />

      {/* Institutional Pricing Section - NEW */}
      <InstitutionalPricing />

      {/* Broker Section */}
      <BrokerSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Quick Access Section */}
      <div className="relative z-10 border-t border-white/5 py-20">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header with CTA */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Ready to Start <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Trading?</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                Join thousands of traders using our advanced platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12" suppressHydrationWarning>
              {/* Trading Terminal CTA */}
              <Link
                href="/dom"
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition">
                      <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <svg className="w-6 h-6 text-blue-400 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition mb-2">
                    Start Trading
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Access advanced order types, depth of market, real-time charts, and instant execution on our professional trading terminal.
                  </p>
                </div>
              </Link>

              {/* Account Management CTA */}
              {!isClient ? (
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 overflow-hidden">
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-purple-500/20">
                        <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Create Account</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Sign up in seconds. No credit card required. Start with demo account.</p>
                  </div>
                </div>
              ) : (
                <Link
                  href={token ? "#" : "/login"}
                  className="group relative p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition">
                        <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <svg className="w-6 h-6 text-purple-400 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition mb-2">
                      {token ? "View Dashboard" : "Create Account"}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {token ? "Monitor your positions, track performance, and analyze your trading history." : "Sign up in seconds. No credit card required. Start with demo account."}
                    </p>
                  </div>
                </Link>
              )}

              {/* Market Data CTA */}
              <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/20 overflow-hidden cursor-pointer">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-orange-500/20 group-hover:bg-orange-500/30 transition">
                      <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-gray-500 font-medium">Live</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-orange-400 transition mb-2">
                    Explore Markets
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Real-time data for crypto, stocks, forex, and commodities. Advanced analytics and insights.
                  </p>
                </div>
              </div>
            </div>

            {/* Platform Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">$2.4B+</div>
                <div className="text-sm text-gray-400">Daily Volume</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">150K+</div>
                <div className="text-sm text-gray-400">Active Traders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">0.01ms</div>
                <div className="text-sm text-gray-400">Latency</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">99.99%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
