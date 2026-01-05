"use client";

import { useState } from "react";
import { Search, Filter, X, Calendar } from "lucide-react";
import type { JournalFilters, EntryType, Mood, TradeOutcome } from "@/types/journal";

interface JournalFiltersProps {
  filters: JournalFilters;
  onFiltersChange: (filters: JournalFilters) => void;
  availableTags: string[];
}

const ENTRY_TYPES: { value: EntryType; label: string }[] = [
  { value: "general", label: "General" },
  { value: "trade", label: "Trade" },
  { value: "analysis", label: "Analysis" },
  { value: "reflection", label: "Reflection" },
];

const MOODS: { value: Mood; label: string }[] = [
  { value: "positive", label: "Positive" },
  { value: "neutral", label: "Neutral" },
  { value: "negative", label: "Negative" },
];

const OUTCOMES: { value: TradeOutcome; label: string }[] = [
  { value: "win", label: "Win" },
  { value: "loss", label: "Loss" },
  { value: "breakeven", label: "Breakeven" },
];

export function JournalFilters({
  filters,
  onFiltersChange,
  availableTags,
}: JournalFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchInput });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.search ||
    filters.entryType ||
    filters.tag ||
    filters.mood ||
    filters.outcome ||
    filters.from ||
    filters.to;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search entries..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2 rounded-lg border ${
            showAdvanced ? "bg-blue-50 border-blue-300" : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Filter className="h-4 w-4" />
        </button>
      </form>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
          {/* Entry Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entry Type
            </label>
            <select
              value={filters.entryType || ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  entryType: e.target.value as EntryType || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {ENTRY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mood
            </label>
            <select
              value={filters.mood || ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  mood: e.target.value as Mood || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Moods</option>
              {MOODS.map((mood) => (
                <option key={mood.value} value={mood.value}>
                  {mood.label}
                </option>
              ))}
            </select>
          </div>

          {/* Trade Outcome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trade Outcome
            </label>
            <select
              value={filters.outcome || ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  outcome: e.target.value as TradeOutcome || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Outcomes</option>
              {OUTCOMES.map((outcome) => (
                <option key={outcome.value} value={outcome.value}>
                  {outcome.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tag */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tag
            </label>
            <select
              value={filters.tag || ""}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  tag: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tags</option>
              {availableTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={filters.from || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    from: e.target.value || undefined,
                  })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={filters.to || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    to: e.target.value || undefined,
                  })
                }
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
              Search: {filters.search}
              <button
                onClick={() => {
                  setSearchInput("");
                  onFiltersChange({ ...filters, search: undefined });
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.entryType && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
              Type: {filters.entryType}
              <button onClick={() => onFiltersChange({ ...filters, entryType: undefined })}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.mood && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
              Mood: {filters.mood}
              <button onClick={() => onFiltersChange({ ...filters, mood: undefined })}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.outcome && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
              Outcome: {filters.outcome}
              <button onClick={() => onFiltersChange({ ...filters, outcome: undefined })}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.tag && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
              Tag: #{filters.tag}
              <button onClick={() => onFiltersChange({ ...filters, tag: undefined })}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleClearFilters}
            className="text-sm text-red-600 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
