'use client';

import { Book, Tag, Clock, ChevronRight } from 'lucide-react';
import { KNOWLEDGE_CATEGORIES, SUBCATEGORY_LABELS, KnowledgeCategory } from '@/types/knowledge';

interface KnowledgeCardProps {
  id: string;
  title: string;
  category: KnowledgeCategory;
  subcategory: string;
  summary?: string;
  tags: string[];
  lastModified?: Date;
  onClick?: () => void;
}

export function KnowledgeCard({
  title,
  category,
  subcategory,
  summary,
  tags,
  lastModified,
  onClick,
}: KnowledgeCardProps) {
  const categoryInfo = KNOWLEDGE_CATEGORIES[category];
  const subcategoryLabel = SUBCATEGORY_LABELS[subcategory] || subcategory;

  const colorClasses: Record<string, { bg: string; text: string; border: string; light: string }> = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-200',
      light: 'bg-blue-50',
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-200',
      light: 'bg-green-50',
    },
    gray: {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      border: 'border-gray-200',
      light: 'bg-gray-50',
    },
  };

  const colors = colorClasses[categoryInfo.color] || colorClasses.gray;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300
                 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.light} ${colors.text}`}>
              {categoryInfo.label}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{subcategoryLabel}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          {/* Summary */}
          {summary && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-2">
              {summary}
            </p>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100
                             text-gray-500 text-xs rounded"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs text-gray-400">+{tags.length - 3}</span>
              )}
            </div>
          )}

          {/* Last Modified */}
          {lastModified && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>Updated {new Date(lastModified).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={`p-2 rounded-lg ${colors.light} ${colors.border} border`}>
          <Book className={`w-4 h-4 ${colors.text}`} />
        </div>
      </div>

      {/* Read More Arrow */}
      <div className="flex items-center justify-end mt-2 text-gray-400 group-hover:text-blue-600 transition-colors">
        <span className="text-xs mr-1">Read more</span>
        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
}
