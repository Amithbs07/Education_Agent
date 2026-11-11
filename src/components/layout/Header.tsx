"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Cpu,
  Sparkles,
  Command,
  PlusCircle,
} from "lucide-react";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 border-b border-white/5 bg-[#07090e]/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
      {/* Search Bar */}
      <div className="relative w-96 max-w-md">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Ask CITADEL, search notes, or explore topics..."
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-12 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.06] transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-gray-500 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
          <Command className="w-2.5 h-2.5" /> K
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Model Engine Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/20 text-xs">
          <Cpu className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-gray-300 font-medium">Gemini Intelligence</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        {/* Start New AI Chat Action */}
        <Link
          href="/tutor"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Session</span>
        </Link>

        {/* Notifications */}
        <button
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-sky-400 absolute top-1.5 right-1.5 ring-2 ring-[#07090e]" />
        </button>

        {/* Profile Avatar */}
        <Link href="/settings">
          <div className="w-8 h-8 rounded-full ring-2 ring-violet-500/40 hover:ring-violet-400 transition-all overflow-hidden flex items-center justify-center bg-gradient-to-tr from-violet-600 to-sky-400 text-white text-xs font-bold shadow-md cursor-pointer">
            AV
          </div>
        </Link>
      </div>
    </header>
  );
}
