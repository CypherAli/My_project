"use client";
import Link from "next/link";

interface CalendarEvent {
  date: string;
  company: string;
  ticker: string;
  event: string;
  time?: string;
  estimate?: string;
  icon: string;
}

const earningsEvents: CalendarEvent[] = [
  { date: "Today", company: "JPMorgan Chase Corporation", ticker: "JPM", event: "Earnings", time: "Before market", estimate: "4.48", icon: "🏦" },
  { date: "Today", company: "Bank of America Corporation", ticker: "BAC", event: "Earnings", time: "Before market", estimate: "0.87", icon: "🏛️" },
  { date: "Today", company: "PNC Financial Services Group", ticker: "PNC", event: "Earnings", time: "Before market", estimate: "4.38", icon: "💼" },
  { date: "Today", company: "LIFT Financial Inc.", ticker: "LFCR", event: "Earnings", time: "After market", estimate: "1.90", icon: "📊" },
];

const ipoEvents: CalendarEvent[] = [
  { date: "Jan 22", company: "SPSO", ticker: "SPSO", event: "IPO", time: "10:00 - 17:00", icon: "🚀" },
  { date: "Jan 22", company: "Mirk Group Ltd", ticker: "MRKQ", event: "IPO", time: "4.98 - 6.86", icon: "🎯" },
  { date: "Jan 23", company: "FGFR", ticker: "FGFR", event: "IPO", time: "23.46 - 28.36", icon: "💎" },
];

const economicEvents: CalendarEvent[] = [
  { date: "Jan 16", company: "United States", ticker: "USD", event: "Retail Sales MoM", time: "13:30", estimate: "0.6%", icon: "🇺🇸" },
  { date: "Jan 16", company: "United States", ticker: "USD", event: "Core Retail Sales MoM", time: "13:30", estimate: "0.5%", icon: "🇺🇸" },
  { date: "Jan 17", company: "United Kingdom", ticker: "GBP", event: "CPI YoY", time: "07:00", estimate: "2.6%", icon: "🇬🇧" },
  { date: "Jan 17", company: "Canada", ticker: "CAD", event: "CPI MoM", time: "13:30", estimate: "0.3%", icon: "🇨🇦" },
];

export default function CalendarSection() {
  return (
    <div className="relative z-10 py-20 border-t border-white/5">
      <div className="container mx-auto px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="text-2xl">📅</span> Market calendars
            </h2>
            <p className="text-gray-400">Earnings releases, IPOs, and economic events</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Earnings Calendar */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Earnings Calendar</h3>
                <Link href="#" className="text-sm text-blue-400 hover:text-blue-300">
                  See all →
                </Link>
              </div>
              <div className="space-y-3">
                {earningsEvents.map((event, idx) => (
                  <Link
                    key={idx}
                    href="#"
                    className="block p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {event.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate mb-1">{event.company}</div>
                        <div className="text-xs text-gray-400 mb-2">
                          <span className="font-mono">{event.ticker}</span> · {event.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                            Estimate: ${event.estimate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* IPO Calendar */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">IPO Calendar</h3>
                <Link href="#" className="text-sm text-blue-400 hover:text-blue-300">
                  See all →
                </Link>
              </div>
              <div className="space-y-3">
                {ipoEvents.map((event, idx) => (
                  <Link
                    key={idx}
                    href="#"
                    className="block p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 hover:border-purple-400/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {event.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-purple-400 font-semibold mb-1">{event.date}</div>
                        <div className="text-sm font-bold text-white truncate mb-1">{event.company}</div>
                        <div className="text-xs text-gray-400">
                          <span className="font-mono">{event.ticker}</span> · {event.time}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Economic Calendar */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Economic Calendar</h3>
                <Link href="#" className="text-sm text-blue-400 hover:text-blue-300">
                  See all →
                </Link>
              </div>
              <div className="space-y-3">
                {economicEvents.map((event, idx) => (
                  <Link
                    key={idx}
                    href="#"
                    className="block p-4 rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border border-green-500/20 hover:border-green-400/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {event.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-green-400 font-semibold mb-1">{event.date} · {event.time}</div>
                        <div className="text-sm font-bold text-white truncate mb-1">{event.event}</div>
                        <div className="text-xs text-gray-400 mb-2">{event.company}</div>
                        <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                          Est: {event.estimate}
                        </span>
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
