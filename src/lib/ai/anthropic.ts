import Anthropic from "@anthropic-ai/sdk";
import { Message, AIProviderInterface, StreamCallbacks } from "./types";
import { getSystemPromptWithContext } from "./prompts";

export class AnthropicProvider implements AIProviderInterface {
  private client: Anthropic;
  private model: string = "claude-sonnet-4-20250514";

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
  }

  async chat(messages: Message[]): Promise<string> {
    const systemMessage = messages.find((m) => m.role === "system");
    const chatMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      system: systemMessage?.content || getSystemPromptWithContext(),
      messages: chatMessages,
    });

    const textContent = response.content.find((block) => block.type === "text");
    return textContent?.type === "text" ? textContent.text : "";
  }

  async streamChat(messages: Message[], callbacks: StreamCallbacks): Promise<void> {
    const systemMessage = messages.find((m) => m.role === "system");
    const chatMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    let fullResponse = "";

    try {
      const stream = this.client.messages.stream({
        model: this.model,
        max_tokens: 4096,
        system: systemMessage?.content || getSystemPromptWithContext(),
        messages: chatMessages,
      });

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          const token = event.delta.text;
          fullResponse += token;
          callbacks.onToken(token);
        }
      }

      callbacks.onComplete(fullResponse);
    } catch (error) {
      callbacks.onError(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
