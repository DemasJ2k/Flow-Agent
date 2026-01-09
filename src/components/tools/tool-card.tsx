"use client";

import { Trash2, Edit2, ExternalLink } from "lucide-react";
import type { Tool } from "@/types/strategy";

interface ToolCardProps {
  tool: Tool;
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
  onClick: (tool: Tool) => void;
}

export function ToolCard({ tool, onEdit, onDelete, onClick }: ToolCardProps) {
  const typeColors: Record<string, string> = {
    indicator: "bg-blue-100 text-blue-700",
    oscillator: "bg-purple-100 text-purple-700",
    overlay: "bg-green-100 text-green-700",
    pattern: "bg-orange-100 text-orange-700",
    calculator: "bg-yellow-100 text-yellow-700",
    screener: "bg-pink-100 text-pink-700",
    other: "bg-gray-100 text-gray-700",
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(tool)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{tool.name}</h3>
            {tool.url && (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-blue-500 hover:text-blue-700"
                title="Open external link"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <p className="text-sm text-gray-500">{tool.category}</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(tool);
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(tool.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {tool.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tool.description}</p>
      )}

      {/* Tool Type */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[tool.toolType] || typeColors.other}`}>
          {tool.toolType.charAt(0).toUpperCase() + tool.toolType.slice(1)}
        </span>
      </div>

      {/* Tags */}
      {tool.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tool.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
          {tool.tags.length > 4 && (
            <span className="px-2 py-0.5 text-gray-400 text-xs">
              +{tool.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Date */}
      <div className="mt-3 pt-3 border-t text-xs text-gray-400">
        Updated {new Date(tool.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
