"use client";

import { useState } from "react";
import { X, Plus, GripVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { PlaybookInput, PlaybookStep, Strategy } from "@/types/strategy";
import { PLAYBOOK_CATEGORIES } from "@/types/strategy";

interface PlaybookEditorProps {
  initialData?: Partial<PlaybookInput> & { id?: string };
  strategies?: Strategy[];
  onSubmit: (data: PlaybookInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const POPULAR_TAGS = [
  "morning-routine", "pre-market", "entry", "exit", "management",
  "risk", "psychology", "review", "checklist", "daily", "weekly",
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function PlaybookEditor({
  initialData,
  strategies = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: PlaybookEditorProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "General");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [strategyId, setStrategyId] = useState<string | null>(initialData?.strategyId || null);
  const [steps, setSteps] = useState<PlaybookStep[]>(
    initialData?.steps || [
      { id: generateId(), title: "", description: "", checkpoints: [] },
    ]
  );
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(steps.map((s) => s.id)));

  const handleAddTag = (tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (normalizedTag && !tags.includes(normalizedTag)) {
      setTags([...tags, normalizedTag]);
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const addStep = () => {
    const newStep: PlaybookStep = {
      id: generateId(),
      title: "",
      description: "",
      checkpoints: [],
    };
    setSteps([...steps, newStep]);
    setExpandedSteps(new Set([...expandedSteps, newStep.id]));
  };

  const removeStep = (stepId: string) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((s) => s.id !== stepId));
  };

  const updateStep = (stepId: string, updates: Partial<PlaybookStep>) => {
    setSteps(steps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)));
  };

  const addCheckpoint = (stepId: string) => {
    const step = steps.find((s) => s.id === stepId);
    if (step) {
      updateStep(stepId, { checkpoints: [...step.checkpoints, ""] });
    }
  };

  const updateCheckpoint = (stepId: string, index: number, value: string) => {
    const step = steps.find((s) => s.id === stepId);
    if (step) {
      const newCheckpoints = [...step.checkpoints];
      newCheckpoints[index] = value;
      updateStep(stepId, { checkpoints: newCheckpoints });
    }
  };

  const removeCheckpoint = (stepId: string, index: number) => {
    const step = steps.find((s) => s.id === stepId);
    if (step) {
      const newCheckpoints = step.checkpoints.filter((_, i) => i !== index);
      updateStep(stepId, { checkpoints: newCheckpoints });
    }
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    const newSteps = [...steps];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up empty checkpoints
    const cleanedSteps = steps.map((s) => ({
      ...s,
      checkpoints: s.checkpoints.filter((c) => c.trim()),
    }));

    await onSubmit({
      name,
      description: description || null,
      category,
      tags,
      strategyId,
      steps: cleanedSteps,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Playbook Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="e.g., Morning Pre-Market Routine"
          required
        />
      </div>

      {/* Category & Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            {PLAYBOOK_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="strategy" className="block text-sm font-medium text-gray-700 mb-1">
            Linked Strategy (optional)
          </label>
          <select
            id="strategy"
            value={strategyId || ""}
            onChange={(e) => setStrategyId(e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">No linked strategy</option>
            {strategies.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="Brief description of this playbook..."
        />
      </div>

      {/* Steps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Steps
          </label>
          <button
            type="button"
            onClick={addStep}
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Step
          </button>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Step Header */}
              <div
                className="flex items-center gap-2 p-3 bg-gray-50 cursor-pointer"
                onClick={() => toggleStep(step.id)}
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-500 w-6">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateStep(step.id, { title: e.target.value });
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 text-sm"
                  placeholder="Step title..."
                />
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveStep(index, "up");
                    }}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveStep(index, "down");
                    }}
                    disabled={index === steps.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStep(step.id);
                    }}
                    disabled={steps.length <= 1}
                    className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-30"
                    title="Remove step"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {expandedSteps.has(step.id) ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Step Content */}
              {expandedSteps.has(step.id) && (
                <div className="p-3 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Description
                    </label>
                    <textarea
                      value={step.description}
                      onChange={(e) => updateStep(step.id, { description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      placeholder="Describe what to do in this step..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-gray-500">
                        Checkpoints
                      </label>
                      <button
                        type="button"
                        onClick={() => addCheckpoint(step.id)}
                        className="text-xs text-purple-600 hover:text-purple-700"
                      >
                        + Add checkpoint
                      </button>
                    </div>
                    {step.checkpoints.length > 0 ? (
                      <div className="space-y-2">
                        {step.checkpoints.map((checkpoint, cpIndex) => (
                          <div key={cpIndex} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-purple-600 border-gray-300 rounded"
                              disabled
                              title="Checkpoint indicator"
                            />
                            <input
                              type="text"
                              value={checkpoint}
                              onChange={(e) =>
                                updateCheckpoint(step.id, cpIndex, e.target.value)
                              }
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
                              placeholder="Checkpoint item..."
                            />
                            <button
                              type="button"
                              onClick={() => removeCheckpoint(step.id, cpIndex)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Remove checkpoint"
                              aria-label="Remove checkpoint"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        No checkpoints yet
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Notes (optional)
                    </label>
                    <input
                      type="text"
                      value={step.notes || ""}
                      onChange={(e) => updateStep(step.id, { notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
            >
              #{tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-purple-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag(newTag);
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Add a tag..."
          />
          <button
            type="button"
            onClick={() => handleAddTag(newTag)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            title="Add tag"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {POPULAR_TAGS.filter((t) => !tags.includes(t)).slice(0, 8).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleAddTag(tag)}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              +{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || !name}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Playbook"}
        </button>
      </div>
    </form>
  );
}
