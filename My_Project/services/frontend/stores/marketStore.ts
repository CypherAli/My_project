import { create } from 'zustand';
import { OrderBook, Trade, Ticker, Kline, TimeFrame, ChartType } from '../lib/types';

interface MarketState {
    // Current symbol
    currentSymbol: string;
    setCurrentSymbol: (symbol: string) => void;

    // Chart settings
    timeFrame: TimeFrame;
    setTimeFrame: (timeFrame: TimeFrame) => void;
    chartType: ChartType;
    setChartType: (chartType: ChartType) => void;

    // Market data
    orderBook: OrderBook | null;
    setOrderBook: (orderBook: OrderBook) => void;
    updateOrderBook: (orderBook: OrderBook) => void;

    trades: Trade[];
    setTrades: (trades: Trade[]) => void;
    addTrade: (trade: Trade) => void;

    klines: Kline[];
    setKlines: (klines: Kline[]) => void;
    updateKline: (kline: Kline) => void;
    addKline: (kline: Kline) => void;

    ticker: Ticker | null;
    setTicker: (ticker: Ticker) => void;

    // UI state
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
    // Initial state
    currentSymbol: 'BTCUSDT',
    timeFrame: '1m',
    chartType: 'candlestick',
    orderBook: null,
    trades: [],
    klines: [],
    ticker: null,
    isLoading: false,
    error: null,

    // Actions
    setCurrentSymbol: (symbol) => set({ currentSymbol: symbol }),

    setTimeFrame: (timeFrame) => set({ timeFrame }),

    setChartType: (chartType) => set({ chartType }),

    setOrderBook: (orderBook) => set({ orderBook }),

    updateOrderBook: (orderBook) => set({ orderBook }),

    setTrades: (trades) => set({ trades }),

    addTrade: (trade) =>
        set((state) => ({
            trades: [trade, ...state.trades].slice(0, 100), // Keep last 100 trades
        })),

    setKlines: (klines) => set({ klines }),

    updateKline: (kline) =>
        set((state) => {
            const klines = [...state.klines];
            const lastIndex = klines.length - 1;

            if (lastIndex >= 0 && klines[lastIndex].time === kline.time) {
                klines[lastIndex] = kline;
            } else {
                klines.push(kline);
            }

            return { klines };
        }),

    addKline: (kline) =>
        set((state) => ({
            klines: [...state.klines, kline],
        })),

    setTicker: (ticker) => set({ ticker }),

    setIsLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),
}));
