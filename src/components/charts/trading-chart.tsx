"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  HistogramData,
  Time,
  ColorType,
  CandlestickSeries,
  HistogramSeries,
} from "lightweight-charts";
import type { OHLCV } from "@/lib/market";

interface TradingChartProps {
  data: OHLCV[];
  height?: number;
  className?: string;
  showVolume?: boolean;
}

export function TradingChart({
  data,
  height = 500,
  className = "",
  showVolume = true,
}: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const [priceInfo, setPriceInfo] = useState<{
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    change: number;
    changePercent: number;
  } | null>(null);

  const initChart = useCallback(() => {
    if (!chartContainerRef.current) return;

    if (chartRef.current) {
      chartRef.current.remove();
    }

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "#0f172a" },
        textColor: "#94a3b8",
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#475569",
          width: 1,
          style: 2,
          labelBackgroundColor: "#334155",
        },
        horzLine: {
          color: "#475569",
          width: 1,
          style: 2,
          labelBackgroundColor: "#334155",
        },
      },
      rightPriceScale: {
        borderColor: "#334155",
        scaleMargins: {
          top: 0.1,
          bottom: showVolume ? 0.25 : 0.1,
        },
      },
      timeScale: {
        borderColor: "#334155",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    candlestickSeriesRef.current = candlestickSeries;

    if (showVolume) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: "#3b82f6",
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "",
      });

      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.85,
          bottom: 0,
        },
      });

      volumeSeriesRef.current = volumeSeries;
    }

    chart.subscribeCrosshairMove((param) => {
      if (param.time && param.seriesData.size > 0) {
        const candleData = param.seriesData.get(candlestickSeries) as CandlestickData | undefined;
        const volumeData = volumeSeriesRef.current
          ? (param.seriesData.get(volumeSeriesRef.current) as HistogramData | undefined)
          : undefined;

        if (candleData) {
          const change = candleData.close - candleData.open;
          const changePercent = (change / candleData.open) * 100;

          setPriceInfo({
            open: candleData.open,
            high: candleData.high,
            low: candleData.low,
            close: candleData.close,
            volume: volumeData?.value || 0,
            change,
            changePercent,
          });
        }
      }
    });

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [height, showVolume]);

  useEffect(() => {
    const cleanup = initChart();
    return () => {
      cleanup?.();
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [initChart]);

  useEffect(() => {
    if (!candlestickSeriesRef.current || data.length === 0) return;

    const chartData: CandlestickData[] = data.map((bar) => ({
      time: (bar.timestamp / 1000) as Time,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
    }));

    candlestickSeriesRef.current.setData(chartData);

    if (volumeSeriesRef.current) {
      const volumeData: HistogramData[] = data.map((bar) => ({
        time: (bar.timestamp / 1000) as Time,
        value: bar.volume,
        color: bar.close >= bar.open ? "#22c55e50" : "#ef444450",
      }));

      volumeSeriesRef.current.setData(volumeData);
    }

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }

    if (chartData.length > 0) {
      const lastCandle = chartData[chartData.length - 1];
      const firstCandle = chartData[0];
      const change = lastCandle.close - firstCandle.open;
      const changePercent = (change / firstCandle.open) * 100;

      setPriceInfo({
        open: lastCandle.open,
        high: lastCandle.high,
        low: lastCandle.low,
        close: lastCandle.close,
        volume: data[data.length - 1]?.volume || 0,
        change,
        changePercent,
      });
    }
  }, [data]);

  const formatPrice = (price: number) => {
    if (price < 1) return price.toFixed(5);
    if (price < 100) return price.toFixed(4);
    return price.toFixed(2);
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1_000_000_000) return `${(volume / 1_000_000_000).toFixed(2)}B`;
    if (volume >= 1_000_000) return `${(volume / 1_000_000).toFixed(2)}M`;
    if (volume >= 1_000) return `${(volume / 1_000).toFixed(2)}K`;
    return volume.toFixed(0);
  };

  return (
    <div className={`relative ${className}`}>
      {priceInfo && (
        <div className="absolute top-2 left-2 z-10 flex gap-4 bg-slate-800/90 px-3 py-2 rounded text-sm">
          <div>
            <span className="text-slate-400">O </span>
            <span className="text-white">{formatPrice(priceInfo.open)}</span>
          </div>
          <div>
            <span className="text-slate-400">H </span>
            <span className="text-green-400">{formatPrice(priceInfo.high)}</span>
          </div>
          <div>
            <span className="text-slate-400">L </span>
            <span className="text-red-400">{formatPrice(priceInfo.low)}</span>
          </div>
          <div>
            <span className="text-slate-400">C </span>
            <span className="text-white">{formatPrice(priceInfo.close)}</span>
          </div>
          <div>
            <span
              className={
                priceInfo.change >= 0 ? "text-green-400" : "text-red-400"
              }
            >
              {priceInfo.change >= 0 ? "+" : ""}
              {priceInfo.changePercent.toFixed(2)}%
            </span>
          </div>
          {showVolume && (
            <div>
              <span className="text-slate-400">Vol </span>
              <span className="text-blue-400">{formatVolume(priceInfo.volume)}</span>
            </div>
          )}
        </div>
      )}

      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
