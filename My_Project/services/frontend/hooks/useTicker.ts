import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMarketStore } from '../stores/marketStore';
import { wsClient } from '../lib/websocket/client';
import { apiClient } from '../lib/api/client';
import { Ticker } from '../lib/types';

export function useTicker(symbol: string) {
    const { ticker, setTicker } = useMarketStore();

    // Fetch ticker data
    const { data, isLoading, error } = useQuery({
        queryKey: ['ticker', symbol],
        queryFn: async () => {
            const data = await apiClient.getTicker(symbol);
            return data;
        },
        staleTime: 5000, // 5 seconds
        refetchInterval: 10000, // Refetch every 10 seconds
    });

    // Update store when data changes
    useEffect(() => {
        if (data) {
            setTicker(data);
        }
    }, [data, setTicker]);

    // Subscribe to real-time ticker updates
    useEffect(() => {
        if (!symbol) return;

        const handleTickerUpdate = (tickerData: Ticker) => {
            setTicker(tickerData);
        };

        wsClient.subscribeToTicker(symbol, handleTickerUpdate);

        return () => {
            wsClient.unsubscribeFromTicker(symbol, handleTickerUpdate);
        };
    }, [symbol, setTicker]);

    return {
        ticker,
        isLoading,
        error,
    };
}
