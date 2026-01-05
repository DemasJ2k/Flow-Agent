import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

// GET - List journal entries with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search");
    const entryType = searchParams.get("type");
    const tag = searchParams.get("tag");
    const mood = searchParams.get("mood");
    const outcome = searchParams.get("outcome");
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (entryType) {
      where.entryType = entryType;
    }

    if (mood) {
      where.mood = mood;
    }

    if (outcome) {
      where.outcome = outcome;
    }

    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) {
        (where.createdAt as Record<string, Date>).gte = new Date(fromDate);
      }
      if (toDate) {
        (where.createdAt as Record<string, Date>).lte = new Date(toDate);
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    // Tag filtering (tags stored as JSON string)
    if (tag) {
      where.tags = { contains: tag };
    }

    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.journalEntry.count({ where }),
    ]);

    // Parse tags from JSON string
    const parsedEntries = entries.map((entry) => ({
      ...entry,
      tags: JSON.parse(entry.tags || "[]"),
    }));

    return NextResponse.json({
      entries: parsedEntries,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Journal list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entries" },
      { status: 500 }
    );
  }
}

// POST - Create new journal entry
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      content,
      tags = [],
      entryType = "general",
      mood,
      symbol,
      tradeDirection,
      outcome,
      pnl,
      conversationId,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const entry = await prisma.journalEntry.create({
      data: {
        title,
        content,
        tags: JSON.stringify(tags),
        entryType,
        mood,
        symbol,
        tradeDirection,
        outcome,
        pnl: pnl ? parseFloat(pnl) : null,
        conversationId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      ...entry,
      tags: JSON.parse(entry.tags),
    });
  } catch (error) {
    console.error("Journal create error:", error);
    return NextResponse.json(
      { error: "Failed to create journal entry" },
      { status: 500 }
    );
  }
}
