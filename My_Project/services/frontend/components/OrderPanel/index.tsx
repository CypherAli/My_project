'use client';

import React, { useState } from 'react';
import { useOrderStore } from '@/stores/orderStore';
import { useMarketStore } from '@/stores/marketStore';
import { apiClient } from '@/lib/api/client';

export default function OrderPanel() {
    const { currentSymbol } = useMarketStore();
    const {
        orderSide,
        setOrderSide,
        orderType,
        setOrderType,
        orderPrice,
        setOrderPrice,
        orderQuantity,
        setOrderQuantity,
        isPlacingOrder,
        setIsPlacingOrder,
        orderError,
        setOrderError,
        resetOrderForm,
    } = useOrderStore();

    const [balance] = useState(10000);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setOrderError(null);

        const price = parseFloat(orderPrice);
        const quantity = parseFloat(orderQuantity);

        if (isNaN(price) || price <= 0) {
            setOrderError('Invalid price');
            return;
        }

        if (isNaN(quantity) || quantity <= 0) {
            setOrderError('Invalid quantity');
            return;
        }

        setIsPlacingOrder(true);

        try {
            await apiClient.createOrder({
                symbol: currentSymbol,
                side: orderSide,
                type: orderType,
                price: orderType === 'market' ? undefined : price,
                quantity,
            });

            resetOrderForm();
        } catch (error: any) {
            setOrderError(error.response?.data?.message || 'Failed to place order');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const total = parseFloat(orderPrice) * parseFloat(orderQuantity) || 0;

    return (
        <div className="bg-tv-white">
            <h3 className="text-sm font-semibold text-tv-gray-900 mb-3">Place Order</h3>

            {/* Buy/Sell Tabs */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setOrderSide('buy')}
                    className={`flex-1 py-2 px-4 rounded font-semibold transition-colors ${orderSide === 'buy'
                            ? 'bg-tv-green text-white'
                            : 'bg-tv-gray-100 text-tv-gray-900 hover:bg-tv-gray-150'
                        }`}
                >
                    Buy
                </button>
                <button
                    onClick={() => setOrderSide('sell')}
                    className={`flex-1 py-2 px-4 rounded font-semibold transition-colors ${orderSide === 'sell'
                            ? 'bg-tv-red text-white'
                            : 'bg-tv-gray-100 text-tv-gray-900 hover:bg-tv-gray-150'
                        }`}
                >
                    Sell
                </button>
            </div>

            {/* Order Type */}
            <div className="mb-4">
                <label className="block text-sm text-tv-gray-550 mb-2">Order Type</label>
                <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as any)}
                    className="w-full bg-tv-white border border-tv-gray-200 rounded px-3 py-2 text-tv-gray-900 focus:outline-none focus:border-tv-blue"
                >
                    <option value="limit">Limit</option>
                    <option value="market">Market</option>
                    <option value="stop-limit">Stop-Limit</option>
                </select>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Price */}
                {orderType !== 'market' && (
                    <div className="mb-4">
                        <label className="block text-sm text-tv-gray-550 mb-2">
                            Price (USDT)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={orderPrice}
                            onChange={(e) => setOrderPrice(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-tv-white border border-tv-gray-200 rounded px-3 py-2 text-tv-gray-900 font-mono focus:outline-none focus:border-tv-blue"
                        />
                    </div>
                )}

                {/* Quantity */}
                <div className="mb-4">
                    <label className="block text-sm text-tv-gray-550 mb-2">
                        Amount (BTC)
                    </label>
                    <input
                        type="number"
                        step="0.00001"
                        value={orderQuantity}
                        onChange={(e) => setOrderQuantity(e.target.value)}
                        placeholder="0.00000"
                        className="w-full bg-tv-white border border-tv-gray-200 rounded px-3 py-2 text-tv-gray-900 font-mono focus:outline-none focus:border-tv-blue"
                    />
                </div>

                {/* Quick Percentage Buttons */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {[25, 50, 75, 100].map((percent) => (
                        <button
                            key={percent}
                            type="button"
                            onClick={() => {
                                const maxQuantity = balance / (parseFloat(orderPrice) || 1);
                                setOrderQuantity(((maxQuantity * percent) / 100).toFixed(5));
                            }}
                            className="py-1 px-2 text-xs bg-tv-gray-100 hover:bg-tv-gray-150 rounded transition-colors text-tv-gray-900"
                        >
                            {percent}%
                        </button>
                    ))}
                </div>

                {/* Total */}
                <div className="mb-4 p-3 bg-tv-gray-50 rounded border border-tv-gray-150">
                    <div className="flex justify-between text-sm">
                        <span className="text-tv-gray-550">Total</span>
                        <span className="font-mono font-semibold text-tv-gray-900">
                            {total.toFixed(2)} USDT
                        </span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                        <span className="text-tv-gray-550">Available</span>
                        <span className="font-mono text-tv-gray-900">{balance.toFixed(2)} USDT</span>
                    </div>
                </div>

                {/* Error Message */}
                {orderError && (
                    <div className="mb-4 p-2 bg-red-50 border border-tv-red rounded text-sm text-tv-red">
                        {orderError}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className={`w-full py-3 rounded font-semibold transition-colors ${orderSide === 'buy'
                            ? 'bg-tv-green hover:bg-opacity-90 text-white'
                            : 'bg-tv-red hover:bg-opacity-90 text-white'
                        } ${isPlacingOrder && 'opacity-50 cursor-not-allowed'}`}
                >
                    {isPlacingOrder ? 'Placing Order...' : `${orderSide === 'buy' ? 'Buy' : 'Sell'} ${currentSymbol}`}
                </button>
            </form>
        </div>
    );
}
