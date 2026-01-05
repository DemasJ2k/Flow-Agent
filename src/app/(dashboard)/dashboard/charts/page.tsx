"use client";

import { useState, useEffect, useCallback } from "react";
import { LineChart, TrendingUp, TrendingDown, RefreshCw, AlertCircle } from "lucide-react";
import { TradingChart } from "@/components/charts/trading-chart";
import type { OHLCV, Timeframe, MarketType } from "@/lib/market";

interface SymbolInfo {
  symbol: string;
  name: string;
}

interface MarketStatus {
  enabled: boolean;
  polygonConfigured: boolean;
}

interface PatternAnalysis {
  orderBlocks: {
    bullish: Array<{ timestamp: number; high: number; low: number; mitigated: boolean }>;
    bearish: Array<{ timestamp: number; high: number; low: number; mitigated: boolean }>;
  };
  fairValueGaps: {
    bullish: Array<{ timestamp: number; high: number; low: number; filled: boolean }>;
    bearish: Array<{ timestamp: number; high: number; low: number; filled: boolean }>;
    unfilled: Array<{ type: string; timestamp: number; high: number; low: number }>;
  };
  marketStructure: {
    trend: "bullish" | "bearish" | "ranging";
    higherHighs: boolean;
    higherLows: boolean;
    lowerHighs: boolean;
    lowerLows: boolean;
  };
}

const TIMEFRAMES: { label: string; value: Timeframe }[] = [
  { label: "1m", value: "1m" },
  { label: "5m", value: "5m" },
  { label: "15m", value: "15m" },
  { label: "30m", value: "30m" },
  { label: "1H", value: "1h" },
  { label: "4H", value: "4h" },
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
];

const MARKET_TYPES: { label: string; value: MarketType }[] = [
  { label: "Forex", value: "forex" },
  { label: "Crypto", value: "crypto" },
  { label: "Metals", value: "metals" },
  { label: "Stocks", value: "stocks" },
];

