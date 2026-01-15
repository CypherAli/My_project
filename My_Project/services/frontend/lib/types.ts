export interface Kline {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface OrderBookLevel {
    price: number;
    quantity: number;
    total: number;
}

export interface OrderBook {
    symbol: string;
    bids: OrderBookLevel[];
    asks: OrderBookLevel[];
    timestamp: number;
}

export interface Trade {
    id: string;
    symbol: string;
    price: number;
    quantity: number;
    side: 'buy' | 'sell';
    timestamp: number;
}

export interface Ticker {
    symbol: string;
    lastPrice: number;
    priceChange: number;
    priceChangePercent: number;
    high24h: number;
    low24h: number;
    volume24h: number;
    timestamp: number;
}

export interface Order {
    id: string;
    symbol: string;
    side: 'buy' | 'sell';
    type: 'market' | 'limit' | 'stop-limit';
    price: number;
    quantity: number;
    filled: number;
    status: 'open' | 'partially_filled' | 'filled' | 'cancelled';
    createdAt: number;
    updatedAt: number;
}

export type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';

export type ChartType = 'candlestick' | 'line' | 'area';

export interface Symbol {
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
    pricePrecision: number;
    quantityPrecision: number;
}
