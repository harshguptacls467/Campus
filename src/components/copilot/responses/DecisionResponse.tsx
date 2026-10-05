"use client";

import React, { useState } from "react";
import { useCampusStore } from "@/store/useCampusStore";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Briefcase,
} from "lucide-react";

interface DecisionResponseProps {
  isEligible?: boolean;
  status?: string;
  company?: string;
  role?: string;
  packageStr?: string;
  package?: string;
  matchScore?: number;
  tableData?: {
    requirement: string;
    required: string;
    student: string;
    passed: boolean;
  }[];
  cgpa?: { student: number | string; required: number | string; pass: boolean };
  backlogs?: { student: number | string; allowed: number | string; pass: boolean };
  branch?: { student: string; allowed: string; pass: boolean };
  skillGap?: {
    skill: string;
    note?: string;
    description?: string;
  };
  whySeeingThis?: string[];
  source?: string;
  confidence?: "High confidence" | "Medium confidence" | "Needs verification" | string;
  ineligibilityReason?: string;
  betterAlternatives?: {
    title: string;
    matchScore: number;
    actionPrompt: string;
  }[];
}

export default function DecisionResponse({
  isEligible,
  status,
  company = "Campus Placement Drive",
  role = "Software Engineer",
  packageStr,
  package: pkg,
  matchScore = 92,
  tableData,
  cgpa,
  backlogs,
  branch,
  skillGap,
  whySeeingThis,
  source = "Campus Placement Circular",
  confidence = "High confidence",
  ineligibilityReason,
  betterAlternatives,
}: DecisionResponseProps) {
  const { setCurrentView, showToast, submitPrompt } = useCampusStore();
  const [showWhy, setShowWhy] = useState(false);

  const effectiveIsEligible = isEligible ?? (status === "eligible");
  const displayPackage = packageStr || pkg || "₹7.5 LPA";

  // Build resolved tableData defensively from direct prop or cgpa/backlogs/branch legacy schema
  let resolvedTable = Array.isArray(tableData) ? tableData : [];
  if (resolvedTable.length === 0 && (cgpa || backlogs || branch)) {
    const list: { requirement: string; required: string; student: string; passed: boolean }[] = [];
    if (branch) {
      list.push({
        requirement: "Branch Criteria",
        required: branch.allowed || "CSE, IT, ECE",
        student: branch.student || "CSE",
        passed: branch.pass ?? true,
      });
    }
    if (cgpa) {
      list.push({
        requirement: "Minimum CGPA",
        required: `${cgpa.required ?? 7.5} Cutoff`,
        student: `${cgpa.student ?? 8.1}`,
        passed: cgpa.pass ?? true,
      });
    }
    if (backlogs) {
      list.push({
        requirement: "Active Backlogs",
        required: `${backlogs.allowed ?? 0} Allowed`,
        student: `${backlogs.student ?? 0}`,
        passed: backlogs.pass ?? true,
      });
    }
    resolvedTable = list;
  }

  const resolvedSkillGap = skillGap
    ? {
        skill: skillGap.skill || "Technical Requirement",
        note: skillGap.note || skillGap.description || "Review technical topics before panel interview.",
      }
    : undefined;

  const resolvedWhySeeingThis = Array.isArray(whySeeingThis) && whySeeingThis.length > 0
    ? whySeeingThis
    : [
        "Verified against current student academic profile",
        "Checked against active campus placement circular",
      ];

  const resolvedAlternatives = Array.isArray(betterAlternatives) ? betterAlternatives : [];

  return (
    <div className="bg-white rounded-3xl border-2 border-indigo-200/90 shadow-md p-6 sm:p-7 space-y-6 text-left max-w-2xl">
      
      {/* 1. WHAT? Top Verdict Badge & Match Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {effectiveIsEligible ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>🟢 YOU ARE ELIGIBLE</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-300 text-rose-800 text-xs font-black tracking-wide">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>🔴 NOT ELIGIBLE</span>
            </div>
          )}

          <span className="text-xs font-mono font-bold text-zinc-500">
            {matchScore}% profile match
          </span>
        </div>

        <span className="text-xs font-mono font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-lg">
          {displayPackage}
        </span>
      </div>

      <div>
        <h3 className="text-xl font-extrabold text-zinc-950">{company}</h3>
        <p className="text-xs text-zinc-500 font-medium mt-0.5">{role}</p>
      </div>

      {/* Requirements Table */}
      {resolvedTable.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 overflow-hidden text-xs">
          <div className="grid grid-cols-12 bg-zinc-50 p-2.5 font-mono text-[11px] text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-200">
            <div className="col-span-5">Requirement</div>
            <div className="col-span-4">Required Criteria</div>
            <div className="col-span-3 text-right">Your Record</div>
          </div>
          <div className="divide-y divide-zinc-100 bg-white">
            {resolvedTable.map((row, i) => (
              <div key={i} className="grid grid-cols-12 p-2.5 items-center">
                <div className="col-span-5 font-bold text-zinc-800">{row.requirement}</div>
                <div className="col-span-4 text-zinc-500 font-mono">{row.required}</div>
                <div className="col-span-3 text-right font-mono font-bold">
                  {row.passed ? (
                    <span className="text-emerald-700">{row.student} ✓</span>
                  ) : (
                    <span className="text-rose-600">{row.student} ✗</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* If Not Eligible: Ineligibility Note & Constructive Alternatives */}
      {!effectiveIsEligible && ineligibilityReason && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
          <p className="text-xs text-rose-900 font-medium">
            <strong>Reason: </strong> {ineligibilityReason}
          </p>

          {resolvedAlternatives.length > 0 && (
            <div className="pt-2 border-t border-rose-200/80 space-y-2">
              <p className="text-[11px] font-mono uppercase font-bold text-rose-800">
                Better alternatives matching your profile:
              </p>
              <div className="space-y-1.5">
                {resolvedAlternatives.map((alt, idx) => (
                  <button
                    key={idx}
                    onClick={() => submitPrompt(alt.actionPrompt)}
                    className="w-full text-left p-2.5 rounded-xl bg-white border border-rose-200/60 hover:border-indigo-400 text-xs font-semibold text-zinc-800 flex items-center justify-between transition-colors"
                  >
                    <span>{alt.title} ({alt.matchScore}% Match)</span>
                    <span className="text-indigo-600 text-[11px] font-bold">Inspect →</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skill Gap Section */}
      {effectiveIsEligible && resolvedSkillGap && (
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>One Possible Gap: {resolvedSkillGap.skill}</span>
          </div>
          <p className="text-xs text-zinc-700 leading-relaxed">
            {resolvedSkillGap.note}
          </p>
        </div>
      )}

      {/* 2. WHY? Expandable Explanation Layer */}
      <div className="pt-1">
        <button
          onClick={() => setShowWhy(!showWhy)}
          className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
        >
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          <span>{showWhy ? "Hide why you're seeing this" : "Why am I seeing this?"}</span>
          {showWhy ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showWhy && (
          <div className="mt-2.5 p-3.5 rounded-2xl bg-[#FAF9F6] border border-zinc-200 text-xs space-y-2">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
              Automated Reasoning Factors:
            </span>
            {resolvedWhySeeingThis.map((reason, i) => (
              <div key={i} className="flex items-start gap-2 text-zinc-700">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. NOW WHAT? Direct Action Buttons & Source Citation */}
      <div className="pt-4 border-t border-zinc-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5 text-[11px] font-mono text-zinc-400">
          <p>Source: {source}</p>
          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200 text-[10px]">
            <ShieldCheck className="w-3 h-3" />
            <span>{(confidence || "HIGH CONFIDENCE").toUpperCase()}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {effectiveIsEligible ? (
            <>
              <button
                onClick={() => showToast(`Prepared 40-minute Docker crash-sheet for ${company}!`)}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold"
              >
                Prep Docker
              </button>
              <button
                onClick={() => {
                  showToast(`Applied for ${company} with verified resume!`);
                  setCurrentView("placements");
                }}
                className="px-4 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs shadow-sm"
              >
                Apply Now →
              </button>
            </>
          ) : (
            <button
              onClick={() => setCurrentView("placements")}
              className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-semibold text-xs"
            >
              Explore Eligible Drives
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
