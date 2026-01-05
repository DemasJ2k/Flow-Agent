import { NextResponse } from "next/server";
import { getMarketService } from "@/lib/market";

export async function GET() {
  try {
    const isPolygonConfigured = !!process.env.POLYGON_API_KEY;
    const marketService = getMarketService();

    return NextResponse.json({
      enabled: isPolygonConfigured,
      polygonConfigured: isPolygonConfigured,
      availableMarkets: ["forex", "crypto", "metals", "stocks"],
      availableTimeframes: ["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w", "1M"],
    });
  } catch (error) {
    console.error("Market status error:", error);
    return NextResponse.json(
      { error: "Failed to check market status" },
      { status: 500 }
    );
  }
}
