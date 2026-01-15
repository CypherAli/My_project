import { useEffect, useRef } from 'react';
import { useMarketStore } from '../stores/marketStore';
import { wsClient } from '../lib/websocket/client';
import { OrderBook } from '../lib/types';

export function useOrderBook(symbol: string) {
    const { orderBook, setOrderBook, updateOrderBook } = useMarketStore();
    const isSubscribed = useRef(false);

    useEffect(() => {
        if (!symbol || isSubscribed.current) return;

        // Subscribe to order book updates
        const handleOrderBookUpdate = (data: OrderBook) => {
            updateOrderBook(data);
        };

        wsClient.subscribeToOrderBook(symbol, handleOrderBookUpdate);
        isSubscribed.current = true;

        return () => {
            wsClient.unsubscribeFromOrderBook(symbol, handleOrderBookUpdate);
            isSubscribed.current = false;
        };
    }, [symbol, updateOrderBook]);

    return {
        orderBook,
        bestBid: orderBook?.bids[0]?.price || 0,
        bestAsk: orderBook?.asks[0]?.price || 0,
        spread: orderBook ? (orderBook.asks[0]?.price || 0) - (orderBook.bids[0]?.price || 0) : 0,
        spreadPercent: orderBook
            ? (((orderBook.asks[0]?.price || 0) - (orderBook.bids[0]?.price || 0)) /
                (orderBook.bids[0]?.price || 1)) *
            100
            : 0,
    };
}
