"use client";

import { useEffect, useRef, useState } from 'react';
import type { IChartApi, Time } from 'lightweight-charts';

interface CandleData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

export default function Chart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    let chart: IChartApi | null = null;
    let ws: WebSocket;
    const candleHistory: CandleData[] = [];
    
    let currentBar = {
      time: 0 as Time,
      open: 0,
      high: 0,
      low: 0,
      close: 0,
    };

    // Dynamic import để tránh SSR issues với lightweight-charts
    import('lightweight-charts').then((LightweightCharts) => {
      if (!chartContainerRef.current) return;
      
      const { createChart, ColorType } = LightweightCharts;

      // 1. Khởi tạo Chart với style giống TradingView
      const newChart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#131722' },
          textColor: '#D9D9D9',
        },
        grid: {
          vertLines: { color: '#1E222D', visible: true },
          horzLines: { color: '#1E222D', visible: true },
        },
        crosshair: {
          mode: 1, // Normal crosshair
          vertLine: {
            color: '#758696',
            width: 1,
            style: 3, // Dashed
            labelBackgroundColor: '#363C4E',
          },
          horzLine: {
            color: '#758696',
            width: 1,
            style: 3,
            labelBackgroundColor: '#363C4E',
          },
        },
        rightPriceScale: {
          borderColor: '#2B2B43',
          scaleMargins: {
            top: 0.1,
            bottom: 0.2,
          },
        },
        timeScale: {
          borderColor: '#2B2B43',
          timeVisible: true,
          secondsVisible: false,
        },
        width: chartContainerRef.current.clientWidth,
        height: 500,
      });
      
      chart = newChart;

      // 2. Tạo Candlestick Series với màu giống TradingView
      const candlestickSeries = newChart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderUpColor: '#26a69a',
        borderDownColor: '#ef5350',
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      // 3. Tạo Volume Series (histogram)
      const volumeSeries = newChart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
      });

      // 4. Load historical data trước khi connect WebSocket
      const generateHistoricalData = () => {
        const now = Math.floor(Date.now() / 1000);
        const basePrice = 49000;
        const data: CandleData[] = [];
        
        // Tạo 100 nến lịch sử (100 phút)
        for (let i = 100; i >= 0; i--) {
          const time = (now - i * 60) as Time;
          const randomChange = (Math.random() - 0.5) * 200;
          const open = basePrice + randomChange;
          const close = open + (Math.random() - 0.5) * 100;
          const high = Math.max(open, close) + Math.random() * 50;
          const low = Math.min(open, close) - Math.random() * 50;
          
          data.push({ time, open, high, low, close });
          candleHistory.push({ time, open, high, low, close });
          
          // Add volume
          volumeSeries.update({
            time,
            value: Math.random() * 1000 + 500,
            color: close > open ? '#26a69a80' : '#ef535080',
          });
        }
        
        candlestickSeries.setData(data);
        
        // Set initial currentBar
        if (data.length > 0) {
          const lastCandle = data[data.length - 1];
          currentBar = { ...lastCandle };
          setLastPrice(lastCandle.close);
        }
      };

      generateHistoricalData();

      // 5. Kết nối WebSocket để nhận Trade realtime
      ws = new WebSocket("ws://localhost:8080/ws");

      ws.onopen = () => {
        console.log('✅ WebSocket connected - receiving live trades');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          
          // Chỉ xử lý tin nhắn loại "trade"
          if (msg.type === 'trade') {
            const trade = msg.data;
            const price = parseFloat(trade.price);
            const amount = parseFloat(trade.amount || trade.quantity || 1);
            const timestamp = Math.floor(Date.now() / 1000);
            
            // Logic gom nến (1 phút 1 nến)
            const candleTime = (timestamp - (timestamp % 60)) as Time;

            if (currentBar.time !== candleTime) {
              // Nến mới - push nến cũ vào lịch sử
              if (currentBar.time !== 0) {
                candleHistory.push({ ...currentBar });
                candlestickSeries.update(currentBar);
              }
              
              // Tạo nến mới
              currentBar = {
                time: candleTime,
                open: price,
                high: price,
                low: price,
                close: price,
              };
              
              // Add volume bar mới
              volumeSeries.update({
                time: candleTime,
                value: amount,
                color: '#26a69a80',
              });
            } else {
              // Cập nhật nến hiện tại
              const prevClose = currentBar.close;
              currentBar.close = price;
              currentBar.high = Math.max(currentBar.high, price);
              currentBar.low = Math.min(currentBar.low, price);
              
              // Update volume color based on direction
              volumeSeries.update({
                time: candleTime,
                value: amount,
                color: currentBar.close >= currentBar.open ? '#26a69a80' : '#ef535080',
              });
              
              // Update price change
              const change = ((price - prevClose) / prevClose) * 100;
              setPriceChange(change);
            }

            // Vẽ update lên chart
            candlestickSeries.update(currentBar);
            setLastPrice(price);
          }
        } catch {
          console.error('Parse error');
        }
      };

      ws.onerror = () => {
        console.log('⚠️ WebSocket error - using historical data only');
      };

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected');
      };

      // Responsive
      const handleResize = () => {
        if (newChart && chartContainerRef.current) {
          newChart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };
      window.addEventListener('resize', handleResize);
      
      // Return cleanup function for the resize listener
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }).catch(() => {
      console.error('Failed to load chart library');
    });

    // Cleanup
    return () => {
      if (ws) {
        ws.close();
      }
      if (chart) {
        chart.remove();
      }
    };
  }, []);

  return (
    <div className="w-full h-[500px] relative border border-gray-800 rounded-lg overflow-hidden shadow-lg bg-[#131722]">
      <div ref={chartContainerRef} className="absolute inset-0" />
      
      {/* Header giống TradingView */}
      <div className="absolute top-3 left-3 flex items-center gap-4 z-10 pointer-events-none">
        <div className="bg-[#1E222D]/90 backdrop-blur-sm px-3 py-2 rounded">
          <span className="text-white font-bold text-base">BTC/USDT</span>
          <span className="text-gray-500 text-xs ml-2">1m</span>
        </div>
        
        {lastPrice && (
          <div className="bg-[#1E222D]/90 backdrop-blur-sm px-3 py-2 rounded flex items-center gap-3">
            <div>
              <div className="text-xs text-gray-500">Price</div>
              <div className={`text-base font-mono font-bold ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${lastPrice.toFixed(2)}
              </div>
            </div>
            {priceChange !== 0 && (
              <div className={`text-sm font-mono ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {priceChange >= 0 ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
