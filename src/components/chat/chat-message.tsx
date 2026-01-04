"use client";

import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";
import { Message } from "@/lib/ai/types";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-start space-x-3 py-4",
        isUser ? "flex-row-reverse space-x-reverse" : ""
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-blue-600" : "bg-gray-700"
        )}
      >
        {isUser ? (
          <User className="h-5 w-5 text-white" />
        ) : (
          <Bot className="h-5 w-5 text-white" />
        )}
      </div>
      <div
        className={cn(
          "flex-1 rounded-lg px-4 py-3",
          isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold mb-2">{children}</h3>,
                code: ({ className, children }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-gray-200 px-1 py-0.5 rounded text-sm">{children}</code>
                  ) : (
                    <code className="block bg-gray-800 text-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => <pre className="mb-2">{children}</pre>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              }}
            >
              {message.content || "..."}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
