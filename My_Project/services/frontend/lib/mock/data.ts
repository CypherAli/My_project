import { Kline, OrderBook, Trade, Ticker, OrderBookLevel } from '../types';

// Generate realistic candlestick data
export function generateKlines(count: number = 500, basePrice: number = 50000): Kline[] {
    const klines: Kline[] = [];
    const now = Date.now();
    const interval = 60 * 1000; // 1 minute

    let price = basePrice;

    for (let i = count - 1; i >= 0; i--) {
        const volatility = 0.002; // 0.2% volatility
        const change = (Math.random() - 0.5) * 2 * volatility * price;

        const open = price;
        const close = price + change;
        const high = Math.max(open, close) + Math.random() * volatility * price;
        const low = Math.min(open, close) - Math.random() * volatility * price;
        const volume = Math.random() * 100 + 50;

        klines.push({
            time: now - i * interval,
            open,
            high,
            low,
            close,
            volume,
        });

        price = close;
    }

    return klines;
}

// Generate realistic order book
export function generateOrderBook(symbol: string, midPrice: number = 50000): OrderBook {
    const bids: OrderBookLevel[] = [];
    const asks: OrderBookLevel[] = [];

    const spread = midPrice * 0.0001; // 0.01% spread
    const bestBid = midPrice - spread / 2;
    const bestAsk = midPrice + spread / 2;

    let cumulativeBid = 0;
    let cumulativeAsk = 0;

    // Generate 20 bid levels
    for (let i = 0; i < 20; i++) {
        const price = bestBid - i * (midPrice * 0.0001);
        const quantity = Math.random() * 5 + 0.1;
        cumulativeBid += quantity;

        bids.push({
            price,
            quantity,
            total: cumulativeBid,
        });
    }

    // Generate 20 ask levels
    for (let i = 0; i < 20; i++) {
        const price = bestAsk + i * (midPrice * 0.0001);
        const quantity = Math.random() * 5 + 0.1;
        cumulativeAsk += quantity;

        asks.push({
            price,
            quantity,
            total: cumulativeAsk,
        });
    }

    return {
        symbol,
        bids,
        asks,
        timestamp: Date.now(),
    };
}

// Generate realistic trades
export function generateTrades(count: number = 100, basePrice: number = 50000): Trade[] {
    const trades: Trade[] = [];
    const now = Date.now();

    for (let i = count - 1; i >= 0; i--) {
        const price = basePrice + (Math.random() - 0.5) * basePrice * 0.001;
        const quantity = Math.random() * 2 + 0.01;
        const side = Math.random() > 0.5 ? 'buy' : 'sell';

        trades.push({
            id: `trade-${i}`,
            symbol: 'BTCUSDT',
            price,
            quantity,
            side,
            timestamp: now - i * 1000,
        });
    }

    return trades;
}

// Generate ticker data
export function generateTicker(symbol: string, currentPrice: number = 50000): Ticker {
    const priceChange = (Math.random() - 0.5) * currentPrice * 0.05;
    const priceChangePercent = (priceChange / currentPrice) * 100;

    return {
        symbol,
        lastPrice: currentPrice,
        priceChange,
        priceChangePercent,
        high24h: currentPrice + Math.random() * currentPrice * 0.03,
        low24h: currentPrice - Math.random() * currentPrice * 0.03,
        volume24h: Math.random() * 10000 + 5000,
        timestamp: Date.now(),
    };
}

// Simulate real-time order book updates
export function simulateOrderBookUpdate(orderBook: OrderBook): OrderBook {
    const newOrderBook = JSON.parse(JSON.stringify(orderBook));

    // Randomly update a few levels
    const updateCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < updateCount; i++) {
        const isBid = Math.random() > 0.5;
        const levels = isBid ? newOrderBook.bids : newOrderBook.asks;
        const index = Math.floor(Math.random() * Math.min(5, levels.length));

        if (levels[index]) {
            levels[index].quantity += (Math.random() - 0.5) * 2;
            levels[index].quantity = Math.max(0.01, levels[index].quantity);

            // Recalculate cumulative totals
            let cumulative = 0;
            levels.forEach((level: OrderBookLevel) => {
                cumulative += level.quantity;
                level.total = cumulative;
            });
        }
    }

    newOrderBook.timestamp = Date.now();
    return newOrderBook;
}

// Simulate new trade
export function simulateNewTrade(currentPrice: number): Trade {
    const price = currentPrice + (Math.random() - 0.5) * currentPrice * 0.0005;
    const quantity = Math.random() * 2 + 0.01;
    const side = Math.random() > 0.5 ? 'buy' : 'sell';

    return {
        id: `trade-${Date.now()}`,
        symbol: 'BTCUSDT',
        price,
        quantity,
        side,
        timestamp: Date.now(),
    };
}

// Simulate new candle update
export function simulateKlineUpdate(lastKline: Kline): Kline {
    const volatility = 0.001;
    const change = (Math.random() - 0.5) * 2 * volatility * lastKline.close;
    const newClose = lastKline.close + change;

    return {
        time: lastKline.time,
        open: lastKline.open,
        high: Math.max(lastKline.high, newClose),
        low: Math.min(lastKline.low, newClose),
        close: newClose,
        volume: lastKline.volume + Math.random() * 10,
    };
}
