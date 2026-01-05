import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

// POST - Create journal entry from AI conversation
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId, title, tags = [], entryType = "analysis" } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required" },
        { status: 400 }
      );
    }

    // Fetch the conversation with messages
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId: session.user.id,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Format the conversation content
    const content = conversation.messages
      .map((msg) => {
        const role = msg.role === "user" ? "You" : "AI";
        return `**${role}:**\n${msg.content}`;
      })
      .join("\n\n---\n\n");

    // Create the journal entry
    const entry = await prisma.journalEntry.create({
      data: {
        title: title || conversation.title || "AI Conversation",
        content,
        tags: JSON.stringify(["ai-conversation", ...tags]),
        entryType,
        conversationId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      ...entry,
      tags: JSON.parse(entry.tags),
    });
  } catch (error) {
    console.error("Journal from conversation error:", error);
    return NextResponse.json(
      { error: "Failed to create journal entry from conversation" },
      { status: 500 }
    );
  }
}
