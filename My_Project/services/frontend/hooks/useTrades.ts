import { useEffect, useRef } from 'react';
import { useMarketStore } from '../stores/marketStore';
import { wsClient } from '../lib/websocket/client';
import { Trade } from '../lib/types';

export function useTrades(symbol: string) {
    const { trades, setTrades, addTrade } = useMarketStore();
    const isSubscribed = useRef(false);

    useEffect(() => {
        if (!symbol || isSubscribed.current) return;

        // Subscribe to trade updates
        const handleTradeUpdate = (trade: Trade) => {
            addTrade(trade);
        };

        wsClient.subscribeToTrades(symbol, handleTradeUpdate);
        isSubscribed.current = true;

        return () => {
            wsClient.unsubscribeFromTrades(symbol, handleTradeUpdate);
            isSubscribed.current = false;
        };
    }, [symbol, addTrade]);

    return {
        trades,
        latestTrade: trades[0] || null,
    };
}
