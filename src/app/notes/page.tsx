"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AgentBadge } from "@/components/brand/AgentBadge";
import { INITIAL_NOTES } from "@/lib/supabase/mock-store";
import { StudyNote } from "@/types/plan";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BookOpen,
  PlusCircle,
  Sparkles,
  Save,
  Copy,
  Check,
  Download,
  Trash2,
  Search,
  Eye,
  Edit3,
  Layers,
  Code,
  List,
  Heading,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function StudyNotesPage() {
  const [notes, setNotes] = useState<StudyNote[]>(INITIAL_NOTES);
  const [activeNoteId, setActiveNoteId] = useState<string>(INITIAL_NOTES[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [editorTab, setEditorTab] = useState<"edit" | "preview" | "split">("split");
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  // AI Generator modal inputs
  const [aiTopic, setAiTopic] = useState("");
  const [aiSubject, setAiSubject] = useState("Distributed Systems");

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleUpdateActiveNote = (updates: Partial<StudyNote>) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNoteId
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      )
    );
  };

  const handleCreateBlankNote = () => {
    const newNote: StudyNote = {
      id: `note_${Date.now()}`,
      userId: "user_citadel_01",
      title: "Untitled Study Note",
      subject: "General Academic",
      topic: "Core Topic",
      contentMarkdown: `# Untitled Note\n\nStart typing notes, formulas, and academic definitions here...`,
      keyDefinitions: [],
      examSummary: "",
      quickRevisionPoints: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const handleGenerateAiNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          subject: aiSubject,
        }),
      });

      const data = await res.json();
      if (data.success && data.note) {
        setNotes([data.note, ...notes]);
        setActiveNoteId(data.note.id);
        setShowAiModal(false);
        setAiTopic("");
      }
    } catch (err) {
      console.error("AI Note generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    if (notes.length <= 1) return;
    const remaining = notes.filter((n) => n.id !== noteId);
    setNotes(remaining);
    setActiveNoteId(remaining[0].id);
  };

  const handleCopyMarkdown = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.contentMarkdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.contentMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeNote.title.replace(/\s+/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const insertMarkdownSyntax = (syntax: string) => {
    if (!activeNote) return;
    handleUpdateActiveNote({
      contentMarkdown: activeNote.contentMarkdown + "\n" + syntax,
    });
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-7.5rem)] rounded-2xl overflow-hidden glass-panel border border-white/5">
        {/* Left Column: Notes Library Drawer */}
        <div className="w-80 bg-[#090d18]/90 border-r border-white/5 flex flex-col hidden md:flex">
          {/* Header & Actions */}
          <div className="p-4 border-b border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-400" />
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                  Study Notes
                </h3>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">
                {notes.length} saved
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCreateBlankNote}
                className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Blank Note</span>
              </button>
              <button
                onClick={() => setShowAiModal(true)}
                className="py-2 px-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Note</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-300 placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredNotes.map((note) => {
              const isSelected = note.id === activeNoteId;
              return (
                <button
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all ${
                    isSelected
                      ? "bg-violet-950/70 border border-violet-500/50 text-white shadow-glow"
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-violet-400">
                      {note.subject}
                    </span>
                    <span className="text-[9px] text-gray-500">
                      {new Date(note.updatedAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-gray-200 truncate mt-1">
                    {note.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                    {note.examSummary || note.topic}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Area: Active Note Editor & Preview */}
        {activeNote && (
          <div className="flex-1 flex flex-col bg-[#07090e]/70">
            {/* Top Note Metadata Toolbar */}
            <div className="p-4 px-6 border-b border-white/5 bg-[#0a0e1a]/90 flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[240px]">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => handleUpdateActiveNote({ title: e.target.value })}
                  placeholder="Note Title..."
                  className="w-full bg-transparent border-none text-base font-bold text-white focus:outline-none placeholder-gray-500"
                />
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={activeNote.subject}
                    onChange={(e) => handleUpdateActiveNote({ subject: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[10px] text-violet-300 font-mono focus:outline-none"
                  />
                  <input
                    type="text"
                    value={activeNote.topic}
                    onChange={(e) => handleUpdateActiveNote({ topic: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[10px] text-sky-300 font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* View Toggle Tabs & Action Buttons */}
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                  <button
                    onClick={() => setEditorTab("edit")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 ${
                      editorTab === "edit" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </button>
                  <button
                    onClick={() => setEditorTab("split")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 ${
                      editorTab === "split" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Split
                  </button>
                  <button
                    onClick={() => setEditorTab("preview")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 ${
                      editorTab === "preview" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Eye className="w-3 h-3" /> Preview
                  </button>
                </div>

                {/* Secondary Actions */}
                <button
                  onClick={handleCopyMarkdown}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Copy Markdown"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Export .md"
                >
                  <Download className="w-4 h-4" />
                </button>
                <Link
                  href="/flashcards"
                  className="p-2 rounded-xl text-gray-400 hover:text-sky-300 hover:bg-white/5 transition-colors"
                  title="Generate Flashcards from Note"
                >
                  <Layers className="w-4 h-4 text-sky-400" />
                </Link>
                <button
                  onClick={() => handleDeleteNote(activeNote.id)}
                  className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Markdown Quick Formatting Toolbar */}
            {editorTab !== "preview" && (
              <div className="px-6 py-1.5 border-b border-white/5 bg-[#0a0e1a]/40 flex items-center gap-2 text-gray-400 text-xs">
                <span className="text-[10px] uppercase font-bold text-gray-500 mr-2">Insert:</span>
                <button
                  onClick={() => insertMarkdownSyntax("## Section Heading")}
                  className="px-2 py-0.5 rounded hover:bg-white/5 hover:text-white flex items-center gap-1"
                >
                  <Heading className="w-3 h-3" /> Heading
                </button>
                <button
                  onClick={() => insertMarkdownSyntax("- Key takeaway item")}
                  className="px-2 py-0.5 rounded hover:bg-white/5 hover:text-white flex items-center gap-1"
                >
                  <List className="w-3 h-3" /> Bullet
                </button>
                <button
                  onClick={() => insertMarkdownSyntax("```typescript\n// code example\n```")}
                  className="px-2 py-0.5 rounded hover:bg-white/5 hover:text-white flex items-center gap-1"
                >
                  <Code className="w-3 h-3" /> Code Block
                </button>
                <button
                  onClick={() => insertMarkdownSyntax("> [!IMPORTANT]\n> High-yield exam concept")}
                  className="px-2 py-0.5 rounded hover:bg-white/5 hover:text-white"
                >
                  Exam Alert
                </button>
              </div>
            )}

            {/* Main Editor & Preview Workspace */}
            <div className="flex-1 overflow-hidden flex">
              {/* Textarea Editor */}
              {(editorTab === "edit" || editorTab === "split") && (
                <div
                  className={`h-full p-6 overflow-y-auto ${
                    editorTab === "split" ? "w-1/2 border-r border-white/5" : "w-full"
                  }`}
                >
                  <textarea
                    value={activeNote.contentMarkdown}
                    onChange={(e) =>
                      handleUpdateActiveNote({ contentMarkdown: e.target.value })
                    }
                    placeholder="Write markdown notes..."
                    className="w-full h-full bg-transparent border-none text-xs sm:text-sm text-gray-200 font-mono leading-relaxed focus:outline-none resize-none"
                  />
                </div>
              )}

              {/* Live Rendered Markdown Preview */}
              {(editorTab === "preview" || editorTab === "split") && (
                <div
                  className={`h-full p-6 lg:p-8 overflow-y-auto bg-[#07090e]/40 ${
                    editorTab === "split" ? "w-1/2" : "w-full"
                  }`}
                >
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm prose-headings:font-display prose-headings:text-white prose-p:text-gray-300 prose-pre:bg-[#0d1220] prose-pre:border prose-pre:border-white/10 prose-code:text-sky-300">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {activeNote.contentMarkdown}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: AI Notes Generator */}
        {showAiModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-panel-glow p-6 rounded-2xl border border-violet-500/40 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AgentBadge agent="Document Intelligence Agent" size="sm" />
                  <h3 className="font-bold text-base text-white">Generate Structured Study Notes</h3>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="text-gray-400 hover:text-white text-xs font-semibold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleGenerateAiNote} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Subject / Course
                  </label>
                  <input
                    type="text"
                    value={aiSubject}
                    onChange={(e) => setAiSubject(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Specific Topic / Chapter
                  </label>
                  <input
                    type="text"
                    required
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="e.g. Relational Normalization (BCNF), Transformer Attention..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowAiModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Synthesizing Notes...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Notes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
