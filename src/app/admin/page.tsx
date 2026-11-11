"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AgentBadge } from "@/components/brand/AgentBadge";
import {
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Database,
  Activity,
  Users,
  Clock,
  Sparkles,
  Server,
  Lock,
  EyeOff,
  RefreshCw,
} from "lucide-react";

export default function AdminObservabilityPage() {
  const [currentRole, setCurrentRole] = useState<"admin" | "student">("admin");
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async (roleToUse: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/metrics?role=${roleToUse}`, {
        headers: { "x-user-role": roleToUse },
      });
      if (res.status === 403) {
        setData(null);
      } else {
        const json = await res.json();
        if (json.success) setData(json);
      }
    } catch (err) {
      console.error("Failed to load admin metrics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics(currentRole);
  }, [currentRole]);

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header Bar & Role Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded border border-violet-800/40">
                RBAC Security Layer
              </span>
              <span className="text-xs text-gray-400 font-mono">
                System Observability & Monitoring
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display">
              Educator & Agent Observability
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Multi-agent routing telemetry, API execution latency, and system health status.
            </p>
          </div>

          {/* Role Simulation Switcher */}
          <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 text-xs self-start md:self-auto">
            <span className="text-gray-400 px-2 text-[11px] font-medium">Role:</span>
            <button
              onClick={() => setCurrentRole("admin")}
              className={`px-3 py-1 rounded-xl font-medium transition-all ${
                currentRole === "admin"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Administrator
            </button>
            <button
              onClick={() => setCurrentRole("student")}
              className={`px-3 py-1 rounded-xl font-medium transition-all ${
                currentRole === "student"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Student (Restricted)
            </button>
          </div>
        </div>

        {/* =========================================================================
            RESTRICTED ACCESS VIEW (WHEN IN STUDENT ROLE)
           ========================================================================= */}
        {currentRole === "student" && (
          <div className="p-12 rounded-3xl glass-panel text-center max-w-2xl mx-auto space-y-4 border border-rose-500/30">
            <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-glow">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white">
              Access Restricted (403 Forbidden)
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              You are viewing the platform with <strong>Student</strong> permissions. Administrator and Educator observability telemetry is strictly protected by role-based access control.
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-400 flex items-center gap-2 text-left">
              <EyeOff className="w-4 h-4 text-violet-400 shrink-0" />
              <span>
                <strong>Privacy Guarantee:</strong> Student private notes, conversations, and uploaded documents are isolated by PostgreSQL Row-Level Security and are never exposed without authorization.
              </span>
            </div>
            <button
              onClick={() => setCurrentRole("admin")}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-all mt-2"
            >
              Switch back to Administrator Role
            </button>
          </div>
        )}

        {/* =========================================================================
            ADMINISTRATOR / EDUCATOR OBSERVABILITY VIEW
           ========================================================================= */}
        {currentRole === "admin" && data && (
          <div className="space-y-6">
            {/* System Health Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/20">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Google Gemini Gateway</h4>
                    <span className="text-[10px] text-gray-400 font-mono">gemini-1.5-flash / pro</span>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {data.systemHealth.geminiApi}
                </span>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center border border-sky-500/20">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Vector RAG Database</h4>
                    <span className="text-[10px] text-gray-400 font-mono">pgvector & Cosine Ranker</span>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {data.systemHealth.vectorDb}
                </span>
              </div>

              <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Multi-Agent Orchestrator</h4>
                    <span className="text-[10px] text-gray-400 font-mono">Supervisor Dispatcher</span>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {data.systemHealth.orchestrator}
                </span>
              </div>
            </div>

            {/* Platform Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Total Registered Students
                </span>
                <div className="text-2xl font-bold text-white font-mono">
                  {data.metrics.totalRegisteredStudents}
                </div>
                <p className="text-[11px] text-gray-400">Undergraduate & Professional</p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Active Learners (24h)
                </span>
                <div className="text-2xl font-bold text-sky-400 font-mono">
                  {data.metrics.activeLearnersToday}
                </div>
                <p className="text-[11px] text-emerald-400">+12% daily engagement</p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Total Study Hours Logged
                </span>
                <div className="text-2xl font-bold text-violet-300 font-mono">
                  {data.metrics.totalStudyHours24h}h
                </div>
                <p className="text-[11px] text-gray-400">Verified session telemetry</p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Platform Error Rate
                </span>
                <div className="text-2xl font-bold text-emerald-400 font-mono">
                  {data.systemHealth.errorRate}%
                </div>
                <p className="text-[11px] text-gray-400">Avg Latency: {data.systemHealth.avgLatencyMs}ms</p>
              </div>
            </div>

            {/* Agent Usage Distribution Table */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Agent Dispatch & Call Volume (24h)
                  </h3>
                  <p className="text-xs text-gray-400">
                    Execution breakdown across the 9 specialized agents.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-white/5 text-[10px] uppercase font-bold text-gray-400">
                    <tr>
                      <th className="py-2.5 px-3">Specialist Agent</th>
                      <th className="py-2.5 px-3">24h Call Volume</th>
                      <th className="py-2.5 px-3">Avg Latency</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.agentUsageStats.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3 font-medium text-white flex items-center gap-2">
                          <AgentBadge agent={item.agent} size="sm" showDot={false} />
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-300">
                          {item.calls} invocations
                        </td>
                        <td className="py-3 px-3 font-mono text-sky-400">
                          {item.avgDurationMs}ms
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded font-bold">
                            HEALTHY
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Agent Execution Trace Logs */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Live Agent Execution Trace Logs
                  </h3>
                  <p className="text-xs text-gray-400">
                    Sanitized audit logs verifying multi-agent routing integrity.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {data.executionLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                        {log.id}
                      </span>
                      <div>
                        <span className="text-white font-semibold block">
                          Intent: {log.detectedIntent}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          Routed: {log.primaryAgent}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-gray-400">
                      <span>{log.durationMs}ms</span>
                      <span className="text-emerald-400 font-bold uppercase">{log.status}</span>
                      <span className="text-gray-500">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
