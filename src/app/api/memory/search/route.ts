import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getMemoryService } from "@/lib/memory";
import type { MemoryNamespace } from "@/lib/memory";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if Pinecone is configured
    if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME) {
      return NextResponse.json(
        { error: "Memory system not configured" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { query, namespace, topK = 5 } = body;

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    if (!namespace) {
      return NextResponse.json(
        { error: "Namespace is required" },
        { status: 400 }
      );
    }

    const memoryService = getMemoryService();
    const results = await memoryService.search(
      query,
      namespace as MemoryNamespace,
      session.user.id,
      topK
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Memory search error:", error);
    return NextResponse.json(
      { error: "Failed to search memory" },
      { status: 500 }
    );
  }
}
