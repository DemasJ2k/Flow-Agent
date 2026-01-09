import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

// GET - Get journal statistics
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");

    // Build date filter
    const dateFilter: Record<string, Date> = {};
    if (fromDate) {
      dateFilter.gte = new Date(fromDate);
    }
    if (toDate) {
      dateFilter.lte = new Date(toDate);
    }

    const where = {
      userId: session.user.id,
      ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}),
    };

    // Get all entries for statistics
    const entries = await prisma.journalEntry.findMany({
      where,
      select: {
        entryType: true,
        mood: true,
        outcome: true,
        pnl: true,
        tags: true,
        createdAt: true,
      },
    });

    // Calculate statistics
    const totalEntries = entries.length;

    // Entry type breakdown
    const entryTypeBreakdown = entries.reduce((acc, entry) => {
      acc[entry.entryType] = (acc[entry.entryType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Mood breakdown
    const moodBreakdown = entries.reduce((acc, entry) => {
      if (entry.mood) {
        acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Trade outcome breakdown
    const tradeEntries = entries.filter((e) => e.entryType === "trade");
    const outcomeBreakdown = tradeEntries.reduce((acc, entry) => {
      if (entry.outcome) {
        acc[entry.outcome] = (acc[entry.outcome] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // P&L statistics
    const pnlEntries = entries.filter((e) => e.pnl !== null);
    const totalPnl = pnlEntries.reduce((sum, e) => sum + (e.pnl || 0), 0);
    const winningTrades = pnlEntries.filter((e) => (e.pnl || 0) > 0);
    const losingTrades = pnlEntries.filter((e) => (e.pnl || 0) < 0);
    const avgWin = winningTrades.length > 0
      ? winningTrades.reduce((sum, e) => sum + (e.pnl || 0), 0) / winningTrades.length
      : 0;
    const avgLoss = losingTrades.length > 0
      ? Math.abs(losingTrades.reduce((sum, e) => sum + (e.pnl || 0), 0) / losingTrades.length)
      : 0;
    const winRate = pnlEntries.length > 0
      ? (winningTrades.length / pnlEntries.length) * 100
      : 0;

    // Tag usage
    const tagUsage = entries.reduce((acc, entry) => {
      const tags = JSON.parse(entry.tags || "[]") as string[];
      tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Entries per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEntries = entries.filter(
      (e) => e.createdAt >= thirtyDaysAgo
    );
    const entriesPerDay = recentEntries.reduce((acc, entry) => {
      const day = entry.createdAt.toISOString().split("T")[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Current streak (consecutive days with entries)
    const sortedDates = [...new Set(
      entries.map((e) => e.createdAt.toISOString().split("T")[0])
    )].sort().reverse();

    let streak = 0;
    const today = new Date().toISOString().split("T")[0];
    const checkDate = new Date(today);

    for (let i = 0; i < sortedDates.length; i++) {
      const currentDateStr = checkDate.toISOString().split("T")[0];
      if (sortedDates.includes(currentDateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0 && currentDateStr !== sortedDates[0]) {
        // Allow for yesterday being the last entry
        checkDate.setDate(checkDate.getDate() - 1);
        if (sortedDates.includes(checkDate.toISOString().split("T")[0])) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return NextResponse.json({
      totalEntries,
      entryTypeBreakdown,
      moodBreakdown,
      trading: {
        totalTrades: tradeEntries.length,
        outcomeBreakdown,
        totalPnl,
        avgWin,
        avgLoss,
        winRate,
        profitFactor: avgLoss > 0 ? avgWin / avgLoss : 0,
      },
      tagUsage,
      entriesPerDay,
      currentStreak: streak,
    });
  } catch (error) {
    console.error("Journal stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal statistics" },
      { status: 500 }
    );
  }
}
