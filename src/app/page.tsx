"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AgentBadge } from "@/components/brand/AgentBadge";
import {
  DEFAULT_PROFILE,
  INITIAL_TASKS,
  INITIAL_LEARNING_PATHS,
  INITIAL_ACTIVITIES,
} from "@/lib/supabase/mock-store";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Flame,
  TrendingUp,
  BookOpen,
  GraduationCap,
  FileText,
  Brain,
  Lightbulb,
  Target,
  ArrowUpRight,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const [profile] = useState(DEFAULT_PROFILE);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const activePath = INITIAL_LEARNING_PATHS[0];

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const completedTaskCount = tasks.filter((t) => t.isCompleted).length;
  const progressRatio = Math.round((completedTaskCount / tasks.length) * 100);

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Top Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-950/60 via-surface-card to-sky-950/40 border border-violet-500/20 p-6 lg:p-8">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-violet-500/10 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AgentBadge agent="Supervisor Agent" size="sm" />
                <span className="text-xs text-violet-300 font-mono">Academic Session #42</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-black text-white font-display">
                Welcome back, {profile.displayName}
              </h1>
              <p className="text-sm text-gray-300 max-w-xl">
                Your AI Tutor has analyzed your recent queries. You're on track with{" "}
                <span className="text-sky-300 font-medium">Distributed Systems</span>. Ready for today's milestone?
              </p>
            </div>

            {/* Quick Stats Strip */}
            <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md p-3.5 rounded-xl border border-white/5">
              <div className="text-center px-3 border-r border-white/10">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-lg">
                  <Flame className="w-5 h-5 fill-amber-400 text-amber-500" />
                  <span>{profile.streakDays}</span>
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                  Day Streak
                </div>
              </div>

              <div className="text-center px-3 border-r border-white/10">
                <div className="text-lg font-bold text-sky-400 font-mono">
                  {progressRatio}%
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                  Tasks Today
                </div>
              </div>

              <div className="text-center px-3">
                <div className="text-lg font-bold text-emerald-400 font-mono">
                  92%
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                  Quiz Avg
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Quick Actions Launcher Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/tutor"
            className="glass-panel p-4 rounded-xl hover:border-violet-500/40 hover:bg-violet-950/20 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-violet-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-sm text-white mt-3">Ask AI Tutor</h3>
            <p className="text-xs text-gray-400 mt-1">
              Step-by-step explanations, math derivations & analogies.
            </p>
          </Link>

          <Link
            href="/assessment"
            className="glass-panel p-4 rounded-xl hover:border-sky-500/40 hover:bg-sky-950/20 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center border border-sky-500/20 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-sky-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-sm text-white mt-3">Generate AI Quiz</h3>
            <p className="text-xs text-gray-400 mt-1">
              Adaptive MCQs & conceptual tests with instant evaluation.
            </p>
          </Link>

          <Link
            href="/learning-paths"
            className="glass-panel p-4 rounded-xl hover:border-emerald-500/40 hover:bg-emerald-950/20 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-sm text-white mt-3">Study Roadmap</h3>
            <p className="text-xs text-gray-400 mt-1">
              Structured milestone schedules tailored to your deadlines.
            </p>
          </Link>

          <Link
            href="/documents"
            className="glass-panel p-4 rounded-xl hover:border-indigo-500/40 hover:bg-indigo-950/20 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition-colors" />
            </div>
            <h3 className="font-semibold text-sm text-white mt-3">Analyze Document</h3>
            <p className="text-xs text-gray-400 mt-1">
              Upload PDFs or lecture notes for grounded RAG Q&A.
            </p>
          </Link>
        </div>

        {/* Middle Two-Column Grid: Active Path + Today's Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Learning Path Card (2 cols) */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    In Progress Roadmap
                  </span>
                  <span className="text-[10px] bg-sky-950/80 text-sky-300 border border-sky-800/40 px-2 py-0.5 rounded-full">
                    {activePath.subject}
                  </span>
                </div>
                <Link
                  href="/learning-paths"
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  View Full Tree <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <h2 className="text-xl font-bold text-white mb-2">
                {activePath.title}
              </h2>
              <p className="text-xs text-gray-400 mb-6">
                Targeting: <span className="text-gray-200">{activePath.targetRoleOrGoal}</span> • Target Completion: {activePath.targetDate}
              </p>

              {/* Progress Bar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-300">Curriculum Progress</span>
                  <span className="text-sky-400 font-mono">
                    {activePath.completedHours} / {activePath.totalEstimatedHours} hours ({activePath.progressPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-sky-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${activePath.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Next Upcoming Module */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-violet-300">Next Active Module:</span>
                  <span className="text-gray-500 font-mono">8 hours remaining</span>
                </div>
                <h4 className="text-sm font-semibold text-white">
                  Module 3: Event-Driven Messaging & Partitioning Strategies
                </h4>
                <p className="text-xs text-gray-400">
                  Kafka architecture, consumer groups, offsets, and ordering guarantees.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" /> Estimated 4 days left in this milestone
              </span>
              <Link
                href="/learning-paths"
                className="px-4 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold transition-all"
              >
                Continue Module
              </Link>
            </div>
          </div>

          {/* Today's Study Tasks Checklist (1 col) */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">Today's Study Plan</h3>
                </div>
                <span className="text-xs font-mono text-gray-400">
                  {completedTaskCount}/{tasks.length} done
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                Curated by the Study Planner Agent based on your 75-min daily goal.
              </p>

              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      task.isCompleted
                        ? "bg-white/[0.01] border-white/5 opacity-60"
                        : "bg-white/[0.03] border-white/10 hover:border-violet-500/30"
                    }`}
                  >
                    <div className="pt-0.5">
                      {task.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-500 hover:text-white shrink-0" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium text-white truncate ${
                          task.isCompleted ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                        <span className="text-violet-300">{task.subject}</span>
                        <span>•</span>
                        <span>{task.durationMinutes}m</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/5">
              <Link
                href="/study-planner"
                className="w-full block text-center py-2 text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                Open Full Study Planner →
              </Link>
            </div>
          </div>
        </div>

        {/* Proactive Section: Your AI Learning Insights */}
        <div className="glass-panel-glow p-6 lg:p-8 rounded-2xl border border-amber-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <AgentBadge agent="Recommendation Agent" size="sm" />
              <h3 className="font-bold text-base text-white">Your AI Learning Insights</h3>
            </div>
            <Link
              href="/insights"
              className="text-xs text-amber-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>View All Recommendations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                Today's Priority Task
              </span>
              <p className="font-semibold text-white">
                Implement Token Bucket Rate Limiter
              </p>
              <Link href="/study-planner" className="text-[11px] text-sky-300 hover:underline inline-block mt-1">
                View Task Checklist →
              </Link>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Topics to Revise
              </span>
              <p className="font-semibold text-gray-200">
                Consensus Quorums (Raft)
              </p>
              <Link href="/assessment" className="text-[11px] text-rose-300 hover:underline inline-block mt-1">
                Take Diagnostic Quiz →
              </Link>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                Upcoming Spaced Reviews
              </span>
              <p className="font-semibold text-white">
                2 Flashcards Due Today
              </p>
              <Link href="/flashcards" className="text-[11px] text-violet-300 hover:underline inline-block mt-1">
                Review Flashcard Deck →
              </Link>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Career Milestone
              </span>
              <p className="font-semibold text-white">
                AI/ML Engineer Stage 1
              </p>
              <Link href="/career-guidance" className="text-[11px] text-emerald-300 hover:underline inline-block mt-1">
                Explore Skill Tree →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section: AI Recommendations & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Pedagogical Recommendation (1 col) */}
          <div className="glass-panel-glow p-6 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-violet-400 uppercase tracking-wider mb-2">
              <Lightbulb className="w-4 h-4" />
              <span>Next Recommended Activity</span>
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              Practice B+ Tree Node Splitting
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              <strong>Why this is relevant:</strong> You asked your AI Tutor about B+ Trees vs Binary Search Trees yesterday. An active recall exercise will solidify how leaf node overflow triggers parent propagation before you move on to indexing joins.
            </p>
            <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/20 text-xs text-violet-200 mb-4 font-mono">
              Suggested: 3-question diagnostic quiz (est. 6 mins)
            </div>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold shadow-glow hover:opacity-90 transition-all"
            >
              Start Diagnostic Quiz <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recent Verified Activities Feed (2 cols) */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-white">Recent Learning Activities</h3>
                <p className="text-xs text-gray-400">
                  Recorded telemetry powering your verified performance analytics.
                </p>
              </div>
              <Link
                href="/analytics"
                className="text-xs text-sky-400 hover:underline flex items-center gap-1"
              >
                Full Analytics <TrendingUp className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {INITIAL_ACTIVITIES.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-300 border border-white/5">
                      {act.activityType === "tutor_chat" && <GraduationCap className="w-4 h-4 text-sky-400" />}
                      {act.activityType === "quiz_completed" && <Brain className="w-4 h-4 text-amber-400" />}
                      {act.activityType === "task_completed" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {act.activityType === "flashcard_reviewed" && <BookOpen className="w-4 h-4 text-fuchsia-400" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {act.details?.topic || act.details?.quizTitle || act.details?.task || "Review Session"}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {act.subject} • {act.durationMinutes} mins
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {act.scorePercentage ? (
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                        {act.scorePercentage}%
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-500 font-mono">Completed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
