"use client";

import React from "react";
import { Info, Sparkles } from "lucide-react";

interface MatchBreakdownBarProps {
  eligibilityPercent: number;
  skillsPercent: number;
  profileCompletenessPercent: number;
}

export default function MatchBreakdownBar({
  eligibilityPercent,
  skillsPercent,
  profileCompletenessPercent,
}: MatchBreakdownBarProps) {
  const items = [
    {
      label: "Mandatory Eligibility",
      percent: eligibilityPercent,
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
    },
    {
      label: "Skills & Stack Match",
      percent: skillsPercent,
      color: "bg-indigo-600",
      textColor: "text-indigo-700",
    },
    {
      label: "Profile Completeness",
      percent: profileCompletenessPercent,
      color: "bg-purple-600",
      textColor: "text-purple-700",
    },
  ];

  return (
    <div className="rounded-2xl p-5 bg-white border border-zinc-200/90 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h4 className="text-xs font-mono font-extrabold uppercase tracking-wider text-zinc-900">
            MATCH BREAKDOWN &amp; SIGNALS
          </h4>
        </div>
        <span className="text-[10px] font-mono text-zinc-400">Multi-Factor Assessment</span>
      </div>

      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="font-semibold text-zinc-700">{it.label}</span>
              <span className={`font-mono font-extrabold ${it.textColor}`}>{it.percent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${it.color} transition-all duration-700`}
                style={{ width: `${it.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Critical Clarification Disclaimer */}
      <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-2 text-[11px] text-zinc-600 leading-relaxed font-sans">
        <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-zinc-800">Recommendation Signal:</strong> Match score indicates
          interview shortlist likelihood. Official campus eligibility is determined strictly by
          mandatory criteria gates.
        </p>
      </div>
    </div>
  );
}
