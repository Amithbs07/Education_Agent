"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AgentBadge } from "@/components/brand/AgentBadge";
import { INITIAL_FLASHCARDS } from "@/lib/supabase/mock-store";
import { Flashcard } from "@/types/plan";
import confetti from "canvas-confetti";
import {
  Layers,
  Sparkles,
  RotateCw,
  PlusCircle,
  CheckCircle2,
  Calendar,
  Flame,
  Clock,
  ArrowRight,
  Brain,
  ThumbsUp,
  AlertCircle,
} from "lucide-react";

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [currentDeck, setCurrentDeck] = useState<string>("Distributed Systems Core Concepts");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Modal State
  const [aiTopic, setAiTopic] = useState("");
  const [aiSubject, setAiSubject] = useState("Distributed Systems");
  const [cardCount, setCardCount] = useState(4);

  // Available unique decks
  const decks = Array.from(new Set(cards.map((c) => c.deckTitle)));
  const deckCards = cards.filter((c) => c.deckTitle === currentDeck);
  const currentCard = deckCards[currentIndex] || deckCards[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReviewRating = async (rating: "hard" | "good" | "easy") => {
    if (!currentCard) return;

    try {
      const res = await fetch("/api/flashcards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: currentCard.id,
          rating,
          currentEaseFactor: currentCard.easeFactor,
          currentInterval: currentCard.intervalDays,
          currentReps: currentCard.repetitions,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local card state
        setCards((prev) =>
          prev.map((c) =>
            c.id === currentCard.id
              ? {
                  ...c,
                  easeFactor: data.easeFactor,
                  intervalDays: data.intervalDays,
                  repetitions: data.repetitions,
                  dueDate: data.nextDueDate,
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error("SM-2 review update failed:", err);
    }

    // Advance to next card or trigger celebration
    setIsFlipped(false);
    if (currentIndex < deckCards.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    } else {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      setCurrentIndex(0);
    }
  };

  const handleGenerateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          subject: aiSubject,
          count: cardCount,
        }),
      });

      const data = await res.json();
      if (data.success && data.cards) {
        setCards([...data.cards, ...cards]);
        setCurrentDeck(data.deckTitle);
        setCurrentIndex(0);
        setIsFlipped(false);
        setShowAiModal(false);
        setAiTopic("");
      }
    } catch (err) {
      console.error("Flashcard generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AgentBadge agent="Document Intelligence Agent" size="sm" />
              <span className="text-xs text-sky-400 font-mono">
                SuperMemo SM-2 Spaced Retrieval
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white font-display">
              Smart Flashcards & Active Recall
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Reinforce long-term academic memory with algorithmic spaced repetition intervals.
            </p>
          </div>

          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all shrink-0 self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Deck with AI</span>
          </button>
        </div>

        {/* Deck Selectors */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/5">
          {decks.map((deck) => {
            const isSelected = deck === currentDeck;
            const count = cards.filter((c) => c.deckTitle === deck).length;

            return (
              <button
                key={deck}
                onClick={() => {
                  setCurrentDeck(deck);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all flex items-center gap-2 whitespace-nowrap ${
                  isSelected
                    ? "bg-violet-950/70 border-violet-500 text-white shadow-glow"
                    : "bg-white/[0.02] border-white/5 text-gray-400 hover:text-gray-200"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>{deck}</span>
                <span className="text-[10px] font-mono text-violet-300 bg-white/5 px-1.5 py-0.2 rounded">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Deck Status Bar */}
        <div className="flex items-center justify-between text-xs text-gray-400 px-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-white font-bold">
              Card {currentIndex + 1} of {deckCards.length}
            </span>
            <span>•</span>
            <span className="text-violet-300 font-medium">{currentCard?.subject}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Interval: {currentCard?.intervalDays}d</span>
            <span>Reps: {currentCard?.repetitions}</span>
            <span className="text-emerald-400">Due: {currentCard?.dueDate}</span>
          </div>
        </div>

        {/* Interactive 3D Flip Card */}
        {currentCard ? (
          <div className="space-y-6">
            <div
              onClick={handleFlip}
              className="cursor-pointer select-none perspective-1000 min-h-[300px] sm:min-h-[340px] w-full"
            >
              <div
                className={`relative w-full h-full min-h-[300px] sm:min-h-[340px] rounded-3xl p-8 flex flex-col justify-between transition-all duration-500 border ${
                  isFlipped
                    ? "bg-gradient-to-br from-[#0c1222] via-[#10182c] to-[#151c34] border-sky-500/40 shadow-glow-blue"
                    : "bg-gradient-to-br from-[#0d101e] via-[#121628] to-[#141b30] border-violet-500/30 shadow-glow"
                }`}
              >
                {/* Card Header Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                      isFlipped
                        ? "bg-sky-950/80 border-sky-500/40 text-sky-300"
                        : "bg-violet-950/80 border-violet-500/40 text-violet-300"
                    }`}
                  >
                    {isFlipped ? "Answer & Core Concept" : "Active Recall Question"}
                  </span>

                  <button
                    type="button"
                    className="text-gray-400 hover:text-white flex items-center gap-1 text-[11px] font-medium"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Flip Card</span>
                  </button>
                </div>

                {/* Card Center Content */}
                <div className="py-6 my-auto text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed max-w-xl mx-auto">
                    {isFlipped ? currentCard.back : currentCard.front}
                  </h3>
                </div>

                {/* Card Footer Prompt */}
                <div className="text-center text-[11px] text-gray-500 font-mono">
                  {isFlipped
                    ? "Rate how well you recalled this concept below to adjust interval"
                    : "Click card to reveal pedagogical answer"}
                </div>
              </div>
            </div>

            {/* Spaced Repetition SM-2 Review Controls */}
            {isFlipped ? (
              <div className="p-4 rounded-2xl glass-panel flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                <span className="text-xs font-semibold text-gray-300">
                  How well did you recall this answer?
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleReviewRating("hard")}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-700/50 text-xs font-semibold transition-all"
                  >
                    Hard (Review in 1d)
                  </button>

                  <button
                    onClick={() => handleReviewRating("good")}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-700/50 text-xs font-semibold transition-all"
                  >
                    Good (Review in {Math.max(2, Math.round(currentCard.intervalDays * 2.5))}d)
                  </button>

                  <button
                    onClick={() => handleReviewRating("easy")}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 text-xs font-semibold shadow-glow transition-all"
                  >
                    Easy (Review in {Math.max(4, Math.round(currentCard.intervalDays * 3.5))}d)
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <button
                  onClick={handleFlip}
                  className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all inline-flex items-center gap-2"
                >
                  <span>Reveal Answer</span>
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 text-xs glass-panel rounded-2xl">
            No cards found in this deck. Generate a deck with AI to get started.
          </div>
        )}

        {/* Modal: Generate AI Deck */}
        {showAiModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full glass-panel-glow p-6 rounded-2xl border border-violet-500/40 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AgentBadge agent="Document Intelligence Agent" size="sm" />
                  <h3 className="font-bold text-base text-white">Generate Spaced Flashcards</h3>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="text-gray-400 hover:text-white text-xs font-semibold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleGenerateDeck} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Subject / Discipline
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
                    Topic / Concept Focus
                  </label>
                  <input
                    type="text"
                    required
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="e.g. Cache Invalidation Patterns, CAP Theorem, Linear Algebra..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Card Count: {cardCount} cards
                  </label>
                  <select
                    value={cardCount}
                    onChange={(e) => setCardCount(Number(e.target.value))}
                    className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value={3}>3 Cards (Bite-sized)</option>
                    <option value={4}>4 Cards (Standard)</option>
                    <option value={8}>8 Cards (Deep Retention)</option>
                  </select>
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
                        <span>Generating Deck...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Flashcards</span>
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
