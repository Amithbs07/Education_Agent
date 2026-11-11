"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { SUBSCRIPTION_PLANS } from "@/lib/billing/plans";
import {
  Check,
  Sparkles,
  Zap,
  Building,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");

  return (
    <AppShell>
      <div className="space-y-12 max-w-6xl mx-auto py-4">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/40 text-violet-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Commercial SaaS Subscription Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
            Predictable, Transparent Educational Pricing
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            From individual STEM students to enterprise university campuses, choose the multi-agent tier engineered for your academic velocity.
          </p>

          {/* Billing Interval Switcher */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <span className={`text-xs font-medium ${!isAnnual ? "text-white" : "text-gray-400"}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 bg-white/10 rounded-full p-0.5 border border-white/20 transition-colors relative"
            >
              <div
                className={`w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-sky-400 transition-transform ${
                  isAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-medium flex items-center gap-1.5 ${isAnnual ? "text-white" : "text-gray-400"}`}>
              <span>Annual Billing</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.values(SUBSCRIPTION_PLANS).map((plan) => {
            const isPro = plan.id === "pro";
            const price = isAnnual
              ? plan.priceAnnual === 0
                ? 0
                : Math.round(plan.priceAnnual / 12)
              : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 border ${
                  isPro
                    ? "bg-gradient-to-b from-[#13192f] to-[#0d1222] border-violet-500 shadow-glow relative"
                    : "glass-panel border-white/10 hover:border-white/20"
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-sky-400 text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
                    Most Popular for Students
                  </div>
                )}

                <div className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white font-display">{plan.name}</h3>
                    <p className="text-xs text-gray-400 min-h-[32px]">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                      ${price}
                    </span>
                    <span className="text-xs text-gray-400">
                      {plan.priceMonthly === 0 ? "forever" : "/ month"}
                    </span>
                  </div>
                  {isAnnual && plan.priceAnnual > 0 && (
                    <span className="text-[11px] text-emerald-400 font-mono block -mt-3">
                      Billed annually (${plan.priceAnnual}/year)
                    </span>
                  )}

                  {/* Feature Checklist */}
                  <div className="pt-4 border-t border-white/5 space-y-2.5">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block mb-2">
                      Included Capabilities:
                    </span>
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href="/subscription"
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      isPro
                        ? "bg-gradient-to-r from-violet-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white shadow-glow"
                        : "bg-white/10 hover:bg-white/15 text-white border border-white/10"
                    }`}
                  >
                    <span>{plan.id === "free" ? "Start Free" : `Select ${plan.name}`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise & Payment Security Banner */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">PCI-DSS Compliant Payment Gateway Architecture</h4>
              <p className="text-[11px] text-gray-400">
                Stripe & Razorpay webhook integration with HMAC signature verification. All payments activate server-side entitlements automatically.
              </p>
            </div>
          </div>
          <Link
            href="/subscription"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-all shrink-0"
          >
            Manage Existing Subscription
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
