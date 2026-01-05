"use client";

import { useState } from "react";
import { X, Plus, TrendingUp, TrendingDown } from "lucide-react";
import type {
  JournalEntryInput,
  EntryType,
  Mood,
  TradeDirection,
  TradeOutcome,
} from "@/types/journal";

interface JournalEditorProps {
  initialData?: Partial<JournalEntryInput>;
  onSubmit: (data: JournalEntryInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ENTRY_TYPES: { value: EntryType; label: string; description: string }[] = [
  { value: "general", label: "General", description: "General notes and thoughts" },
  { value: "trade", label: "Trade", description: "Document a trade" },
  { value: "analysis", label: "Analysis", description: "Market analysis" },
  { value: "reflection", label: "Reflection", description: "Self-reflection and review" },
];

const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: "positive", label: "Positive", emoji: "😊" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "negative", label: "Negative", emoji: "😔" },
];

const POPULAR_TAGS = [
  "ICT", "scalping", "swing", "trend", "reversal", "breakout",
  "support", "resistance", "order-block", "fvg", "liquidity",
  "psychology", "discipline", "risk-management", "lesson-learned",
];

export function JournalEditor({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: JournalEditorProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [entryType, setEntryType] = useState<EntryType>(initialData?.entryType || "general");
  const [mood, setMood] = useState<Mood | null>(initialData?.mood || null);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [symbol, setSymbol] = useState(initialData?.symbol || "");
  const [tradeDirection, setTradeDirection] = useState<TradeDirection | null>(
    initialData?.tradeDirection || null
  );
  const [outcome, setOutcome] = useState<TradeOutcome | null>(initialData?.outcome || null);
  const [pnl, setPnl] = useState(initialData?.pnl?.toString() || "");

  const handleAddTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags([...tags, normalizedTag]);
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: JournalEntryInput = {
      title,
      content,
      tags,
      entryType,
      mood,
      symbol: entryType === "trade" ? symbol : null,
      tradeDirection: entryType === "trade" ? tradeDirection : null,
      outcome: entryType === "trade" ? outcome : null,
      pnl: entryType === "trade" && pnl ? parseFloat(pnl) : null,
    };

    await onSubmit(data);
  };

  const isTrade = entryType === "trade";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Entry Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Entry Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {ENTRY_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setEntryType(type.value)}
              className={`p-3 rounded-lg border-2 text-left transition-colors ${
                entryType === type.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-sm">{type.label}</div>
              <div className="text-xs text-gray-500">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter a title for your entry..."
          required
        />
      </div>

      {/* Trade-specific fields */}
      {isTrade && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
              Symbol
            </label>
            <input
              type="text"
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="EUR/USD"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Direction
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTradeDirection("long")}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border-2 transition-colors ${
                  tradeDirection === "long"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Long
              </button>
              <button
                type="button"
                onClick={() => setTradeDirection("short")}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border-2 transition-colors ${
                  tradeDirection === "short"
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <TrendingDown className="h-4 w-4" />
                Short
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Outcome
            </label>
            <select
              value={outcome || ""}
              onChange={(e) => setOutcome(e.target.value as TradeOutcome)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select...</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
              <option value="breakeven">Breakeven</option>
            </select>
          </div>

          <div>
            <label htmlFor="pnl" className="block text-sm font-medium text-gray-700 mb-1">
              P&L ($)
            </label>
            <input
              type="number"
              id="pnl"
              value={pnl}
              onChange={(e) => setPnl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          placeholder="Write your journal entry here... You can use markdown for formatting."
          required
        />
      </div>

      {/* Mood */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How are you feeling?
        </label>
        <div className="flex gap-3">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(mood === m.value ? null : m.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                mood === m.value
                  ? m.value === "positive"
                    ? "border-green-500 bg-green-50"
                    : m.value === "negative"
                    ? "border-red-500 bg-red-50"
                    : "border-yellow-500 bg-yellow-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-xl">{m.emoji}</span>
              <span className="text-sm font-medium">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag(newTag);
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Add a tag..."
          />
          <button
            type="button"
            onClick={() => handleAddTag(newTag)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {POPULAR_TAGS.filter((t) => !tags.includes(t)).slice(0, 8).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleAddTag(tag)}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              +{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !title || !content}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Entry"}
        </button>
      </div>
    </form>
  );
}
