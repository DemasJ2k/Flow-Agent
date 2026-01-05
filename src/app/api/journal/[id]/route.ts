import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

// GET - Get single journal entry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const entry = await prisma.journalEntry.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!entry) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...entry,
      tags: JSON.parse(entry.tags || "[]"),
    });
  } catch (error) {
    console.error("Journal get error:", error);
    return NextResponse.json(
      { error: "Failed to fetch journal entry" },
      { status: 500 }
    );
  }
}

// PUT - Update journal entry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.journalEntry.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      );
    }

    const {
      title,
      content,
      tags,
      entryType,
      mood,
      symbol,
      tradeDirection,
      outcome,
      pnl,
      conversationId,
    } = body;

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);
    if (entryType !== undefined) updateData.entryType = entryType;
    if (mood !== undefined) updateData.mood = mood;
    if (symbol !== undefined) updateData.symbol = symbol;
    if (tradeDirection !== undefined) updateData.tradeDirection = tradeDirection;
    if (outcome !== undefined) updateData.outcome = outcome;
    if (pnl !== undefined) updateData.pnl = pnl ? parseFloat(pnl) : null;
    if (conversationId !== undefined) updateData.conversationId = conversationId;

    const entry = await prisma.journalEntry.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      ...entry,
      tags: JSON.parse(entry.tags || "[]"),
    });
  } catch (error) {
    console.error("Journal update error:", error);
    return NextResponse.json(
      { error: "Failed to update journal entry" },
      { status: 500 }
    );
  }
}

// DELETE - Delete journal entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existing = await prisma.journalEntry.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      );
    }

    await prisma.journalEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Journal delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete journal entry" },
      { status: 500 }
    );
  }
}
