import { create } from 'zustand';
import { Order } from '../lib/types';

interface OrderState {
    // Open orders
    openOrders: Order[];
    setOpenOrders: (orders: Order[]) => void;
    addOrder: (order: Order) => void;
    updateOrder: (orderId: string, updates: Partial<Order>) => void;
    removeOrder: (orderId: string) => void;

    // Order history
    orderHistory: Order[];
    setOrderHistory: (orders: Order[]) => void;

    // Order form state
    orderSide: 'buy' | 'sell';
    setOrderSide: (side: 'buy' | 'sell') => void;

    orderType: 'market' | 'limit' | 'stop-limit';
    setOrderType: (type: 'market' | 'limit' | 'stop-limit') => void;

    orderPrice: string;
    setOrderPrice: (price: string) => void;

    orderQuantity: string;
    setOrderQuantity: (quantity: string) => void;

    // UI state
    isPlacingOrder: boolean;
    setIsPlacingOrder: (isPlacing: boolean) => void;

    orderError: string | null;
    setOrderError: (error: string | null) => void;

    // Reset form
    resetOrderForm: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
    // Initial state
    openOrders: [],
    orderHistory: [],
    orderSide: 'buy',
    orderType: 'limit',
    orderPrice: '',
    orderQuantity: '',
    isPlacingOrder: false,
    orderError: null,

    // Actions
    setOpenOrders: (orders) => set({ openOrders: orders }),

    addOrder: (order) =>
        set((state) => ({
            openOrders: [order, ...state.openOrders],
        })),

    updateOrder: (orderId, updates) =>
        set((state) => ({
            openOrders: state.openOrders.map((order) =>
                order.id === orderId ? { ...order, ...updates } : order
            ),
        })),

    removeOrder: (orderId) =>
        set((state) => ({
            openOrders: state.openOrders.filter((order) => order.id !== orderId),
        })),

    setOrderHistory: (orders) => set({ orderHistory: orders }),

    setOrderSide: (side) => set({ orderSide: side }),

    setOrderType: (type) => set({ orderType: type }),

    setOrderPrice: (price) => set({ orderPrice: price }),

    setOrderQuantity: (quantity) => set({ orderQuantity: quantity }),

    setIsPlacingOrder: (isPlacing) => set({ isPlacingOrder: isPlacing }),

    setOrderError: (error) => set({ orderError: error }),

    resetOrderForm: () =>
        set({
            orderPrice: '',
            orderQuantity: '',
            orderError: null,
        }),
}));
