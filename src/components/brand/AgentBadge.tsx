import React from "react";
import { AgentIdentity } from "@/types/agent";
import {
  Brain,
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  Briefcase,
  LineChart,
  BookOpen,
  Layers,
  Sparkles,
} from "lucide-react";

interface AgentBadgeProps {
  agent: AgentIdentity;
  size?: "sm" | "md";
  showDot?: boolean;
}

export function AgentBadge({ agent, size = "md", showDot = true }: AgentBadgeProps) {
  const getBadgeConfig = () => {
    switch (agent) {
      case "Supervisor Agent":
        return {
          icon: Brain,
          color: "text-violet-400 bg-violet-950/70 border-violet-700/50",
          dotColor: "bg-violet-400 shadow-[0_0_8px_#8b5cf6]",
        };
      case "Tutor Agent":
        return {
          icon: GraduationCap,
          color: "text-sky-400 bg-sky-950/70 border-sky-700/50",
          dotColor: "bg-sky-400 shadow-[0_0_8px_#38bdf8]",
        };
      case "Study Planner Agent":
        return {
          icon: Calendar,
          color: "text-emerald-400 bg-emerald-950/70 border-emerald-700/50",
          dotColor: "bg-emerald-400 shadow-[0_0_8px_#10b981]",
        };
      case "Assessment Agent":
        return {
          icon: CheckCircle2,
          color: "text-amber-400 bg-amber-950/70 border-amber-700/50",
          dotColor: "bg-amber-400 shadow-[0_0_8px_#f59e0b]",
        };
      case "Document Intelligence Agent":
        return {
          icon: FileText,
          color: "text-indigo-400 bg-indigo-950/70 border-indigo-700/50",
          dotColor: "bg-indigo-400 shadow-[0_0_8px_#6366f1]",
        };
      case "Study Notes Agent":
        return {
          icon: BookOpen,
          color: "text-purple-400 bg-purple-950/70 border-purple-700/50",
          dotColor: "bg-purple-400 shadow-[0_0_8px_#c084fc]",
        };
      case "Flashcard Agent":
        return {
          icon: Layers,
          color: "text-pink-400 bg-pink-950/70 border-pink-700/50",
          dotColor: "bg-pink-400 shadow-[0_0_8px_#f472b6]",
        };
      case "Career Guidance Agent":
        return {
          icon: Briefcase,
          color: "text-fuchsia-400 bg-fuchsia-950/70 border-fuchsia-700/50",
          dotColor: "bg-fuchsia-400 shadow-[0_0_8px_#d946ef]",
        };
      case "Learning Analytics Agent":
        return {
          icon: LineChart,
          color: "text-cyan-400 bg-cyan-950/70 border-cyan-700/50",
          dotColor: "bg-cyan-400 shadow-[0_0_8px_#06b6d4]",
        };
      case "Recommendation Agent":
        return {
          icon: Sparkles,
          color: "text-amber-400 bg-amber-950/70 border-amber-700/50",
          dotColor: "bg-amber-400 shadow-[0_0_8px_#fbbf24]",
        };
      default:
        return {
          icon: Brain,
          color: "text-violet-400 bg-violet-950/70 border-violet-700/50",
          dotColor: "bg-violet-400",
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      } ${config.color}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`} />
      )}
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      <span>{agent}</span>
    </div>
  );
}
