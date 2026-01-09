import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

// GET - List tools with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const toolType = searchParams.get("toolType");
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

    if (toolType) {
      where.toolType = toolType;
    }

    const tools = await prisma.tool.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    // Parse JSON fields and apply tag filter
    let filteredTools = tools.map((t) => ({
      ...t,
      tags: JSON.parse(t.tags),
    }));

    if (tag) {
      filteredTools = filteredTools.filter((t) => t.tags.includes(tag));
    }

    return NextResponse.json({ tools: filteredTools });
  } catch (error) {
    console.error("Tools list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tools" },
      { status: 500 }
    );
  }
}

// POST - Create new tool
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
      url,
      toolType = "indicator",
    } = body;

    if (!name || !content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 }
      );
    }

    const tool = await prisma.tool.create({
      data: {
        name,
        description,
        content,
        category,
        tags: JSON.stringify(tags),
        url,
        toolType,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      ...tool,
      tags: JSON.parse(tool.tags),
    });
  } catch (error) {
    console.error("Tool create error:", error);
    return NextResponse.json(
      { error: "Failed to create tool" },
      { status: 500 }
    );
  }
}
