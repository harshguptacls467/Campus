"use client";

import React from "react";
import { useCampusStore } from "@/store/useCampusStore";
import {
  CheckCircle2,
  AlertTriangle,
  Flame,
  Gauge,
  Calendar,
  Clock,
  Briefcase,
  ArrowRight,
  ExternalLink,
  BookOpen,
  ShieldCheck,
  FileText,
} from "lucide-react";

interface DecisionCardProps {
  type: "eligibility" | "panic" | "attendance" | "deadlines" | "notices" | "conflict";
  data: any;
}

export default function DecisionCard({ type, data }: DecisionCardProps) {
  const { setCurrentView, showToast, setClassesToMiss } = useCampusStore();

  if (type === "eligibility") {
    return (
      <div className="bg-white rounded-2xl border-2 border-emerald-300/80 shadow-md p-5 space-y-4 text-left max-w-2xl">
        {/* Status Badge & Header */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>🟢 YOU&apos;RE ELIGIBLE</span>
          </div>
          <span className="text-xs font-mono text-zinc-400">{data.package}</span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-zinc-900">{data.company}</h3>
          <p className="text-xs text-zinc-500 font-medium">{data.role}</p>
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">CGPA</span>
            <span className="text-xs font-bold text-zinc-900">
              {data.cgpa.student} / {data.cgpa.required} req ✓
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Backlogs</span>
            <span className="text-xs font-bold text-zinc-900">
              {data.backlogs.student} / {data.backlogs.allowed} max ✓
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Branch</span>
            <span className="text-xs font-bold text-emerald-700">
              {data.branch.student} ✓
            </span>
          </div>
        </div>

        {/* Skill Gap Section */}
        {data.skillGap && (
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Skill Gap: {data.skillGap.skill}</span>
            </div>
            <p className="text-xs text-zinc-700 leading-relaxed">
              {data.skillGap.description}
            </p>
          </div>
        )}

        {/* Action Button & Source Citation */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-zinc-100">
          <span className="text-[11px] font-mono text-zinc-400">
            Source: {data.source}
          </span>
          <button
            onClick={() => {
              showToast("Opening TCS Placement Guide & Docker cheat-sheet!");
              setCurrentView("opportunities");
            }}
            className="px-4 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <span>{data.ctaText}</span>
          </button>
        </div>
      </div>
    );
  }

  if (type === "panic") {
    return (
      <div className="bg-rose-50/70 rounded-2xl border-2 border-rose-300 shadow-md p-5 space-y-4 text-left max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
            <Flame className="w-4 h-4 text-rose-600" />
            <span>🚨 PANIC MODE SYNTHESIZED</span>
          </div>
          <span className="text-xs font-mono font-bold text-rose-700">3-Hour Sprint</span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-zinc-950">{data.exam}</h3>
          <p className="text-xs text-rose-700 font-semibold">{data.when}</p>
        </div>

        <p className="text-xs text-zinc-700 leading-relaxed">{data.message}</p>

        {/* 3-hour preview blocks */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-xl bg-white border border-rose-200">
            <span className="text-[10px] font-mono text-zinc-400">00:00 – 00:35</span>
            <p className="text-xs font-bold text-zinc-900 truncate">Normalization (BCNF)</p>
          </div>
          <div className="p-2 rounded-xl bg-white border border-rose-200">
            <span className="text-[10px] font-mono text-zinc-400">00:35 – 01:10</span>
            <p className="text-xs font-bold text-zinc-900 truncate">SQL Joins &amp; Groups</p>
          </div>
          <div className="p-2 rounded-xl bg-white border border-rose-200">
            <span className="text-[10px] font-mono text-zinc-400">01:10 – 01:45</span>
            <p className="text-xs font-bold text-zinc-900 truncate">ACID &amp; 2PL Lock</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-rose-200">
          <span className="text-[11px] font-mono text-zinc-500">Zero Waste • High-Yield Prioritized</span>
          <button
            onClick={() => {
              setCurrentView("panic");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Launch Full Panic Mode →</span>
          </button>
        </div>
      </div>
    );
  }

  if (type === "attendance") {
    return (
      <div className="bg-white rounded-2xl border-2 border-purple-300 shadow-md p-5 space-y-4 text-left max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold">
            <Gauge className="w-4 h-4 text-purple-600" />
            <span>BUNK-O-METER CALCULATION</span>
          </div>
          <span className="text-xs font-bold text-rose-600 uppercase px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200">
            {data.verdict}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center p-3 rounded-2xl bg-zinc-50 border border-zinc-200 w-28 shrink-0">
            <span className="text-[10px] text-zinc-400 uppercase font-mono block">Current</span>
            <span className="text-xl font-extrabold text-zinc-900">{data.currentAttendance}%</span>
          </div>
          <div className="text-center p-3 rounded-2xl bg-rose-50 border border-rose-200 w-28 shrink-0">
            <span className="text-[10px] text-rose-500 uppercase font-mono block">If You Bunk</span>
            <span className="text-xl font-extrabold text-rose-600">{data.simulatedAttendance}%</span>
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            {data.warning}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
          <span className="text-[11px] font-mono text-zinc-400">Threshold: 75.0% Mandatory</span>
          <button
            onClick={() => {
              setClassesToMiss(2);
              setCurrentView("bunk");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <span>Open Bunk-o-Meter Simulator →</span>
          </button>
        </div>
      </div>
    );
  }

  if (type === "deadlines") {
    return (
      <div className="bg-white rounded-2xl border border-zinc-300 shadow-md p-5 space-y-4 text-left max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-bold">
            <Clock className="w-4 h-4 text-zinc-600" />
            <span>UPCOMING DEADLINES ({data.count})</span>
          </div>
          <span className="text-xs font-mono text-zinc-400">Synced to CSE 5th Sem</span>
        </div>

        <div className="space-y-2">
          {data.deadlines.map((item: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/70 text-xs"
            >
              <div>
                <p className="font-bold text-zinc-900">{item.title}</p>
                <p className="text-[11px] text-zinc-500">{item.due}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  item.status === "Critical"
                    ? "bg-rose-100 text-rose-700"
                    : item.status === "Urgent"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-indigo-50 text-indigo-700"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
          <button
            onClick={() => showToast("All deadlines synced to your phone calendar!")}
            className="text-xs text-indigo-600 font-bold hover:underline"
          >
            + Export ICS to Calendar
          </button>
          <button
            onClick={() => {
              setCurrentView("deadlines");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold"
          >
            View Deadline Timeline
          </button>
        </div>
      </div>
    );
  }

  return null;
}
