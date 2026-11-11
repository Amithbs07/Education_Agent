"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CitadelLogo } from "@/components/brand/CitadelLogo";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Target,
  Brain,
  Compass,
} from "lucide-react";
import { AcademicLevel, KnowledgeLevel, LearningStyle } from "@/types/student";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form states
  const [displayName, setDisplayName] = useState("Alex Vance");
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>("undergraduate");
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevel>("intermediate");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    "Computer Science",
    "Artificial Intelligence",
  ]);
  const [customSubject, setCustomSubject] = useState("");
  const [targetGoal, setTargetGoal] = useState("Master System Design & Algorithms");
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>("visual_and_examples");

  const academicOptions: { id: AcademicLevel; label: string; desc: string }[] = [
    { id: "school", label: "School Student", desc: "Grades 9-12, foundational sciences & math" },
    { id: "undergraduate", label: "College / University", desc: "Undergraduate STEM, humanities, or business" },
    { id: "graduate", label: "Graduate / Postgrad", desc: "Master's, PhD, and advanced research" },
    { id: "competitive_exam", label: "Competitive Exam Aspirant", desc: "GATE, GRE, MCAT, JEE, or civil services" },
    { id: "professional", label: "Working Professional", desc: "Upskilling in AI, engineering, or cloud" },
    { id: "self_learner", label: "Self-Directed Learner", desc: "Curiosity-driven lifelong learner" },
  ];

  const popularSubjects = [
    "Computer Science",
    "Artificial Intelligence",
    "Data Structures & Algorithms",
    "Distributed Systems",
    "Linear Algebra & Calculus",
    "Organic Chemistry",
    "Microeconomics",
    "Cloud Architecture (AWS/GCP)",
  ];

  const learningStyleOptions: {
    id: LearningStyle;
    label: string;
    desc: string;
    icon: typeof Brain;
  }[] = [
    {
      id: "visual_and_examples",
      label: "Visual & Real-World Analogies",
      desc: "Learn through diagrams, mental models, and intuitive metaphors.",
      icon: Sparkles,
    },
    {
      id: "step_by_step",
      label: "Step-by-Step Rigorous Derivation",
      desc: "Methodical, formulaic, and procedural breakdowns.",
      icon: BookOpen,
    },
    {
      id: "socratic_hints",
      label: "Socratic Method & Guided Inquiries",
      desc: "Ask thought-provoking questions and hints before revealing answers.",
      icon: Brain,
    },
    {
      id: "practical_projects",
      label: "Project-Based & Code-First",
      desc: "Immediate practical implementation with hands-on exercises.",
      icon: Target,
    },
  ];

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSubject.trim() && !selectedSubjects.includes(customSubject.trim())) {
      setSelectedSubjects([...selectedSubjects, customSubject.trim()]);
      setCustomSubject("");
    }
  };

  const handleFinish = () => {
    // Save onboarding profile to localStorage for instant client state
    const profileData = {
      displayName,
      academicLevel,
      knowledgeLevel,
      primarySubjects: selectedSubjects,
      targetGoals: [targetGoal],
      dailyStudyGoalMinutes: dailyMinutes,
      preferredLearningStyle: learningStyle,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("citadel_student_profile", JSON.stringify(profileData));
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#07090e] bg-citadel-radial flex flex-col justify-between p-6 md:p-12">
      {/* Top Header */}
      <div className="flex items-center justify-between max-w-4xl w-full mx-auto pb-8">
        <CitadelLogo size="md" withTagline={false} />
        <div className="text-xs text-gray-400 font-mono">
          Step {step} of 4
        </div>
      </div>

      {/* Main Multi-Step Box */}
      <div className="max-w-2xl w-full mx-auto glass-panel-glow p-8 md:p-10 rounded-2xl border border-violet-500/30">
        {/* Step Indicator Progress Bar */}
        <div className="w-full bg-white/5 h-1.5 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-sky-400 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* STEP 1: Basic Info & Academic Level */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">
                Personalization Profile
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Tell us about your academic stage
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                CITADEL tunes its explanations, terminology, and depth to match your stage.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                What should your AI Tutor call you?
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Vance"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-3">
                Your Current Academic Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {academicOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAcademicLevel(opt.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      academicLevel === opt.id
                        ? "bg-violet-950/60 border-violet-500 text-white shadow-[0_0_15px_-3px_rgba(139,92,246,0.3)]"
                        : "bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="font-semibold text-sm text-gray-200">{opt.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Subjects & Interests */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
                Knowledge Domain
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                What subjects are you focused on?
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Select your focus areas or add your specific curriculum topics.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-3">
                Select from popular subjects
              </label>
              <div className="flex flex-wrap gap-2">
                {popularSubjects.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleSubject(sub)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? "bg-sky-950/60 border-sky-500 text-sky-200 shadow-glow-blue"
                          : "bg-white/[0.03] border-white/5 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Add other subjects or specific courses
              </label>
              <form onSubmit={handleAddCustomSubject} className="flex gap-2">
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="e.g. Quantum Computing, Econometrics..."
                  className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 transition-all"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        )}

        {/* STEP 3: Goals & Study Routine */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Target Objectives
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                Set your primary learning goal
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                The Study Planner Agent will allocate your roadmap milestones around this target.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Primary Goal / Milestone
              </label>
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder="e.g. Ace finals in Algorithms & Data Structures"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-300">
                  Target Daily Study Time
                </label>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {dailyMinutes} minutes / day
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="180"
                step="10"
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>20 mins (Bite-sized)</span>
                <span>60 mins (Standard)</span>
                <span>180 mins (Intensive)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Current Knowledge Base
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["beginner", "intermediate", "advanced"] as KnowledgeLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setKnowledgeLevel(lvl)}
                    className={`py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                      knowledgeLevel === lvl
                        ? "bg-emerald-950/60 border-emerald-500 text-emerald-200"
                        : "bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/10"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Preferred Learning Style */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">
                Cognitive Fit
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                How do you learn most effectively?
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Every learner's mind processes information differently. Choose your ideal approach.
              </p>
            </div>

            <div className="space-y-3">
              {learningStyleOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = learningStyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLearningStyle(opt.id)}
                    className={`w-full p-4 rounded-xl flex items-start gap-4 text-left border transition-all ${
                      isSelected
                        ? "bg-violet-950/60 border-violet-500 text-white shadow-glow"
                        : "bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/15"
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-lg ${
                        isSelected
                          ? "bg-violet-500 text-white"
                          : "bg-white/5 text-gray-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-white">
                        {opt.label}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{opt.desc}</div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 border-t border-white/5 mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all"
            >
              Launch CITADEL Agent
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center text-xs text-gray-600 py-4">
        CITADEL Education Agent • AI-Native Personalized Learning Platform
      </div>
    </div>
  );
}
