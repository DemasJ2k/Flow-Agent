import OpenAI from "openai";
import { Message, AIProviderInterface, StreamCallbacks } from "./types";
import { getSystemPromptWithContext } from "./prompts";

export class OpenAIProvider implements AIProviderInterface {
  private client: OpenAI;
  private model: string = "gpt-4o";

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  async chat(messages: Message[]): Promise<string> {
    const hasSystemMessage = messages.some((m) => m.role === "system");
    const chatMessages = hasSystemMessage
      ? messages
      : [{ role: "system" as const, content: getSystemPromptWithContext() }, ...messages];

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: chatMessages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      max_tokens: 4096,
    });

    return response.choices[0]?.message?.content || "";
  }

  async streamChat(messages: Message[], callbacks: StreamCallbacks): Promise<void> {
    const hasSystemMessage = messages.some((m) => m.role === "system");
    const chatMessages = hasSystemMessage
      ? messages
      : [{ role: "system" as const, content: getSystemPromptWithContext() }, ...messages];

    let fullResponse = "";

    try {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages: chatMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: 4096,
        stream: true,
      });

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || "";
        if (token) {
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
