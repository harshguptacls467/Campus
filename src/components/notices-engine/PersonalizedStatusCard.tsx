"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, UserCheck, ShieldAlert } from "lucide-react";
import { useCampusStore } from "@/store/useCampusStore";

interface PersonalizedStatusCardProps {
  isEligible: boolean;
  reason: string;
  notForYouMessage?: string;
  branches: string[];
  targetAudience: string;
}

export default function PersonalizedStatusCard({
  isEligible,
  reason,
  notForYouMessage,
  branches,
  targetAudience,
}: PersonalizedStatusCardProps) {
  const [isWhyExpanded, setIsWhyExpanded] = useState<boolean>(false);
  const { studentUser } = useCampusStore();

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isEligible
          ? "bg-emerald-50/60 border-emerald-300 text-emerald-950"
          : "bg-rose-50/70 border-rose-300 text-rose-950"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isEligible
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-rose-600 text-white shadow-md shadow-rose-600/20"
            }`}
          >
            {isEligible ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider opacity-75">
                PERSONALIZED INTELLIGENCE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/80 border border-current font-semibold">
                Profile: CSE · {studentUser.semester}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black tracking-tight">
              {isEligible ? "🟢 YOU ARE ELIGIBLE" : "🔴 NOT FOR YOU"}
            </h3>

            <p className="text-xs leading-relaxed opacity-90 max-w-xl">
              {isEligible
                ? `This circular matches your registered profile (${studentUser.semester} Computer Science). Mandatory action is required before the cutoff.`
                : notForYouMessage ||
                  `This notice applies to ${targetAudience}. Your profile is registered as ${studentUser.semester}. Don't worry — you don't need to take action.`}
            </p>
          </div>
        </div>

        {/* Expandable Why Button */}
        <button
          onClick={() => setIsWhyExpanded(!isWhyExpanded)}
          className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors shrink-0 ${
            isEligible
              ? "bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-emerald-900"
              : "bg-rose-100 hover:bg-rose-200 border-rose-300 text-rose-900"
          }`}
        >
          <span>Why?</span>
          {isWhyExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Expandable Explanation Panel */}
      {isWhyExpanded && (
        <div className="mt-4 pt-4 border-t border-current/20 text-xs space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
            <div className="p-2.5 rounded-xl bg-white/80 border border-current/20">
              <p className="text-zinc-500 font-sans text-[10px]">Academic Year &amp; Sem</p>
              <p className="font-bold">
                Required: {targetAudience}
                <br />
                <span className="text-emerald-700">You: {studentUser.semester}</span>
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/80 border border-current/20">
              <p className="text-zinc-500 font-sans text-[10px]">Eligible Branches</p>
              <p className="font-bold">
                {branches.join(", ")}
                <br />
                <span className="text-emerald-700">You: CSE (Match)</span>
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/80 border border-current/20">
              <p className="text-zinc-500 font-sans text-[10px]">Attendance Cutoff</p>
              <p className="font-bold">
                Req: 75.0%
                <br />
                <span className="text-emerald-700">You: {studentUser.overallAttendance}% (Safe)</span>
              </p>
            </div>
          </div>

          <p className="text-xs italic bg-white/60 p-2.5 rounded-xl border border-current/15">
            <strong>Copilot Verification Note:</strong> {reason}
          </p>
        </div>
      )}
    </div>
  );
}
