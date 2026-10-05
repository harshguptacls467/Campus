"use client";

import React, { useState } from "react";
import { XCircle, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

interface NotEligibleCardProps {
  requiredCGPA: number;
  studentCGPA: number;
  difference: number;
  blockers: { field: string; status: "blocker" | "passed"; text: string }[];
  onShowBetterMatches: () => void;
}

export default function NotEligibleCard({
  requiredCGPA,
  studentCGPA,
  difference,
  blockers,
  onShowBetterMatches,
}: NotEligibleCardProps) {
  const [isWhyExpanded, setIsWhyExpanded] = useState<boolean>(true);

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-rose-50/70 border-2 border-rose-300 text-rose-950 shadow-lg space-y-6">
      
      {/* Dominant Result Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30">
            <XCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase font-black tracking-widest text-rose-800 bg-rose-200/80 px-2.5 py-0.5 rounded-full border border-rose-300">
              OFFICIAL ELIGIBILITY VERDICT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-rose-950 tracking-tight">
              🔴 NOT ELIGIBLE
            </h2>
            <p className="text-xs sm:text-sm text-rose-900 leading-relaxed font-sans">
              You do not meet the minimum academic CGPA threshold specified by the hiring team.
            </p>
          </div>
        </div>

        {/* CGPA Discrepancy Pill */}
        <div className="p-3 rounded-2xl bg-white border border-rose-200 text-center font-mono shrink-0 shadow-sm">
          <span className="text-[10px] uppercase text-zinc-400 block font-sans">CGPA Gap</span>
          <span className="text-lg font-black text-rose-600">-{difference.toFixed(1)}</span>
        </div>
      </div>

      {/* Why? CGPA Breakdown */}
      <div className="p-4 rounded-2xl bg-white border border-rose-200/90 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono uppercase font-extrabold text-zinc-900 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>MANDATORY GATE BREAKDOWN</span>
          </h4>
          <span className="text-[10px] font-mono text-zinc-400">Strict Cutoff</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] text-zinc-400 uppercase block font-sans">Required CGPA</span>
            <span className="text-sm font-extrabold text-zinc-900">≥ {requiredCGPA.toFixed(1)}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
            <span className="text-[10px] text-rose-500 uppercase block font-sans">Your Profile</span>
            <span className="text-sm font-extrabold text-rose-700">{studentCGPA.toFixed(1)}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
            <span className="text-[10px] text-zinc-400 uppercase block font-sans">Difference</span>
            <span className="text-sm font-extrabold text-zinc-800">0.2</span>
          </div>
        </div>

        {/* Prioritized Eligibility Blockers Summary */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-100">
          <span className="text-[11px] font-bold text-zinc-700 block">
            Eligibility Gate Checklist:
          </span>
          {blockers.map((b, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              {b.status === "blocker" ? (
                <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              )}
              <span
                className={
                  b.status === "blocker"
                    ? "font-bold text-rose-800 font-mono"
                    : "text-zinc-600 font-mono"
                }
              >
                {b.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Value-Add: "But here's what you can do" */}
      <div className="p-5 rounded-2xl bg-indigo-950 text-white shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-300 font-mono text-xs font-extrabold uppercase">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>BUT HERE&apos;S WHAT YOU CAN DO</span>
        </div>

        <p className="text-sm font-bold text-white leading-relaxed">
          Campus Copilot found <span className="text-emerald-400">2 campus opportunities</span> you
          ARE 100% eligible for right now!
        </p>

        <p className="text-xs text-zinc-300">
          TCS Digital (Cutoff 7.5 • 92% match) and Infosys Specialist Programmer (Cutoff 7.0 • 84%
          match) both accept your 7.8 CGPA.
        </p>

        <button
          onClick={onShowBetterMatches}
          className="mt-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
        >
          <span>Show Better Matches (2 Found)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
