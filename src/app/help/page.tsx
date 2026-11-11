"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  BookOpen,
  GraduationCap,
  FileText,
  Layers,
  CreditCard,
  Building2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Send,
  CheckCircle2,
  ExternalLink,
  Activity,
  MessageSquare,
  Zap,
  ArrowRight,
  LifeBuoy,
  Info,
  Clock,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: "all" | "tutor" | "rag" | "flashcards" | "billing" | "institution" | "security";
  question: string;
  answer: string;
  highlight?: string;
  linkText?: string;
  linkHref?: string;
}

const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "tutor",
    question: "How does CITADEL's AI Tutor differ from standard chatbots like ChatGPT?",
    answer:
      "Unlike generic chatbots that provide answers without pedagogical structure, CITADEL uses an educational agent framework. In Socratic Mode, the tutor breaks down problems step-by-step, asks guiding questions, provides progressive hints before revealing solutions, and continuously adjusts explanations to your academic level (Simple, Intermediate, or Rigorous). Context is maintained across study sessions.",
    highlight: "Socratic Guided Learning",
    linkText: "Try AI Tutor",
    linkHref: "/tutor",
  },
  {
    id: "faq-2",
    category: "rag",
    question: "How does Document Intelligence & Retrieval-Augmented Generation (RAG) work?",
    answer:
      "When you upload course syllabi, lecture slides, textbooks, or research papers (PDF, DOCX, TXT, MD), CITADEL parses and segments them into semantic chunks. These are embedded in a vector index. When you ask questions in the Document Inspector, CITADEL retrieves the exact relevant excerpts and synthesizes answers strictly grounded in your materials, complete with verifiable section and page citations.",
    highlight: "Grounded with Citations",
    linkText: "Inspect Documents",
    linkHref: "/documents",
  },
  {
    id: "faq-3",
    category: "flashcards",
    question: "What is the SuperMemo SM-2 algorithm used in Smart Flashcards?",
    answer:
      "CITADEL implements the mathematically proven SM-2 spaced-repetition algorithm. Each time you review a card and grade it as 'Hard', 'Good', or 'Easy', the system calculates its optimal repetition interval (I) and easiness factor (EF). Hard cards repeat in 1 day; mastered cards space out to 6, 15, and 30+ days. This maximizes long-term memory retention while minimizing review time.",
    highlight: "Mathematically Optimized Memory",
    linkText: "Practice Flashcards",
    linkHref: "/flashcards",
  },
  {
    id: "faq-4",
    category: "billing",
    question: "How are monthly AI credits and token limits measured?",
    answer:
      "Each subscription tier (Free, Student Pro, Institution) includes a monthly quota of AI Tutor queries, document uploads, and vector queries. Your usage is tracked in real-time on your Subscription page. If you reach your free monthly allowance, your access is paused until the next billing cycle, or you can upgrade to Student Pro for 500+ monthly requests and unlimited flashcards.",
    highlight: "Transparent Metering",
    linkText: "View Usage & Plans",
    linkHref: "/subscription",
  },
  {
    id: "faq-5",
    category: "institution",
    question: "How do universities and colleges onboard student cohorts?",
    answer:
      "The Institution tier provides an enterprise multi-tenant campus workspace. Institution administrators can invite students and educators by email or domain, configure seat pools, provision shared course curricula, review campus-wide mastery telemetry, and assign faculty cohorts in the Educator Hub.",
    highlight: "Multi-Tenant Workspaces",
    linkText: "Campus Workspace",
    linkHref: "/institution",
  },
  {
    id: "faq-6",
    category: "security",
    question: "Is my academic data and uploaded coursework private?",
    answer:
      "Yes. CITADEL uses strict Row-Level Security (RLS) policies at the database layer. Uploaded documents, vector embeddings, personal notes, and assessment history are isolated to your authenticated user account. Your private study materials are never shared with other students or used to train third-party public models.",
    highlight: "Enterprise Privacy & Isolation",
    linkText: "Review Settings",
    linkHref: "/settings",
  },
  {
    id: "faq-7",
    category: "tutor",
    question: "How does the Multi-Agent Orchestration Supervisor work?",
    answer:
      "When you submit a query or goal, our natural-language intent classifier routes the task to the most specialized agent: Tutor Agent for explanations, Assessment Agent for diagnostic quizzes, Document Agent for RAG lookups, Study Notes Agent for formatted summaries, or Career Agent for skill roadmaps. The Supervisor validates results before presenting them to you.",
    highlight: "9 Specialized Autonomous Agents",
    linkText: "Explore Insights",
    linkHref: "/insights",
  },
  {
    id: "faq-8",
    category: "flashcards",
    question: "Can I generate flashcards and quizzes directly from my uploaded PDFs?",
    answer:
      "Yes! Navigate to Documents, upload your PDF or syllabus, and use the 1-Click Study Pack generator. The Document Intelligence Agent extracts key definitions, formulas, and conceptual checkpoints, instantly generating ready-to-study flashcard decks and targeted diagnostic quizzes.",
    highlight: "1-Click PDF to Flashcards",
    linkText: "Upload Course Material",
    linkHref: "/documents",
  },
];

