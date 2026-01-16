'use client';

import { useState } from 'react';
import { useMockData } from '@/hooks/useMockData';
import Header from '@/components/Header';
import TradingChart from '@/components/TradingChart';
import OrderBook from '@/components/OrderBook';
import OrderPanel from '@/components/OrderPanel';
import TradeHistory from '@/components/TradeHistory';

export default function TradingPage() {
  useMockData();

  const [activeTab, setActiveTab] = useState<'chart' | 'dom'>('chart');

  return (
    <div className="flex flex-col h-screen bg-tv-white">
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex items-center border-b border-tv-gray-150 bg-tv-white px-6 py-3">
          <button
            onClick={() => setActiveTab('chart')}
            className={`tab-button ${activeTab === 'chart' ? 'active' : ''}`}
          >
            Chart
          </button>
          <button
            onClick={() => setActiveTab('dom')}
            className={`tab-button ${activeTab === 'dom' ? 'active' : ''}`}
          >
            DOM (Depth of Market)
          </button>
        </div>

        {/* Content based on active tab */}
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'chart' ? (
            <>
              {/* Chart View */}
              <div className="flex-1 flex flex-col border-r border-tv-gray-150">
                <div className="flex-1">
                  <TradingChart />
                </div>

                {/* Bottom Panel - Order Entry & Trade History */}
                <div className="h-80 border-t border-tv-gray-150 grid grid-cols-2 gap-px bg-tv-gray-150">
                  <div className="bg-tv-white p-4 overflow-auto">
                    <OrderPanel />
                  </div>
                  <div className="bg-tv-white overflow-auto">
                    <TradeHistory />
                  </div>
                </div>
              </div>

              {/* Right Sidebar - Market Info */}
              <div className="w-80 bg-tv-white border-l border-tv-gray-150 p-4 overflow-auto">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2 text-tv-gray-900">Market Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-tv-gray-550">24h High</span>
                      <span className="font-mono">50,250.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-tv-gray-550">24h Low</span>
                      <span className="font-mono">49,750.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-tv-gray-550">24h Volume</span>
                      <span className="font-mono">1,234.56 BTC</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* DOM View - Full Width */}
              <div className="flex-1 grid grid-cols-3 gap-px bg-tv-gray-150">
                {/* Order Book */}
                <div className="bg-tv-white">
                  <OrderBook />
                </div>

                {/* Chart in Middle */}
                <div className="bg-tv-white">
                  <TradingChart />
                </div>

                {/* Order Panel + Trade History */}
                <div className="bg-tv-white flex flex-col">
                  <div className="flex-1 p-4 border-b border-tv-gray-150 overflow-auto">
                    <OrderPanel />
                  </div>
                  <div className="flex-1 overflow-auto">
                    <TradeHistory />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
