import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

// GET - Get single playbook
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

    const playbook = await prisma.playbook.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        strategy: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    });

    if (!playbook) {
      return NextResponse.json(
        { error: "Playbook not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...playbook,
      steps: JSON.parse(playbook.steps),
      tags: JSON.parse(playbook.tags),
    });
  } catch (error) {
    console.error("Playbook get error:", error);
    return NextResponse.json(
      { error: "Failed to fetch playbook" },
      { status: 500 }
    );
  }
}

// PUT - Update playbook
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
    const { name, description, steps, category, tags, strategyId } = body;

    // Verify ownership
    const existing = await prisma.playbook.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Playbook not found" },
        { status: 404 }
      );
    }

    // Verify strategy ownership if provided
    if (strategyId) {
      const strategy = await prisma.strategy.findFirst({
        where: { id: strategyId, userId: session.user.id },
      });
      if (!strategy) {
        return NextResponse.json(
          { error: "Strategy not found" },
          { status: 404 }
        );
      }
    }

    const playbook = await prisma.playbook.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(steps !== undefined && { steps: JSON.stringify(steps) }),
        ...(category !== undefined && { category }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(strategyId !== undefined && { strategyId }),
      },
      include: {
        strategy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...playbook,
      steps: JSON.parse(playbook.steps),
      tags: JSON.parse(playbook.tags),
    });
  } catch (error) {
    console.error("Playbook update error:", error);
    return NextResponse.json(
      { error: "Failed to update playbook" },
      { status: 500 }
    );
  }
}

// DELETE - Delete playbook
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
    const existing = await prisma.playbook.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Playbook not found" },
        { status: 404 }
      );
    }

    await prisma.playbook.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Playbook delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete playbook" },
      { status: 500 }
    );
  }
}
