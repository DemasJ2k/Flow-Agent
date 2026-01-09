"use client";

import { useState, useEffect, useCallback } from "react";
import { Lightbulb, Plus, ArrowLeft, Search, Filter } from "lucide-react";
import { StrategyEditor } from "@/components/strategies/strategy-editor";
import { StrategyCard } from "@/components/strategies/strategy-card";
import type { Strategy, StrategyInput, StrategyFilters, Market, Timeframe, RiskLevel } from "@/types/strategy";
import { STRATEGY_CATEGORIES, MARKETS, TIMEFRAMES, RISK_LEVELS } from "@/types/strategy";

type ViewMode = "list" | "create" | "edit" | "view";

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [filters, setFilters] = useState<StrategyFilters>({});
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const fetchStrategies = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.market) params.set("market", filters.market);
      if (filters.timeframe) params.set("timeframe", filters.timeframe);
      if (filters.riskLevel) params.set("riskLevel", filters.riskLevel);
      if (filters.tag) params.set("tag", filters.tag);

      const res = await fetch(`/api/strategies?${params.toString()}`);
      const data = await res.json();

      if (data.strategies) {
        setStrategies(data.strategies);
      }
    } catch (error) {
      console.error("Failed to fetch strategies:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  const handleCreate = async (data: StrategyInput) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/strategies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await fetchStrategies();
        setViewMode("list");
      }
    } catch (error) {
      console.error("Failed to create strategy:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (data: StrategyInput) => {
    if (!selectedStrategy) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/strategies/${selectedStrategy.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await fetchStrategies();
        setViewMode("list");
        setSelectedStrategy(null);
      }
    } catch (error) {
      console.error("Failed to update strategy:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this strategy?")) return;

    try {
      const res = await fetch(`/api/strategies/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchStrategies();
        if (selectedStrategy?.id === id) {
          setSelectedStrategy(null);
          setViewMode("list");
        }
      }
    } catch (error) {
      console.error("Failed to delete strategy:", error);
    }
  };

  const handleEdit = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setViewMode("edit");
  };

  const handleView = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setViewMode("view");
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedStrategy(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchInput });
  };

  const availableTags = [...new Set(strategies.flatMap((s) => s.tags))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {viewMode !== "list" && (
            <button
              type="button"
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {viewMode === "create"
                ? "New Strategy"
                : viewMode === "edit"
                ? "Edit Strategy"
                : viewMode === "view"
                ? selectedStrategy?.name
                : "Trading Strategies"}
            </h1>
            <p className="text-gray-600">
              {viewMode === "list"
                ? "Document and organize your trading strategies"
                : ""}
            </p>
          </div>
        </div>
        {viewMode === "list" && (
          <button
            type="button"
            onClick={() => setViewMode("create")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            <span>New Strategy</span>
          </button>
        )}
      </div>

      {viewMode === "list" && (
        <>
          {/* Search & Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search strategies..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border ${
                  showFilters ? "bg-blue-50 border-blue-300" : "border-gray-300"
                }`}
              >
                <Filter className="h-4 w-4" />
              </button>
            </form>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value || undefined })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Categories</option>
                    {STRATEGY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Market
                  </label>
                  <select
                    value={filters.market || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, market: (e.target.value as Market) || undefined })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Markets</option>
                    {MARKETS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timeframe
                  </label>
                  <select
                    value={filters.timeframe || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, timeframe: (e.target.value as Timeframe) || undefined })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Timeframes</option>
                    {TIMEFRAMES.map((tf) => (
                      <option key={tf.value} value={tf.value}>
                        {tf.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Risk Level
                  </label>
                  <select
                    value={filters.riskLevel || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, riskLevel: (e.target.value as RiskLevel) || undefined })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Risk Levels</option>
                    {RISK_LEVELS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                {availableTags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tag
                    </label>
                    <select
                      value={filters.tag || ""}
                      onChange={(e) =>
                        setFilters({ ...filters, tag: e.target.value || undefined })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">All Tags</option>
                      {availableTags.map((tag) => (
                        <option key={tag} value={tag}>
                          #{tag}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Strategies Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-16 bg-gray-200 rounded mb-3" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-200 rounded w-16" />
                    <div className="h-5 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : strategies.length === 0 ? (
            <div className="rounded-lg bg-white p-12 shadow-md">
              <div className="text-center text-gray-500">
                <Lightbulb className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No strategies yet</h3>
                <p className="text-sm mt-2 max-w-md mx-auto">
                  Start documenting your trading strategies to build your knowledge base.
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode("create")}
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create First Strategy</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {strategies.map((strategy) => (
                <StrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onClick={handleView}
                />
              ))}
            </div>
          )}
        </>
      )}

      {viewMode === "create" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <StrategyEditor
            onSubmit={handleCreate}
            onCancel={handleBack}
            isLoading={isSaving}
          />
        </div>
      )}

      {viewMode === "edit" && selectedStrategy && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <StrategyEditor
            initialData={selectedStrategy}
            onSubmit={handleUpdate}
            onCancel={handleBack}
            isLoading={isSaving}
          />
        </div>
      )}

      {viewMode === "view" && selectedStrategy && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-end gap-2 mb-4">
            <button
              type="button"
              onClick={() => handleEdit(selectedStrategy)}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(selectedStrategy.id)}
              className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>
          </div>

          {/* Strategy Info */}
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {selectedStrategy.category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                selectedStrategy.riskLevel === "low"
                  ? "bg-green-100 text-green-700"
                  : selectedStrategy.riskLevel === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedStrategy.riskLevel.charAt(0).toUpperCase() +
                selectedStrategy.riskLevel.slice(1)}{" "}
              Risk
            </span>
            {selectedStrategy.timeframes.map((tf) => (
              <span key={tf} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {tf}
              </span>
            ))}
            {selectedStrategy.markets.map((m) => (
              <span key={m} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {m}
              </span>
            ))}
          </div>

          {selectedStrategy.description && (
            <p className="text-gray-600 mb-6">{selectedStrategy.description}</p>
          )}

          {/* Content */}
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-800">
              {selectedStrategy.content}
            </pre>
          </div>

          {/* Tags */}
          {selectedStrategy.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t flex flex-wrap gap-2">
              {selectedStrategy.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
