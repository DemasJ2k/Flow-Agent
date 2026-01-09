"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  Time,
  ColorType,
  CandlestickSeries,
} from "lightweight-charts";
import type { OHLCV } from "@/lib/market";

interface CandlestickChartProps {
  data: OHLCV[];
  width?: number;
  height?: number;
  className?: string;
  onCrosshairMove?: (price: number | null, time: Time | null) => void;
}

export function CandlestickChart({
  data,
  width,
  height = 400,
  className = "",
  onCrosshairMove,
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const defaultPrice = useMemo(() => {
    if (data.length > 0) {
      return data[data.length - 1].close;
    }
    return null;
  }, [data]);

  const [hoverPrice, setHoverPrice] = useState<number | null>(null);
  const displayPrice = hoverPrice ?? defaultPrice;

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: width || chartContainerRef.current.clientWidth,
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
          bottom: 0.1,
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

    chart.subscribeCrosshairMove((param) => {
      if (param.time && param.seriesData.size > 0) {
        const seriesData = param.seriesData.get(candlestickSeries);
        if (seriesData) {
          const candleData = seriesData as CandlestickData;
          setHoverPrice(candleData.close);
          onCrosshairMove?.(candleData.close, param.time);
        }
      } else {
        setHoverPrice(null);
        onCrosshairMove?.(null, null);
      }
    });

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: width || chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [height, width, onCrosshairMove]);

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

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [data]);

  return (
    <div className={`relative ${className}`}>
      <div ref={chartContainerRef} className="w-full" />
      {displayPrice && (
        <div className="absolute top-2 right-2 bg-slate-800/80 px-3 py-1 rounded text-sm">
          <span className="text-slate-400">Price: </span>
          <span className="text-white font-medium">
            {displayPrice.toFixed(5)}
          </span>
        </div>
      )}
    </div>
  );
}
