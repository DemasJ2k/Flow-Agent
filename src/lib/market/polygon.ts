// Polygon.io API Client

import {
  PolygonAggregateResponse,
  PolygonBar,
  AggregateBar,
  OHLCV,
  Timeframe,
  TIMEFRAME_MAP,
} from "./types";

const POLYGON_BASE_URL = "https://api.polygon.io";

export class PolygonClient {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.POLYGON_API_KEY || "";
    if (!this.apiKey) {
      console.warn("Polygon API key not configured");
    }
  }

  private async fetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${POLYGON_BASE_URL}${endpoint}`);
    url.searchParams.set("apiKey", this.apiKey);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Polygon API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Get aggregate bars for a ticker
   */
  async getAggregates(
    ticker: string,
    timeframe: Timeframe,
    from: Date,
    to: Date,
    adjusted: boolean = true
  ): Promise<AggregateBar[]> {
    const { multiplier, timespan } = TIMEFRAME_MAP[timeframe];
    const fromStr = from.toISOString().split("T")[0];
    const toStr = to.toISOString().split("T")[0];

    const endpoint = `/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${fromStr}/${toStr}`;

    const response = await this.fetch<PolygonAggregateResponse>(endpoint, {
      adjusted: adjusted.toString(),
      sort: "asc",
      limit: "5000",
    });

    if (!response.results) {
      return [];
    }

    return response.results.map((bar) => this.transformBar(ticker, bar));
  }

  /**
   * Get previous day's OHLCV for a ticker
   */
  async getPreviousClose(ticker: string, adjusted: boolean = true): Promise<AggregateBar | null> {
    const endpoint = `/v2/aggs/ticker/${ticker}/prev`;

    const response = await this.fetch<PolygonAggregateResponse>(endpoint, {
      adjusted: adjusted.toString(),
    });

    if (!response.results || response.results.length === 0) {
      return null;
    }

    return this.transformBar(ticker, response.results[0]);
  }

  /**
   * Get real-time quote for forex/crypto
   */
  async getForexQuote(from: string, to: string): Promise<{ last: number; timestamp: number } | null> {
    const endpoint = `/v1/last_quote/currencies/${from}/${to}`;

    try {
      const response = await this.fetch<{
        last: { ask: number; bid: number; timestamp: number };
        status: string;
      }>(endpoint);

      if (response.status !== "success") {
        return null;
      }

      return {
        last: (response.last.ask + response.last.bid) / 2,
        timestamp: response.last.timestamp,
      };
    } catch {
      return null;
    }
  }

  /**
   * Get real-time quote for crypto
   */
  async getCryptoQuote(from: string, to: string): Promise<{ last: number; timestamp: number } | null> {
    const endpoint = `/v1/last/crypto/${from}/${to}`;

    try {
      const response = await this.fetch<{
        last: { price: number; timestamp: number };
        status: string;
      }>(endpoint);

      if (response.status !== "success") {
        return null;
      }

      return {
        last: response.last.price,
        timestamp: response.last.timestamp,
      };
    } catch {
      return null;
    }
  }

  /**
   * Get snapshot for stocks
   */
  async getStockSnapshot(ticker: string): Promise<{
    price: number;
    change: number;
    changePercent: number;
    volume: number;
  } | null> {
    const endpoint = `/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}`;

    try {
      const response = await this.fetch<{
        ticker: {
          day: { c: number; v: number };
          todaysChange: number;
          todaysChangePerc: number;
        };
        status: string;
      }>(endpoint);

      if (response.status !== "OK") {
        return null;
      }

      return {
        price: response.ticker.day.c,
        change: response.ticker.todaysChange,
        changePercent: response.ticker.todaysChangePerc,
        volume: response.ticker.day.v,
      };
    } catch {
      return null;
    }
  }

  /**
   * Transform Polygon bar to our format
   */
  private transformBar(ticker: string, bar: PolygonBar): AggregateBar {
    return {
      ticker,
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v,
      vwap: bar.vw,
      timestamp: bar.t,
      transactions: bar.n,
    };
  }

  /**
   * Convert AggregateBar to OHLCV format for charts
   */
  static toOHLCV(bar: AggregateBar): OHLCV {
    return {
      timestamp: bar.timestamp,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
      volume: bar.volume,
    };
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// Singleton instance
let polygonClient: PolygonClient | null = null;

export function getPolygonClient(): PolygonClient {
  if (!polygonClient) {
    polygonClient = new PolygonClient();
  }
  return polygonClient;
}
