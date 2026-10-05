"use client";

import React, { useState } from "react";
import { useCampusStore } from "@/store/useCampusStore";
import {
  Gauge,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";

export default function AttendanceResponse() {
  const { setCurrentView, setClassesToMiss, showToast } = useCampusStore();
  const [selectedMiss, setSelectedMiss] = useState<number>(2);

  const calculations = [
    { miss: 1, proj: "77.1%", safe: true, label: "1 class (DBMS Lab)" },
    { miss: 2, proj: "75.8%", safe: true, label: "2 classes (DBMS + Networks)" },
    { miss: 3, proj: "74.5%", safe: false, label: "3 classes (Full Day Bunk)" },
  ];

  return (
    <div className="bg-white rounded-3xl border-2 border-purple-300 shadow-md p-6 sm:p-7 space-y-6 text-left max-w-2xl">
      
      {/* 1. WHAT? Header */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold">
          <Gauge className="w-4 h-4 text-purple-600" />
          <span>ATTENDANCE SIMULATOR</span>
        </div>
        <span className="text-xs font-mono font-bold text-zinc-600">Tomorrow: 3 scheduled classes</span>
      </div>

      <div>
        <h3 className="text-xl font-extrabold text-zinc-950">
          Can I bunk tomorrow?
        </h3>
        <p className="text-xs text-zinc-500 font-medium mt-0.5">
          Current Semester Attendance: <strong className="text-zinc-900 font-mono">78.4%</strong>
        </p>
      </div>

      {/* Step by step calculation table */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase font-bold text-zinc-400 block">
          Impact of Missing Classes Tomorrow:
        </span>
        <div className="space-y-2">
          {calculations.map((c) => (
            <div
              key={c.miss}
              onClick={() => setSelectedMiss(c.miss)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                c.safe
                  ? "bg-[#FAF9F6] border-zinc-200 hover:border-indigo-300"
                  : "bg-rose-50/80 border-rose-300 text-rose-950"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-zinc-200/80 font-mono font-bold text-xs flex items-center justify-center">
                  {c.miss}
                </span>
                <div>
                  <p className="font-bold text-zinc-900">{c.label}</p>
                  <p className="text-[10px] text-zinc-400 font-mono">Simulated Overall</p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-sm font-extrabold font-mono ${
                    c.safe ? "text-indigo-950" : "text-rose-600"
                  }`}
                >
                  {c.proj}
                </span>
                <span
                  className={`text-[10px] font-bold block ${
                    c.safe ? "text-emerald-700" : "text-rose-600 uppercase"
                  }`}
                >
                  {c.safe ? "Safe buffer ✓" : "⚠️ DEBAR RISK"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. WHY? Critical Warning */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 space-y-1.5 text-xs text-amber-950">
        <div className="flex items-center gap-2 font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>⚠️ 75.0% Mandatory Cutoff Warning</span>
        </div>
        <p className="leading-relaxed">
          Missing all 3 classes drops your overall attendance to <strong>74.5%</strong>. Additionally, your Computer Networks attendance (currently at 68.2%) would drop to 64.3%, automatically issuing an academic council admit card blockage.
        </p>
      </div>

      {/* 3. NOW WHAT? Actions */}
      <div className="pt-3 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-[11px] font-mono text-zinc-400">
          Source: University Academic Regulations 2026
        </span>

        <button
          onClick={() => {
            setClassesToMiss(selectedMiss);
            setCurrentView("attendance");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="px-4 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>Open Full Bunk-o-Meter Planner →</span>
        </button>
      </div>

    </div>
  );
}
