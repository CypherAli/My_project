"use client";

import { useEffect, useRef } from 'react';
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts';

export default function Chart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    let chart: IChartApi | null = null;
    let candlestickSeries: ISeriesApi<"Candlestick"> | null = null;
    let ws: WebSocket;
    
    const currentBar = {
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

      // 1. Khởi tạo Chart
      chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#111827' },
          textColor: '#D9D9D9',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 400,
      });

      // 2. Tạo Series Nến
      candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      // 3. Kết nối WebSocket để nhận Trade
      ws = new WebSocket("ws://localhost:8080/ws");

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          
          // Chỉ xử lý tin nhắn loại "trade"
          if (msg.type === 'trade') {
            const trade = msg.data;
            const price = parseFloat(trade.price);
            const timestamp = Math.floor(Date.now() / 1000);
            
            // Logic gom nến (1 phút 1 nến)
            const candleTime = (timestamp - (timestamp % 60)) as Time;

            if (currentBar.time !== candleTime) {
              // Nến mới
              currentBar.time = candleTime;
              currentBar.open = price;
              currentBar.high = price;
              currentBar.low = price;
              currentBar.close = price;
            } else {
              // Cập nhật nến hiện tại
              currentBar.close = price;
              currentBar.high = Math.max(currentBar.high, price);
              currentBar.low = Math.min(currentBar.low, price);
            }

            // Vẽ update lên chart
            if (candlestickSeries) {
              candlestickSeries.update(currentBar);
            }
          }
        } catch {
          // Bỏ qua lỗi parse
        }
      };

      ws.onerror = (error) => {
        console.log('WebSocket error:', error);
      };

      // Responsive
      const handleResize = () => {
        if (chart && chartContainerRef.current) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth });
        }
      };
      window.addEventListener('resize', handleResize);
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
    <div className="w-[600px] h-[400px] relative border border-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div ref={chartContainerRef} className="absolute inset-0" />
      <div className="absolute top-2 left-2 text-gray-400 text-xs font-mono bg-gray-900/80 px-2 py-1 rounded z-10">
        BTC/USDT • 1m (Realtime)
      </div>
    </div>
  );
}
