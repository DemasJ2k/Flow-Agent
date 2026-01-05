import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getMarketService, Timeframe } from "@/lib/market";
import {
  detectOrderBlocks,
  detectFairValueGaps,
  detectLiquidityPools,
  analyzeMarketStructure,
} from "@/lib/market/patterns";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const ticker = searchParams.get("ticker");
    const timeframe = searchParams.get("timeframe") as Timeframe;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!ticker) {
      return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
    }

    if (!timeframe) {
      return NextResponse.json({ error: "Timeframe is required" }, { status: 400 });
    }

    const marketService = getMarketService();

    if (!marketService.isConfigured()) {
      return NextResponse.json(
        { error: "Market data API not configured" },
        { status: 400 }
      );
    }

    // Default date range based on timeframe
    const toDate = to ? new Date(to) : new Date();
    let fromDate: Date;

    if (from) {
      fromDate = new Date(from);
    } else {
      fromDate = new Date();
      switch (timeframe) {
        case "1m":
        case "5m":
          fromDate.setDate(fromDate.getDate() - 2);
          break;
        case "15m":
        case "30m":
          fromDate.setDate(fromDate.getDate() - 7);
          break;
        case "1h":
        case "4h":
          fromDate.setDate(fromDate.getDate() - 30);
          break;
        default:
          fromDate.setDate(fromDate.getDate() - 90);
      }
    }

    const data = await marketService.getOHLCV(ticker, timeframe, fromDate, toDate);

    if (data.length === 0) {
      return NextResponse.json({ error: "No data available for analysis" }, { status: 404 });
    }

    // Detect ICT patterns
    const orderBlocks = detectOrderBlocks(data);
    const fairValueGaps = detectFairValueGaps(data);
    const liquidityPools = detectLiquidityPools(data);
    const marketStructure = analyzeMarketStructure(data);

    return NextResponse.json({
      ticker,
      timeframe,
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
      candleCount: data.length,
      patterns: {
        orderBlocks: {
          bullish: orderBlocks.filter((ob) => ob.type === "bullish"),
          bearish: orderBlocks.filter((ob) => ob.type === "bearish"),
        },
        fairValueGaps: {
          bullish: fairValueGaps.filter((fvg) => fvg.type === "bullish"),
          bearish: fairValueGaps.filter((fvg) => fvg.type === "bearish"),
          unfilled: fairValueGaps.filter((fvg) => !fvg.filled),
        },
        liquidityPools: {
          buySide: liquidityPools.filter((lp) => lp.type === "buy-side"),
          sellSide: liquidityPools.filter((lp) => lp.type === "sell-side"),
          unswept: liquidityPools.filter((lp) => !lp.swept),
        },
        marketStructure,
      },
    });
  } catch (error) {
    console.error("Pattern detection error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to detect patterns" },
      { status: 500 }
    );
  }
}
