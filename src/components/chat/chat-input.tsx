"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { AIProvider } from "@/lib/ai/types";

interface ChatInputProps {
  onSend: (message: string, provider: AIProvider) => void;
  isLoading: boolean;
  provider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
}

export function ChatInput({
  onSend,
  isLoading,
  provider,
  onProviderChange,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim(), provider);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-sm text-gray-500">Provider:</span>
        <select
          value={provider}
          onChange={(e) => onProviderChange(e.target.value as AIProvider)}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="anthropic">Claude (Anthropic)</option>
          <option value="openai">GPT (OpenAI)</option>
        </select>
      </div>
      <div className="flex space-x-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about trading, markets, ICT concepts, or strategies..."
          className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] max-h-[200px]"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
