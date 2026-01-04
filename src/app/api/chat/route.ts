import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { getAIProvider, AIProvider, Message } from "@/lib/ai";
import { getSystemPromptWithContext } from "@/lib/ai/prompts";
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
    } = body as {
      messages: Message[];
      provider: AIProvider;
      conversationId?: string;
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
          error: `${provider === "anthropic" ? "Anthropic" : "OpenAI"} API key not configured`,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Add system prompt if not present
    const hasSystemMessage = messages.some((m) => m.role === "system");
    const chatMessages: Message[] = hasSystemMessage
      ? messages
      : [{ role: "system", content: getSystemPromptWithContext() }, ...messages];

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
              // Save messages to database if conversationId provided
              if (conversationId) {
                try {
                  // Get the last user message
                  const userMessage = messages.filter((m) => m.role === "user").pop();

                  if (userMessage) {
                    // Save user message
                    await prisma.message.create({
                      data: {
                        role: "user",
                        content: userMessage.content,
                        conversationId,
                      },
                    });
                  }

                  // Save assistant message
                  await prisma.message.create({
                    data: {
                      role: "assistant",
                      content: response,
                      provider,
                      conversationId,
                    },
                  });

                  // Update conversation timestamp
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
