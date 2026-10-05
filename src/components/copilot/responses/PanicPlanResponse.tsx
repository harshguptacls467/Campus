"use client";

import React, { useState } from "react";
import { useCampusStore } from "@/store/useCampusStore";
import {
  Flame,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Play,
  CheckCircle2,
  FileDown,
} from "lucide-react";

export default function PanicPlanResponse() {
  const { setCurrentView, showToast } = useCampusStore();
  const [showWhyTopics, setShowWhyTopics] = useState(false);

  const planTopics = [
    {
      time: "0:00 — 0:35",
      title: "Normalization & Functional Dependencies",
      sub: "BCNF candidate keys, lossless join test (14 Marks)",
      why: "Appears in 4 of the last 5 papers. High syllabus weight. Estimated prep: 35 min.",
    },
    {
      time: "0:35 — 1:10",
      title: "Transactions & ACID Properties",
      sub: "Serializability precedence graph & 2PL locking protocols",
      why: "Standard Section B 10-marker. High probability question.",
    },
    {
      time: "1:10 — 1:40",
      title: "B+ Tree Indexing & Hash Indices",
      sub: "Order calculations, split algorithm, sequentially linked leaves",
      why: "Direct numerical calculation question.",
    },
    {
      time: "1:40 — 2:20",
      title: "Previous Year Questions (2023 - 2025)",
      sub: "Solved past papers focusing on common examiner patterns",
      why: "Over 60% of question patterns repeat across mid-sems.",
    },
    {
      time: "2:20 — 2:50",
      title: "Important Definitions & SQL Cheatsheet",
      sub: "HAVING vs WHERE, correlated subquery syntax, write-ahead logging",
      why: "Quick 2-mark definitions in Section A.",
    },
    {
      time: "2:50 — 3:00",
      title: "Rapid Formula Review & Mental Reset",
      sub: "Final 10-minute scan, hydration, and formula retention check",
      why: "Prevents burnout and consolidates short-term recall.",
    },
  ];

  return (
    <div className="bg-[#18181B] text-zinc-100 rounded-3xl border-2 border-rose-500/80 shadow-2xl p-6 sm:p-7 space-y-6 text-left max-w-2xl">
      
      {/* 1. WHAT? Urgent Exam Banner */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 text-rose-300 text-xs font-mono font-bold border border-rose-800">
          <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
          <span>🚨 PANIC MODE SYNTHESIS</span>
        </div>
        <span className="text-xs font-mono font-bold text-rose-400">180-Minute Zero Waste</span>
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-mono tracking-tight">
          3 HOURS • 1 EXAM • ZERO WASTE
        </h2>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          CS501 Database Management Systems • Hall 302 • Tomorrow 10:00 AM
        </p>
      </div>

      {/* Structured Time Timeline */}
      <div className="space-y-2">
        {planTopics.map((topic, i) => (
          <div
            key={i}
            className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start justify-between gap-3 text-xs"
          >
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-rose-400 block">
                {topic.time}
              </span>
              <p className="font-bold text-white text-xs sm:text-sm">{topic.title}</p>
              <p className="text-[11px] text-zinc-400 font-mono">{topic.sub}</p>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 shrink-0">Stage 0{i + 1}</span>
          </div>
        ))}
      </div>

      {/* 2. WHY? Expandable Reasoning Layer */}
      <div className="pt-1">
        <button
          onClick={() => setShowWhyTopics(!showWhyTopics)}
          className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showWhyTopics ? "Hide topic justification" : "Show why these topics were prioritized"}</span>
          {showWhyTopics ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showWhyTopics && (
          <div className="mt-2.5 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs space-y-2 font-mono text-zinc-300">
            <span className="text-[10px] uppercase text-zinc-500 font-bold block">
              Curriculum Weightage Analysis:
            </span>
            {planTopics.map((t, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span><strong>{t.title.split("&")[0]}:</strong> {t.why}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. NOW WHAT? Actions */}
      <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-[11px] font-mono text-zinc-400">
          Source: 5 Years of University Mid-Sem Papers &amp; Syllabus Weightage
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast("Downloading 2-Page DBMS Formula Sheet PDF...")}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Download Cheatsheet"
          >
            <FileDown className="w-4 h-4 text-rose-400" />
          </button>
          <button
            onClick={() => {
              setCurrentView("exams");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-950/40"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start 3-Hour Plan</span>
          </button>
        </div>
      </div>

    </div>
  );
}
