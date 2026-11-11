"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AgentBadge } from "@/components/brand/AgentBadge";
import { CareerRecommendation, CareerCategory } from "@/types/career";
import {
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Code,
  Layers,
  Clock,
  TrendingUp,
  Cpu,
  Globe,
  Cloud,
  Shield,
  BarChart3,
  Terminal,
  Palette,
  ExternalLink,
} from "lucide-react";

export default function CareerGuidancePage() {
  const [selectedCategory, setSelectedCategory] = useState<CareerCategory>("ai_ml");
  const [recommendation, setRecommendation] = useState<CareerRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSkills, setCurrentSkills] = useState<string[]>([
    "Python",
    "SQL",
    "Linear Algebra",
    "REST APIs",
  ]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [timelineMonths, setTimelineMonths] = useState(6);

  const careerCategories: { id: CareerCategory; title: string; icon: any; desc: string }[] = [
    { id: "ai_ml", title: "AI/ML Engineering", icon: Cpu, desc: "Transformers, RAG, tensor optimization, and distributed serving" },
    { id: "full_stack", title: "Full Stack Engineering", icon: Globe, desc: "Modern React, Next.js App Router, PostgreSQL, and scalable APIs" },
    { id: "cloud_computing", title: "Cloud & DevOps", icon: Cloud, desc: "Kubernetes, Terraform, AWS/GCP, and CI/CD pipelines" },
    { id: "software_engineering", title: "Software Engineering", icon: Terminal, desc: "Algorithms, distributed systems, concurrency, and high-performance design" },
    { id: "data_analytics", title: "Data Analytics", icon: BarChart3, desc: "Advanced SQL, dimensional modeling, Tableau, and business intelligence" },
    { id: "data_science", title: "Data Science", icon: TrendingUp, desc: "Predictive ML models, feature engineering, and statistical inference" },
    { id: "cybersecurity", title: "Cybersecurity", icon: Shield, desc: "Network security, cryptography, penetration testing, and OWASP defense" },
    { id: "ui_ux", title: "UI/UX Design Systems", icon: Palette, desc: "Figma design tokens, accessibility (WCAG), and interaction architecture" },
  ];

  const fetchRecommendation = async (category: CareerCategory, skills: string[], timeline: number) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/career/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          currentSkills: skills,
          timelineMonths: timeline,
        }),
      });

      const data = await res.json();
      if (data.success && data.recommendation) {
        setRecommendation(data.recommendation);
      }
    } catch (err) {
      console.error("Failed to load career recommendation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendation(selectedCategory, currentSkills, timelineMonths);
  }, [selectedCategory]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillInput.trim() && !currentSkills.includes(newSkillInput.trim())) {
      const updated = [...currentSkills, newSkillInput.trim()];
      setCurrentSkills(updated);
      setNewSkillInput("");
      fetchRecommendation(selectedCategory, updated, timelineMonths);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = currentSkills.filter((s) => s !== skillToRemove);
    setCurrentSkills(updated);
    fetchRecommendation(selectedCategory, updated, timelineMonths);
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AgentBadge agent="Career Guidance Agent" size="sm" />
              <span className="text-xs text-fuchsia-400 font-mono">
                Technical Skill Trees & Portfolio Architect
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display">
              AI Career & Technical Skill Guidance
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Explore high-demand technical career tracks, assess skill gaps, and execute milestone-based learning roadmaps.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] max-w-sm self-start md:self-auto">
            <strong>Advisory Note:</strong> AI-generated career analysis based on industry benchmarks. This is educational guidance, not a formal guarantee of employment or compensation.
          </div>
        </div>

        {/* Career Category Selector Carousel / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {careerCategories.map((cat) => {
            const isSelected = cat.id === selectedCategory;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  isSelected
                    ? "bg-fuchsia-950/70 border-fuchsia-500 text-white shadow-glow"
                    : "bg-[#0d1220] border-white/5 text-gray-400 hover:text-gray-200 hover:border-white/15"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected ? "bg-fuchsia-500 text-white" : "bg-white/5 text-gray-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-semibold leading-tight">{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main Recommendation Hero Section */}
        {recommendation && (
          <div className="space-y-6">
            {/* Role Header Card */}
            <div className="glass-panel p-6 lg:p-8 rounded-2xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-fuchsia-400 tracking-widest">
                    Recommended Specialization
                  </span>
                  <h2 className="text-xl lg:text-2xl font-bold text-white mt-1">
                    {recommendation.careerTitle}
                  </h2>
                </div>

                <div className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/10 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Timeline</span>
                    <span className="text-sky-400 font-bold">{timelineMonths} Months</span>
                  </div>
                  <div className="w-[1px] h-6 bg-white/10" />
                  <div className="text-right">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Weekly Commitment</span>
                    <span className="text-emerald-400 font-bold">10-12 hrs/wk</span>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-4xl">
                {recommendation.overview}
              </p>

              {/* Recommended Next Action Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-fuchsia-950/60 via-surface to-sky-950/40 border border-fuchsia-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-300">
                    Recommended Immediate Action
                  </span>
                  <p className="text-xs font-semibold text-white">
                    {recommendation.recommendedNextAction}
                  </p>
                </div>
                <Link
                  href="/learning-paths"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-sky-500 hover:opacity-90 text-white text-xs font-semibold shadow-glow transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
                >
                  <span>Build Curriculum</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Skill Gap Analysis Section */}
            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>Skill Gap Analysis</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Comparison between core industry role requirements and your current technical toolkit.
                  </p>
                </div>

                {/* Add Custom Skill Form */}
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="Add verified skill..."
                    className="bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-fuchsia-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10"
                  >
                    + Add
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Skills */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified Current Skills ({currentSkills.length})</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSkills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-emerald-500 hover:text-emerald-200 text-xs ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Identified Skill Gaps */}
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Identified Skill Gaps ({recommendation.skillGaps.length})</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recommendation.skillGaps.map((gap, i) => (
                      <span
                        key={i}
                        className="text-xs bg-rose-950/60 border border-rose-800/40 text-rose-300 px-2.5 py-1 rounded-lg"
                      >
                        ⚠ {gap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Milestones Roadmap Timeline */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-white font-display">
                Progressive Skill Acquisition Milestones
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendation.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="glass-panel p-5 rounded-2xl border border-white/5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-fuchsia-400 uppercase font-bold">Stage {idx + 1}</span>
                        <span className="text-gray-400">{m.durationWeeks} Weeks</span>
                      </div>
                      <h4 className="font-bold text-sm text-white">{m.milestoneName}</h4>
                      <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                        {m.topics.map((top, i) => (
                          <li key={i}>{top}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-white/5">
                      <span className="text-[10px] text-emerald-400 uppercase font-mono block mb-1">
                        Competencies:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {m.skillsAcquired.map((skill, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-300 font-mono"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Capstone Projects */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-white font-display">
                Recommended Hands-On Portfolio Projects
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendation.projects.map((proj, i) => (
                  <div
                    key={i}
                    className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold font-mono px-2 py-0.5 rounded bg-violet-950/80 border border-violet-800/40 text-violet-300 capitalize">
                          {proj.difficulty} Difficulty
                        </span>
                        <Code className="w-4 h-4 text-gray-500" />
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-white">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {proj.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-white/5">
                      <div className="flex flex-wrap gap-1.5">
                        {proj.techStack.map((tech, j) => (
                          <span
                            key={j}
                            className="text-[11px] bg-sky-950/60 border border-sky-800/40 text-sky-300 px-2 py-0.5 rounded-md font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <p className="text-[11px] text-gray-400 italic">
                        <strong>Outcome:</strong> {proj.keyOutcome}
                      </p>
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
