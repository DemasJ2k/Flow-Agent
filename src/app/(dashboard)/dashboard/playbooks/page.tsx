"use client";

import { useState, useEffect, useCallback } from "react";
import { BookMarked, Plus, ArrowLeft, Search, Filter, CheckCircle2 } from "lucide-react";
import { PlaybookEditor } from "@/components/playbooks/playbook-editor";
import { PlaybookCard } from "@/components/playbooks/playbook-card";
import type { Playbook, PlaybookInput, PlaybookFilters, Strategy } from "@/types/strategy";
import { PLAYBOOK_CATEGORIES } from "@/types/strategy";

type ViewMode = "list" | "create" | "edit" | "view" | "execute";

export default function PlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [filters, setFilters] = useState<PlaybookFilters>({});
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const fetchPlaybooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.category) params.set("category", filters.category);
      if (filters.strategyId) params.set("strategyId", filters.strategyId);
      if (filters.tag) params.set("tag", filters.tag);

      const res = await fetch(`/api/playbooks?${params.toString()}`);
      const data = await res.json();

      if (data.playbooks) {
        setPlaybooks(data.playbooks);
      }
    } catch (error) {
      console.error("Failed to fetch playbooks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchStrategies = useCallback(async () => {
    try {
      const res = await fetch("/api/strategies");
      const data = await res.json();
      if (data.strategies) {
        setStrategies(data.strategies);
      }
    } catch (error) {
      console.error("Failed to fetch strategies:", error);
    }
  }, []);

  useEffect(() => {
    fetchPlaybooks();
    fetchStrategies();
  }, [fetchPlaybooks, fetchStrategies]);

  const handleCreate = async (data: PlaybookInput) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/playbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await fetchPlaybooks();
        setViewMode("list");
      }
    } catch (error) {
      console.error("Failed to create playbook:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (data: PlaybookInput) => {
    if (!selectedPlaybook) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/playbooks/${selectedPlaybook.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await fetchPlaybooks();
        setViewMode("list");
        setSelectedPlaybook(null);
      }
    } catch (error) {
      console.error("Failed to update playbook:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this playbook?")) return;

    try {
      const res = await fetch(`/api/playbooks/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchPlaybooks();
        if (selectedPlaybook?.id === id) {
          setSelectedPlaybook(null);
          setViewMode("list");
        }
      }
    } catch (error) {
      console.error("Failed to delete playbook:", error);
    }
  };

  const handleEdit = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
    setViewMode("edit");
  };

  const handleView = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
    setViewMode("view");
  };

  const handleExecute = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
    setCheckedItems(new Set());
    setViewMode("execute");
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedPlaybook(null);
    setCheckedItems(new Set());
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchInput });
  };

  const toggleCheckpoint = (stepId: string, checkpointIndex: number) => {
    const key = `${stepId}-${checkpointIndex}`;
    const newChecked = new Set(checkedItems);
    if (newChecked.has(key)) {
      newChecked.delete(key);
    } else {
      newChecked.add(key);
    }
    setCheckedItems(newChecked);
  };

  const availableTags = [...new Set(playbooks.flatMap((p) => p.tags))];

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
                ? "New Playbook"
                : viewMode === "edit"
                ? "Edit Playbook"
                : viewMode === "view" || viewMode === "execute"
                ? selectedPlaybook?.name
                : "Trading Playbooks"}
            </h1>
            <p className="text-gray-600">
              {viewMode === "list"
                ? "Step-by-step guides and checklists for trading"
                : viewMode === "execute"
                ? "Execute your playbook step by step"
                : ""}
            </p>
          </div>
        </div>
        {viewMode === "list" && (
          <button
            type="button"
            onClick={() => setViewMode("create")}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <Plus className="h-5 w-5" />
            <span>New Playbook</span>
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
                  placeholder="Search playbooks..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg border ${
                  showFilters ? "bg-purple-50 border-purple-300" : "border-gray-300"
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
                    {PLAYBOOK_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="strategyFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Linked Strategy
                  </label>
                  <select
                    id="strategyFilter"
                    value={filters.strategyId || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, strategyId: e.target.value || undefined })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Strategies</option>
                    {strategies.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
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

          {/* Playbooks Grid */}
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
          ) : playbooks.length === 0 ? (
            <div className="rounded-lg bg-white p-12 shadow-md">
              <div className="text-center text-gray-500">
                <BookMarked className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No playbooks yet</h3>
                <p className="text-sm mt-2 max-w-md mx-auto">
                  Create step-by-step guides and checklists for your trading routines.
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode("create")}
                  className="mt-4 inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create First Playbook</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playbooks.map((playbook) => (
                <PlaybookCard
                  key={playbook.id}
                  playbook={playbook}
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
          <PlaybookEditor
            strategies={strategies}
            onSubmit={handleCreate}
            onCancel={handleBack}
            isLoading={isSaving}
          />
        </div>
      )}

      {viewMode === "edit" && selectedPlaybook && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <PlaybookEditor
            initialData={selectedPlaybook}
            strategies={strategies}
            onSubmit={handleUpdate}
            onCancel={handleBack}
            isLoading={isSaving}
          />
        </div>
      )}

      {viewMode === "view" && selectedPlaybook && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-end gap-2 mb-4">
            <button
              type="button"
              onClick={() => handleExecute(selectedPlaybook)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Start Checklist
            </button>
            <button
              type="button"
              onClick={() => handleEdit(selectedPlaybook)}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(selectedPlaybook.id)}
              className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>
          </div>

          {/* Playbook Info */}
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {selectedPlaybook.category}
            </span>
            {selectedPlaybook.strategy && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {selectedPlaybook.strategy.name}
              </span>
            )}
          </div>

          {selectedPlaybook.description && (
            <p className="text-gray-600 mb-6">{selectedPlaybook.description}</p>
          )}

          {/* Steps */}
          <div className="space-y-4">
            {selectedPlaybook.steps.map((step, index) => (
              <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {index + 1}. {step.title}
                </h4>
                {step.description && (
                  <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                )}
                {step.checkpoints.length > 0 && (
                  <ul className="space-y-1 mb-2">
                    {step.checkpoints.map((cp, cpIndex) => (
                      <li key={cpIndex} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-gray-300" />
                        {cp}
                      </li>
                    ))}
                  </ul>
                )}
                {step.notes && (
                  <p className="text-xs text-gray-400 italic">{step.notes}</p>
                )}
              </div>
            ))}
          </div>

          {/* Tags */}
          {selectedPlaybook.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t flex flex-wrap gap-2">
              {selectedPlaybook.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {viewMode === "execute" && selectedPlaybook && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            {selectedPlaybook.description && (
              <p className="text-gray-600">{selectedPlaybook.description}</p>
            )}
          </div>

          {/* Interactive Steps */}
          <div className="space-y-4">
            {selectedPlaybook.steps.map((step, index) => {
              const allCheckpointsChecked =
                step.checkpoints.length > 0 &&
                step.checkpoints.every((_, cpIndex) =>
                  checkedItems.has(`${step.id}-${cpIndex}`)
                );

              return (
                <div
                  key={step.id}
                  className={`border-2 rounded-lg p-4 transition-colors ${
                    allCheckpointsChecked
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    {allCheckpointsChecked && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {index + 1}. {step.title}
                  </h4>
                  {step.description && (
                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                  )}
                  {step.checkpoints.length > 0 && (
                    <ul className="space-y-2 mb-2">
                      {step.checkpoints.map((cp, cpIndex) => {
                        const isChecked = checkedItems.has(`${step.id}-${cpIndex}`);
                        return (
                          <li key={cpIndex}>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleCheckpoint(step.id, cpIndex)}
                                className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              />
                              <span
                                className={`text-sm ${
                                  isChecked ? "text-gray-400 line-through" : "text-gray-700"
                                }`}
                              >
                                {cp}
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {step.notes && (
                    <p className="text-xs text-gray-400 italic mt-2">{step.notes}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium text-gray-900">
                {checkedItems.size} /{" "}
                {selectedPlaybook.steps.reduce((acc, s) => acc + s.checkpoints.length, 0)}{" "}
                checkpoints
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all"
                style={{
                  width: `${
                    (checkedItems.size /
                      Math.max(
                        selectedPlaybook.steps.reduce((acc, s) => acc + s.checkpoints.length, 0),
                        1
                      )) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
