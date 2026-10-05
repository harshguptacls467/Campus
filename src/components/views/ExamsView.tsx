"use client";

import React, { useState } from "react";
import { UPCOMING_EXAM } from "@/lib/mock/exams";
import { useCampusStore } from "@/store/useCampusStore";
import PanicMode from "../copilot/PanicMode";
import {
  GraduationCap,
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  Sparkles,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export default function ExamsView() {
  const { showToast } = useCampusStore();
  const [showPanicSprint, setShowPanicSprint] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-mono font-bold mb-2">
            <Flame className="w-3.5 h-3.5 text-rose-600 animate-bounce" />
            <span>EXAM INTELLIGENCE &amp; READINESS</span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">
            Exams &amp; High-Yield Sprints
          </h1>
          <p className="text-zinc-600 text-sm mt-1">
            Real-time syllabus weightage synthesis, seating hall allocation, and panic mode zero-waste study sprints.
          </p>
        </div>

        <button
          onClick={() => setShowPanicSprint(!showPanicSprint)}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            showPanicSprint
              ? "bg-zinc-800 text-white"
              : "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/20"
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>{showPanicSprint ? "Hide Panic Sprint" : "Launch 180-Min Panic Mode"}</span>
        </button>
      </div>

      {/* Main Approaching Exam Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold bg-rose-950 px-2.5 py-0.5 rounded-md border border-rose-800">
                CRITICAL EXAMINATION
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {UPCOMING_EXAM.timeRemaining}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {UPCOMING_EXAM.courseCode} • {UPCOMING_EXAM.courseName}
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              {UPCOMING_EXAM.scheduledAt} • {UPCOMING_EXAM.location} • Seat: {UPCOMING_EXAM.seatAllocation}
            </p>
          </div>

          <div className="text-right sm:text-right">
            <span className="text-3xl font-black font-mono text-amber-400">
              {UPCOMING_EXAM.prepPercentage}%
            </span>
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">
              Preparation Readiness
            </span>
          </div>
        </div>

        {/* Readiness Breakdown Factors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Syllabus Covered</span>
            <span className="text-base font-bold font-mono text-white mt-0.5 block">68%</span>
            <span className="text-[10px] text-zinc-500">Units 1, 2, 3</span>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">PYQ Practice</span>
            <span className="text-base font-bold font-mono text-amber-400 mt-0.5 block">60%</span>
            <span className="text-[10px] text-zinc-500">2023-2025 solved</span>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Saved Notes</span>
            <span className="text-base font-bold font-mono text-emerald-400 mt-0.5 block">Ready ✓</span>
            <span className="text-[10px] text-zinc-500">Prof. Rao slides</span>
          </div>
          <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">High-Yield Priority</span>
            <span className="text-base font-bold font-mono text-rose-400 mt-0.5 block">72%</span>
            <span className="text-[10px] text-zinc-500">4 key topics focus</span>
          </div>
        </div>

        {/* High-Yield Topics List */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
            Highest-Yield Question Topics (Based on 5-Year Papers)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {UPCOMING_EXAM.highYieldTopics.map((topic, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-zinc-200">{topic.title}</p>
                  <p className="text-[11px] text-rose-400 font-mono">{topic.weightage}</p>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                    topic.confidence === "Ready"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : topic.confidence === "Needs Review"
                      ? "bg-amber-950 text-amber-300 border border-amber-800"
                      : "bg-rose-950 text-rose-300 border border-rose-800"
                  }`}
                >
                  {topic.confidence}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded Panic Mode Study Sprint Section */}
      {showPanicSprint && (
        <div className="rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
          <PanicMode />
        </div>
      )}

    </div>
  );
}
