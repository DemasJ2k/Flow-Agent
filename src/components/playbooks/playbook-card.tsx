"use client";

import { Trash2, Edit2, ListChecks, Link } from "lucide-react";
import type { Playbook } from "@/types/strategy";

interface PlaybookCardProps {
  playbook: Playbook;
  onEdit: (playbook: Playbook) => void;
  onDelete: (id: string) => void;
  onClick: (playbook: Playbook) => void;
}

export function PlaybookCard({
  playbook,
  onEdit,
  onDelete,
  onClick,
}: PlaybookCardProps) {
  const totalCheckpoints = playbook.steps.reduce(
    (acc, step) => acc + step.checkpoints.length,
    0
  );

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(playbook)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{playbook.name}</h3>
            {playbook.strategy && (
              <span title={`Linked to: ${playbook.strategy.name}`}>
                <Link className="h-4 w-4 text-purple-500" />
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{playbook.category}</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(playbook);
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(playbook.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {playbook.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{playbook.description}</p>
      )}

      {/* Steps & Checkpoints Count */}
      <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center gap-1 text-sm text-gray-600">
          <ListChecks className="h-4 w-4 text-purple-500" />
          {playbook.steps.length} step{playbook.steps.length !== 1 ? "s" : ""}
        </span>
        {totalCheckpoints > 0 && (
          <span className="text-sm text-gray-500">
            {totalCheckpoints} checkpoint{totalCheckpoints !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Strategy Link */}
      {playbook.strategy && (
        <div className="mb-3">
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
            {playbook.strategy.name}
          </span>
        </div>
      )}

      {/* Tags */}
      {playbook.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {playbook.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
          {playbook.tags.length > 4 && (
            <span className="px-2 py-0.5 text-gray-400 text-xs">
              +{playbook.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Date */}
      <div className="mt-3 pt-3 border-t text-xs text-gray-400">
        Updated {new Date(playbook.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
