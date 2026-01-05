// Simple in-memory cache for market data

import { AggregateBar } from "./types";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class MarketDataCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL: number = 60 * 1000; // 1 minute default

  /**
   * Get cached data if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache entry with optional TTL
   */
  set<T>(key: string, data: T, ttlMs?: number): void {
    const ttl = ttlMs || this.defaultTTL;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    });
  }

  /**
   * Generate cache key for aggregate data
   */
  static aggregateKey(
    ticker: string,
    timeframe: string,
    from: string,
    to: string
  ): string {
    return `agg:${ticker}:${timeframe}:${from}:${to}`;
  }

  /**
   * Generate cache key for quote data
   */
  static quoteKey(ticker: string): string {
    return `quote:${ticker}`;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache stats
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const marketCache = new MarketDataCache();

// TTL constants for different data types
export const CACHE_TTL = {
  QUOTE: 10 * 1000, // 10 seconds for real-time quotes
  MINUTE_BARS: 60 * 1000, // 1 minute for minute bars
  HOURLY_BARS: 5 * 60 * 1000, // 5 minutes for hourly bars
  DAILY_BARS: 60 * 60 * 1000, // 1 hour for daily bars
  SNAPSHOT: 30 * 1000, // 30 seconds for snapshots
};
