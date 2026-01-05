"use client";

import { formatDistanceToNow } from "date-fns";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Brain,
  Edit,
  Trash2,
  DollarSign,
} from "lucide-react";
import type { JournalEntry, EntryType } from "@/types/journal";

interface JournalCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
  onClick: (entry: JournalEntry) => void;
}

const ENTRY_TYPE_ICONS: Record<EntryType, typeof BookOpen> = {
  general: BookOpen,
  trade: TrendingUp,
  analysis: BarChart2,
  reflection: Brain,
};

const ENTRY_TYPE_COLORS: Record<EntryType, string> = {
  general: "bg-gray-100 text-gray-700",
  trade: "bg-blue-100 text-blue-700",
  analysis: "bg-purple-100 text-purple-700",
  reflection: "bg-amber-100 text-amber-700",
};

const MOOD_EMOJIS: Record<string, string> = {
  positive: "😊",
  neutral: "😐",
  negative: "😔",
};

export function JournalCard({ entry, onEdit, onDelete, onClick }: JournalCardProps) {
  const Icon = ENTRY_TYPE_ICONS[entry.entryType] || BookOpen;
  const typeColor = ENTRY_TYPE_COLORS[entry.entryType] || ENTRY_TYPE_COLORS.general;

  const isTrade = entry.entryType === "trade";
  const pnlColor =
    entry.pnl && entry.pnl > 0
      ? "text-green-600"
      : entry.pnl && entry.pnl < 0
      ? "text-red-600"
      : "text-gray-600";

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(entry)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`p-2 rounded-lg ${typeColor}`}>
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">{entry.title}</h3>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {entry.mood && (
            <span className="text-lg" title={entry.mood}>
              {MOOD_EMOJIS[entry.mood]}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(entry);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entry.id);
            }}
            className="p-1 text-gray-400 hover:text-red-600 rounded"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Trade info */}
      {isTrade && (entry.symbol || entry.pnl != null) && (
        <div className="flex items-center gap-3 mb-3 py-2 px-3 bg-gray-50 rounded-lg text-sm">
          {entry.symbol && (
            <span className="font-medium text-gray-700">{entry.symbol}</span>
          )}
          {entry.tradeDirection && (
            <span
              className={`flex items-center gap-1 ${
                entry.tradeDirection === "long" ? "text-green-600" : "text-red-600"
              }`}
            >
              {entry.tradeDirection === "long" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {entry.tradeDirection.toUpperCase()}
            </span>
          )}
          {entry.outcome && (
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                entry.outcome === "win"
                  ? "bg-green-100 text-green-700"
                  : entry.outcome === "loss"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {entry.outcome.toUpperCase()}
            </span>
          )}
          {entry.pnl != null && (
            <span className={`flex items-center gap-1 font-medium ${pnlColor}`}>
              <DollarSign className="h-3 w-3" />
              {entry.pnl >= 0 ? "+" : ""}
              {entry.pnl.toFixed(2)}
            </span>
          )}
        </div>
      )}

      {/* Content preview */}
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{entry.content}</p>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {entry.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
          {entry.tags.length > 5 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
              +{entry.tags.length - 5} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
