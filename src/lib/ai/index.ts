import { AIProvider, AIProviderInterface, Message, StreamCallbacks } from "./types";
import { AnthropicProvider } from "./anthropic";
import { OpenAIProvider } from "./openai";

export * from "./types";
export * from "./prompts";

export function getAIProvider(provider: AIProvider, apiKey?: string): AIProviderInterface {
  switch (provider) {
    case "anthropic":
      return new AnthropicProvider(apiKey);
    case "openai":
      return new OpenAIProvider(apiKey);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export async function chat(
  provider: AIProvider,
  messages: Message[],
  apiKey?: string
): Promise<string> {
  const aiProvider = getAIProvider(provider, apiKey);
  return aiProvider.chat(messages);
}

export async function streamChat(
  provider: AIProvider,
  messages: Message[],
  callbacks: StreamCallbacks,
  apiKey?: string
): Promise<void> {
  const aiProvider = getAIProvider(provider, apiKey);
  return aiProvider.streamChat(messages, callbacks);
}
