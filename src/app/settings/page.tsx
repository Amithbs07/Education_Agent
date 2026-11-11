"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { DEFAULT_PROFILE } from "@/lib/supabase/mock-store";
import {
  Save,
  Key,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Cpu,
  Clock,
  CheckCircle2,
  Sliders,
  CreditCard,
} from "lucide-react";

export default function SettingsPage() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [apiKey, setApiKey] = useState("");
  const [geminiModel, setGeminiModel] = useState("gemini-1.5-flash");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white font-display">
            Settings & Educational Preferences
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Configure your student persona, learning parameters, and AI model credentials.
          </p>
        </div>

        {isSaved && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Preferences updated successfully! Your AI Tutor has adapted to the changes.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: AI Engine & API Keys */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
              <Key className="w-4 h-4" />
              <span>AI Provider & Gemini Model Gateway</span>
            </div>
            <p className="text-xs text-gray-400">
              CITADEL uses Google Gemini for multi-agent reasoning. You can provide your own API key to bypass default limits.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Google Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Keys are kept in your local browser environment or server-side env.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Selected Model
                </label>
                <select
                  value={geminiModel}
                  onChange={(e) => setGeminiModel(e.target.value)}
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-fast, Recommended)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Theoretical Reasoning)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-gen Multimodal)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Student Academic Identity */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
              <GraduationCap className="w-4 h-4" />
              <span>Student Profile & Learning Goals</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Academic Level
                </label>
                <select
                  value={profile.academicLevel}
                  onChange={(e) =>
                    setProfile({ ...profile, academicLevel: e.target.value as any })
                  }
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="school">School Student (Grades 9-12)</option>
                  <option value="undergraduate">College / University Undergraduate</option>
                  <option value="graduate">Graduate / Master's / PhD</option>
                  <option value="competitive_exam">Competitive Exam Aspirant (GRE/GATE/JEE)</option>
                  <option value="professional">Working Professional Upskilling</option>
                  <option value="self_learner">Self-Learner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Daily Study Goal (Minutes)
                </label>
                <input
                  type="number"
                  value={profile.dailyStudyGoalMinutes}
                  onChange={(e) =>
                    setProfile({ ...profile, dailyStudyGoalMinutes: Number(e.target.value) })
                  }
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Preferred Pedagogical Approach
                </label>
                <select
                  value={profile.preferredLearningStyle}
                  onChange={(e) =>
                    setProfile({ ...profile, preferredLearningStyle: e.target.value as any })
                  }
                  className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="visual_and_examples">Visual & Real-World Analogies</option>
                  <option value="step_by_step">Step-by-Step Formal Derivation</option>
                  <option value="socratic_hints">Socratic Inquiries & Hints</option>
                  <option value="practical_projects">Hands-On Code & Exercises</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Commercial Plan Tier */}
          <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">CITADEL Pro Student Plan</span>
                <span className="text-[10px] bg-gradient-to-r from-violet-600 to-sky-500 text-white font-bold px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Unlimited Multi-Agent queries, RAG document indexing, and priority Gemini Pro reasoning.
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 border border-white/10 transition-all"
            >
              Manage Tier
            </button>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white text-xs font-semibold shadow-glow transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
