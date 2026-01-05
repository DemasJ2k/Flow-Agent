// ICT Pattern Detection

import type { OHLCV } from "./types";

export interface OrderBlock {
  type: "bullish" | "bearish";
  startIndex: number;
  endIndex: number;
  high: number;
  low: number;
  timestamp: number;
  strength: number; // 0-1 based on move strength
  mitigated: boolean;
}

export interface FairValueGap {
  type: "bullish" | "bearish";
  index: number;
  high: number;
  low: number;
  timestamp: number;
  size: number;
  filled: boolean;
  fillPercent: number;
}

export interface LiquidityPool {
  type: "buy-side" | "sell-side";
  level: number;
  strength: number;
  timestamp: number;
  index: number;
  swept: boolean;
}

export interface SwingPoint {
  type: "high" | "low";
  index: number;
  price: number;
  timestamp: number;
}

/**
 * Detect Order Blocks (supply/demand zones)
 * An Order Block is the last up/down candle before a strong move in the opposite direction
 */
export function detectOrderBlocks(
  data: OHLCV[],
  minMovePercent: number = 0.5,
  lookback: number = 3
): OrderBlock[] {
  const orderBlocks: OrderBlock[] = [];
  if (data.length < lookback + 2) return orderBlocks;

  for (let i = lookback; i < data.length - 1; i++) {
    const currentCandle = data[i];
    const nextCandle = data[i + 1];
    const isBullishCandle = currentCandle.close > currentCandle.open;
    const isBearishCandle = currentCandle.close < currentCandle.open;

    // Check for bullish order block (last bearish candle before strong bullish move)
    if (isBearishCandle) {
      const moveUp = (nextCandle.close - currentCandle.close) / currentCandle.close * 100;
      if (moveUp > minMovePercent) {
        // Verify strong continuation
        let continuation = 0;
        for (let j = i + 1; j < Math.min(i + lookback + 1, data.length); j++) {
          if (data[j].close > data[j].open) continuation++;
        }

        if (continuation >= lookback - 1) {
          // Check if mitigated (price returned to OB zone)
          let mitigated = false;
          for (let j = i + lookback; j < data.length; j++) {
            if (data[j].low <= currentCandle.high) {
              mitigated = true;
              break;
            }
          }

          orderBlocks.push({
            type: "bullish",
            startIndex: i,
            endIndex: i,
            high: currentCandle.high,
            low: currentCandle.low,
            timestamp: currentCandle.timestamp,
            strength: Math.min(moveUp / minMovePercent, 2) / 2,
            mitigated,
          });
        }
      }
    }

    // Check for bearish order block (last bullish candle before strong bearish move)
    if (isBullishCandle) {
      const moveDown = (currentCandle.close - nextCandle.close) / currentCandle.close * 100;
      if (moveDown > minMovePercent) {
        // Verify strong continuation
        let continuation = 0;
        for (let j = i + 1; j < Math.min(i + lookback + 1, data.length); j++) {
          if (data[j].close < data[j].open) continuation++;
        }

        if (continuation >= lookback - 1) {
          // Check if mitigated
          let mitigated = false;
          for (let j = i + lookback; j < data.length; j++) {
            if (data[j].high >= currentCandle.low) {
              mitigated = true;
              break;
            }
          }

          orderBlocks.push({
            type: "bearish",
            startIndex: i,
            endIndex: i,
            high: currentCandle.high,
            low: currentCandle.low,
            timestamp: currentCandle.timestamp,
            strength: Math.min(moveDown / minMovePercent, 2) / 2,
            mitigated,
          });
        }
      }
    }
  }

  return orderBlocks;
}

/**
 * Detect Fair Value Gaps (imbalances)
 * FVG occurs when candle 1's low is higher than candle 3's high (bullish)
 * or candle 1's high is lower than candle 3's low (bearish)
 */
