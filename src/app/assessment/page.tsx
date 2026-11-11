"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AgentBadge } from "@/components/brand/AgentBadge";
import { INITIAL_QUIZZES } from "@/lib/supabase/mock-store";
import { Quiz, QuizQuestion, QuizAttemptResult } from "@/types/quiz";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Clock,
  Brain,
  Sliders,
  Award,
  AlertTriangle,
  Lightbulb,
  GraduationCap,
} from "lucide-react";

export default function AssessmentPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [activeQuiz, setActiveQuiz] = useState<Quiz>(INITIAL_QUIZZES[0]);
  const [quizState, setQuizState] = useState<"idle" | "running" | "evaluated">("idle");

  // Runner state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showHintFor, setShowHintFor] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<QuizAttemptResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Generator form state
  const [topic, setTopic] = useState("Consensus Protocols & Fault Tolerance");
  const [subject, setSubject] = useState("Distributed Systems");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [totalQuestions, setTotalQuestions] = useState(4);
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [isGenerating, setIsGenerating] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizState === "running") {
      timer = setInterval(() => setSecondsElapsed((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [quizState]);

  const handleStartQuiz = (quizToStart: Quiz) => {
    setActiveQuiz(quizToStart);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setShowHintFor(null);
    setEvaluationResult(null);
    setSecondsElapsed(0);
    setQuizState("running");
  };

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/agent/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          topic,
          difficulty,
          totalQuestions,
          questionType,
        }),
      });

      const data = await res.json();
      if (data.success && data.quiz) {
        setQuizzes([data.quiz, ...quizzes]);
        handleStartQuiz(data.quiz);
      }
    } catch (err) {
      console.error("Quiz generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/agent/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: activeQuiz.id,
          quizTitle: activeQuiz.title,
          subject: activeQuiz.subject,
          questions: activeQuiz.questions,
          userAnswers,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setEvaluationResult(data.result);
        setQuizState("evaluated");

        if (data.result.percentage >= 75) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQ = activeQuiz.questions[currentQuestionIndex];
  const progressRatio = Math.round(
    ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100
  );

  return (
    <AppShell>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AgentBadge agent="Assessment Agent" size="sm" />
              <span className="text-xs text-amber-400 font-mono">
                Adaptive Diagnostics & Gap Analysis
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display">
              AI Quiz & Assessment Suite
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Test conceptual depth, identify knowledge gaps, and receive instant pedagogical explanations.
            </p>
          </div>

          {quizState !== "idle" && (
            <button
              onClick={() => setQuizState("idle")}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 self-start md:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Back to Quiz Hub</span>
            </button>
          )}
        </div>

        {/* =========================================================================
            STATE 1: IDLE / GENERATOR HUB
           ========================================================================= */}
        {quizState === "idle" && (
          <div className="space-y-8">
            {/* Quick Generator Box */}
            <div className="glass-panel-glow p-6 lg:p-8 rounded-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>Generate Adaptive Assessment</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Powered by the Assessment Agent with Socratic hints and real-time gap evaluations.
                  </p>
                </div>
              </div>

              <form onSubmit={handleGenerateQuiz} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Specific Chapter / Topic
                    </label>
                    <input
                      type="text"
                      required
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Raft Consensus, Normalization, Transformer Attention..."
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 capitalize"
                    >
                      <option value="beginner">Beginner (Foundations)</option>
                      <option value="intermediate">Intermediate (Problem Solving)</option>
                      <option value="advanced">Advanced (Deep Theory)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Questions Count: {totalQuestions}
                    </label>
                    <select
                      value={totalQuestions}
                      onChange={(e) => setTotalQuestions(Number(e.target.value))}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value={3}>3 Questions (Quick Sprint)</option>
                      <option value={4}>4 Questions (Standard)</option>
                      <option value={8}>8 Questions (In-Depth Diagnostic)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Question Modality
                    </label>
                    <select
                      value={questionType}
                      onChange={(e) => setQuestionType(e.target.value)}
                      className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="multiple_choice">Multiple Choice (MCQ)</option>
                      <option value="true_false">True / False</option>
                      <option value="short_answer">Short Answer (Conceptual)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-violet-600 hover:opacity-90 text-white text-xs font-semibold shadow-glow disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Generating Diagnostic Questions...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate & Start Assessment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Available Preset Assessments */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-white font-display">
                Curated Diagnostic Assessments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.map((q) => (
                  <div
                    key={q.id}
                    className="glass-panel p-5 rounded-2xl space-y-3 flex flex-col justify-between hover:border-amber-500/30 transition-all"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-amber-400 font-mono">
                          {q.subject}
                        </span>
                        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300 capitalize">
                          {q.difficulty}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-white">{q.title}</h4>
                      <p className="text-xs text-gray-400">
                        {q.totalQuestions} questions • ~{q.timeLimitMinutes || 8} mins
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartQuiz(q)}
                      className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      <span>Take Assessment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 2: LIVE QUIZ RUNNER
           ========================================================================= */}
        {quizState === "running" && currentQ && (
          <div className="glass-panel p-6 lg:p-8 rounded-2xl space-y-6">
            {/* Top Bar: Progress & Timer */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold font-mono text-amber-400">
                  Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                </span>
                <span className="text-[11px] text-gray-500 font-mono">
                  Concept: {currentQ.conceptTested}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono bg-black/40 px-3 py-1 rounded-lg border border-white/10">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {Math.floor(secondsElapsed / 60)}:
                  {(secondsElapsed % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-violet-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressRatio}%` }}
              />
            </div>

            {/* Question Prompt */}
            <div className="space-y-4 py-2">
              <h2 className="text-base lg:text-lg font-bold text-white leading-relaxed">
                {currentQ.prompt}
              </h2>

              {/* Socratic Hint Box */}
              {currentQ.hint && (
                <div>
                  {showHintFor === currentQ.id ? (
                    <div className="p-3.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-200 flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-violet-300 mb-0.5">Socratic Hint:</strong>
                        <span>{currentQ.hint}</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowHintFor(currentQ.id)}
                      className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1.5 font-medium transition-colors"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Need a hint? (Does not reveal answer)</span>
                    </button>
                  )}
                </div>
              )}

              {/* Question Options / Input */}
              {currentQ.options && currentQ.options.length > 0 ? (
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((opt) => {
                    const isSelected = userAnswers[currentQ.id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleAnswerSelect(currentQ.id, opt.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3.5 ${
                          isSelected
                            ? "bg-amber-950/60 border-amber-500 text-white shadow-glow"
                            : "bg-white/[0.02] border-white/5 text-gray-300 hover:border-white/15 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs uppercase ${
                            isSelected
                              ? "bg-amber-500 text-black"
                              : "bg-white/5 text-gray-400 border border-white/10"
                          }`}
                        >
                          {opt.id}
                        </div>
                        <span className="text-xs font-medium flex-1">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-gray-400 mb-2">
                    Your Conceptual Answer:
                  </label>
                  <input
                    type="text"
                    value={userAnswers[currentQ.id] || ""}
                    onChange={(e) => handleAnswerSelect(currentQ.id, e.target.value)}
                    placeholder="Type the exact concept or term..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Bottom Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((i) => i - 1)}
                className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((i) => i + 1)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all"
                >
                  Next Question
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitQuiz}
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:opacity-90 text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all flex items-center gap-2"
                >
                  {isSubmitting ? "Evaluating..." : "Submit for Evaluation"}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 3: INSTANT EVALUATION & GAP ANALYSIS
           ========================================================================= */}
        {quizState === "evaluated" && evaluationResult && (
          <div className="space-y-6">
            {/* Score Banner Card */}
            <div className="glass-panel-glow p-6 lg:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-amber-500/30">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Evaluation Complete
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {evaluationResult.quizTitle}
                </h2>
                <p className="text-xs text-gray-300 max-w-xl">
                  {evaluationResult.suggestedAction}
                </p>
              </div>

              {/* Score Indicator */}
              <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/10 shrink-0">
                <div className="text-center">
                  <div className="text-3xl font-black text-amber-400 font-mono">
                    {evaluationResult.score} / {evaluationResult.maxScore}
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                    Raw Score
                  </div>
                </div>
                <div className="w-[1px] h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-3xl font-black text-emerald-400 font-mono">
                    {evaluationResult.percentage}%
                  </div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                    Mastery Index
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Weak Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified Strengths</span>
                </div>
                {evaluationResult.strengths.length > 0 ? (
                  <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                    {evaluationResult.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400">Review needed across tested topics.</p>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-300 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Identified Knowledge Gaps (Needs Review)</span>
                </div>
                {evaluationResult.weakAreas.length > 0 ? (
                  <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                    {evaluationResult.weakAreas.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-emerald-300">No knowledge gaps detected!</p>
                )}
              </div>
            </div>

            {/* Detailed Question-by-Question Breakdown */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-white font-display">
                Detailed Question Review & Explanations
              </h3>

              <div className="space-y-4">
                {activeQuiz.questions.map((q, idx) => {
                  const evalItem = evaluationResult.evaluations.find(
                    (e) => e.questionId === q.id
                  );
                  const isCorrect = evalItem?.isCorrect;

                  return (
                    <div
                      key={q.id}
                      className={`p-6 rounded-2xl border space-y-3 ${
                        isCorrect
                          ? "bg-emerald-950/10 border-emerald-500/20"
                          : "bg-rose-950/10 border-rose-500/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                          Question {idx + 1} • {q.conceptTested}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          {isCorrect ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Incorrect
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-white">{q.prompt}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">
                            Your Answer:
                          </span>
                          <span className={isCorrect ? "text-emerald-300 font-semibold" : "text-rose-300 font-semibold"}>
                            {evalItem?.userAnswer || "None"}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">
                            Correct Answer:
                          </span>
                          <span className="text-emerald-300 font-semibold">
                            {q.correctAnswer}
                          </span>
                        </div>
                      </div>

                      {/* Pedagogical Explanation */}
                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-300">
                        <strong className="text-white block mb-1">Pedagogical Explanation:</strong>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Step Action CTA */}
            <div className="p-6 rounded-2xl glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-white">Ask your AI Tutor to clarify gaps?</h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  The Tutor Agent can walk through your missed questions step-by-step.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleStartQuiz(activeQuiz)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all"
                >
                  Retake Quiz
                </button>
                <Link
                  href="/tutor"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Discuss with AI Tutor</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
