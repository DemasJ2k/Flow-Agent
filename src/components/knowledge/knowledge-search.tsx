'use client';

import { useState, useCallback } from 'react';
import { Search, X, Loader2, Book, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { KNOWLEDGE_CATEGORIES, SUBCATEGORY_LABELS, KnowledgeCategory } from '@/types/knowledge';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchResult {
  id: string;
  title: string;
  category: KnowledgeCategory;
  subcategory: string;
  excerpt: string;
  section?: string;
  score?: number;
  highlights?: string[];
}

interface KnowledgeSearchProps {
  onSelectResult: (category: KnowledgeCategory, subcategory: string) => void;
}

export function KnowledgeSearch({ onSelectResult }: KnowledgeSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedSearch = useDebounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/knowledge/search?q=${encodeURIComponent(searchQuery)}&limit=10`
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.results);
      setHasSearched(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearch = useCallback((value: string) => {
    setQuery(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search trading knowledge... (e.g., 'order blocks', 'stop loss', 'RSI')"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10 h-12"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Searching...</span>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-500 mb-3">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>

          {results.map((result) => {
            const categoryInfo = KNOWLEDGE_CATEGORIES[result.category];
            const subcategoryLabel = SUBCATEGORY_LABELS[result.subcategory] || result.subcategory;

            const colorClasses: Record<string, { bg: string; text: string }> = {
              blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
              green: { bg: 'bg-green-50', text: 'text-green-600' },
              gray: { bg: 'bg-gray-50', text: 'text-gray-600' },
            };

            const colors = colorClasses[categoryInfo.color] || colorClasses.gray;

            return (
              <button
                type="button"
                key={result.id}
                onClick={() => onSelectResult(result.category, result.subcategory)}
                className="w-full text-left p-4 bg-gray-50 border border-gray-200 rounded-lg
                           hover:border-gray-300 hover:bg-gray-100 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Category & Section */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {categoryInfo.label}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{subcategoryLabel}</span>
                      {result.section && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-400">{result.section}</span>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {result.title}
                    </h4>

                    {/* Excerpt / Highlights */}
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {result.highlights?.[0] || result.excerpt}
                    </p>

                    {/* Score if available */}
                    {result.score !== undefined && result.score !== null && (
                      <div className="mt-2 text-xs text-gray-400">
                        Relevance: {(result.score * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>

                  <div className="flex items-center text-gray-400 group-hover:text-blue-600 transition-colors">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {!loading && hasSearched && results.length === 0 && (
        <div className="mt-8 text-center py-8">
          <Book className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No results found for "{query}"</p>
          <p className="text-sm text-gray-400 mt-1">
            Try different keywords or browse categories above
          </p>
        </div>
      )}
    </div>
  );
}
