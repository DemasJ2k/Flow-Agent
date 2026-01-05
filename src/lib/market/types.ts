// Market Data Types

export type MarketType = "forex" | "crypto" | "stocks" | "metals";

export type Timeframe =
  | "1m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "4h"
  | "1d"
  | "1w"
  | "1M";

export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketTicker {
  symbol: string;
  name: string;
  type: MarketType;
  exchange?: string;
  currency?: string;
}

export interface TickerQuote {
  symbol: string;
  bid: number;
  ask: number;
  last: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
}

export interface AggregateBar {
  ticker: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap?: number;
  timestamp: number;
  transactions?: number;
}

export interface PolygonAggregateResponse {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: PolygonBar[];
  status: string;
  request_id: string;
  count: number;
}

export interface PolygonBar {
  v: number; // volume
  vw?: number; // volume weighted average price
  o: number; // open
  c: number; // close
  h: number; // high
  l: number; // low
  t: number; // timestamp (milliseconds)
  n?: number; // number of transactions
}

export interface PolygonTickerDetails {
  ticker: string;
  name: string;
  market: string;
  locale: string;
  primary_exchange?: string;
  type: string;
  active: boolean;
  currency_name?: string;
  currency_symbol?: string;
}

export interface PolygonSnapshotTicker {
  ticker: string;
  todaysChange: number;
  todaysChangePerc: number;
  updated: number;
  day: {
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
    vw?: number;
  };
  min?: {
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
    vw?: number;
  };
  prevDay: {
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
    vw?: number;
  };
}

// Popular trading pairs/symbols
export const FOREX_PAIRS = [
  { symbol: "C:EURUSD", name: "EUR/USD" },
  { symbol: "C:GBPUSD", name: "GBP/USD" },
  { symbol: "C:USDJPY", name: "USD/JPY" },
  { symbol: "C:USDCHF", name: "USD/CHF" },
  { symbol: "C:AUDUSD", name: "AUD/USD" },
  { symbol: "C:USDCAD", name: "USD/CAD" },
  { symbol: "C:NZDUSD", name: "NZD/USD" },
  { symbol: "C:EURGBP", name: "EUR/GBP" },
  { symbol: "C:EURJPY", name: "EUR/JPY" },
  { symbol: "C:GBPJPY", name: "GBP/JPY" },
];

export const CRYPTO_PAIRS = [
  { symbol: "X:BTCUSD", name: "BTC/USD" },
  { symbol: "X:ETHUSD", name: "ETH/USD" },
  { symbol: "X:SOLUSD", name: "SOL/USD" },
  { symbol: "X:XRPUSD", name: "XRP/USD" },
  { symbol: "X:ADAUSD", name: "ADA/USD" },
  { symbol: "X:DOGEUSD", name: "DOGE/USD" },
  { symbol: "X:AVAXUSD", name: "AVAX/USD" },
  { symbol: "X:LINKUSD", name: "LINK/USD" },
];

export const METALS = [
  { symbol: "C:XAUUSD", name: "Gold/USD" },
  { symbol: "C:XAGUSD", name: "Silver/USD" },
  { symbol: "C:XPTUSD", name: "Platinum/USD" },
  { symbol: "C:XPDUSD", name: "Palladium/USD" },
];

export const POPULAR_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "SPY", name: "S&P 500 ETF" },
  { symbol: "QQQ", name: "Nasdaq 100 ETF" },
];

// Timeframe mapping for Polygon API
export const TIMEFRAME_MAP: Record<Timeframe, { multiplier: number; timespan: string }> = {
  "1m": { multiplier: 1, timespan: "minute" },
  "5m": { multiplier: 5, timespan: "minute" },
  "15m": { multiplier: 15, timespan: "minute" },
  "30m": { multiplier: 30, timespan: "minute" },
  "1h": { multiplier: 1, timespan: "hour" },
  "4h": { multiplier: 4, timespan: "hour" },
  "1d": { multiplier: 1, timespan: "day" },
  "1w": { multiplier: 1, timespan: "week" },
  "1M": { multiplier: 1, timespan: "month" },
};
