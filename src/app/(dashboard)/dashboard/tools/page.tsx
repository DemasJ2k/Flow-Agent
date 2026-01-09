"use client";

import { useState, useEffect, useCallback } from "react";
import { Wrench, Plus, ArrowLeft, Search, Filter } from "lucide-react";
import { ToolEditor } from "@/components/tools/tool-editor";
import { ToolCard } from "@/components/tools/tool-card";
import type { Tool, ToolInput, ToolFilters, ToolType } from "@/types/strategy";
import { TOOL_CATEGORIES, TOOL_TYPES } from "@/types/strategy";

type ViewMode = "list" | "create" | "edit" | "view";

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filters, setFilters] = useState<ToolFilters>({});
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const fetchTools = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.toolType) params.set("toolType", filters.toolType);
      if (filters.tag) params.set("tag", filters.tag);

      const res = await fetch(`/api/tools?${params.toString()}`);
      const data = await res.json();

      if (data.tools) {
        setTools(data.tools);
      }
    } catch (error) {
      console.error("Failed to fetch tools:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

  const handleCreate = async (data: ToolInput) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await fetchTools();
        setViewMode("list");
      }
    } catch (error) {
      console.error("Failed to create tool:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (data: ToolInput) => {
    if (!selectedTool) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/tools/${selectedTool.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await fetchTools();
        setViewMode("list");
        setSelectedTool(null);
      }
    } catch (error) {
      console.error("Failed to update tool:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tool?")) return;

    try {
      const res = await fetch(`/api/tools/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchTools();
        if (selectedTool?.id === id) {
          setSelectedTool(null);
          setViewMode("list");
        }
      }
    } catch (error) {
      console.error("Failed to delete tool:", error);
    }
  };

  const handleEdit = (tool: Tool) => {
    setSelectedTool(tool);
    setViewMode("edit");
  };

  const handleView = (tool: Tool) => {
    setSelectedTool(tool);
    setViewMode("view");
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedTool(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchInput });
  };

  const availableTags = [...new Set(tools.flatMap((t) => t.tags))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {viewMode !== "list" && (
            <button
              type="button"
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {viewMode === "create"
                ? "New Tool"
                : viewMode === "edit"
                ? "Edit Tool"
                : viewMode === "view"
                ? selectedTool?.name
                : "Trading Tools"}
            </h1>
            <p className="text-gray-600">
              {viewMode === "list"
                ? "Document indicators, calculators, and analysis tools"
                : ""}
            </p>
          </div>
        </div>
        {viewMode === "list" && (
          <button
            type="button"
            onClick={() => setViewMode("create")}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Plus className="h-5 w-5" />
            <span>Add Tool</span>
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
                  placeholder="Search tools..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border ${
                  showFilters ? "bg-green-50 border-green-300" : "border-gray-300"
                }`}
                title="Toggle filters"
              >
                <Filter className="h-4 w-4" />
              </button>
            </form>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="categoryFilter"
                    value={filters.category || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value || undefined })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Categories</option>
                    {TOOL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="toolTypeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Tool Type
                  </label>
                  <select
                    id="toolTypeFilter"
                    value={filters.toolType || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, toolType: (e.target.value as ToolType) || undefined })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Types</option>
                    {TOOL_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                {availableTags.length > 0 && (
                  <div>
                    <label htmlFor="tagFilter" className="block text-sm font-medium text-gray-700 mb-1">
                      Tag
                    </label>
                    <select
                      id="tagFilter"
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

          {/* Tools Grid */}
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
          ) : tools.length === 0 ? (
            <div className="rounded-lg bg-white p-12 shadow-md">
              <div className="text-center text-gray-500">
                <Wrench className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No tools yet</h3>
                <p className="text-sm mt-2 max-w-md mx-auto">
                  Start documenting your trading tools, indicators, and calculators.
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode("create")}
                  className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add First Tool</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
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
          <ToolEditor
            onSubmit={handleCreate}
            onCancel={handleBack}
            isLoading={isSaving}
          />
        </div>
      )}

      {viewMode === "edit" && selectedTool && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <ToolEditor
            initialData={selectedTool}
            onSubmit={handleUpdate}
            onCancel={handleBack}
            isLoading={isSaving}
          />
        </div>
      )}

      {viewMode === "view" && selectedTool && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-end gap-2 mb-4">
            {selectedTool.url && (
              <a
                href={selectedTool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50"
              >
                Open External Link
              </a>
            )}
            <button
              type="button"
              onClick={() => handleEdit(selectedTool)}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(selectedTool.id)}
              className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>
          </div>

          {/* Tool Info */}
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {selectedTool.category}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {selectedTool.toolType.charAt(0).toUpperCase() + selectedTool.toolType.slice(1)}
            </span>
          </div>

          {selectedTool.description && (
            <p className="text-gray-600 mb-6">{selectedTool.description}</p>
          )}

          {/* Content */}
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-800">
              {selectedTool.content}
            </pre>
          </div>

          {/* Tags */}
          {selectedTool.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t flex flex-wrap gap-2">
              {selectedTool.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
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
