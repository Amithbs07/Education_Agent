"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AgentBadge } from "@/components/brand/AgentBadge";
import { INITIAL_LEARNING_PATHS } from "@/lib/supabase/mock-store";
import { LearningPath, LearningModule } from "@/types/plan";
import {
  GitFork,
  PlusCircle,
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  BookOpen,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Target,
  Code,
  Flame,
  Layers,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

export default function LearningPathsPage() {
  const [paths, setPaths] = useState<LearningPath[]>(INITIAL_LEARNING_PATHS);
  const [activePathId, setActivePathId] = useState(INITIAL_LEARNING_PATHS[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>("mod_1");

  // Form states for new path generator
  const [newSubject, setNewSubject] = useState("");
  const [newTargetGoal, setNewTargetGoal] = useState("");
  const [newCurrentLevel, setNewCurrentLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [newHoursPerWeek, setNewHoursPerWeek] = useState(8);
  const [newTargetDate, setNewTargetDate] = useState("2026-12-31");

  const activePath = paths.find((p) => p.id === activePathId) || paths[0];

  const handleToggleModule = (modId: string) => {
    setPaths((prev) =>
      prev.map((p) => {
        if (p.id !== activePathId) return p;
        const updatedModules = p.modules.map((m) =>
          m.id === modId ? { ...m, isCompleted: !m.isCompleted } : m
        );
        const completedHours = updatedModules
          .filter((m) => m.isCompleted)
          .reduce((acc, m) => acc + m.estimatedHours, 0);
        const progressPercentage = Math.round((completedHours / p.totalEstimatedHours) * 100);

        return {
          ...p,
          modules: updatedModules,
          completedHours,
          progressPercentage,
        };
      })
    );
  };

  const handleGeneratePath = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/agent/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: newSubject,
          targetGoal: newTargetGoal || `Mastery in ${newSubject}`,
          currentLevel: newCurrentLevel,
          availableHoursPerWeek: newHoursPerWeek,
          targetDate: newTargetDate,
        }),
      });

      const data = await res.json();
      if (data.success && data.learningPath) {
        setPaths([data.learningPath, ...paths]);
        setActivePathId(data.learningPath.id);
        setShowCreateModal(false);
        setNewSubject("");
        setNewTargetGoal("");
      }
    } catch (err) {
      console.error("Path generation failed:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AgentBadge agent="Study Planner Agent" size="sm" />
              <span className="text-xs text-sky-400 font-mono">Personalized Curriculum Engine</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display">
              Personalized Learning Paths
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Structured roadmaps, topic-wise objectives, curated resources, and checkpoint milestones.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all shrink-0 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate New Learning Path</span>
          </button>
        </div>

        {/* Path Tabs Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/5">
          {paths.map((p) => {
            const isSelected = p.id === activePathId;
            return (
              <button
                key={p.id}
                onClick={() => setActivePathId(p.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 whitespace-nowrap ${
                  isSelected
                    ? "bg-violet-950/70 border-violet-500 text-white shadow-glow"
                    : "bg-white/[0.02] border-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
                }`}
              >
                <GitFork className="w-3.5 h-3.5 text-sky-400" />
                <span>{p.title}</span>
                <span className="text-[10px] font-mono text-violet-300 ml-1">
                  {p.progressPercentage}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Roadmap Hero Card */}
        {activePath && (
          <div className="glass-panel p-6 lg:p-8 rounded-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
                    {activePath.subject}
                  </span>
                  <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300 capitalize">
                    {activePath.currentLevel} → {activePath.targetLevel}
                  </span>
                </div>
                <h2 className="text-xl lg:text-2xl font-bold text-white">
                  {activePath.title}
                </h2>
                <p className="text-xs text-gray-400 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-violet-400" />
                  <span>Objective: <strong className="text-gray-200">{activePath.targetRoleOrGoal}</strong></span>
                </p>
              </div>

              {/* Progress Summary Pill */}
              <div className="bg-black/40 p-4 rounded-xl border border-white/10 flex items-center gap-6 shrink-0">
                <div>
                  <div className="text-[10px] uppercase font-bold text-gray-400">Total Hours</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">
                    {activePath.completedHours} / {activePath.totalEstimatedHours}h
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Target Deadline</div>
                  <div className="text-base font-bold text-sky-400 font-mono mt-0.5">
                    {activePath.targetDate}
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-300">Curriculum Progress</span>
                <span className="text-sky-400 font-mono">{activePath.progressPercentage}% Completed</span>
              </div>
              <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-500 to-sky-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${activePath.progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Revision & Checkpoint Timeline */}
            <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-violet-300 uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Active Revision Checkpoints (Spaced Retrieval)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activePath.revisionSchedule.map((cp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="font-semibold text-white">{cp.checkpointName}</span>
                      <span className="font-mono text-sky-400">Day {cp.targetDay}</span>
                    </div>
                    <p className="text-[11px] text-gray-400">{cp.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modules Roadmap Node Tree */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-white font-display">
              Curriculum Modules & Practice Milestones
            </h3>
            <span className="text-xs text-gray-400 font-mono">
              {activePath?.modules.length} Detailed Stages
            </span>
          </div>

          <div className="space-y-3">
            {activePath?.modules.map((module, index) => {
              const isExpanded = expandedModuleId === module.id;

              return (
                <div
                  key={module.id}
                  className={`rounded-2xl border transition-all ${
                    module.isCompleted
                      ? "bg-white/[0.01] border-white/5 opacity-80"
                      : "bg-[#0f1422] border-white/10 hover:border-violet-500/30"
                  }`}
                >
                  {/* Module Accordion Header */}
                  <div className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <button
                        onClick={() => handleToggleModule(module.id)}
                        className="text-gray-400 hover:text-white transition-colors shrink-0"
                        title={module.isCompleted ? "Mark incomplete" : "Mark completed"}
                      >
                        {module.isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-500 hover:text-sky-400" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest">
                            Stage {index + 1}
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">
                            • {module.estimatedHours} Hours
                          </span>
                        </div>
                        <h4
                          className={`text-sm font-semibold truncate ${
                            module.isCompleted ? "line-through text-gray-400" : "text-white"
                          }`}
                        >
                          {module.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setExpandedModuleId(isExpanded ? null : module.id)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                      >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Module Details */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-white/5 space-y-4 text-xs">
                      <p className="text-gray-300 leading-relaxed">{module.description}</p>

                      {/* Objectives */}
                      <div>
                        <span className="font-semibold text-sky-300 uppercase tracking-wider text-[10px] block mb-1.5">
                          Key Learning Objectives:
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-gray-300 pl-1">
                          {module.objectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Core Topics */}
                      <div>
                        <span className="font-semibold text-violet-300 uppercase tracking-wider text-[10px] block mb-1.5">
                          Topics Covered:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {module.keyTopics.map((top, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-gray-300 font-mono text-[11px]"
                            >
                              {top}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Hands-On Practice Exercise */}
                      <div className="p-3.5 rounded-xl bg-violet-950/30 border border-violet-500/20">
                        <div className="flex items-center gap-1.5 text-violet-300 font-semibold mb-1">
                          <Code className="w-3.5 h-3.5" />
                          <span>Hands-On Practice Activity:</span>
                        </div>
                        <p className="text-gray-300">{module.practiceExercise}</p>
                      </div>

                      {/* Recommended Resources */}
                      {module.recommendedResources.length > 0 && (
                        <div>
                          <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px] block mb-1.5">
                            Curated Resources:
                          </span>
                          <div className="space-y-1.5">
                            {module.recommendedResources.map((res, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 text-gray-300"
                              >
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                                  <span>{res.title}</span>
                                </div>
                                <span className="text-[10px] uppercase font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                                  {res.type}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal: Generate New Learning Path */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-xl w-full glass-panel-glow p-6 md:p-8 rounded-2xl border border-violet-500/40 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AgentBadge agent="Study Planner Agent" size="sm" />
                  <h3 className="font-bold text-lg text-white">Generate Custom Learning Path</h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white text-xs font-semibold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleGeneratePath} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Subject or Skill to Master
                  </label>
                  <input
                    type="text"
                    required
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g. Deep Learning & Transformers, Rust Concurrency, Quantum Mechanics..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Specific Learning Goal or Role
                  </label>
                  <input
                    type="text"
                    value={newTargetGoal}
                    onChange={(e) => setNewTargetGoal(e.target.value)}
                    placeholder="e.g. Build production LLM systems from scratch"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Current Knowledge Level
                    </label>
                    <select
                      value={newCurrentLevel}
                      onChange={(e) => setNewCurrentLevel(e.target.value as any)}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="beginner">Beginner (Foundational)</option>
                      <option value="intermediate">Intermediate (Working Knowledge)</option>
                      <option value="advanced">Advanced (Deep Specialization)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Weekly Hours: {newHoursPerWeek}h
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="30"
                      value={newHoursPerWeek}
                      onChange={(e) => setNewHoursPerWeek(Number(e.target.value))}
                      className="w-full accent-violet-500 mt-2 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white text-xs font-semibold shadow-glow disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating Curriculum...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Roadmap</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
