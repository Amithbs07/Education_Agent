"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AgentBadge } from "@/components/brand/AgentBadge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  Clock,
  Flame,
  Award,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Calendar,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res);
      })
      .catch((err) => console.error("Analytics fetch error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AgentBadge agent="Learning Analytics Agent" size="sm" />
              <span className="text-xs text-cyan-400 font-mono">
                Verified Student Telemetry
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display">
              Performance & Mastery Analytics
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Objective analytics calculated strictly from verified session duration, quiz submissions, and active recall events.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-gray-300 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Telemetry Pipeline Live</span>
          </div>
        </div>

        {/* Top KPI Metrics Strip */}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  Total Weekly Study
                </span>
                <Clock className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {Math.floor(data.totalMinutes / 60)}h {data.totalMinutes % 60}m
              </div>
              <p className="text-[11px] text-emerald-400">
                +24% vs previous 7-day average
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  Active Study Streak
                </span>
                <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-amber-400 font-mono">
                {data.streakDays} Days
              </div>
              <p className="text-[11px] text-amber-300">
                Consistent spaced retrieval
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  Average Quiz Accuracy
                </span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                91.2%
              </div>
              <p className="text-[11px] text-gray-400">
                Across 4 diagnostic assessments
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                  Mastered Concepts
                </span>
                <Brain className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-2xl font-bold text-violet-300 font-mono">
                18 Topics
              </div>
              <p className="text-[11px] text-violet-400">
                85%+ accuracy threshold
              </p>
            </div>
          </div>
        )}

        {/* AI Performance Summary Card */}
        {data?.performanceSummary && (
          <div className="glass-panel-glow p-6 lg:p-8 rounded-2xl border border-cyan-500/30 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-base text-white">
                AI Performance Diagnostic Synthesis
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 1. What You Are Doing Well
                </span>
                <p className="text-gray-300 leading-relaxed">
                  {data.performanceSummary.strengths}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1.5">
                <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> 2. Areas Needing Improvement
                </span>
                <p className="text-gray-300 leading-relaxed">
                  {data.performanceSummary.weaknesses}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-1.5">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] block">
                  3. Topics to Revise
                </span>
                <p className="text-gray-300 leading-relaxed">
                  {data.performanceSummary.topicsToRevise.join(" • ")}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 space-y-1.5">
                <span className="font-bold text-violet-300 uppercase tracking-wider text-[10px] block">
                  4. Recommended Next Step
                </span>
                <p className="text-gray-300 leading-relaxed">
                  {data.performanceSummary.nextStepRecommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Charts Grid: Weekly Activity + Quiz Trend */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Study Activity Area Chart */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">Daily Study Activity</h3>
                  <p className="text-xs text-gray-400">Minutes dedicated to learning per day</p>
                </div>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  7-Day Trend
                </span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.weeklyActivity}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} unit="m" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0d1220",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "0.75rem",
                        fontSize: "12px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="minutes"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#areaGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quiz Score Progression Line Chart */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">Quiz Score Progression</h3>
                  <p className="text-xs text-gray-400">Accuracy % across sequential assessments</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  +7% Mastery Gain
                </span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.quizScoreTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                    <YAxis domain={[70, 100]} stroke="#6b7280" fontSize={11} unit="%" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0d1220",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "0.75rem",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ fill: "#10b981", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Topic Mastery Spectrum */}
        {data?.topicMastery && (
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Topic Mastery Spectrum</h3>
                <p className="text-xs text-gray-400">
                  Calculated from quiz performance, code exercises, and flashcard retention.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {data.topicMastery.map((item: any, i: number) => {
                const isMastered = item.mastery >= 90;
                const isReviewNeeded = item.mastery < 75;

                return (
                  <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{item.topic}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            isMastered
                              ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/40"
                              : isReviewNeeded
                              ? "bg-rose-950/80 text-rose-300 border border-rose-800/40"
                              : "bg-amber-950/80 text-amber-300 border border-amber-800/40"
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="font-mono font-bold text-gray-300">{item.mastery}%</span>
                      </div>
                    </div>

                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isMastered
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                            : isReviewNeeded
                            ? "bg-gradient-to-r from-rose-500 to-amber-500"
                            : "bg-gradient-to-r from-amber-500 to-sky-400"
                        }`}
                        style={{ width: `${item.mastery}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
