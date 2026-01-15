import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';

type EventCallback = (data: any) => void;

class WebSocketClient {
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private subscriptions: Map<string, Set<EventCallback>> = new Map();

    connect() {
        if (this.socket?.connected) {
            console.log('WebSocket already connected');
            return;
        }

        this.socket = io(WS_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: this.reconnectDelay,
            reconnectionDelayMax: 5000,
        });

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            this.resubscribeAll();
        });

        this.socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            this.reconnectAttempts++;
        });

        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.subscriptions.clear();
    }

    subscribe(channel: string, callback: EventCallback) {
        if (!this.subscriptions.has(channel)) {
            this.subscriptions.set(channel, new Set());
        }

        this.subscriptions.get(channel)!.add(callback);

        if (this.socket?.connected) {
            this.socket.emit('subscribe', { channel });
            this.socket.on(channel, callback);
        }
    }

    unsubscribe(channel: string, callback?: EventCallback) {
        if (callback) {
            this.subscriptions.get(channel)?.delete(callback);
            if (this.socket) {
                this.socket.off(channel, callback);
            }
        } else {
            this.subscriptions.delete(channel);
            if (this.socket) {
                this.socket.emit('unsubscribe', { channel });
                this.socket.off(channel);
            }
        }
    }

    private resubscribeAll() {
        this.subscriptions.forEach((callbacks, channel) => {
            if (this.socket) {
                this.socket.emit('subscribe', { channel });
                callbacks.forEach((callback) => {
                    this.socket!.on(channel, callback);
                });
            }
        });
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }

    // Convenience methods for common channels
    subscribeToOrderBook(symbol: string, callback: EventCallback) {
        this.subscribe(`orderbook.${symbol}`, callback);
    }

    subscribeToTrades(symbol: string, callback: EventCallback) {
        this.subscribe(`trades.${symbol}`, callback);
    }

    subscribeToKlines(symbol: string, interval: string, callback: EventCallback) {
        this.subscribe(`klines.${symbol}.${interval}`, callback);
    }

    subscribeToTicker(symbol: string, callback: EventCallback) {
        this.subscribe(`ticker.${symbol}`, callback);
    }

    subscribeToUserOrders(callback: EventCallback) {
        this.subscribe('user.orders', callback);
    }

    unsubscribeFromOrderBook(symbol: string, callback?: EventCallback) {
        this.unsubscribe(`orderbook.${symbol}`, callback);
    }

    unsubscribeFromTrades(symbol: string, callback?: EventCallback) {
        this.unsubscribe(`trades.${symbol}`, callback);
    }

    unsubscribeFromKlines(symbol: string, interval: string, callback?: EventCallback) {
        this.unsubscribe(`klines.${symbol}.${interval}`, callback);
    }

    unsubscribeFromTicker(symbol: string, callback?: EventCallback) {
        this.unsubscribe(`ticker.${symbol}`, callback);
    }

    unsubscribeFromUserOrders(callback?: EventCallback) {
        this.unsubscribe('user.orders', callback);
    }
}

export const wsClient = new WebSocketClient();
