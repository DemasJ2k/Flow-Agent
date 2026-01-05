"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen, Plus, BarChart2, ArrowLeft } from "lucide-react";
import { JournalEditor } from "@/components/journal/journal-editor";
import { JournalCard } from "@/components/journal/journal-card";
import { JournalFilters } from "@/components/journal/journal-filters";
import { JournalStatsPanel } from "@/components/journal/journal-stats";
import type { JournalEntry, JournalEntryInput, JournalFilters as Filters, JournalStats } from "@/types/journal";

type ViewMode = "list" | "create" | "edit" | "view" | "stats";

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState<JournalStats | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set("search", filters.search);
      if (filters.entryType) params.set("type", filters.entryType);
      if (filters.tag) params.set("tag", filters.tag);
      if (filters.mood) params.set("mood", filters.mood);
      if (filters.outcome) params.set("outcome", filters.outcome);
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);

      const res = await fetch(`/api/journal?${params.toString()}`);
      const data = await res.json();

      if (data.entries) {
        setEntries(data.entries);
        const allTags = data.entries.flatMap((e: JournalEntry) => e.tags);
        setAvailableTags([...new Set(allTags)] as string[]);
      }
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/journal/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
    fetchStats();
  }, [fetchEntries, fetchStats]);

  const handleCreate = async (data: JournalEntryInput) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await fetchEntries();
        await fetchStats();
        setViewMode("list");
      }
    } catch (error) {
      console.error("Failed to create entry:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (data: JournalEntryInput) => {
    if (!selectedEntry) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/journal/${selectedEntry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await fetchEntries();
        await fetchStats();
        setViewMode("list");
        setSelectedEntry(null);
      }
    } catch (error) {
      console.error("Failed to update entry:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const res = await fetch(`/api/journal/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchEntries();
        await fetchStats();
        if (selectedEntry?.id === id) {
          setSelectedEntry(null);
          setViewMode("list");
        }
      }
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setViewMode("edit");
  };

  const handleView = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setViewMode("view");
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedEntry(null);
  };

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
                ? "New Journal Entry"
                : viewMode === "edit"
                ? "Edit Entry"
                : viewMode === "view"
                ? selectedEntry?.title
                : viewMode === "stats"
                ? "Journal Analytics"
                : "Trading Journal"}
            </h1>
            <p className="text-gray-600">
              {viewMode === "list"
                ? "Log your trades and track your progress"
                : viewMode === "stats"
                ? "Track your trading performance"
                : ""}
            </p>
          </div>
        </div>
        {viewMode === "list" && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setViewMode("stats")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <BarChart2 className="h-5 w-5" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("create")}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              <span>New Entry</span>
            </button>
          </div>
        )}
      </div>

      {viewMode === "list" && (
        <>
          <JournalFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableTags={availableTags}
          />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-16 bg-gray-200 rounded mb-3" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-gray-200 rounded w-16" />
                    <div className="h-5 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="rounded-lg bg-white p-12 shadow-md">
              <div className="text-center text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No journal entries yet</h3>
                <p className="text-sm mt-2 max-w-md mx-auto">
                  Start documenting your trades, market observations, and trading thoughts.
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode("create")}
                  className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create First Entry</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entries.map((entry) => (
                <JournalCard
                  key={entry.id}
                  entry={entry}
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
          <JournalEditor
            onSubmit={handleCreate}
            onCancel={handleBack}
            isLoading={isSaving}
          />
        </div>
      )}

      {viewMode === "edit" && selectedEntry && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <JournalEditor
            initialData={selectedEntry}
            onSubmit={handleUpdate}
            onCancel={handleBack}
            isLoading={isSaving}
          />
        </div>
      )}

      {viewMode === "view" && selectedEntry && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-end gap-2 mb-4">
            <button
              type="button"
              onClick={() => handleEdit(selectedEntry)}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDelete(selectedEntry.id)}
              className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>
          </div>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{selectedEntry.content}</p>
          </div>
          {selectedEntry.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t flex flex-wrap gap-2">
              {selectedEntry.tags.map((tag) => (
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

      {viewMode === "stats" && (
        <JournalStatsPanel stats={stats} isLoading={isLoading} />
      )}
    </div>
  );
}
