"use client";

import { useState, useCallback, useRef } from "react";
import { AIProvider, Message } from "@/lib/ai/types";

interface UseChatOptions {
  conversationId?: string;
  onError?: (error: string) => void;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, provider: AIProvider) => Promise<void>;
  clearMessages: () => void;
  setMessages: (messages: Message[]) => void;
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string, provider: AIProvider) => {
      if (!content.trim()) return;

      setError(null);
      setIsLoading(true);

      // Add user message
      const userMessage: Message = { role: "user", content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      // Create placeholder for assistant message
      const assistantMessage: Message = { role: "assistant", content: "" };
      setMessages([...newMessages, assistantMessage]);

      try {
        // Abort any existing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.filter((m) => m.role !== "system"),
            provider,
            conversationId: options.conversationId,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to send message");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let assistantContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));

                if (data.error) {
                  throw new Error(data.error);
                }

                if (data.token) {
                  assistantContent += data.token;
                  setMessages([
                    ...newMessages,
                    { role: "assistant", content: assistantContent },
                  ]);
                }

                if (data.done) {
                  // Final update with complete response
                  setMessages([
                    ...newMessages,
                    { role: "assistant", content: data.fullResponse || assistantContent },
                  ]);
                }
              } catch (parseError) {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return; // Request was aborted, don't show error
        }

        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        options.onError?.(errorMessage);

        // Remove the empty assistant message on error
        setMessages(newMessages);
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, options]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    setMessages,
  };
}
