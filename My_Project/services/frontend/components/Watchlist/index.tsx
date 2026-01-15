'use client';

import React, { useState } from 'react';
import { useMarketStore } from '@/stores/marketStore';
import { useTicker } from '@/hooks/useTicker';
import { formatPrice, formatPercentage, cn } from '@/lib/utils';

const watchlistSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 'DOGEUSDT'];

function WatchlistItem({ symbol }: { symbol: string }) {
    const { currentSymbol, setCurrentSymbol } = useMarketStore();
    const { ticker } = useTicker(symbol);
    const isActive = currentSymbol === symbol;

    return (
        <div
            onClick={() => setCurrentSymbol(symbol)}
            className={cn(
                'p-3 cursor-pointer border-b border-border hover:bg-muted/50 transition-colors',
                isActive && 'bg-muted'
            )}
        >
            <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{symbol}</span>
                {ticker && (
                    <span
                        className={cn(
                            'text-xs font-medium',
                            ticker.priceChangePercent >= 0 ? 'text-success' : 'text-danger'
                        )}
                    >
                        {formatPercentage(ticker.priceChangePercent)}
                    </span>
                )}
            </div>
            {ticker && (
                <div className="flex items-center justify-between">
                    <span className="text-sm font-mono">{formatPrice(ticker.lastPrice, 2)}</span>
                    <span className="text-xs text-muted-foreground">
                        Vol: {(ticker.volume24h / 1000).toFixed(1)}K
                    </span>
                </div>
            )}
        </div>
    );
}

export default function Watchlist() {
    return (
        <div className="flex flex-col h-full bg-card border-l border-border">
            <div className="p-3 border-b border-border">
                <h3 className="text-sm font-semibold">Watchlist</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
                {watchlistSymbols.map((symbol) => (
                    <WatchlistItem key={symbol} symbol={symbol} />
                ))}
            </div>
        </div>
    );
}
