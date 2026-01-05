import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getMarketService, Timeframe, MarketType } from "@/lib/market";

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
        { error: "Market data API not configured. Please add POLYGON_API_KEY to environment variables." },
        { status: 400 }
      );
    }

    // Default date range: last 30 days for daily, last 7 days for smaller timeframes
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
        case "1d":
          fromDate.setFullYear(fromDate.getFullYear() - 1);
          break;
        case "1w":
          fromDate.setFullYear(fromDate.getFullYear() - 3);
          break;
        case "1M":
          fromDate.setFullYear(fromDate.getFullYear() - 10);
          break;
        default:
          fromDate.setDate(fromDate.getDate() - 30);
      }
    }

    const data = await marketService.getOHLCV(ticker, timeframe, fromDate, toDate);

    return NextResponse.json({
      ticker,
      timeframe,
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Market OHLCV error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
