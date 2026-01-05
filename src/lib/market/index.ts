// Market Data Service

import { getPolygonClient, PolygonClient } from "./polygon";
import { marketCache, CACHE_TTL, MarketDataCache } from "./cache";
import {
  AggregateBar,
  OHLCV,
  Timeframe,
  MarketType,
  FOREX_PAIRS,
  CRYPTO_PAIRS,
  METALS,
  POPULAR_STOCKS,
} from "./types";

export * from "./types";
export { getPolygonClient } from "./polygon";
export { marketCache, CACHE_TTL } from "./cache";

export class MarketDataService {
  private polygon: PolygonClient;

  constructor() {
    this.polygon = getPolygonClient();
  }

  /**
   * Get OHLCV data for charting
   */
  async getOHLCV(
    ticker: string,
    timeframe: Timeframe,
    from: Date,
    to: Date
  ): Promise<OHLCV[]> {
    const cacheKey = MarketDataCache.aggregateKey(
      ticker,
      timeframe,
      from.toISOString().split("T")[0],
      to.toISOString().split("T")[0]
    );

    // Check cache first
    const cached = marketCache.get<AggregateBar[]>(cacheKey);
    if (cached) {
      return cached.map(PolygonClient.toOHLCV);
    }

    // Fetch from API
    const bars = await this.polygon.getAggregates(ticker, timeframe, from, to);

    // Determine TTL based on timeframe
    const ttl = this.getTTLForTimeframe(timeframe);
    marketCache.set(cacheKey, bars, ttl);

    return bars.map(PolygonClient.toOHLCV);
  }

  /**
   * Get current price for a ticker
   */
  async getCurrentPrice(
    ticker: string,
    marketType: MarketType
  ): Promise<{ price: number; change?: number; changePercent?: number } | null> {
    const cacheKey = MarketDataCache.quoteKey(ticker);

    // Check cache
    const cached = marketCache.get<{ price: number; change?: number; changePercent?: number }>(cacheKey);
    if (cached) {
      return cached;
    }

    let result: { price: number; change?: number; changePercent?: number } | null = null;

    try {
      if (marketType === "forex" || marketType === "metals") {
        // Parse forex/metals ticker (e.g., C:EURUSD -> EUR, USD)
        const cleaned = ticker.replace("C:", "");
        const from = cleaned.slice(0, 3);
        const to = cleaned.slice(3, 6);
        const quote = await this.polygon.getForexQuote(from, to);
        if (quote) {
          result = { price: quote.last };
        }
      } else if (marketType === "crypto") {
        // Parse crypto ticker (e.g., X:BTCUSD -> BTC, USD)
        const cleaned = ticker.replace("X:", "");
        const from = cleaned.slice(0, -3);
        const to = cleaned.slice(-3);
        const quote = await this.polygon.getCryptoQuote(from, to);
        if (quote) {
          result = { price: quote.last };
        }
      } else if (marketType === "stocks") {
        const snapshot = await this.polygon.getStockSnapshot(ticker);
        if (snapshot) {
          result = {
            price: snapshot.price,
            change: snapshot.change,
            changePercent: snapshot.changePercent,
          };
        }
      }

      if (result) {
        marketCache.set(cacheKey, result, CACHE_TTL.QUOTE);
      }

      return result;
    } catch (error) {
      console.error(`Error fetching price for ${ticker}:`, error);
      return null;
    }
  }

  /**
   * Get previous close data
   */
  async getPreviousClose(ticker: string): Promise<AggregateBar | null> {
    const cacheKey = `prevClose:${ticker}`;

    const cached = marketCache.get<AggregateBar>(cacheKey);
    if (cached) {
      return cached;
    }

    const prevClose = await this.polygon.getPreviousClose(ticker);
    if (prevClose) {
      marketCache.set(cacheKey, prevClose, CACHE_TTL.DAILY_BARS);
    }

    return prevClose;
  }

  /**
   * Get available symbols for a market type
   */
  getAvailableSymbols(marketType: MarketType): { symbol: string; name: string }[] {
    switch (marketType) {
      case "forex":
        return FOREX_PAIRS;
      case "crypto":
        return CRYPTO_PAIRS;
      case "metals":
        return METALS;
      case "stocks":
        return POPULAR_STOCKS;
      default:
        return [];
    }
  }

  /**
   * Check if Polygon is configured
   */
  isConfigured(): boolean {
    return this.polygon.isConfigured();
  }

  /**
   * Get appropriate TTL for timeframe
   */
  private getTTLForTimeframe(timeframe: Timeframe): number {
    switch (timeframe) {
      case "1m":
      case "5m":
        return CACHE_TTL.MINUTE_BARS;
      case "15m":
      case "30m":
      case "1h":
      case "4h":
        return CACHE_TTL.HOURLY_BARS;
      case "1d":
      case "1w":
      case "1M":
        return CACHE_TTL.DAILY_BARS;
      default:
        return CACHE_TTL.MINUTE_BARS;
    }
  }
}

// Singleton instance
let marketService: MarketDataService | null = null;

export function getMarketService(): MarketDataService {
  if (!marketService) {
    marketService = new MarketDataService();
  }
  return marketService;
}
