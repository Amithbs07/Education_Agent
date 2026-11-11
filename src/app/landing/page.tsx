"use client";

import React from "react";
import Link from "next/link";
import { CitadelLogo } from "@/components/brand/CitadelLogo";
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Brain,
  FileText,
  Layers,
  Briefcase,
  LineChart,
  ShieldCheck,
  CheckCircle2,
  Building,
  Terminal,
  Cpu,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const capabilities = [
    {
      icon: GraduationCap,
      title: "Intelligent AI Tutor",
      desc: "Step-by-step mathematical and code derivations, real-world analogies, and Socratic hints tailored to your academic level.",
      tag: "Multi-Tier Reasoning",
    },
    {
      icon: Brain,
      title: "Adaptive Assessment Suite",
      desc: "Generates high-yield conceptual diagnostic quizzes, grades submissions automatically, and pinpoints knowledge gaps.",
      tag: "Active Recall",
    },
    {
      icon: FileText,
      title: "Document Intelligence & RAG",
      desc: "Upload PDFs, DOCX, and textbooks for grounded question-answering with exact page numbers and citation excerpts.",
      tag: "Vector Grounding",
    },
    {
      icon: Layers,
      title: "Smart Spaced Flashcards",
      desc: "SuperMemo SM-2 retention algorithm schedules retrieval intervals, extending memory duration without cramming.",
      tag: "SM-2 Retrieval",
    },
    {
      icon: Briefcase,
      title: "Career & Skill Guidance",
      desc: "Maps industry competencies, identifies personal skill gaps, and curates hands-on portfolio capstone projects.",
      tag: "Skill Trees",
    },
    {
      icon: Building,
      title: "Institution Workspaces",
      desc: "Multi-tenant campus portals with faculty cohorts, assignment distribution, and campus-wide mastery telemetry.",
      tag: "Multi-Tenancy",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] bg-citadel-radial text-gray-100 flex flex-col justify-between">
      {/* Top Navigation */}
      <header className="h-20 border-b border-white/5 bg-[#07090e]/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between max-w-7xl w-full mx-auto">
        <CitadelLogo size="md" withTagline={true} />

        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-gray-300">
          <Link href="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/institution" className="hover:text-white transition-colors">
            For Institutions
          </Link>
          <Link href="/educator" className="hover:text-white transition-colors">
            Educator Workspace
          </Link>
          <Link href="/help" className="hover:text-white transition-colors">
            Help & Docs
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-all"
          >
            Student Onboarding
          </Link>
          <Link
            href="/"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all flex items-center gap-2"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 lg:px-12 py-16 sm:py-24 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-950/80 border border-violet-500/40 text-violet-300 text-xs font-mono font-bold shadow-glow">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>CITADEL Education Agent • Autonomous Multi-Agent Pedagogical Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-tight">
          Learn Smarter. Grow Faster. <br />
          <span className="text-gradient-citadel">Achieve More.</span>
        </h1>

        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          The commercial AI-native education platform that acts as your personal academic assistant, tutor, study planner, and technical career companion.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white text-sm font-bold uppercase tracking-wider shadow-glow transition-all flex items-center justify-center gap-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/pricing"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold border border-white/10 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore SaaS Pricing</span>
          </Link>
        </div>

        {/* Real-Time Live Stats Counter */}
        <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
          <div className="p-4 rounded-2xl glass-panel border border-white/5">
            <div className="text-2xl font-black text-white font-mono">9 Specialized</div>
            <div className="text-[11px] text-violet-300 mt-1 uppercase font-bold">AI Agents</div>
          </div>
          <div className="p-4 rounded-2xl glass-panel border border-white/5">
            <div className="text-2xl font-black text-sky-400 font-mono">SM-2 Spaced</div>
            <div className="text-[11px] text-gray-400 mt-1 uppercase font-bold">Retrieval Decks</div>
          </div>
          <div className="p-4 rounded-2xl glass-panel border border-white/5">
            <div className="text-2xl font-black text-emerald-400 font-mono">Vector RAG</div>
            <div className="text-[11px] text-gray-400 mt-1 uppercase font-bold">Citation Grounding</div>
          </div>
          <div className="p-4 rounded-2xl glass-panel border border-white/5">
            <div className="text-2xl font-black text-amber-400 font-mono">Multi-Tenant</div>
            <div className="text-[11px] text-gray-400 mt-1 uppercase font-bold">Campus Workspaces</div>
          </div>
        </div>
      </section>

      {/* Product Capabilities Matrix */}
      <section className="px-6 lg:px-12 py-16 max-w-7xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
            Autonomous Multi-Agent Architecture
          </span>
          <h2 className="text-3xl font-black text-white font-display">
            Engineered Beyond Simple Chatbots
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            CITADEL orchestrates 9 specialized educational intelligence agents with verified student telemetry, active spaced retrieval, and grounded document ingestion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <div
                key={i}
                className="glass-panel p-7 rounded-3xl border border-white/5 hover:border-violet-500/40 hover:bg-violet-950/10 transition-all duration-300 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600/20 to-sky-400/20 text-sky-400 flex items-center justify-center border border-violet-500/30">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-violet-300 bg-white/5 px-2 py-0.5 rounded font-bold uppercase">
                      {cap.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white font-display">{cap.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{cap.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <Link
                    href="/"
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Try Feature in App</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Institutional Multi-Tenant Campus Section */}
      <section className="px-6 lg:px-12 py-16 bg-[#090d18] border-y border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
              For Universities & Enterprise Campuses
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Enterprise Multi-Tenant Campus Workspaces
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Equip your entire university or educational department with centralized AI seats, isolated tenant data security, faculty cohort distribution, and campus-wide learning telemetry.
            </p>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-300">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Role-Based Access Control
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Strict Tenant Isolation
              </span>
            </div>
          </div>

          <div className="shrink-0 space-y-3 w-full sm:w-auto">
            <Link
              href="/institution"
              className="block w-full text-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all"
            >
              Explore Campus Workspace
            </Link>
            <Link
              href="/pricing"
              className="block w-full text-center px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all"
            >
              View Institution Pricing ($499/mo)
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 border-t border-white/5 max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">CITADEL</span>
          <span>•</span>
          <span>Education Agent Commercial SaaS Platform</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/help" className="hover:text-gray-300 transition-colors">
            Help Center
          </Link>
          <Link href="/pricing" className="hover:text-gray-300 transition-colors">
            Pricing
          </Link>
          <Link href="/admin" className="hover:text-gray-300 transition-colors">
            Admin Observability
          </Link>
        </div>
      </footer>
    </div>
  );
}
