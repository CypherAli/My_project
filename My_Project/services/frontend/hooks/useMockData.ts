'use client';

import { useEffect } from 'react';
import { useMarketStore } from '@/stores/marketStore';
import {
    generateKlines,
    generateOrderBook,
    generateTrades,
    generateTicker,
    simulateOrderBookUpdate,
    simulateNewTrade,
    simulateKlineUpdate,
} from '@/lib/mock/data';

const USE_MOCK_DATA = true; // Set to false when backend is ready

export function useMockData() {
    const {
        currentSymbol,
        timeFrame,
        setKlines,
        setOrderBook,
        setTrades,
        setTicker,
        updateKline,
        addTrade,
        updateOrderBook,
    } = useMarketStore();

    useEffect(() => {
        if (!USE_MOCK_DATA) return;

        // Initialize mock data
        const initialKlines = generateKlines(500, 50000);
        const initialOrderBook = generateOrderBook(currentSymbol, 50000);
        const initialTrades = generateTrades(100, 50000);
        const initialTicker = generateTicker(currentSymbol, 50000);

        setKlines(initialKlines);
        setOrderBook(initialOrderBook);
        setTrades(initialTrades);
        setTicker(initialTicker);

        // Simulate real-time updates
        const orderBookInterval = setInterval(() => {
            const updatedOrderBook = simulateOrderBookUpdate(initialOrderBook);
            updateOrderBook(updatedOrderBook);
        }, 1000);

        const tradeInterval = setInterval(() => {
            const newTrade = simulateNewTrade(50000);
            addTrade(newTrade);
        }, 2000);

        const klineInterval = setInterval(() => {
            if (initialKlines.length > 0) {
                const lastKline = initialKlines[initialKlines.length - 1];
                const updatedKline = simulateKlineUpdate(lastKline);
                updateKline(updatedKline);
            }
        }, 3000);

        return () => {
            clearInterval(orderBookInterval);
            clearInterval(tradeInterval);
            clearInterval(klineInterval);
        };
    }, [currentSymbol, timeFrame]);

    return { isUsingMockData: USE_MOCK_DATA };
}
