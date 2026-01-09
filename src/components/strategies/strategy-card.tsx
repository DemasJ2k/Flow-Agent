"use client";

import { Trash2, Edit2, Clock, TrendingUp, Globe } from "lucide-react";
import type { Strategy } from "@/types/strategy";

interface StrategyCardProps {
  strategy: Strategy;
  onEdit: (strategy: Strategy) => void;
  onDelete: (id: string) => void;
  onClick: (strategy: Strategy) => void;
}

export function StrategyCard({
  strategy,
  onEdit,
  onDelete,
  onClick,
}: StrategyCardProps) {
  const riskColors = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(strategy)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{strategy.name}</h3>
            {strategy.isPublic && (
              <span title="Public">
                <Globe className="h-4 w-4 text-blue-500" />
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{strategy.category}</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(strategy);
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(strategy.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {strategy.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {strategy.description}
        </p>
      )}

      {/* Risk Level & Timeframes */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${riskColors[strategy.riskLevel]}`}
        >
          {strategy.riskLevel.charAt(0).toUpperCase() + strategy.riskLevel.slice(1)} Risk
        </span>
        {strategy.timeframes.length > 0 && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            {strategy.timeframes.slice(0, 3).join(", ")}
            {strategy.timeframes.length > 3 && `+${strategy.timeframes.length - 3}`}
          </span>
        )}
      </div>

      {/* Markets */}
      {strategy.markets.length > 0 && (
        <div className="flex items-center gap-1 mb-3">
          <TrendingUp className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-500">
            {strategy.markets.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}
          </span>
        </div>
      )}

      {/* Tags */}
      {strategy.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {strategy.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
          {strategy.tags.length > 4 && (
            <span className="px-2 py-0.5 text-gray-400 text-xs">
              +{strategy.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Date */}
      <div className="mt-3 pt-3 border-t text-xs text-gray-400">
        Updated {new Date(strategy.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
