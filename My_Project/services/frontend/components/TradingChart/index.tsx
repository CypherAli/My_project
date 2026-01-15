'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';
import { useMarketStore } from '@/stores/marketStore';
import { useMarketData } from '@/hooks/useMarketData';
import { Kline } from '@/lib/types';

export default function TradingChart() {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

    const { currentSymbol, timeFrame, chartType } = useMarketStore();
    const { klines, isLoading } = useMarketData(currentSymbol, timeFrame);

    const [isChartReady, setIsChartReady] = useState(false);

    // Initialize chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: '#131722' },
                textColor: '#D1D4DC',
            },
            grid: {
                vertLines: { color: '#2A2E39' },
                horzLines: { color: '#2A2E39' },
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    width: 1,
                    color: '#758696',
                    style: 3,
                },
                horzLine: {
                    width: 1,
                    color: '#758696',
                    style: 3,
                },
            },
            rightPriceScale: {
                borderColor: '#2A2E39',
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.2,
                },
            },
            timeScale: {
                borderColor: '#2A2E39',
                timeVisible: true,
                secondsVisible: false,
            },
            handleScroll: {
                mouseWheel: true,
                pressedMouseMove: true,
            },
            handleScale: {
                axisPressedMouseMove: true,
                mouseWheel: true,
                pinch: true,
            },
        });

        chartRef.current = chart;

        // Create candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26A69A',
            downColor: '#EF5350',
            borderUpColor: '#26A69A',
            borderDownColor: '#EF5350',
            wickUpColor: '#26A69A',
            wickDownColor: '#EF5350',
        });

        candlestickSeriesRef.current = candlestickSeries;

        // Create volume series
        const volumeSeries = chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
        });

        volumeSeriesRef.current = volumeSeries;

        // Auto-resize
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                });
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        setIsChartReady(true);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, []);

    // Update chart data when klines change
    useEffect(() => {
        if (!isChartReady || !candlestickSeriesRef.current || !volumeSeriesRef.current || !klines.length) {
            return;
        }

        const candleData: CandlestickData[] = klines.map((kline: Kline) => ({
            time: (kline.time / 1000) as Time,
            open: kline.open,
            high: kline.high,
            low: kline.low,
            close: kline.close,
        }));

        const volumeData = klines.map((kline: Kline) => ({
            time: (kline.time / 1000) as Time,
            value: kline.volume,
            color: kline.close >= kline.open ? '#26a69a80' : '#ef535080',
        }));

        candlestickSeriesRef.current.setData(candleData);
        volumeSeriesRef.current.setData(volumeData);

        // Fit content
        if (chartRef.current) {
            chartRef.current.timeScale().fitContent();
        }
    }, [klines, isChartReady]);

    return (
        <div className="relative w-full h-full bg-background">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                    <div className="text-muted-foreground">Loading chart data...</div>
                </div>
            )}
            <div ref={chartContainerRef} className="w-full h-full" />
        </div>
    );
}
