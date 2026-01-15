'use client';

import React from 'react';
import { useMarketStore } from '@/stores/marketStore';
import { TimeFrame } from '@/lib/types';

const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT'];
const timeframes: TimeFrame[] = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'];

export default function Header() {
    const { currentSymbol, setCurrentSymbol, timeFrame, setTimeFrame } = useMarketStore();

    return (
        <header className="bg-tv-white border-b border-tv-gray-150">
            <div className="flex items-center justify-between px-4 py-2">
                {/* Left: Logo and Symbol */}
                <div className="flex items-center gap-6">
                    <div className="text-2xl font-bold text-tv-gray-900">TradingView</div>

                    <div className="flex items-center gap-2">
                        <select
                            value={currentSymbol}
                            onChange={(e) => setCurrentSymbol(e.target.value)}
                            className="bg-tv-white border border-tv-gray-200 rounded px-3 py-1.5 text-sm font-semibold text-tv-gray-900 hover:bg-tv-gray-50 focus:outline-none focus:border-tv-blue"
                        >
                            {symbols.map((symbol) => (
                                <option key={symbol} value={symbol}>
                                    {symbol}
                                </option>
                            ))}
                        </select>

                        <div className="text-2xl font-bold text-tv-gray-900">49,200.08</div>
                        <div className="text-sm text-tv-red">-240.08 -0.53%</div>
                    </div>
                </div>

                {/* Center: Timeframe Selector */}
                <div className="flex items-center gap-1">
                    {timeframes.map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeFrame(tf)}
                            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${timeFrame === tf
                                    ? 'bg-tv-blue text-white'
                                    : 'bg-transparent text-tv-gray-550 hover:bg-tv-gray-100'
                                }`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <button className="px-4 py-1.5 text-sm font-medium text-tv-gray-900 hover:bg-tv-gray-100 rounded transition-colors">
                        Indicators
                    </button>
                    <button className="px-4 py-1.5 bg-tv-blue text-white text-sm font-medium rounded hover:bg-tv-blue-dark transition-colors">
                        Upgrade now
                    </button>
                </div>
            </div>
        </header>
    );
}
