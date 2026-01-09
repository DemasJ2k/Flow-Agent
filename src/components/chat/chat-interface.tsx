"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ConversationSidebar } from "./conversation-sidebar";
import { AIProvider, Message } from "@/lib/ai/types";
import { MessageSquare, PanelLeftClose, PanelLeft, BookOpen, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export function ChatInterface() {
  const { success, error: showError } = useToast();
  const [provider, setProvider] = useState<AIProvider>("anthropic");
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [showSidebar, setShowSidebar] = useState(true);
  const [savingToJournal, setSavingToJournal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, error, sendMessage, clearMessages, setMessages } =
    useChat({
      conversationId,
      onError: (err) => console.error("Chat error:", err),
    });

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversation messages when conversationId changes
  useEffect(() => {
    const loadConversation = async (id: string) => {
      try {
        const response = await fetch(`/api/conversations/${id}`);
        if (response.ok) {
          const data = await response.json();
          const loadedMessages: Message[] = data.messages.map(
            (m: { role: string; content: string }) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })
          );
          setMessages(loadedMessages);
        }
      } catch (error) {
        console.error("Error loading conversation:", error);
      }
    };

    if (conversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId, setMessages]);

  const handleNewConversation = async () => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Conversation" }),
      });
      if (response.ok) {
        const data = await response.json();
        setConversationId(data.id);
        clearMessages();
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const handleSelectConversation = (id: string) => {
    setConversationId(id);
  };

  const handleSendMessage = async (content: string, selectedProvider: AIProvider) => {
    // Create conversation if not exists
    if (!conversationId) {
      try {
        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setConversationId(data.id);
        }
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    }

    await sendMessage(content, selectedProvider);
  };

  const handleSaveToJournal = async () => {
    if (!conversationId || messages.length === 0) {
      showError("No conversation to save");
      return;
    }

    setSavingToJournal(true);
    try {
      const response = await fetch("/api/journal/from-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      });

      if (response.ok) {
        success("Conversation saved to journal");
      } else {
        const data = await response.json();
        showError(data.error || "Failed to save to journal");
      }
    } catch (err) {
      showError("Failed to save to journal");
    } finally {
      setSavingToJournal(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar toggle for mobile */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="lg:hidden fixed bottom-20 left-4 z-50 p-2 bg-blue-600 text-white rounded-full shadow-lg"
      >
        {showSidebar ? (
          <PanelLeftClose className="h-5 w-5" />
        ) : (
          <PanelLeft className="h-5 w-5" />
        )}
      </button>

      {/* Conversation sidebar */}
      <div
        className={`${
          showSidebar ? "block" : "hidden"
        } lg:block absolute lg:relative z-40 h-full`}
      >
        <ConversationSidebar
          currentConversationId={conversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
        />
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header with save button */}
        {messages.length > 0 && (
          <div className="flex items-center justify-end px-4 py-2 border-b border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveToJournal}
              disabled={savingToJournal || !conversationId}
              className="text-gray-600 hover:text-gray-900"
            >
              {savingToJournal ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <BookOpen className="w-4 h-4 mr-2" />
              )}
              Save to Journal
            </Button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium">Start a conversation</h3>
              <p className="text-sm mt-2 max-w-md">
                Ask about market analysis, trading strategies, ICT concepts, or get
                help with your trades.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
                {[
                  "Explain order blocks in ICT",
                  "What are fair value gaps?",
                  "How do I manage risk in scalping?",
                  "Analyze EUR/USD for today",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSendMessage(suggestion, provider)}
                    className="text-left px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          provider={provider}
          onProviderChange={setProvider}
        />
      </div>
    </div>
  );
}
