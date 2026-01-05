import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getMarketService, MarketType } from "@/lib/market";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const marketType = searchParams.get("type") as MarketType | null;

    const marketService = getMarketService();

    if (marketType) {
      const symbols = marketService.getAvailableSymbols(marketType);
      return NextResponse.json({ type: marketType, symbols });
    }

    // Return all symbols grouped by type
    return NextResponse.json({
      forex: marketService.getAvailableSymbols("forex"),
      crypto: marketService.getAvailableSymbols("crypto"),
      metals: marketService.getAvailableSymbols("metals"),
      stocks: marketService.getAvailableSymbols("stocks"),
    });
  } catch (error) {
    console.error("Market symbols error:", error);
    return NextResponse.json(
      { error: "Failed to fetch symbols" },
      { status: 500 }
    );
  }
}