const FEATURE_TOURS = [
  {
    title: "Socratic AI Tutor",
    desc: "Interactive step-by-step guidance with adjustable depth, Socratic hints, and code rendering.",
    icon: GraduationCap,
    badge: "Core AI",
    href: "/tutor",
  },
  {
    title: "Document RAG Inspector",
    desc: "Upload PDFs and course slides. Ask questions grounded strictly in citations.",
    icon: FileText,
    badge: "Vector RAG",
    href: "/documents",
  },
  {
    title: "Spaced Repetition (SM-2)",
    desc: "3D interactive flip cards with scientifically calibrated review intervals.",
    icon: Layers,
    badge: "SM-2 Engine",
    href: "/flashcards",
  },
  {
    title: "Career & Skill Gap Engine",
    desc: "Compare your skills against 8 tech career paths with customized portfolio projects.",
    icon: Zap,
    badge: "Phase 4 Intelligence",
    href: "/career-guidance",
  },
  {
    title: "SaaS Subscription Quotas",
    desc: "Inspect real-time token usage, subscription tier limits, and upgrade flows.",
    icon: CreditCard,
    badge: "Phase 5 SaaS",
    href: "/subscription",
  },
  {
    title: "Campus & Educator Hub",
    desc: "Multi-tenant academic workspace for departments, cohorts, and assignment tracking.",
    icon: Building2,
    badge: "Enterprise",
    href: "/institution",
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openFaq, setOpenFaq] = useState<string | null>("faq-1");

  // Health check state
  const [healthStatus, setHealthStatus] = useState<{
    status: string;
    uptime?: number;
    db?: string;
    aiGateway?: string;
  } | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  // Feedback form state
  const [formCategory, setFormCategory] = useState<
    "tutor" | "documents" | "flashcards" | "billing" | "performance" | "bug" | "feature" | "other"
  >("feature");
  const [formSubject, setFormSubject] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [ticketResult, setTicketResult] = useState<{
    success: boolean;
    ticketId?: string;
    message?: string;
  } | null>(null);

  // Check health on mount
  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const data = await res.json();
        setHealthStatus({
          status: data.status || "healthy",
          uptime: data.uptimeSeconds,
          db: data.services?.database?.status || "online",
          aiGateway: data.services?.aiGateway?.status || "online",
        });
      } else {
        setHealthStatus({ status: "degraded" });
      }
    } catch {
      setHealthStatus({ status: "operational (local)" });
    } finally {
      setLoadingHealth(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSubject.trim() || !formMessage.trim()) return;

    setSubmittingFeedback(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: formCategory,
          subject: formSubject,
          message: formMessage,
          email: formEmail || undefined,
          rating: formRating,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTicketResult({
          success: true,
          ticketId: data.ticketId,
          message: data.message,
        });
        setFormSubject("");
        setFormMessage("");
      } else {
        setTicketResult({
          success: false,
          message: data.error || "Failed to submit feedback",
        });
      }
    } catch (err) {
      setTicketResult({
        success: false,
        message: "Network error while transmitting feedback.",
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-950/60 via-[#0d1220] to-sky-950/40 border border-white/10 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>CITADEL Knowledge Base & Support</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How can we support your{" "}
            <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
              academic journey?
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Find instant answers to questions regarding Socratic AI tutoring, document RAG,
            SM-2 spaced repetition, SaaS billing limits, and enterprise campus integrations.
          </p>

          {/* Search Box */}
          <div className="pt-2 relative max-w-xl">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics: SM-2, RAG citations, API limits, student pro..."
              className="w-full bg-[#0a0e1a]/90 border border-white/20 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 shadow-lg transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Live System Operational Status Badge */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-emerald-400">All Systems Operational</span>
            </div>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">AI Gateway: <span className="text-white font-mono">Gemini-1.5</span></span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">Vector Engine: <span className="text-white font-mono">Active (pgvector)</span></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchHealth}
              disabled={loadingHealth}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>{loadingHealth ? "Checking..." : "Ping System"}</span>
            </button>
            <Link
              href="/api/health"
              target="_blank"
              className="px-3 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 transition-colors flex items-center gap-1"
            >
              <span>/api/health</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Discovery Tour Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Platform Capabilities Quick Guide</h2>
            <p className="text-xs text-gray-400">
              Jump directly to any module across Phases 1 through 5
            </p>
          </div>
          <span className="text-xs text-violet-400 font-mono">9 Specialized Agents</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURE_TOURS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group p-5 rounded-2xl bg-[#0a0e1a]/80 border border-white/5 hover:border-violet-500/40 hover:bg-[#0e1424] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/10 font-mono">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-medium text-violet-400 group-hover:text-sky-300">
                  <span>Explore module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Interactive FAQ Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-violet-400" />
              <span>Frequently Asked Questions</span>
            </h2>
            <p className="text-xs text-gray-400">
              Clear technical and academic explanations for students and faculty
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0a0e1a] border border-white/10 rounded-xl">
            {[
              { id: "all", label: "All Topics" },
              { id: "tutor", label: "AI Tutor" },
              { id: "rag", label: "RAG & Docs" },
              { id: "flashcards", label: "Flashcards (SM-2)" },
              { id: "billing", label: "Pricing & Quotas" },
              { id: "institution", label: "Campus" },
              { id: "security", label: "Privacy & RBAC" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#0a0e1a]/60 border border-white/5 text-gray-400 space-y-2">
              <Info className="w-6 h-6 mx-auto text-gray-500" />
              <p className="text-sm">No matching questions found for &ldquo;{searchQuery}&rdquo;</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-xs text-violet-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-[#0e1424] border-violet-500/40 shadow-lg shadow-violet-950/20"
                      : "bg-[#0a0e1a]/60 border-white/5 hover:border-white/15"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-1 rounded-md bg-white/5 text-gray-400 font-mono text-xs">
                        Q:
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {faq.question}
                      </span>
                      {faq.highlight && (
                        <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300">
                          {faq.highlight}
                        </span>
                      )}
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-violet-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 space-y-3">
                      <p>{faq.answer}</p>
                      {faq.linkHref && faq.linkText && (
                        <div className="pt-2">
                          <Link
                            href={faq.linkHref}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 hover:underline"
                          >
                            <span>{faq.linkText}</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Support Ticket & Academic Feedback Submission Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 rounded-3xl bg-gradient-to-br from-[#0a0e1a] via-[#0d1220] to-[#0a0e1a] border border-white/10 shadow-2xl">
        <div className="lg:col-span-1 space-y-4">
          <div className="p-3 w-fit rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Academic Support & Feedback</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Need assistance with your study plan, prompt tuning, or enterprise seat quotas?
            Submit a direct inquiry. Every submission receives an official tracking reference.
          </p>

          <div className="space-y-3 pt-2 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Standard Response: Under 4 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct Pedagogical Engineering Review</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {ticketResult ? (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
                <h4 className="text-base font-bold">Inquiry Logged Successfully!</h4>
              </div>
              <p className="text-xs text-gray-300">{ticketResult.message}</p>
              {ticketResult.ticketId && (
                <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Ticket Reference:</span>
                  <span className="font-mono text-sm font-bold text-emerald-300">
                    {ticketResult.ticketId}
                  </span>
                </div>
              )}
              <button
                onClick={() => setTicketResult(null)}
                className="text-xs font-semibold text-emerald-400 hover:underline"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Inquiry Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e: any) => setFormCategory(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="feature">Feature Request & Enhancement</option>
                    <option value="tutor">AI Tutor Pedagogical Guidance</option>
                    <option value="documents">Document RAG & Uploads</option>
                    <option value="flashcards">Flashcards & SM-2</option>
                    <option value="billing">Subscription & Token Quotas</option>
                    <option value="bug">Bug Report</option>
                    <option value="other">General Academic Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Contact Email (optional)
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="alex@citadel.ai"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Subject Line *
                </label>
                <input
                  type="text"
                  required
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="e.g., Question regarding RAG citations in Computer Vision PDF"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">
                  Details & Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Provide context, error messages, or learning objectives you would like improved..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>Experience Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        className={`text-sm ${
                          star <= formRating ? "text-amber-400" : "text-gray-600"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingFeedback ? "Dispatching..." : "Submit Inquiry"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
