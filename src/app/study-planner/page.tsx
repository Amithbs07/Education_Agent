"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AgentBadge } from "@/components/brand/AgentBadge";
import { INITIAL_TASKS } from "@/lib/supabase/mock-store";
import { StudyTask } from "@/types/plan";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  PlusCircle,
  Clock,
  Filter,
  Flame,
  AlertCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function StudyPlannerPage() {
  const [tasks, setTasks] = useState<StudyTask[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "high_priority">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("Distributed Systems");
  const [newDueDate, setNewDueDate] = useState("2026-11-10");
  const [newDuration, setNewDuration] = useState(45);
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");
  const [newNotes, setNewNotes] = useState("");

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: StudyTask = {
      id: `task_${Date.now()}`,
      userId: "user_citadel_01",
      title: newTitle,
      subject: newSubject,
      dueDate: newDueDate,
      durationMinutes: newDuration,
      priority: newPriority,
      notes: newNotes,
      isCompleted: false,
    };

    setTasks([newTask, ...tasks]);
    setShowAddModal(false);
    setNewTitle("");
    setNewNotes("");
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return !t.isCompleted;
    if (filter === "completed") return t.isCompleted;
    if (filter === "high_priority") return t.priority === "high";
    return true;
  });

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalMinutes = tasks.reduce((acc, t) => acc + (t.isCompleted ? t.durationMinutes : 0), 0);
  const plannedMinutes = tasks.reduce((acc, t) => acc + t.durationMinutes, 0);

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AgentBadge agent="Study Planner Agent" size="sm" />
              <span className="text-xs text-emerald-400 font-mono">Dynamic Daily & Weekly Scheduler</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display">
              Intelligent Study Planner
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Personalized schedules organized by priority, deadlines, and active retrieval checkpoints.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-glow transition-all shrink-0 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Study Task</span>
          </button>
        </div>

        {/* Study Velocity Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Completed Tasks
            </span>
            <div className="text-2xl font-bold text-white font-mono">
              {completedCount} <span className="text-xs text-gray-500">/ {tasks.length}</span>
            </div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {Math.round((completedCount / (tasks.length || 1)) * 100)}% completion rate
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Time Studied Today
            </span>
            <div className="text-2xl font-bold text-sky-400 font-mono">
              {totalMinutes}m <span className="text-xs text-gray-500">/ {plannedMinutes}m</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Daily goal: 75 minutes
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Study Streak
            </span>
            <div className="text-2xl font-bold text-amber-400 font-mono flex items-center gap-1.5">
              <Flame className="w-5 h-5 fill-amber-400 text-amber-500" />
              <span>5 Days</span>
            </div>
            <p className="text-[11px] text-amber-300">
              Consistent active recall active
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Next Checkpoint
            </span>
            <div className="text-sm font-bold text-violet-300 truncate mt-1">
              Consensus Protocols (Raft)
            </div>
            <p className="text-[11px] text-gray-400">
              Scheduled: Tomorrow 10:00 AM
            </p>
          </div>
        </div>

        {/* Task Management Section with Filters */}
        <div className="glass-panel p-6 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-semibold text-gray-300">Filter View:</span>
              <div className="flex gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                {(["all", "pending", "high_priority", "completed"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilter(mode)}
                    className={`px-3 py-1 rounded-lg capitalize font-medium text-[11px] transition-all ${
                      filter === mode
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {mode.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs font-mono text-gray-400">
              Showing {filteredTasks.length} task{filteredTasks.length === 1 ? "" : "s"}
            </span>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                  task.isCompleted
                    ? "bg-white/[0.01] border-white/5 opacity-70"
                    : "bg-[#0f1422] border-white/10 hover:border-emerald-500/30"
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-0.5 text-gray-400 hover:text-emerald-400 transition-colors shrink-0"
                >
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-500 hover:text-white" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 font-mono">
                      {task.subject}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                        task.priority === "high"
                          ? "bg-rose-950/60 border-rose-800 text-rose-300"
                          : task.priority === "medium"
                          ? "bg-amber-950/60 border-amber-800 text-amber-300"
                          : "bg-white/5 border-white/10 text-gray-400"
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                  </div>

                  <h4
                    className={`text-sm font-semibold mt-1 ${
                      task.isCompleted ? "line-through text-gray-400" : "text-white"
                    }`}
                  >
                    {task.title}
                  </h4>

                  {task.notes && (
                    <p className="text-xs text-gray-400 mt-1">{task.notes}</p>
                  )}

                  <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.durationMinutes} minutes
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" /> Due {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-xs">
                No tasks match the selected filter.
              </div>
            )}
          </div>
        </div>

        {/* Modal: Add New Task */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-lg w-full glass-panel-glow p-6 md:p-8 rounded-2xl border border-emerald-500/40 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AgentBadge agent="Study Planner Agent" size="sm" />
                  <h3 className="font-bold text-lg text-white">Schedule Study Task</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white text-xs font-semibold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Task Title / Objective
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Implement Raft Log Replication in Go"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="240"
                      step="5"
                      value={newDuration}
                      onChange={(e) => setNewDuration(Number(e.target.value))}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Priority Level
                    </label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Study Notes / Key References (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="e.g. Focus on edge case where follower rejects append entries due to term mismatch."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-glow transition-all"
                  >
                    Save Task
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
