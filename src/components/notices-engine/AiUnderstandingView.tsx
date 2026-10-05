"use client";

import React, { useState } from "react";
import { DetailedNoticeData } from "@/lib/mock/notices";
import PersonalizedStatusCard from "./PersonalizedStatusCard";
import WhatChangedWidget from "./WhatChangedWidget";
import ConflictDetectorCard from "./ConflictDetectorCard";
import SourceConfidencePanel from "./SourceConfidencePanel";
import AskAboutNoticeBar from "./AskAboutNoticeBar";
import { AddToCalendarModal, SetReminderModal } from "./CalendarReminderModals";
import {
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  Bell,
  Sparkles,
  ArrowRight,
  BookOpen,
  DollarSign,
  Layers,
} from "lucide-react";
import { useCampusStore } from "@/store/useCampusStore";

interface AiUnderstandingViewProps {
  notice: DetailedNoticeData;
  activeHighlightId: string | null;
  onFieldClick: (fieldId: string) => void;
}

export default function AiUnderstandingView({
  notice,
  activeHighlightId,
  onFieldClick,
}: AiUnderstandingViewProps) {
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const { showToast } = useCampusStore();

  return (
    <div className="space-y-6">
      
      {/* Notice Title Banner */}
      <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase font-black px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              AI STRUCTURED INTELLIGENCE
            </span>
            <span className="text-xs font-mono text-zinc-400">{notice.officialRef}</span>
          </div>

          <span className="text-xs font-mono text-zinc-500 font-medium">
            Published {notice.publishedAgo}
          </span>
        </div>

        <h2 className="text-2xl font-black text-zinc-950 tracking-tight leading-tight">
          {notice.title}
        </h2>

        {/* 5-Second Comprehension: "IN SHORT" */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-1">
          <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>IN SHORT (5-SECOND READ)</span>
          </div>
          <p className="text-xs sm:text-[13px] text-zinc-800 leading-relaxed font-sans">
            {notice.inShortSummary}
          </p>
        </div>
      </div>

      {/* Personalized Student Status (🟢 Eligible vs 🔴 Not for you) */}
      <PersonalizedStatusCard
        isEligible={notice.isEligibleForStudent}
        reason={notice.studentStatusReason}
        notForYouMessage={notice.notForYouMessage}
        branches={notice.branches}
        targetAudience={notice.targetAudience}
      />

      {/* "WHAT CHANGED?" Diff Detector Widget */}
      {notice.whatChanged && <WhatChangedWidget changes={notice.whatChanged} />}

      {/* Conflict Detector Widget */}
      {notice.conflictAlert && (
        <ConflictDetectorCard
          conflict={notice.conflictAlert}
          onViewSources={() => {
            const el = document.getElementById("sources-section");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}

      {/* Core Extracted Attributes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Important Deadline */}
        <div
          onClick={() => onFieldClick("hl-deadline")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
            activeHighlightId === "hl-deadline"
              ? "bg-amber-50 border-amber-500 ring-2 ring-amber-400 shadow-md"
              : "bg-white border-zinc-200/90 hover:border-amber-400 hover:bg-amber-50/30"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-amber-700">
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">
                IMPORTANT DEADLINE
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold">
              URGENT
            </span>
          </div>

          <p className="text-xl font-black text-zinc-950 tracking-tight">{notice.deadline}</p>
          <p className="text-xs text-amber-800 font-mono mt-1">
            5 days remaining • Automatic portal lockout
          </p>

          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCalendarModal(true);
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Add to Calendar</span>
            </button>
            <span className="text-[10px] text-zinc-400 font-mono group-hover:text-zinc-600">
              Click to view in PDF ↗
            </span>
          </div>
        </div>

        {/* Target Audience & Eligibility */}
        <div
          onClick={() => onFieldClick("hl-eligibility")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
            activeHighlightId === "hl-eligibility"
              ? "bg-blue-50 border-blue-500 ring-2 ring-blue-400 shadow-md"
              : "bg-white border-zinc-200/90 hover:border-blue-400 hover:bg-blue-50/30"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-blue-700">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">
                WHO IS THIS FOR?
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-extrabold">
              TARGET AUDIENCE
            </span>
          </div>

          <p className="text-base font-extrabold text-zinc-950">{notice.targetAudience}</p>
          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            {notice.branches.map((b) => (
              <span
                key={b}
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Branch Match: 100%</span>
            <span className="group-hover:text-zinc-600">Click to view in PDF ↗</span>
          </div>
        </div>

        {/* Late Fee Penalty */}
        <div
          onClick={() => onFieldClick("hl-fee")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
            activeHighlightId === "hl-fee"
              ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 shadow-md"
              : "bg-white border-zinc-200/90 hover:border-emerald-400 hover:bg-emerald-50/30"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-emerald-700">
              <DollarSign className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">
                LATE FINE PENALTY
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-extrabold">
              SAVINGS RISK
            </span>
          </div>

          <p className="text-xl font-black text-emerald-900">{notice.lateFee}</p>
          <p className="text-xs text-zinc-500 mt-1">Levied from 12 Oct to 15 Oct 2026</p>

          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Avoid by Oct 11</span>
            <span className="group-hover:text-zinc-600">Click to view in PDF ↗</span>
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div
          onClick={() => onFieldClick("hl-docs")}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
            activeHighlightId === "hl-docs"
              ? "bg-purple-50 border-purple-500 ring-2 ring-purple-400 shadow-md"
              : "bg-white border-zinc-200/90 hover:border-purple-400 hover:bg-purple-50/30"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-purple-700">
              <FileCheck className="w-4 h-4" />
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">
                REQUIRED DOCUMENTS
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-extrabold">
              {notice.requiredDocuments.length} ITEMS
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-medium text-zinc-800">
            {notice.requiredDocuments.map((doc, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{doc}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Pre-requisite checklist</span>
            <span className="group-hover:text-zinc-600">Click to view in PDF ↗</span>
          </div>
        </div>
      </div>

      {/* Action Panel: "WHAT SHOULD YOU DO?" */}
      <div className="p-6 rounded-3xl bg-zinc-950 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold">
              EXECUTION PIPELINE
            </span>
            <h3 className="text-lg font-black tracking-tight text-white mt-0.5">
              WHAT SHOULD YOU DO?
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">Sequential Next Steps</span>
        </div>

        <div className="space-y-3">
          {/* Step 1: Open Form */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Complete examination form</h4>
                <p className="text-xs text-zinc-400 font-mono">
                  Deadline: 11 Oct • 11:59 PM (Direct portal link)
                </p>
              </div>
            </div>

            <a
              href="https://erp.college.edu/exam-forms"
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                e.preventDefault();
                showToast("Opening University Exam Registration Portal in new tab.");
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-colors flex items-center gap-1.5 shrink-0 justify-center"
            >
              <span>Open Form</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Step 2: Keep Fee Receipt Ready */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Keep fee receipt ready</h4>
                <p className="text-xs text-zinc-400 font-mono">
                  PDF format, max 2MB (Available in ERP Finance)
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800">
              ✓ Verified In Locker
            </span>
          </div>

          {/* Step 3: Set Reminder */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Set proactive reminder</h4>
                <p className="text-xs text-zinc-400 font-mono">
                  Never miss before ₹500 late penalty kicks in
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowReminderModal(true)}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0 justify-center"
            >
              <Bell className="w-3.5 h-3.5 text-purple-400" />
              <span>Remind Me</span>
            </button>
          </div>
        </div>
      </div>

      {/* Source Provenance & Confidence */}
      <div id="sources-section">
        <SourceConfidencePanel
          sources={notice.sources}
          confidence={notice.confidence}
          confidenceDetails={notice.confidenceDetails}
        />
      </div>

      {/* Ask Copilot Grounded Q&A Bar */}
      <AskAboutNoticeBar
        notice={notice}
        onTriggerCalendarModal={() => setShowCalendarModal(true)}
      />

      {/* Confirmation Modals */}
      <AddToCalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        title={notice.title}
        deadlineText={notice.deadline}
      />

      <SetReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        noticeTitle={notice.title}
      />
    </div>
  );
}
