"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useCampusStore } from "@/store/useCampusStore";
import { TODAY_TIMELINE, CAMPUS_CHANGES } from "@/lib/mock/timeline";
import { STUDENT_NOTICES } from "@/lib/mock/notices";
import { STUDENT_OPPORTUNITIES } from "@/lib/mock/placements";
import { UPCOMING_EXAM } from "@/lib/mock/exams";
import CampusOrbFallback from "../3d/CampusOrbFallback";
import WhatShouldIDoTodayWidget from "./WhatShouldIDoTodayWidget";
import {
  Sparkles,
  ArrowRight,
  Flame,
  Gauge,
  Clock,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Radio,
  TrendingUp,
  Info,
  Layers,
  ChevronRight,
} from "lucide-react";

// Lazy-load miniature 3D campus mesh
const CampusOrb = dynamic(() => import("../3d/CampusOrb"), {
  ssr: false,
  loading: () => <CampusOrbFallback />,
});

export default function StudentOverview() {
  const {
    studentUser,
    setCurrentView,
    submitPrompt,
    showToast,
    toggleSaveItem,
    savedItemIds,
  } = useCampusStore();

  const [aiQuestion, setAiQuestion] = useState("");
  const [expandedWhyOpp, setExpandedWhyOpp] = useState<string | null>("opp-tcs");
  const [isSimulatingAttendance, setIsSimulatingAttendance] = useState(false);
  const [missCount, setMissCount] = useState<number>(1);
  const [selectedNoticeForSource, setSelectedNoticeForSource] = useState<string | null>(null);

  const handleAiAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    submitPrompt(aiQuestion);
    setCurrentView("copilot");
    setAiQuestion("");
  };

  const suggestionChips = [
    "What's due this week?",
    "Am I eligible for today's placement?",
    "I have DBMS tomorrow",
    "Can I bunk tomorrow?",
    "Summarize important notices",
  ];

  // Attendance simulation math
  const simulatedAttendance = (78.4 - missCount * 1.3).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* =========================================================================
          1. CONTEXTUAL GREETING & CAMPUS PRIORITY WORKLOAD SIGNAL
          ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-200/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 text-xs font-mono text-zinc-500 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>CAMPUS LIVE CONTEXT</span>
            <span className="text-zinc-300">•</span>
            <span>Monday, 5 Oct</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-950 tracking-tight leading-tight">
            Good afternoon, {studentUser.firstName}.<br />
            <span className="text-zinc-500 font-bold">Here’s what actually matters today.</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 font-medium flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
            <span>3 things need your attention: DBMS Mid-Sem, TCS Registration, and Exam Form.</span>
          </p>
        </div>

        {/* AI Campus Priority Score Radial Signal */}
        <div className="flex items-center gap-4 p-4 rounded-3xl bg-white border border-zinc-200 shadow-sm shrink-0">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" stroke="#F4F4F5" strokeWidth="6" fill="none" />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#6366F1"
                strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 26}`}
                strokeDashoffset={`${2 * Math.PI * 26 * (1 - 0.78)}`}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-extrabold font-mono text-zinc-900 leading-none">
                {studentUser.campusPriorityScore}
              </span>
              <span className="text-[9px] font-mono text-zinc-400">/ 10</span>
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-900">Campus Priority</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-bold">
                Busy Week
              </span>
            </div>
            <p className="text-xs text-zinc-500">Your week is getting busy.</p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 pt-1">
              <span>2 Deadlines</span>
              <span>•</span>
              <span>1 Drive</span>
              <span>•</span>
              <span>2 Exams</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. “WHAT SHOULD I DO?” PROMINENT AI INPUT
          ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border-2 border-indigo-200/80 shadow-xl shadow-indigo-950/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-spin-slow" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Campus Intelligence Prompt
            </span>
          </div>
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
            Direct Synthesizer for 5th Sem CSE
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950">
            What do you need to figure out?
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Ask anything across circulars, syllabus weightage, eligibility, or attendance.
          </p>
        </div>

        <form onSubmit={handleAiAsk} className="relative">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#FAF9F6] border border-zinc-300 focus-within:border-indigo-600 focus-within:ring-3 focus-within:ring-indigo-100 transition-all">
            <div className="pl-3 text-zinc-400">
              <Search className="w-4 h-4 text-indigo-600" />
            </div>
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="Ask about exams, placements, notices, attendance..."
              className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none py-2 px-1 font-medium"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>Ask AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-mono text-zinc-400 mr-1">Suggestions:</span>
          {suggestionChips.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                submitPrompt(chip);
                setCurrentView("copilot");
              }}
              className="px-3 py-1 rounded-xl bg-zinc-100/90 hover:bg-zinc-200/90 text-zinc-700 text-xs font-medium border border-zinc-200/60 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          3. TODAY'S INTELLIGENCE TIMELINE + EXAM INTELLIGENCE WIDGET
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: What Should I Do Today? AI Intelligence Feed */}
        <div className="lg:col-span-7 space-y-4">
          <WhatShouldIDoTodayWidget />
        </div>

        {/* Right: Approaching Exam Card + Attendance Simulator Preview */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 11: Exam Intelligence Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-950 to-indigo-950 text-white shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md bg-rose-950 text-rose-400 border border-rose-800">
                APPROACHING EXAM
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {UPCOMING_EXAM.timeRemaining}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {UPCOMING_EXAM.courseCode} • {UPCOMING_EXAM.courseName}
              </h3>
              <p className="text-xs text-zinc-300 font-mono mt-0.5">
                {UPCOMING_EXAM.scheduledAt} • {UPCOMING_EXAM.location}
              </p>
            </div>

            {/* Preparation Score */}
            <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-400">Your AI Preparation Score</span>
                <span className="font-mono font-black text-amber-400">{UPCOMING_EXAM.prepPercentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400"
                  style={{ width: `${UPCOMING_EXAM.prepPercentage}%` }}
                />
              </div>
              <p className="text-[10px] font-mono text-zinc-400">
                Calculated against 5-yr exam papers, saved notes &amp; completed topics.
              </p>
            </div>

            {/* Exam Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setCurrentView("exams")}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/40 transition-colors"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Enter Panic Mode</span>
              </button>

              <button
                onClick={() => {
                  showToast("Opened DBMS 4 High-Yield Topics Cheat Sheet!");
                  setCurrentView("exams");
                }}
                className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs transition-colors"
              >
                High-Yield Topics
              </button>
            </div>
          </div>

          {/* Section 10: Attendance Intelligence Widget */}
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-purple-600" />
                <h4 className="font-extrabold text-sm text-zinc-900">Attendance Intelligence</h4>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                78.4% Safe
              </span>
            </div>

            <p className="text-xs text-zinc-600">
              You are currently safe above the university 75.0% threshold.
            </p>

            {/* Attendance Simulation Box */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-700">What happens if you miss classes?</span>
                <button
                  onClick={() => setIsSimulatingAttendance(!isSimulatingAttendance)}
                  className="font-bold text-indigo-600 hover:underline"
                >
                  {isSimulatingAttendance ? "Hide" : "Simulate"}
                </button>
              </div>

              {isSimulatingAttendance && (
                <div className="space-y-2 pt-2 border-t border-zinc-200 text-xs font-mono">
                  <div className="flex justify-between text-zinc-500">
                    <span>Current attendance</span>
                    <strong className="text-zinc-900">78.4%</strong>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>After missing 1 class</span>
                    <strong>77.1%</strong>
                  </div>
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>After missing 2 classes</span>
                    <strong>75.8% ⚠️</strong>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans pt-1">
                    ⚠️ Mandatory academic council review and debar risk begins strictly at 75.0%.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setCurrentView("attendance")}
              className="w-full py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open Bunk-o-Meter Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* =========================================================================
          4. WHAT CHANGED? (NEWLY DETECTED CAMPUS MODIFICATIONS)
          ========================================================================= */}
      <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-zinc-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <h3 className="font-extrabold text-base text-zinc-950">
              What Changed on Campus?
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Automated Discrepancy &amp; Addendum Monitor
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CAMPUS_CHANGES.map((ch) => (
            <div
              key={ch.id}
              className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`w-2 h-2 rounded-full ${
                    ch.type === "critical"
                      ? "bg-rose-500"
                      : ch.type === "warning"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                />
                <span className="text-[10px] font-mono text-zinc-400">{ch.timestamp}</span>
              </div>

              <h4 className="font-bold text-zinc-900 leading-snug">{ch.title}</h4>

              <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-200 font-mono text-xs flex items-center justify-between">
                <span className="line-through text-zinc-400">{ch.diffBefore}</span>
                <ArrowRight className="w-3 h-3 text-zinc-400" />
                <span className="font-bold text-indigo-900">{ch.diffAfter}</span>
              </div>

              <p className="text-[10px] font-mono text-zinc-500">
                Source: {ch.verifiedSource}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          5. “YOUR OPPORTUNITIES” (AI PERSONALIZED WITH EXPLANATION LAYER)
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
              You might actually care about these.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600">
              Personalized based on your verified CSE record, coursework grades, and stack.
            </p>
          </div>
          <button
            onClick={() => setCurrentView("placements")}
            className="text-xs font-bold text-indigo-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Opportunities</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STUDENT_OPPORTUNITIES.slice(0, 2).map((opp) => {
            const isExpanded = expandedWhyOpp === opp.id;
            return (
              <div
                key={opp.id}
                className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg text-zinc-950">{opp.company}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          🟢 You&apos;re eligible
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">{opp.role} • <strong>{opp.package}</strong></p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-black text-xl text-indigo-950 leading-none">
                        {opp.matchScore}%
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400 block uppercase">
                        AI Match
                      </span>
                    </div>
                  </div>

                  {/* Criteria Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 font-mono text-[11px]">
                      CSE • 7.5+ CGPA • No active backlog
                    </span>
                  </div>

                  {/* Skill Gap highlight */}
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs">
                    <span className="font-bold text-amber-900">Skill Gap: </span>
                    <span className="text-zinc-700">
                      {typeof opp.skillGap === "object"
                        ? opp.skillGap?.skillName
                        : opp.skillGap || "None"}
                    </span>
                  </div>

                  {/* Section 13: Expandable AI Explanation Layer */}
                  <div className="mt-3 pt-3 border-t border-zinc-100">
                    <button
                      onClick={() => setExpandedWhyOpp(isExpanded ? null : opp.id)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>{isExpanded ? "Hide why you're seeing this" : "Why am I seeing this?"}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-1.5">
                        <p className="text-[11px] font-mono font-bold text-zinc-400 uppercase">
                          AI Verification Breakdown:
                        </p>
                        {(opp.whySeeingThis || opp.whyExplanation || []).map((reason: string, i: number) => (
                          <div key={i} className="flex items-start gap-2 text-zinc-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{reason}</span>
                          </div>
                        ))}
                        <p className="text-[10px] font-mono text-zinc-400 pt-1 border-t border-zinc-200/60">
                          {opp.sourceConfidence.source} • {opp.sourceConfidence.confidence}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400">Deadline: {opp.deadline}</span>
                  <button
                    onClick={() => {
                      showToast(`Registered for ${opp.company} drive!`);
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-950 text-white font-semibold text-xs shadow-xs hover:bg-indigo-900 transition-colors"
                  >
                    View Details &amp; Apply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          6. NOTICE INTELLIGENCE (STRUCTURED EXTRACTED CARDS)
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
              Notices worth your attention
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600">
              Clean structured facts automatically extracted from 4-page college PDFs.
            </p>
          </div>
          <button
            onClick={() => setCurrentView("notices")}
            className="text-xs font-bold text-indigo-700 hover:underline"
          >
            All Notices →
          </button>
        </div>

        <div className="space-y-3">
          {STUDENT_NOTICES.slice(0, 2).map((notice) => (
            <div
              key={notice.id}
              className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    AI EXTRACTED
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{notice.officialRef}</span>
                  <span className="text-xs font-mono text-zinc-400">• {notice.publishedAgo}</span>
                </div>

                <h4 className="font-extrabold text-base text-zinc-950">{notice.title}</h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Deadline</span>
                    <strong className="text-rose-600">{notice.deadline}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Audience</span>
                    <span className="font-medium text-zinc-800">{notice.targetAudience}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Late Fee</span>
                    <span className="font-medium text-zinc-800">{notice.lateFee}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Your Status</span>
                    <span className="font-bold text-emerald-700">Eligible ✓</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedNoticeForSource(notice.id)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold"
                >
                  View Source
                </button>
                <button
                  onClick={() => showToast(`Opened official portal for ${notice.title}!`)}
                  className="px-4 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold shadow-xs"
                >
                  Fill Form
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source PDF Modal Viewer */}
      {selectedNoticeForSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-lg w-full p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <span className="font-bold text-zinc-900">Official Gazetted Circular</span>
              <button
                onClick={() => setSelectedNoticeForSource(null)}
                className="text-zinc-400 hover:text-zinc-700 font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 leading-relaxed text-zinc-800 whitespace-pre-line">
              {STUDENT_NOTICES.find((n) => n.id === selectedNoticeForSource)?.rawExcerpt}
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center justify-between">
              <span>Verified digital cryptographic signature: VALID</span>
              <button
                onClick={() => {
                  showToast("Notice downloaded as official PDF archive.");
                  setSelectedNoticeForSource(null);
                }}
                className="text-indigo-600 font-bold hover:underline"
              >
                Download Raw PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
