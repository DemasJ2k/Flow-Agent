import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

// GET - Get single strategy
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

    const strategy = await prisma.strategy.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        playbooks: true,
      },
    });

    if (!strategy) {
      return NextResponse.json(
        { error: "Strategy not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...strategy,
      tags: JSON.parse(strategy.tags),
      timeframes: JSON.parse(strategy.timeframes),
      markets: JSON.parse(strategy.markets),
      playbooks: strategy.playbooks.map((p) => ({
        ...p,
        steps: JSON.parse(p.steps),
        tags: JSON.parse(p.tags),
      })),
    });
  } catch (error) {
    console.error("Strategy get error:", error);
    return NextResponse.json(
      { error: "Failed to fetch strategy" },
      { status: 500 }
    );
  }
}

// PUT - Update strategy
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
    const {
      name,
      description,
      content,
      category,
      tags,
      timeframes,
      markets,
      riskLevel,
      isPublic,
    } = body;

    // Verify ownership
    const existing = await prisma.strategy.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Strategy not found" },
        { status: 404 }
      );
    }

    const strategy = await prisma.strategy.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(timeframes !== undefined && { timeframes: JSON.stringify(timeframes) }),
        ...(markets !== undefined && { markets: JSON.stringify(markets) }),
        ...(riskLevel !== undefined && { riskLevel }),
        ...(isPublic !== undefined && { isPublic }),
      },
    });

    return NextResponse.json({
      ...strategy,
      tags: JSON.parse(strategy.tags),
      timeframes: JSON.parse(strategy.timeframes),
      markets: JSON.parse(strategy.markets),
    });
  } catch (error) {
    console.error("Strategy update error:", error);
    return NextResponse.json(
      { error: "Failed to update strategy" },
      { status: 500 }
    );
  }
}

// DELETE - Delete strategy
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
    const existing = await prisma.strategy.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Strategy not found" },
        { status: 404 }
      );
    }

    await prisma.strategy.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Strategy delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete strategy" },
      { status: 500 }
    );
  }
}
