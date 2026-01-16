"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import LanguageSelector from "@/components/LanguageSelector";
import MarketSummary from "@/components/MarketSummary";
import USStocks from "@/components/USStocks";
import CommunityIdeas from "@/components/CommunityIdeas";
import IndicatorsStrategies from "@/components/IndicatorsStrategies";
import TopStories from "@/components/TopStories";
import CryptoSection from "@/components/CryptoSection";
import ForexHeatmap from "@/components/ForexHeatmap";
import FuturesCommodities from "@/components/FuturesCommodities";
import CalendarSection from "@/components/CalendarSection";
import BrokerSection from "@/components/BrokerSection";

export default function Home() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAuthClick = () => {
    if (token) {
      logout();
    } else {
      router.push('/login');
    }
  };

  return (
    <main className="min-h-screen bg-black text-gray-100 relative overflow-hidden">
      {/* Animated Background with Gradient Waves */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        
        {/* Wave patterns */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-400/30 to-transparent" />
        </div>
      </div>
      {/* Header */}
      <header className="relative z-10 h-16 border-b border-white/5 flex items-center px-8 bg-black/80 backdrop-blur-xl">
        {/* Logo */}
        <Link href="/" className="font-bold text-xl text-white tracking-tight mr-8 flex items-center gap-2 hover:opacity-80 transition">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">A</span>
            </div>
            <span className="font-bold text-lg">APEX</span>
          </div>
        </Link>
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl mr-12">
          <input
            type="text"
            placeholder="Search (Ctrl+K)"
            className="w-full h-10 px-4 pl-11 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 transition-all"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {/* Navigation */}
        <nav className="flex items-center gap-10 flex-1">
          <Link href="/" className="text-sm text-white/90 hover:text-white transition font-medium">
            Products
          </Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition font-medium">
            Community
          </Link>
          <Link href="/dom" className="text-sm text-gray-400 hover:text-white transition font-medium">
            Markets
          </Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition font-medium">
            Brokers
          </Link>
          <Link href="#" className="text-sm text-gray-400 hover:text-white transition font-medium">
            More
          </Link>
        </nav>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Language Selector */}
          <LanguageSelector />

          {/* User/Auth Section - Suppress Hydration */}
          <div suppressHydrationWarning>
            {!isClient ? (
              <div className="w-32 h-10 bg-transparent"></div>
            ) : token ? (
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-white/5 rounded-lg transition">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <button
                  onClick={handleAuthClick}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg transition border border-white/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleAuthClick}
                className="px-7 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
              >
                Get started
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-8 pt-32 pb-24">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1920&q=80"
            alt="Trading Background"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.7) contrast(1.2)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Main Headline - TradingView Style */}
          <div className="text-center mb-12">
            <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight tracking-tight">
              <span className="text-white">Look first</span>
              <span className="text-gray-600"> / </span>
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-transparent bg-clip-text animate-gradient">
                Then leap.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
              The best trades require research, then commitment.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mb-20" suppressHydrationWarning>
            {!isClient ? (
              <div className="px-14 py-6 bg-white text-black text-lg font-bold rounded-full">
                Get started for free
              </div>
            ) : (
              <Link
                href={token ? "/dom" : "/login"}
                className="group relative px-14 py-6 bg-white hover:bg-gray-50 text-black text-lg font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-white/30"
              >
                <span className="flex items-center gap-3">
                  Get started for free
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            )}
          </div>

          {/* Subtext */}
          <div className="text-center mb-24">
            <p className="text-gray-500 text-sm">
              $0 forever, no credit card needed
            </p>
          </div>
        </div>
      </div>

      {/* Where the world does markets - Video Section */}
      <div className="relative z-10 py-32 border-t border-white/5">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Where the world does markets
              </h2>
              <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto">
                Join 100 million traders and investors taking the future into their own hands.
              </p>
            </div>

            {/* Trading Chart Mockup with Glow Effect */}
            <div className="relative group">
              {/* Glow Background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Chart Container - Reduced size */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-blue-400/50 bg-black/40 backdrop-blur-sm shadow-2xl max-w-4xl mx-auto">
                {/* Chart Video/GIF */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-900 via-black to-gray-900">
                  {/* Trading Chart - High quality stock market image with subtle animation */}
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=80"
                      alt="Trading Chart"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Animated scanning line effect */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan" />
                    </div>
                    
                    {/* Pulsing data points */}
                    <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                    <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-red-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                  </div>
                  
                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
                </div>
              </div>

              {/* Explore Button - Moved below chart */}
              <div className="flex justify-center mt-12">
                <Link
                  href="/dom"
                  className="group/btn px-10 py-4 bg-white hover:bg-gray-50 text-black rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-2xl flex items-center gap-3"
                >
                  Explore features
                  <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 border-t border-white/5">
        <div className="container mx-auto px-8">
          <div className="max-w-6xl mx-auto">
            {/* Features - Minimal Design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all">
              <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-400 leading-relaxed">
                Rust-powered matching engine processes thousands of orders per second with microsecond latency.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all">
              <h3 className="text-xl font-bold text-white mb-3">Real-Time Data</h3>
              <p className="text-gray-400 leading-relaxed">
                WebSocket streaming delivers live orderbook updates and trade executions instantly.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all">
              <h3 className="text-xl font-bold text-white mb-3">Bank-Grade Security</h3>
              <p className="text-gray-400 leading-relaxed">
                Enterprise security with JWT authentication and ACID-compliant transactional system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Tech Stack Section */}
      <div className="relative z-10 border-t border-white/5 py-16">
        <div className="container mx-auto px-8">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-xs text-gray-500 uppercase tracking-wider mb-8">
              Built with world-class technology
            </p>
            <div className="flex gap-8 justify-center items-center flex-wrap">
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-gray-300 font-medium">Rust</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="text-gray-300 font-medium">Go</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-gray-300 font-medium">Next.js</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-gray-300 font-medium">PostgreSQL</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-gray-300 font-medium">Redis</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-gray-300 font-medium">NATS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Summary Section */}
      <MarketSummary />

      {/* US Stocks Section */}
      <USStocks />

      {/* Community Ideas Section */}
      <CommunityIdeas />

      {/* Indicators and Strategies Section */}
      <IndicatorsStrategies />

      {/* Top Stories Section */}
      <TopStories />

      {/* Crypto Section */}
      <CryptoSection />

      {/* Forex Heatmap Section */}
      <ForexHeatmap />

      {/* Futures & Commodities Section */}
      <FuturesCommodities />

      {/* Calendar Section */}
      <CalendarSection />

      {/* Broker Section */}
      <BrokerSection />

      {/* Quick Access Section */}
      <div className="relative z-10 border-t border-white/5 py-20">
        <div className="container mx-auto px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" suppressHydrationWarning>
              <Link
                href="/dom"
                className="group p-10 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-all"
              >
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition">
                  Start Trading →
                </h3>
                <p className="text-gray-400">
                  Access advanced order types, depth of market, and real-time execution.
                </p>
              </Link>

              {!isClient ? (
                <div className="p-10 rounded-2xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-yellow-500/20">
                  <h3 className="text-2xl font-bold text-white mb-3">View Dashboard →</h3>
                  <p className="text-gray-400">Monitor your positions and trading history.</p>
                </div>
              ) : (
                <Link
                  href={token ? "#" : "/login"}
                  className="group p-10 rounded-2xl bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-yellow-500/20 hover:border-yellow-500/40 transition-all"
                >
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition">
                    {token ? "View Dashboard" : "Create Account"} →
                  </h3>
                  <p className="text-gray-400">
                    {token ? "Monitor your positions and trading history." : "Sign up in seconds. No credit card required."}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
