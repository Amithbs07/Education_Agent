import React from "react";
import Link from "next/link";

interface CitadelLogoProps {
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
  className?: string;
}

export function CitadelLogo({ size = "md", withTagline = false, className = "" }: CitadelLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-11 h-11",
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      {/* CITADEL Shield/Monolith Icon */}
      <div
        className={`relative ${sizeClasses[size]} rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-sky-500 p-[1.5px] shadow-glow transition-transform duration-300 group-hover:scale-105`}
      >
        <div className="w-full h-full bg-[#07090e] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Inner Citadel geometric emblem */}
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-sky-400/20" />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-3/5 h-3/5 text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
            <path d="M12 7v10" strokeWidth="2" strokeDasharray="2 2" className="text-violet-300" />
            <path d="M9 11l3-3 3 3" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-wider text-white font-display ${textClasses[size]}`}>
            CITADEL
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400 bg-violet-950/80 border border-violet-700/50 px-1.5 py-0.5 rounded">
            AGENT
          </span>
        </div>
        {withTagline && (
          <span className="text-[11px] text-gray-400 font-medium tracking-tight mt-1">
            Learn Smarter. Grow Faster. Achieve More.
          </span>
        )}
      </div>
    </Link>
  );
}
