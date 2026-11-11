"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { AgentBadge } from "@/components/brand/AgentBadge";
import { INITIAL_DOCUMENTS, INITIAL_DOCUMENT_CHUNKS } from "@/lib/supabase/mock-store";
import { UploadedDocument, DocumentChunk } from "@/types/document";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FileText,
  Upload,
  Search,
  Sparkles,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  Layers,
  Send,
  AlertCircle,
  FileCode,
  FileType,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function DocumentLibraryPage() {
  const [documents, setDocuments] = useState<UploadedDocument[]>(INITIAL_DOCUMENTS as any);
  const [chunks, setChunks] = useState<DocumentChunk[]>(INITIAL_DOCUMENT_CHUNKS);
  const [selectedDocId, setSelectedDocId] = useState<string>(INITIAL_DOCUMENTS[0].id);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // RAG Query states
  const [ragQuery, setRagQuery] = useState("");
  const [isQuerying, setIsQuerying] = useState(false);
  const [ragAnswer, setRagAnswer] = useState<string | null>(null);
  const [citations, setCitations] = useState<{ pageNumber: number; excerpt: string }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];
  const docChunks = chunks.filter((c) => c.documentId === selectedDocId);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload document");
      }

      setDocuments([data.document, ...documents]);
      setChunks([...data.chunks, ...chunks]);
      setSelectedDocId(data.document.id);
      setRagAnswer(null);
      setCitations([]);
    } catch (err: any) {
      setUploadError(err.message || "Upload processing error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAskRAG = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuery.trim() || isQuerying) return;

    setIsQuerying(true);
    setRagAnswer(null);
    setCitations([]);

    try {
      const res = await fetch("/api/documents/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: ragQuery,
          documentId: selectedDocId,
          chunks: docChunks,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRagAnswer(data.answer);
        setCitations(data.citations || []);
      }
    } catch (err) {
      console.error("RAG query failed:", err);
      setRagAnswer("An error occurred while analyzing document context.");
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AgentBadge agent="Document Intelligence Agent" size="sm" />
              <span className="text-xs text-indigo-400 font-mono">
                Vector RAG & Document Grounding
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display">
              Document Library & RAG Inspector
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Upload academic papers, notes, or textbooks for grounded Q&A, chapter summaries, and citation indexing.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.docx,.txt,.md"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-glow disabled:opacity-50 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? "Indexing Document..." : "Upload Document"}</span>
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Two-Column Workspace: Left Document List | Right Inspector & RAG */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Uploaded Documents Shelf */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Indexed Documents ({documents.length})</span>
              </h3>
            </div>

            <div className="space-y-2.5">
              {documents.map((doc) => {
                const isSelected = doc.id === selectedDocId;

                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setRagAnswer(null);
                      setCitations([]);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-indigo-950/70 border-indigo-500 text-white shadow-glow"
                        : "bg-[#0d1220] border-white/5 text-gray-400 hover:border-white/15 hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono uppercase font-bold text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40">
                        {doc.fileType}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {doc.totalPages} pages • {Math.round(doc.fileSize / 1024)} KB
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-white truncate mt-1">
                      {doc.filename}
                    </h4>

                    <p className="text-[11px] text-gray-400 line-clamp-2 mt-1">
                      {doc.summary || "Indexed and ready for RAG grounding."}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {doc.extractedConcepts?.slice(0, 3).map((concept, i) => (
                        <span
                          key={i}
                          className="text-[9px] bg-white/5 border border-white/5 px-1.5 py-0.5 rounded text-gray-300 font-mono"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: RAG Grounded Query & Document Inspector */}
          {selectedDoc && (
            <div className="lg:col-span-2 space-y-6">
              {/* Document Overview Card */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/5">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                      Active Document Focus
                    </span>
                    <h2 className="text-base font-bold text-white truncate">
                      {selectedDoc.filename}
                    </h2>
                  </div>

                  {/* Actions derived from Document */}
                  <div className="flex items-center gap-2">
                    <Link
                      href="/notes"
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 border border-white/10 transition-all flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-violet-400" />
                      <span>Create Notes</span>
                    </Link>
                    <Link
                      href="/assessment"
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 border border-white/10 transition-all flex items-center gap-1.5"
                    >
                      <Brain className="w-3.5 h-3.5 text-amber-400" />
                      <span>Generate Quiz</span>
                    </Link>
                  </div>
                </div>

                {/* Executive Summary */}
                <div>
                  <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                    Executive Summary
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {selectedDoc.summary}
                  </p>
                </div>

                {/* Key Concepts Tags */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Indexed Key Concepts
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDoc.extractedConcepts?.map((c, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-700/40 px-2.5 py-1 rounded-lg"
                      >
                        ✓ {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RAG Grounded Q&A Interface */}
              <div className="glass-panel-glow p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h3 className="font-bold text-sm text-white">
                      Ask Questions Grounded in this Document
                    </h3>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {docChunks.length} vector chunks available
                  </span>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleAskRAG} className="flex gap-2">
                  <input
                    type="text"
                    value={ragQuery}
                    onChange={(e) => setRagQuery(e.target.value)}
                    placeholder={`e.g. How does leader election prevent split-brain in ${selectedDoc.filename.slice(0, 20)}...?`}
                    className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={isQuerying || !ragQuery.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-glow disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    {isQuerying ? "Analyzing..." : "Ask RAG"}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Grounded Response Area */}
                {ragAnswer && (
                  <div className="mt-4 p-5 rounded-xl bg-[#090d18] border border-indigo-500/30 space-y-4 text-xs leading-relaxed animate-fade-in">
                    <div className="flex items-center justify-between text-gray-400 pb-2 border-b border-white/5">
                      <AgentBadge agent="Document Intelligence Agent" size="sm" />
                      <span className="font-mono text-[10px] text-emerald-400">
                        Grounded in {citations.length} Verified Citation{citations.length === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className="prose prose-invert max-w-none text-xs text-gray-200">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {ragAnswer}
                      </ReactMarkdown>
                    </div>

                    {/* Citations Excerpt Box */}
                    {citations.length > 0 && (
                      <div className="pt-3 border-t border-white/5 space-y-2">
                        <span className="font-bold text-[10px] uppercase tracking-wider text-indigo-400 block">
                          Document Citations & References:
                        </span>
                        <div className="space-y-1.5">
                          {citations.map((cite, i) => (
                            <div
                              key={i}
                              className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] text-gray-300 flex items-start gap-2"
                            >
                              <span className="font-mono text-indigo-300 font-bold shrink-0">
                                [Page {cite.pageNumber}]:
                              </span>
                              <span className="italic">{cite.excerpt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