export function detectFairValueGaps(
  data: OHLCV[],
  minGapPercent: number = 0.1
): FairValueGap[] {
  const fvgs: FairValueGap[] = [];
  if (data.length < 3) return fvgs;

  for (let i = 0; i < data.length - 2; i++) {
    const candle1 = data[i];
    const candle2 = data[i + 1];
    const candle3 = data[i + 2];

    // Bullish FVG: Candle 1 high < Candle 3 low
    if (candle1.high < candle3.low) {
      const gapSize = candle3.low - candle1.high;
      const gapPercent = (gapSize / candle2.close) * 100;

      if (gapPercent >= minGapPercent) {
        // Check if filled
        let fillPercent = 0;
        for (let j = i + 3; j < data.length; j++) {
          if (data[j].low <= candle1.high) {
            fillPercent = 100;
            break;
          } else if (data[j].low < candle3.low) {
            const filled = candle3.low - data[j].low;
            fillPercent = Math.max(fillPercent, (filled / gapSize) * 100);
          }
        }

        fvgs.push({
          type: "bullish",
          index: i + 1,
          high: candle3.low,
          low: candle1.high,
          timestamp: candle2.timestamp,
          size: gapSize,
          filled: fillPercent >= 100,
          fillPercent: Math.min(fillPercent, 100),
        });
      }
    }

    // Bearish FVG: Candle 1 low > Candle 3 high
    if (candle1.low > candle3.high) {
      const gapSize = candle1.low - candle3.high;
      const gapPercent = (gapSize / candle2.close) * 100;

      if (gapPercent >= minGapPercent) {
        // Check if filled
        let fillPercent = 0;
        for (let j = i + 3; j < data.length; j++) {
          if (data[j].high >= candle1.low) {
            fillPercent = 100;
            break;
          } else if (data[j].high > candle3.high) {
            const filled = data[j].high - candle3.high;
            fillPercent = Math.max(fillPercent, (filled / gapSize) * 100);
          }
        }

        fvgs.push({
          type: "bearish",
          index: i + 1,
          high: candle1.low,
          low: candle3.high,
          timestamp: candle2.timestamp,
          size: gapSize,
          filled: fillPercent >= 100,
          fillPercent: Math.min(fillPercent, 100),
        });
      }
    }
  }

  return fvgs;
}

/**
 * Detect Swing Highs and Lows
 */
export function detectSwingPoints(
  data: OHLCV[],
  lookback: number = 5
): SwingPoint[] {
  const swingPoints: SwingPoint[] = [];
  if (data.length < lookback * 2 + 1) return swingPoints;

  for (let i = lookback; i < data.length - lookback; i++) {
    const currentHigh = data[i].high;
    const currentLow = data[i].low;

    // Check for swing high
    let isSwingHigh = true;
    for (let j = i - lookback; j <= i + lookback; j++) {
      if (j !== i && data[j].high >= currentHigh) {
        isSwingHigh = false;
        break;
      }
    }

    if (isSwingHigh) {
      swingPoints.push({
        type: "high",
        index: i,
        price: currentHigh,
        timestamp: data[i].timestamp,
      });
    }

    // Check for swing low
    let isSwingLow = true;
    for (let j = i - lookback; j <= i + lookback; j++) {
      if (j !== i && data[j].low <= currentLow) {
        isSwingLow = false;
        break;
      }
    }

    if (isSwingLow) {
      swingPoints.push({
        type: "low",
        index: i,
        price: currentLow,
        timestamp: data[i].timestamp,
      });
    }
  }

  return swingPoints.sort((a, b) => a.index - b.index);
}

/**
 * Detect Liquidity Pools (areas with multiple swing highs/lows)
 */
