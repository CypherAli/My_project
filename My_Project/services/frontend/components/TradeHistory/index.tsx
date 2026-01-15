'use client';

import React from 'react';
import { useTrades } from '@/hooks/useTrades';
import { useMarketStore } from '@/stores/marketStore';
import { formatPrice, formatVolume, formatTime } from '@/lib/utils';
import { Trade } from '@/lib/types';

export default function TradeHistory() {
    const { currentSymbol } = useMarketStore();
    const { trades } = useTrades(currentSymbol);

    return (
        <div className="flex flex-col h-full bg-tv-white">
            {/* Header */}
            <div className="p-3 border-b border-tv-gray-150">
                <h3 className="text-sm font-semibold text-tv-gray-900">Recent Trades</h3>
                <div className="grid grid-cols-3 text-xs text-tv-gray-550 font-mono mt-2">
                    <div>Price (USDT)</div>
                    <div className="text-right">Amount (BTC)</div>
                    <div className="text-right">Time</div>
                </div>
            </div>

            {/* Trades List */}
            <div className="flex-1 overflow-y-auto">
                {trades.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-tv-gray-550 text-sm">
                        No recent trades
                    </div>
                ) : (
                    trades.map((trade: Trade) => (
                        <div
                            key={trade.id}
                            className="grid grid-cols-3 px-3 py-1 text-xs font-mono hover:bg-tv-gray-50 transition-colors"
                        >
                            <div className={trade.side === 'buy' ? 'text-tv-green' : 'text-tv-red'}>
                                {formatPrice(trade.price, 2)}
                            </div>
                            <div className="text-right text-tv-gray-900">{formatVolume(trade.quantity)}</div>
                            <div className="text-right text-tv-gray-550">
                                {formatTime(trade.timestamp)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
