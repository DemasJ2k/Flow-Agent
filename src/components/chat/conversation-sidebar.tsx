"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MessageSquare, Plus, Trash2, Edit2, Check, X } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messages?: { content: string }[];
}

interface ConversationSidebarProps {
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

export function ConversationSidebar({
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [currentConversationId]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (currentConversationId === id) {
          onNewConversation();
        }
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleRename = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle }),
      });
      if (response.ok) {
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, title: editTitle } : c))
        );
        setEditingId(null);
      }
    } catch (error) {
      console.error("Error renaming conversation:", error);
    }
  };

  const startEditing = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
  };

  return (
    <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col h-full">
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={onNewConversation}
          className="flex items-center justify-center space-x-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "group relative rounded-lg transition-colors",
                  currentConversationId === conversation.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                )}
              >
                {editingId === conversation.id ? (
                  <div className="flex items-center p-2 space-x-1">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 text-sm px-2 py-1 border rounded"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRename(conversation.id);
                        if (e.key === "Escape") cancelEditing();
                      }}
                    />
                    <button
                      onClick={() => handleRename(conversation.id)}
                      className="p-1 text-green-600 hover:bg-green-100 rounded"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectConversation(conversation.id)}
                    className="w-full text-left p-3 pr-16"
                  >
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.messages?.[0]?.content || "No messages"}
                    </p>
                  </button>
                )}

                {editingId !== conversation.id && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 flex space-x-1">
                    <button
                      onClick={() => startEditing(conversation)}
                      className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(conversation.id)}
                      className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