export default function ChartsPage() {
  const [marketStatus, setMarketStatus] = useState<MarketStatus | null>(null);
  const [symbols, setSymbols] = useState<Record<string, SymbolInfo[]>>({});
  const [selectedMarket, setSelectedMarket] = useState<MarketType>("forex");
  const [selectedSymbol, setSelectedSymbol] = useState<string>("C:EURUSD");
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>("1h");
  const [chartData, setChartData] = useState<OHLCV[]>([]);
  const [patterns, setPatterns] = useState<PatternAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOrderBlocks, setShowOrderBlocks] = useState(true);
  const [showFVG, setShowFVG] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/market/status");
        const data = await res.json();
        setMarketStatus(data);
      } catch (err) {
        console.error("Failed to check market status:", err);
      }
    }
    checkStatus();
  }, []);

  useEffect(() => {
    async function fetchSymbols() {
      try {
        const res = await fetch("/api/market/symbols");
        const data = await res.json();
        setSymbols(data);
      } catch (err) {
        console.error("Failed to fetch symbols:", err);
      }
    }
    fetchSymbols();
  }, []);

  const fetchChartData = useCallback(async () => {
    if (!marketStatus?.enabled) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/market/ohlcv?ticker=${selectedSymbol}&timeframe=${selectedTimeframe}`
      );
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setChartData([]);
      } else {
        setChartData(data.data || []);
      }
    } catch (err) {
      setError("Failed to fetch chart data");
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, [marketStatus?.enabled, selectedSymbol, selectedTimeframe]);

  const fetchPatterns = useCallback(async () => {
    if (!marketStatus?.enabled) return;

    try {
      const res = await fetch(
        `/api/market/patterns?ticker=${selectedSymbol}&timeframe=${selectedTimeframe}`
      );
      const data = await res.json();

      if (!data.error) {
        setPatterns(data.patterns);
      }
    } catch (err) {
      console.error("Failed to fetch patterns:", err);
    }
  }, [marketStatus?.enabled, selectedSymbol, selectedTimeframe]);

  useEffect(() => {
    if (marketStatus?.enabled) {
      fetchChartData();
      fetchPatterns();
    }
  }, [fetchChartData, fetchPatterns, marketStatus?.enabled]);

  const handleMarketChange = (market: MarketType) => {
    setSelectedMarket(market);
    const marketSymbols = symbols[market];
    if (marketSymbols && marketSymbols.length > 0) {
      setSelectedSymbol(marketSymbols[0].symbol);
    }
  };

  const handleSymbolClick = (symbol: string, market: MarketType) => {
    setSelectedMarket(market);
    setSelectedSymbol(symbol);
  };

  const currentSymbols = symbols[selectedMarket] || [];
  const currentSymbolName =
    currentSymbols.find((s) => s.symbol === selectedSymbol)?.name || selectedSymbol;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Market Charts</h1>
        <p className="text-gray-600">Real-time market data with ICT pattern detection</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selectedMarket}
              onChange={(e) => handleMarketChange(e.target.value as MarketType)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MARKET_TYPES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currentSymbols.map((s) => (
                <option key={s.symbol} value={s.symbol}>
                  {s.name}
                </option>
              ))}
            </select>

            <div className="flex space-x-1">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setSelectedTimeframe(tf.value)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedTimeframe === tf.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                fetchChartData();
                fetchPatterns();
              }}
              disabled={loading}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">ICT Patterns:</span>
            <label className="flex items-center space-x-1 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="rounded"
                checked={showOrderBlocks}
                onChange={(e) => setShowOrderBlocks(e.target.checked)}
              />
              <span>Order Blocks</span>
            </label>
            <label className="flex items-center space-x-1 text-sm cursor-pointer">
              <input
                type="checkbox"
                className="rounded"
                checked={showFVG}
                onChange={(e) => setShowFVG(e.target.checked)}
              />
              <span>FVG</span>
            </label>
          </div>
        </div>

        {!marketStatus?.enabled ? (
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-lg font-medium">Polygon API Not Configured</h3>
              <p className="text-sm mt-2">
                Add POLYGON_API_KEY to your environment variables to enable live charts.
              </p>
              <a
                href="https://polygon.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm mt-2 inline-block"
              >
                Get a free API key at polygon.io
              </a>
            </div>
          </div>
        ) : error ? (
          <div className="h-96 flex items-center justify-center bg-red-50 rounded-lg border border-red-200">
            <div className="text-center text-red-600">
              <AlertCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Error Loading Chart</h3>
              <p className="text-sm mt-2">{error}</p>
              <button
                onClick={fetchChartData}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : loading && chartData.length === 0 ? (
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin text-blue-600" />
              <p className="text-gray-600">Loading chart data...</p>
            </div>
          </div>
        ) : chartData.length > 0 ? (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{currentSymbolName}</h2>
              {patterns?.marketStructure && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    patterns.marketStructure.trend === "bullish"
                      ? "bg-green-100 text-green-700"
                      : patterns.marketStructure.trend === "bearish"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {patterns.marketStructure.trend.toUpperCase()}
                </span>
              )}
            </div>
            <TradingChart data={chartData} height={500} showVolume={true} />
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center text-gray-500">
              <LineChart className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No Data Available</h3>
              <p className="text-sm mt-2">Select a symbol to view chart data</p>
            </div>
          </div>
        )}

        {patterns && chartData.length > 0 && (showOrderBlocks || showFVG) && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {showOrderBlocks && (
              <>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Bullish Order Blocks</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {patterns.orderBlocks.bullish.length}
                  </p>
                  <p className="text-xs text-green-600">
                    {patterns.orderBlocks.bullish.filter((ob) => !ob.mitigated).length} unmitigated
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Bearish Order Blocks</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {patterns.orderBlocks.bearish.length}
                  </p>
                  <p className="text-xs text-red-600">
                    {patterns.orderBlocks.bearish.filter((ob) => !ob.mitigated).length} unmitigated
                  </p>
                </div>
              </>
            )}
            {showFVG && (
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Fair Value Gaps</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {patterns.fairValueGaps.unfilled.length}
                </p>
                <p className="text-xs text-purple-600">
                  unfilled ({patterns.fairValueGaps.bullish.length} bullish,{" "}
                  {patterns.fairValueGaps.bearish.length} bearish total)
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(symbols).map(([market, marketSymbols]) => (
          <div key={market} className="rounded-lg bg-white p-4 shadow-md">
            <h3 className="font-semibold text-gray-900 mb-3 capitalize">{market}</h3>
            <div className="space-y-2">
              {(marketSymbols as SymbolInfo[]).slice(0, 5).map((s) => (
                <button
                  key={s.symbol}
                  onClick={() => handleSymbolClick(s.symbol, market as MarketType)}
                  className={`w-full flex items-center justify-between p-2 rounded-md transition-colors ${
                    selectedSymbol === s.symbol
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-sm font-medium">{s.name}</span>
                  <div className="flex items-center space-x-2">
                    {selectedSymbol === s.symbol && chartData.length > 0 ? (
                      <>
                        <span className="text-sm text-gray-700">
                          {chartData[chartData.length - 1]?.close.toFixed(
                            chartData[chartData.length - 1]?.close < 100 ? 4 : 2
                          )}
                        </span>
                        {chartData.length > 1 &&
                          chartData[chartData.length - 1].close >
                            chartData[chartData.length - 2].close ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                      </>
                    ) : (
                      <>
                        <span className="text-sm text-gray-400">--</span>
                        <TrendingUp className="h-4 w-4 text-gray-300" />
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
