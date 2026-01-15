import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class APIClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: `${API_BASE_URL}/api/v1`,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                // Add auth token if available
                const token = localStorage.getItem('auth_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Handle unauthorized
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Market Data
    async getOrderBook(symbol: string) {
        const response = await this.client.get(`/trading/orderbook/${symbol}`);
        return response.data;
    }

    async getTrades(symbol: string, limit: number = 100) {
        const response = await this.client.get(`/market/trades/${symbol}`, {
            params: { limit },
        });
        return response.data;
    }

    async getTicker(symbol: string) {
        const response = await this.client.get(`/market/ticker/${symbol}`);
        return response.data;
    }

    async getKlines(symbol: string, interval: string, limit: number = 500) {
        const response = await this.client.get(`/market/klines/${symbol}`, {
            params: { interval, limit },
        });
        return response.data;
    }

    // Trading
    async createOrder(orderData: {
        symbol: string;
        side: 'buy' | 'sell';
        type: 'market' | 'limit' | 'stop-limit';
        price?: number;
        quantity: number;
    }) {
        const response = await this.client.post('/trading/orders', orderData);
        return response.data;
    }

    async cancelOrder(orderId: string) {
        const response = await this.client.delete(`/trading/orders/${orderId}`);
        return response.data;
    }

    async getOrder(orderId: string) {
        const response = await this.client.get(`/trading/orders/${orderId}`);
        return response.data;
    }

    // User
    async getUserOrders() {
        const response = await this.client.get('/user/orders');
        return response.data;
    }

    async getUserTrades() {
        const response = await this.client.get('/user/trades');
        return response.data;
    }

    async getBalance() {
        const response = await this.client.get('/user/balance');
        return response.data;
    }

    async getProfile() {
        const response = await this.client.get('/user/profile');
        return response.data;
    }

    // Auth
    async login(email: string, password: string) {
        const response = await this.client.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
        }
        return response.data;
    }

    async register(email: string, password: string, username: string) {
        const response = await this.client.post('/auth/register', {
            email,
            password,
            username,
        });
        return response.data;
    }

    async logout() {
        await this.client.post('/auth/logout');
        localStorage.removeItem('auth_token');
    }
}

export const apiClient = new APIClient();
