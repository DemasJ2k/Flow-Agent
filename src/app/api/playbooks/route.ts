import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

// GET - List playbooks with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const strategyId = searchParams.get("strategyId");
    const tag = searchParams.get("tag");

    const where: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (strategyId) {
      where.strategyId = strategyId;
    }

    const playbooks = await prisma.playbook.findMany({
      where,
      include: {
        strategy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Parse JSON fields and apply tag filter
    let filteredPlaybooks = playbooks.map((p) => ({
      ...p,
      steps: JSON.parse(p.steps),
      tags: JSON.parse(p.tags),
    }));

    if (tag) {
      filteredPlaybooks = filteredPlaybooks.filter((p) => p.tags.includes(tag));
    }

    return NextResponse.json({ playbooks: filteredPlaybooks });
  } catch (error) {
    console.error("Playbooks list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch playbooks" },
      { status: 500 }
    );
  }
}

// POST - Create new playbook
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
      steps = [],
      category = "General",
      tags = [],
      strategyId,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
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

    const playbook = await prisma.playbook.create({
      data: {
        name,
        description,
        steps: JSON.stringify(steps),
        category,
        tags: JSON.stringify(tags),
        strategyId,
        userId: session.user.id,
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
    console.error("Playbook create error:", error);
    return NextResponse.json(
      { error: "Failed to create playbook" },
      { status: 500 }
    );
  }
}
