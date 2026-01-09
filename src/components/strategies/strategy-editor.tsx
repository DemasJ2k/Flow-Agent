"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import type {
  StrategyInput,
  RiskLevel,
  Timeframe,
  Market,
} from "@/types/strategy";
import {
  STRATEGY_CATEGORIES,
  TIMEFRAMES,
  MARKETS,
  RISK_LEVELS,
} from "@/types/strategy";

interface StrategyEditorProps {
  initialData?: Partial<StrategyInput> & { id?: string };
  onSubmit: (data: StrategyInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const POPULAR_TAGS = [
  "ICT", "SMC", "price-action", "orderflow", "liquidity",
  "order-blocks", "fvg", "breaker", "mitigation", "inducement",
  "swing", "scalp", "intraday", "position",
];

export function StrategyEditor({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: StrategyEditorProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [category, setCategory] = useState(initialData?.category || "General");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [timeframes, setTimeframes] = useState<Timeframe[]>(
    initialData?.timeframes || []
  );
  const [markets, setMarkets] = useState<Market[]>(initialData?.markets || []);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(
    initialData?.riskLevel || "medium"
  );
  const [isPublic, setIsPublic] = useState(initialData?.isPublic || false);

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

  const toggleTimeframe = (tf: Timeframe) => {
    if (timeframes.includes(tf)) {
      setTimeframes(timeframes.filter((t) => t !== tf));
    } else {
      setTimeframes([...timeframes, tf]);
    }
  };

  const toggleMarket = (m: Market) => {
    if (markets.includes(m)) {
      setMarkets(markets.filter((market) => market !== m));
    } else {
      setMarkets([...markets, m]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      name,
      description: description || null,
      content,
      category,
      tags,
      timeframes,
      markets,
      riskLevel,
      isPublic,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Strategy Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g., ICT Silver Bullet"
          required
        />
      </div>

      {/* Category & Risk Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {STRATEGY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Risk Level
          </label>
          <div className="flex gap-2">
            {RISK_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setRiskLevel(level.value)}
                className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                  riskLevel === level.value
                    ? level.value === "low"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : level.value === "medium"
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-red-500 bg-red-50 text-red-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Brief description of the strategy..."
        />
      </div>

      {/* Timeframes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Applicable Timeframes
        </label>
        <div className="flex flex-wrap gap-2">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              type="button"
              onClick={() => toggleTimeframe(tf.value)}
              className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-colors ${
                timeframes.includes(tf.value)
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Markets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Applicable Markets
        </label>
        <div className="flex flex-wrap gap-2">
          {MARKETS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => toggleMarket(m.value)}
              className={`px-3 py-1.5 rounded-lg text-sm border-2 transition-colors ${
                markets.includes(m.value)
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Strategy Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={15}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-mono text-sm"
          placeholder="Document your strategy here... Use markdown for formatting.

## Entry Criteria
- ...

## Exit Criteria
- ...

## Risk Management
- ..."
          required
        />
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

      {/* Public Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isPublic" className="text-sm text-gray-700">
          Make this strategy public (share with community)
        </label>
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
          disabled={isLoading || !name || !content}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Strategy"}
        </button>
      </div>
    </form>
  );
}
