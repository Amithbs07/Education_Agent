"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AgentBadge } from "@/components/brand/AgentBadge";
import { SUBSCRIPTION_PLANS } from "@/lib/billing/plans";
import {
  CreditCard,
  Sparkles,
  Zap,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export default function SubscriptionManagementPage() {
  const [data, setData] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const fetchSubscriptionData = async () => {
    try {
      const res = await fetch("/api/billing/plans");
      const json = await res.json();
      if (json.success) setData(json);
    } catch (err) {
      console.error("Subscription fetch error:", err);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const handlePlanSwitch = async (newPlanId: "free" | "pro" | "institution") => {
    setIsUpdating(true);
    setUpdateMessage(null);
    try {
      const res = await fetch("/api/billing/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: newPlanId }),
      });
      const json = await res.json();
      if (json.success) {
        setUpdateMessage(json.message);
        fetchSubscriptionData();
      }
    } catch (err) {
      console.error("Plan switch error:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const currentPlan = data?.currentSubscription
    ? SUBSCRIPTION_PLANS[data.currentSubscription.planId] || SUBSCRIPTION_PLANS.pro
    : SUBSCRIPTION_PLANS.pro;

  const usage = data?.currentUsage || {
    aiRequestsCount: 68,
    documentsProcessed: 4,
    tokensConsumed: 48200,
  };

  const aiPercentage = Math.min(100, Math.round((usage.aiRequestsCount / currentPlan.limits.aiRequestsPerMonth) * 100));
  const docPercentage = Math.min(100, Math.round((usage.documentsProcessed / currentPlan.limits.documentUploadsPerMonth) * 100));

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl mx-auto py-2">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded border border-violet-800/40">
                SaaS Subscription & Quota Engine
              </span>
              <span className="text-xs text-gray-400 font-mono">
                Server-Side Entitlement Enforced
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display">
              Subscription & Usage Quotas
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Monitor your AI token consumption, manage active tier entitlements, and review payment configurations.
            </p>
          </div>

          <Link
            href="/pricing"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all flex items-center gap-2 self-start md:self-auto"
          >
            <span>Compare All Plans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {updateMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{updateMessage}</span>
          </div>
        )}

        {/* Current Plan Overview Card */}
        <div className="glass-panel-glow p-6 lg:p-8 rounded-3xl border border-violet-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-violet-400 tracking-wider">
                Current Active Subscription
              </span>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-2xl font-bold text-white font-display">
                  {currentPlan.name}
                </h2>
                <span className="text-[10px] bg-gradient-to-r from-violet-600 to-sky-500 text-white font-bold px-2.5 py-0.5 rounded-full font-mono uppercase">
                  Active
                </span>
              </div>
            </div>

            <div className="text-right sm:text-right">
              <span className="text-3xl font-black text-white font-mono">
                ${currentPlan.priceMonthly}
              </span>
              <span className="text-xs text-gray-400"> / month</span>
              <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                Next renewal: December 10, 2026
              </p>
            </div>
          </div>

          {/* Real-Time Metered Usage Bars */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
              Monthly Resource Quotas & Consumption
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* AI Requests Meter */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-medium">AI Multi-Agent Invocations</span>
                  <span className="text-sky-400 font-mono font-bold">
                    {usage.aiRequestsCount} / {currentPlan.limits.aiRequestsPerMonth} ({aiPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-sky-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${aiPercentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-mono block">
                  Resets on 1st of every month
                </span>
              </div>

              {/* Document Processing Meter */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-medium">Document Uploads (RAG Indexing)</span>
                  <span className="text-violet-300 font-mono font-bold">
                    {usage.documentsProcessed} / {currentPlan.limits.documentUploadsPerMonth} ({docPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-400 to-violet-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${docPercentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-mono block">
                  Max size: {currentPlan.limits.maxDocumentSizeMB}MB per file
                </span>
              </div>
            </div>
          </div>

          {/* Quick Plan Switcher Controls */}
          <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-gray-400">
              Need more AI capacity or institution campus features?
            </span>
            <div className="flex items-center gap-2">
              {currentPlan.id !== "free" && (
                <button
                  onClick={() => handlePlanSwitch("free")}
                  disabled={isUpdating}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 border border-white/10 transition-all"
                >
                  Downgrade to Free
                </button>
              )}
              {currentPlan.id !== "pro" && (
                <button
                  onClick={() => handlePlanSwitch("pro")}
                  disabled={isUpdating}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 hover:opacity-90 text-xs font-semibold text-white shadow-glow transition-all"
                >
                  Upgrade to Student Pro ($19/mo)
                </button>
              )}
              {currentPlan.id !== "institution" && (
                <button
                  onClick={() => handlePlanSwitch("institution")}
                  disabled={isUpdating}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-xs font-semibold text-white border border-violet-500/40 shadow-glow transition-all"
                >
                  Switch to Campus Tier ($499/mo)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Payment Integration Details & Webhook Architecture */}
        <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-sm text-white">Payment Method & Provider Integration</h3>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
            CITADEL integrates with Stripe and Razorpay for recurring subscriptions. Webhook handlers automatically verify cryptographic signatures before activating server-side entitlements.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Payment Provider</span>
              <span className="text-white font-semibold font-mono">Stripe Billing (PCI Level 1)</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Customer Reference</span>
              <span className="text-sky-300 font-semibold font-mono">cus_citadel_alex_01</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-gray-400 uppercase font-mono block">Billing Status</span>
              <span className="text-emerald-400 font-semibold font-mono">Automatic Renewal Active</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