export function detectLiquidityPools(
  data: OHLCV[],
  swingLookback: number = 5,
  clusterThreshold: number = 0.1 // % price difference to cluster
): LiquidityPool[] {
  const swingPoints = detectSwingPoints(data, swingLookback);
  const pools: LiquidityPool[] = [];

  // Group swing highs
  const swingHighs = swingPoints.filter((p) => p.type === "high");
  const swingLows = swingPoints.filter((p) => p.type === "low");

  // Cluster swing highs into liquidity pools
  const highClusters = clusterLevels(
    swingHighs.map((p) => p.price),
    clusterThreshold
  );

  highClusters.forEach((cluster) => {
    if (cluster.count >= 2) {
      // Check if swept
      const lastSwingIndex = swingHighs.find(
        (p) => Math.abs(p.price - cluster.level) / cluster.level <= clusterThreshold / 100
      )?.index || 0;

      let swept = false;
      for (let i = lastSwingIndex + 1; i < data.length; i++) {
        if (data[i].high > cluster.level) {
          swept = true;
          break;
        }
      }

      pools.push({
        type: "buy-side",
        level: cluster.level,
        strength: cluster.count / swingHighs.length,
        timestamp: data[lastSwingIndex]?.timestamp || 0,
        index: lastSwingIndex,
        swept,
      });
    }
  });

  // Cluster swing lows into liquidity pools
  const lowClusters = clusterLevels(
    swingLows.map((p) => p.price),
    clusterThreshold
  );

  lowClusters.forEach((cluster) => {
    if (cluster.count >= 2) {
      const lastSwingIndex = swingLows.find(
        (p) => Math.abs(p.price - cluster.level) / cluster.level <= clusterThreshold / 100
      )?.index || 0;

      let swept = false;
      for (let i = lastSwingIndex + 1; i < data.length; i++) {
        if (data[i].low < cluster.level) {
          swept = true;
          break;
        }
      }

      pools.push({
        type: "sell-side",
        level: cluster.level,
        strength: cluster.count / swingLows.length,
        timestamp: data[lastSwingIndex]?.timestamp || 0,
        index: lastSwingIndex,
        swept,
      });
    }
  });

  return pools;
}

/**
 * Helper function to cluster price levels
 */
function clusterLevels(
  prices: number[],
  thresholdPercent: number
): { level: number; count: number }[] {
  if (prices.length === 0) return [];

  const sorted = [...prices].sort((a, b) => a - b);
  const clusters: { level: number; count: number }[] = [];
  let currentCluster = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const avgLevel = currentCluster.reduce((a, b) => a + b, 0) / currentCluster.length;
    const diff = Math.abs(sorted[i] - avgLevel) / avgLevel * 100;

    if (diff <= thresholdPercent) {
      currentCluster.push(sorted[i]);
    } else {
      clusters.push({
        level: currentCluster.reduce((a, b) => a + b, 0) / currentCluster.length,
        count: currentCluster.length,
      });
      currentCluster = [sorted[i]];
    }
  }

  // Don't forget the last cluster
  if (currentCluster.length > 0) {
    clusters.push({
      level: currentCluster.reduce((a, b) => a + b, 0) / currentCluster.length,
      count: currentCluster.length,
    });
  }

  return clusters;
}

/**
 * Analyze market structure
 */
export function analyzeMarketStructure(data: OHLCV[]): {
  trend: "bullish" | "bearish" | "ranging";
  swingPoints: SwingPoint[];
  higherHighs: boolean;
  higherLows: boolean;
  lowerHighs: boolean;
  lowerLows: boolean;
} {
  const swingPoints = detectSwingPoints(data, 3);
  const highs = swingPoints.filter((p) => p.type === "high");
  const lows = swingPoints.filter((p) => p.type === "low");

  let higherHighs = false;
  let higherLows = false;
  let lowerHighs = false;
  let lowerLows = false;

  // Check recent swing highs
  if (highs.length >= 2) {
    const recentHighs = highs.slice(-3);
    higherHighs = recentHighs.every(
      (h, i) => i === 0 || h.price > recentHighs[i - 1].price
    );
    lowerHighs = recentHighs.every(
      (h, i) => i === 0 || h.price < recentHighs[i - 1].price
    );
  }

  // Check recent swing lows
  if (lows.length >= 2) {
    const recentLows = lows.slice(-3);
    higherLows = recentLows.every(
      (l, i) => i === 0 || l.price > recentLows[i - 1].price
    );
    lowerLows = recentLows.every(
      (l, i) => i === 0 || l.price < recentLows[i - 1].price
    );
  }

  let trend: "bullish" | "bearish" | "ranging" = "ranging";
  if (higherHighs && higherLows) trend = "bullish";
  else if (lowerHighs && lowerLows) trend = "bearish";

  return {
    trend,
    swingPoints,
    higherHighs,
    higherLows,
    lowerHighs,
    lowerLows,
  };
}
