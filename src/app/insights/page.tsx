"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AgentBadge } from "@/components/brand/AgentBadge";
import { LearningRecommendation, LearningInsight } from "@/types/recommendation";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Brain,
  FileText,
  Target,
  X,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

export default function LearningInsightsPage() {
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [insight, setInsight] = useState<LearningInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecommendations = async () => {
    try {
      const res = await fetch("/api/recommendations");
      const data = await res.json();
      if (data.success) {
        setRecommendations(data.recommendations || []);
        setInsight(data.insights || null);
      }
    } catch (err) {
      console.error("Failed to load insights:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleDismiss = async (id: string) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
    try {
      await fetch("/api/recommendations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error("Dismiss error:", err);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AgentBadge agent="Recommendation Agent" size="sm" />
              <span className="text-xs text-amber-400 font-mono">
                Proactive Pedagogical Telemetry Engine
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display">
              AI Learning Insights & Recommendations
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Continuously analyzed from your quiz attempts, study velocity, flashcard reviews, and uncompleted goals.
            </p>
          </div>
        </div>

        {/* Weekly Intelligence Synthesis Banner */}
        {insight && (
          <div className="glass-panel-glow p-6 lg:p-8 rounded-2xl space-y-4 border border-amber-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Weekly Learning Intelligence Synthesis
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                Telemetry Verified
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-3xl">
              {insight.weeklySummary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">
                  Today's Top Action
                </span>
                <p className="text-xs font-semibold text-white truncate">
                  {insight.todayRecommendedTask}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-400">
                  Targeted Topics to Revise
                </span>
                <p className="text-xs font-semibold text-gray-200 truncate">
                  {insight.topicsToRevise.join(", ")}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-sky-400">
                  Upcoming Spaced Reviews
                </span>
                <p className="text-xs font-semibold text-gray-200">
                  {insight.upcomingReviews} Flashcard{insight.upcomingReviews === 1 ? "" : "s"} due today
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Active Prioritized Recommendations List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white font-display">
              Actionable Learning Recommendations ({recommendations.length})
            </h3>
            <span className="text-xs text-gray-400 font-mono">
              Prioritized by pedagogical urgency
            </span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => {
              const isHigh = rec.priority === "high";

              return (
                <div
                  key={rec.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isHigh
                      ? "bg-gradient-to-r from-rose-950/20 via-[#0d1222] to-amber-950/20 border-rose-500/30 shadow-glow"
                      : "bg-[#0d1222] border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          rec.priority === "high"
                            ? "bg-rose-950/80 border-rose-800 text-rose-300"
                            : rec.priority === "medium"
                            ? "bg-amber-950/80 border-amber-800 text-amber-300"
                            : "bg-white/5 border-white/10 text-gray-400"
                        }`}
                      >
                        {rec.priority} Priority
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono capitalize">
                        • {rec.category.replace("_", " ")}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{rec.activity}</h4>

                    <p className="text-xs text-gray-300 leading-relaxed">
                      <strong>Why this matters:</strong> {rec.reason}
                    </p>

                    <p className="text-[11px] text-gray-400 italic">
                      <strong>Expected Outcome:</strong> {rec.expectedOutcome}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                    <Link
                      href={rec.actionHref}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all flex items-center gap-1.5"
                    >
                      <span>Execute</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDismiss(rec.id)}
                      className="p-2 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
                      title="Dismiss recommendation"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {recommendations.length === 0 && (
              <div className="text-center py-16 text-gray-500 text-xs glass-panel rounded-2xl">
                All recommendations up to date! Great job maintaining your learning velocity.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
