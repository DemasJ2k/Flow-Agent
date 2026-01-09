import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

// GET - List strategies with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const market = searchParams.get("market");
    const timeframe = searchParams.get("timeframe");
    const riskLevel = searchParams.get("riskLevel");
    const tag = searchParams.get("tag");

    const where: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { content: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (riskLevel) {
      where.riskLevel = riskLevel;
    }

    const strategies = await prisma.strategy.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    // Parse JSON fields and apply additional filters
    let filteredStrategies = strategies.map((s) => ({
      ...s,
      tags: JSON.parse(s.tags),
      timeframes: JSON.parse(s.timeframes),
      markets: JSON.parse(s.markets),
    }));

    if (market) {
      filteredStrategies = filteredStrategies.filter((s) =>
        s.markets.includes(market)
      );
    }

    if (timeframe) {
      filteredStrategies = filteredStrategies.filter((s) =>
        s.timeframes.includes(timeframe)
      );
    }

    if (tag) {
      filteredStrategies = filteredStrategies.filter((s) =>
        s.tags.includes(tag)
      );
    }

    return NextResponse.json({ strategies: filteredStrategies });
  } catch (error) {
    console.error("Strategies list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch strategies" },
      { status: 500 }
    );
  }
}

// POST - Create new strategy
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      content,
      category = "General",
      tags = [],
      timeframes = [],
      markets = [],
      riskLevel = "medium",
      isPublic = false,
    } = body;

    if (!name || !content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 }
      );
    }

    const strategy = await prisma.strategy.create({
      data: {
        name,
        description,
        content,
        category,
        tags: JSON.stringify(tags),
        timeframes: JSON.stringify(timeframes),
        markets: JSON.stringify(markets),
        riskLevel,
        isPublic,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      ...strategy,
      tags: JSON.parse(strategy.tags),
      timeframes: JSON.parse(strategy.timeframes),
      markets: JSON.parse(strategy.markets),
    });
  } catch (error) {
    console.error("Strategy create error:", error);
    return NextResponse.json(
      { error: "Failed to create strategy" },
      { status: 500 }
    );
  }
}
