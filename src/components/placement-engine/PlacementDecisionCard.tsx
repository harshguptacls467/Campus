"use client";

import React, { useState, useEffect } from "react";
import { DetailedPlacementOpportunity } from "@/lib/mock/placements";
import RequirementComparisonTable from "./RequirementComparisonTable";
import MatchBreakdownBar from "./MatchBreakdownBar";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Bell,
  Send,
  Zap,
} from "lucide-react";
import { useCampusStore } from "@/store/useCampusStore";

interface PlacementDecisionCardProps {
  opportunity: DetailedPlacementOpportunity;
  onOpenPreparationPlan?: () => void;
  onAddReminder?: () => void;
}

export default function PlacementDecisionCard({
  opportunity,
  onOpenPreparationPlan,
  onAddReminder,
}: PlacementDecisionCardProps) {
  const [animatedScore, setAnimatedScore] = useState<number>(0);
  const [isWhyExpanded, setIsWhyExpanded] = useState<boolean>(true);
  const { showToast } = useCampusStore();

  // Animate match score from 0 -> target (clean integer)
  useEffect(() => {
    let start = 0;
    const end = opportunity.matchScore;
    const duration = 600;
    const stepTime = 16;
    const increment = end / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [opportunity.matchScore]);

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-white border-2 border-emerald-300 shadow-xl space-y-6">
      
      {/* 4. The Big Result Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/25">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-black tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                OFFICIAL ELIGIBILITY VERDICT
              </span>
              <span className="text-xs font-mono text-zinc-400">• {opportunity.batch}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              🟢 YOU ARE ELIGIBLE
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-emerald-800">
              {opportunity.company} Drive • {opportunity.summaryText}
            </p>
          </div>
        </div>

        {/* Animated Match Score Badge (clean integer, no fake decimals) */}
        <div className="p-4 rounded-2xl bg-zinc-950 text-white text-center font-mono shrink-0 shadow-md min-w-[120px]">
          <span className="text-[10px] uppercase text-zinc-400 block tracking-wider font-sans">
            Profile Match
          </span>
          <span className="text-3xl font-black text-emerald-400">
            {animatedScore}%
          </span>
          <span className="text-[9px] text-zinc-400 block mt-0.5">High Fit Signal</span>
        </div>
      </div>

      {/* 5. Requirement Comparison Table */}
      <RequirementComparisonTable requirements={opportunity.requirements} />

      {/* 8. Expandable "Why am I eligible?" User-Facing Reasoning */}
      <div className="rounded-2xl p-4 bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsWhyExpanded(!isWhyExpanded)}
            className="flex items-center gap-2 font-extrabold text-emerald-950 hover:underline"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Why am I eligible? (AI Reasoning)</span>
            {isWhyExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
          <span className="text-[10px] font-mono text-emerald-800">4 of 4 Gates Passed</span>
        </div>

        {isWhyExpanded && (
          <ul className="space-y-1.5 pl-2 border-l-2 border-emerald-300 font-sans text-emerald-900 pt-1 animate-in fade-in duration-150">
            {opportunity.whyExplanation.map((point, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 7. Skill Gap vs Eligibility Separation */}
      {opportunity.skillGap && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                PROFILE STRENGTH TIP
              </span>
              <span className="font-extrabold text-zinc-900">
                One skill could strengthen your profile: {opportunity.skillGap.skillName}
              </span>
            </div>
            <p className="text-zinc-600 leading-relaxed font-sans">
              {opportunity.skillGap.explanation}
            </p>
          </div>

          <button
            onClick={() =>
              showToast(`Opening recommended study primer for ${opportunity.skillGap?.skillName}`)
            }
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-300 text-indigo-700 font-bold shadow-xs whitespace-nowrap shrink-0 transition-colors"
          >
            {opportunity.skillGap.actionLabel}
          </button>
        </div>
      )}

      {/* 14. Match Breakdown (Recommendation Signal) */}
      <MatchBreakdownBar
        eligibilityPercent={opportunity.matchBreakdown.eligibilityPercent}
        skillsPercent={opportunity.matchBreakdown.skillsPercent}
        profileCompletenessPercent={opportunity.matchBreakdown.profileCompletenessPercent}
      />

      {/* 13. "WHAT SHOULD I DO NEXT?" Action Panel */}
      <div className="p-5 rounded-2xl bg-zinc-950 text-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold tracking-widest">
              DECISION → ACTION
            </span>
            <h4 className="text-base font-extrabold text-white">
              WHAT SHOULD YOU DO NEXT?
            </h4>
          </div>
          <span className="text-xs font-mono text-zinc-400">{opportunity.nextSteps.deadlineNotice}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://tp.college.edu/tcs-apply"
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              e.preventDefault();
              showToast("Opening Official T&P Application Portal in new window.");
            }}
            className="flex-1 min-w-[160px] py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-colors flex items-center justify-center gap-2"
          >
            <span>Open Application</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => {
              if (onAddReminder) onAddReminder();
              else showToast("Reminder scheduled for TCS application deadline.");
            }}
            className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-xs transition-colors flex items-center gap-2"
          >
            <Bell className="w-3.5 h-3.5 text-purple-400" />
            <span>Add Reminder</span>
          </button>

          <button
            onClick={() => {
              if (onOpenPreparationPlan) onOpenPreparationPlan();
              else showToast("Scrolling to 7-day interview preparation sprint.");
            }}
            className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-xs transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Prepare for Interview</span>
          </button>
        </div>
      </div>

      {/* 9 & 10. Source & Confidence Panel */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500 font-mono border-t border-zinc-100">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-indigo-600" />
          <span>
            VERIFIED AGAINST:{" "}
            <strong className="text-zinc-900 font-sans">
              {opportunity.sourceDocument.filename}
            </strong>{" "}
            ({opportunity.sourceDocument.uploadedAgo})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {opportunity.confidence.level}
          </span>
        </div>
      </div>
    </div>
  );
}
