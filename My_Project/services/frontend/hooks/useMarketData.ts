import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useMarketStore } from '../stores/marketStore';
import { wsClient } from '../lib/websocket/client';
import { apiClient } from '../lib/api/client';
import { Kline, TimeFrame } from '../lib/types';

export function useMarketData(symbol: string, timeFrame: TimeFrame) {
    const { klines, setKlines, updateKline, setIsLoading, setError } = useMarketStore();
    const isSubscribed = useRef(false);

    // Fetch historical klines
    const { data, isLoading, error } = useQuery({
        queryKey: ['klines', symbol, timeFrame],
        queryFn: async () => {
            const data = await apiClient.getKlines(symbol, timeFrame, 500);
            return data;
        },
        staleTime: 60000, // 1 minute
        refetchOnWindowFocus: false,
    });

    // Update store when data changes
    useEffect(() => {
        if (data) {
            setKlines(data);
        }
    }, [data, setKlines]);

    // Subscribe to real-time updates
    useEffect(() => {
        if (!symbol || !timeFrame || isSubscribed.current) return;

        const handleKlineUpdate = (kline: Kline) => {
            updateKline(kline);
        };

        wsClient.subscribeToKlines(symbol, timeFrame, handleKlineUpdate);
        isSubscribed.current = true;

        return () => {
            wsClient.unsubscribeFromKlines(symbol, timeFrame, handleKlineUpdate);
            isSubscribed.current = false;
        };
    }, [symbol, timeFrame, updateKline]);

    // Update loading and error states
    useEffect(() => {
        setIsLoading(isLoading);
        setError(error ? error.message : null);
    }, [isLoading, error, setIsLoading, setError]);

    return {
        klines,
        isLoading,
        error,
    };
}
