export type AIProvider = "anthropic" | "openai";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  messages: Message[];
  provider: AIProvider;
  conversationId?: string;
  userId: string;
}

export interface ChatResponse {
  content: string;
  provider: AIProvider;
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: Error) => void;
}

export interface AIProviderInterface {
  chat(messages: Message[]): Promise<string>;
  streamChat(messages: Message[], callbacks: StreamCallbacks): Promise<void>;
}
