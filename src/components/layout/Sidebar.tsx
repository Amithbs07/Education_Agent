"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CitadelLogo } from "@/components/brand/CitadelLogo";
import {
  LayoutDashboard,
  GraduationCap,
  GitFork,
  Calendar,
  CheckCircle2,
  FileText,
  BookOpen,
  Layers,
  Briefcase,
  LineChart,
  Settings,
  Sparkles,
  Flame,
  ShieldCheck,
  Lightbulb,
  CreditCard,
  Building2,
  Users,
  LifeBuoy,
  Globe,
  Tag,
} from "lucide-react";

const learningItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "AI Tutor", href: "/tutor", icon: GraduationCap, badge: "AI" },
  { name: "Learning Paths", href: "/learning-paths", icon: GitFork },
  { name: "Study Planner", href: "/study-planner", icon: Calendar },
  { name: "Assessments", href: "/assessment", icon: CheckCircle2 },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Notes", href: "/notes", icon: BookOpen },
  { name: "Flashcards", href: "/flashcards", icon: Layers },
  { name: "Career Guidance", href: "/career-guidance", icon: Briefcase },
  { name: "Learning Insights", href: "/insights", icon: Lightbulb, badge: "NEW" },
  { name: "Analytics", href: "/analytics", icon: LineChart },
];

const workspaceItems = [
  { name: "Subscription & Limits", href: "/subscription", icon: CreditCard },
  { name: "Campus Workspace", href: "/institution", icon: Building2 },
  { name: "Educator Hub", href: "/educator", icon: Users },
  { name: "Pricing Plans", href: "/pricing", icon: Tag },
  { name: "Help & FAQ", href: "/help", icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0a0e1a]/95 border-r border-white/5 flex flex-col h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/5">
        <CitadelLogo size="md" withTagline={true} />
      </div>

      {/* Main Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {/* Core Learning Platform */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Core Learning Platform
          </div>
          {learningItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600/20 to-sky-500/10 text-white border border-violet-500/30 shadow-[0_0_15px_-3px_rgba(139,92,246,0.2)]"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-sky-400"
                        : "text-gray-500 group-hover:text-gray-300"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm font-mono">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Commercial SaaS & Workspaces */}
        <div className="space-y-1 pt-2 border-t border-white/5">
          <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Workspaces & SaaS
          </div>
          {workspaceItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600/20 to-sky-500/10 text-white border border-violet-500/30 shadow-[0_0_15px_-3px_rgba(139,92,246,0.2)]"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-sky-400"
                        : "text-gray-500 group-hover:text-gray-300"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Administration & Public */}
        <div className="space-y-1 pt-2 border-t border-white/5">
          <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Management & Showcase
          </div>
          <Link
            href="/admin"
            className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
              pathname === "/admin"
                ? "bg-gradient-to-r from-violet-600/20 to-sky-500/10 text-white border border-violet-500/30 shadow-glow"
                : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck
                className={`w-4 h-4 transition-colors ${
                  pathname === "/admin" ? "text-violet-400" : "text-gray-500 group-hover:text-gray-300"
                }`}
              />
              <span>Educator & Admin</span>
            </div>
            <span className="text-[9px] font-mono text-gray-500 bg-white/5 px-1 py-0.2 rounded">
              RBAC
            </span>
          </Link>

          <Link
            href="/settings"
            className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
              pathname === "/settings"
                ? "bg-gradient-to-r from-violet-600/20 to-sky-500/10 text-white border border-violet-500/30 shadow-glow"
                : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings
                className={`w-4 h-4 transition-colors ${
                  pathname === "/settings" ? "text-sky-400" : "text-gray-500 group-hover:text-gray-300"
                }`}
              />
              <span>Settings & Keys</span>
            </div>
          </Link>

          <Link
            href="/landing"
            className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
              pathname === "/landing"
                ? "bg-gradient-to-r from-violet-600/20 to-sky-500/10 text-white border border-violet-500/30 shadow-glow"
                : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Globe
                className={`w-4 h-4 transition-colors ${
                  pathname === "/landing" ? "text-sky-400" : "text-gray-500 group-hover:text-gray-300"
                }`}
              />
              <span>Marketing Landing</span>
            </div>
            <span className="text-[9px] font-mono text-violet-400 bg-violet-500/10 px-1 py-0.2 rounded">
              Public
            </span>
          </Link>
        </div>
      </nav>

      {/* Student Streak & Quick Card */}
      <div className="p-3 border-t border-white/5 bg-[#07090e]/60">
        <div className="p-3 rounded-xl bg-gradient-to-br from-violet-950/40 via-surface-card to-sky-950/30 border border-violet-500/20 mb-2">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>5-Day Streak</span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">75m goal</span>
          </div>
          <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-violet-500 to-sky-400 h-full rounded-full transition-all duration-500"
              style={{ width: "68%" }}
            />
          </div>
        </div>

        {/* User Profile Mini Bar */}
        <Link
          href="/settings"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-sky-400 flex items-center justify-center font-bold text-xs text-white shadow-inner">
            AV
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate group-hover:text-sky-300 transition-colors">
              Alex Vance
            </p>
            <p className="text-[10px] text-gray-400 truncate">Computer Science & AI</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
