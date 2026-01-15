'use client';

import React from 'react';
import { useOrderBook } from '@/hooks/useOrderBook';
import { useMarketStore } from '@/stores/marketStore';
import { useOrderStore } from '@/stores/orderStore';
import { formatPrice, formatVolume } from '@/lib/utils';
import { OrderBookLevel } from '@/lib/types';

export default function OrderBook() {
    const { currentSymbol } = useMarketStore();
    const { orderBook, bestBid, bestAsk, spread, spreadPercent } = useOrderBook(currentSymbol);
    const { setOrderPrice, setOrderSide } = useOrderStore();

    const handlePriceClick = (price: number, side: 'buy' | 'sell') => {
        setOrderPrice(price.toString());
        setOrderSide(side);
    };

    if (!orderBook) {
        return (
            <div className="flex items-center justify-center h-full text-tv-gray-550">
                Loading order book...
            </div>
        );
    }

    const maxBidVolume = Math.max(...orderBook.bids.map((b) => b.quantity), 1);
    const maxAskVolume = Math.max(...orderBook.asks.map((a) => a.quantity), 1);

    return (
        <div className="flex flex-col h-full bg-tv-white">
            {/* Header */}
            <div className="p-3 border-b border-tv-gray-150">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-tv-gray-900">Order Book</h3>
                    <div className="text-xs text-tv-gray-550">
                        Spread: {formatPrice(spread, 2)} ({spreadPercent.toFixed(3)}%)
                    </div>
                </div>
                <div className="grid grid-cols-3 text-xs text-tv-gray-550 font-mono">
                    <div>Price (USDT)</div>
                    <div className="text-right">Amount (BTC)</div>
                    <div className="text-right">Total</div>
                </div>
            </div>

            {/* Order Book Content */}
            <div className="flex-1 overflow-hidden">
                {/* Asks (Sell Orders) - Reversed */}
                <div className="h-1/2 overflow-y-auto flex flex-col-reverse">
                    {orderBook.asks.slice(0, 15).reverse().map((ask: OrderBookLevel, index: number) => {
                        const volumePercent = (ask.quantity / maxAskVolume) * 100;
                        return (
                            <div
                                key={`ask-${index}`}
                                className="orderbook-row"
                                onClick={() => handlePriceClick(ask.price, 'sell')}
                            >
                                <div
                                    className="volume-bar ask"
                                    style={{ width: `${volumePercent}%` }}
                                />
                                <div className="text-tv-red">{formatPrice(ask.price, 2)}</div>
                                <div className="text-right">{formatVolume(ask.quantity)}</div>
                                <div className="text-right text-tv-gray-550">
                                    {formatVolume(ask.total)}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Current Price */}
                <div className="py-2 px-3 bg-tv-gray-50 border-y border-tv-gray-150">
                    <div className="flex items-center justify-between">
                        <div className="text-lg font-bold font-mono text-tv-green">
                            {formatPrice(bestBid, 2)}
                        </div>
                        <div className="text-xs text-tv-gray-550">Last Price</div>
                    </div>
                </div>

                {/* Bids (Buy Orders) */}
                <div className="h-1/2 overflow-y-auto">
                    {orderBook.bids.slice(0, 15).map((bid: OrderBookLevel, index: number) => {
                        const volumePercent = (bid.quantity / maxBidVolume) * 100;
                        return (
                            <div
                                key={`bid-${index}`}
                                className="orderbook-row"
                                onClick={() => handlePriceClick(bid.price, 'buy')}
                            >
                                <div
                                    className="volume-bar bid"
                                    style={{ width: `${volumePercent}%` }}
                                />
                                <div className="text-tv-green">{formatPrice(bid.price, 2)}</div>
                                <div className="text-right">{formatVolume(bid.quantity)}</div>
                                <div className="text-right text-tv-gray-550">
                                    {formatVolume(bid.total)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
