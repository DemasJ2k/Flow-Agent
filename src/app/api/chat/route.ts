import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getAIProvider, AIProvider, Message } from "@/lib/ai";
import { getSystemPromptWithContext } from "@/lib/ai/prompts";
import { getMemoryService } from "@/lib/memory";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const {
      messages,
      provider = "anthropic",
      conversationId,
      useMemory = true,
    } = body as {
      messages: Message[];
      provider: AIProvider;
      conversationId?: string;
      useMemory?: boolean;
    };

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if API key is configured
    const apiKey =
      provider === "anthropic"
        ? process.env.ANTHROPIC_API_KEY
        : process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: `Provider API key not configured`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get relevant context from memory if enabled and Pinecone is configured
    let contextFromMemory = "";
    const isPineconeConfigured = process.env.PINECONE_API_KEY && process.env.PINECONE_INDEX_NAME;

    if (useMemory && isPineconeConfigured) {
      try {
        const memoryService = getMemoryService();
        const lastUserMessage = messages.filter((m) => m.role === "user").pop();

        if (lastUserMessage) {
          contextFromMemory = await memoryService.getRelevantContext(
            lastUserMessage.content,
            session.user.id,
            {
              includeConversations: true,
              includeJournal: true,
              includeStrategies: true,
              topK: 3,
            }
          );
        }
      } catch (memoryError) {
        console.error("Error retrieving memory context:", memoryError);
      }
    }

    // Add system prompt with context if not present
    const hasSystemMessage = messages.some((m) => m.role === "system");
    const systemPrompt = getSystemPromptWithContext(contextFromMemory);
    const chatMessages: Message[] = hasSystemMessage
      ? messages
      : [{ role: "system", content: systemPrompt }, ...messages];

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const aiProvider = getAIProvider(provider);
          let fullResponse = "";

          await aiProvider.streamChat(chatMessages, {
            onToken: (token) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ token })}\n\n`));
              fullResponse += token;
            },
            onComplete: async (response) => {
              if (conversationId) {
                try {
                  const userMessage = messages.filter((m) => m.role === "user").pop();

                  if (userMessage) {
                    const savedUserMessage = await prisma.message.create({
                      data: {
                        role: "user",
                        content: userMessage.content,
                        conversationId,
                      },
                    });

                    if (isPineconeConfigured && useMemory) {
                      try {
                        const memoryService = getMemoryService();
                        await memoryService.storeConversationMessage(
                          session.user.id,
                          conversationId,
                          savedUserMessage.id,
                          userMessage.content,
                          "user"
                        );
                      } catch (memError) {
                        console.error("Error storing user message in memory:", memError);
                      }
                    }
                  }

                  const savedAssistantMessage = await prisma.message.create({
                    data: {
                      role: "assistant",
                      content: response,
                      provider,
                      conversationId,
                    },
                  });

                  if (isPineconeConfigured && useMemory) {
                    try {
                      const memoryService = getMemoryService();
                      await memoryService.storeConversationMessage(
                        session.user.id,
                        conversationId,
                        savedAssistantMessage.id,
                        response,
                        "assistant"
                      );
                    } catch (memError) {
                      console.error("Error storing assistant message in memory:", memError);
                    }
                  }

                  await prisma.conversation.update({
                    where: { id: conversationId },
                    data: { updatedAt: new Date() },
                  });
                } catch (dbError) {
                  console.error("Error saving messages:", dbError);
                }
              }

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ done: true, fullResponse: response })}\n\n`)
              );
              controller.close();
            },
            onError: (error) => {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`)
              );
              controller.close();
            },
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
