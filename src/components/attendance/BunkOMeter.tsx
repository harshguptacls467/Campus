"use client";

import React, { useState } from "react";
import { useCampusStore } from "@/store/useCampusStore";
import {
  Gauge,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Info,
  Calendar,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function BunkOMeter() {
  const { student, classesToMiss, setClassesToMiss, showToast } = useCampusStore();
  const [dutyLeaveApplied, setDutyLeaveApplied] = useState(false);

  // Student stats
  const totalConducted = student.courses.reduce((acc, c) => acc + c.classesConducted, 0);
  const totalAttended = student.courses.reduce((acc, c) => acc + c.classesAttended, 0);

  // Simulated calculation
  const newAttended = dutyLeaveApplied ? totalAttended : totalAttended;
  const newConducted = totalConducted + classesToMiss;
  const simulatedOverall = Number(((newAttended / newConducted) * 100).toFixed(1));

  const isSafe = simulatedOverall >= 75.0;
  const marginFromCutoff = Number((simulatedOverall - 75.0).toFixed(1));

  // Circular gauge calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (simulatedOverall / 100) * circumference;

  return (
    <section id="bunk-o-meter" className="py-16 sm:py-24 bg-[#FBFBFA] relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-mono font-bold mb-3">
            <Gauge className="w-3.5 h-3.5 text-purple-600" />
            <span>ATTENDANCE SIMULATOR</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight">
            Can I bunk tomorrow?
          </h2>
          <p className="text-zinc-600 text-base sm:text-lg mt-3">
            Drag the slider to test real-time impact before you hit snooze. Never risk academic council debarment.
          </p>
        </div>

        {/* Main Interactive Bunk-o-Meter Gauge & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: Large Interactive Circular Attendance Gauge */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 rounded-3xl bg-white border border-zinc-200 shadow-xl shadow-purple-950/5 relative">
            
            {/* SVG Circular Progress Ring */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                {/* Background Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="#F4F4F5"
                  strokeWidth="14"
                  fill="transparent"
                />
                {/* 75% Threshold indicator mark */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="#E4E4E7"
                  strokeWidth="14"
                  strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                  fill="transparent"
                  strokeLinecap="round"
                />
                {/* Animated Value Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke={isSafe ? "#6366F1" : "#EF4444"}
                  strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-300 ease-out"
                />
              </svg>

              {/* Inside Gauge Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
                  Simulated
                </span>
                <span
                  className={`text-4xl sm:text-5xl font-extrabold tracking-tight transition-colors duration-200 ${
                    isSafe ? "text-zinc-950" : "text-rose-600"
                  }`}
                >
                  {simulatedOverall}%
                </span>
                <span className="text-xs text-zinc-500 font-medium mt-0.5">
                  Current: {student.overallAttendance}%
                </span>
              </div>
            </div>

            {/* Verdict Banner */}
            <div className="mt-6 w-full text-center">
              {isSafe ? (
                <div className="py-2.5 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>SAFE TO BUNK ({marginFromCutoff}% buffer above 75%)</span>
                </div>
              ) : (
                <div className="py-2.5 px-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center gap-2 text-rose-800 font-bold text-sm animate-pulse">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  <span>DEBAR RISK! Drops below 75% cutoff</span>
                </div>
              )}
            </div>

            {/* Duty Leave Simulation Checkbox */}
            <div className="mt-4 pt-4 border-t border-zinc-100 w-full flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-zinc-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dutyLeaveApplied}
                  onChange={(e) => {
                    setDutyLeaveApplied(e.target.checked);
                    showToast(
                      e.target.checked
                        ? "Duty Leave / Hackathon attendance waiver simulated!"
                        : "Duty Leave removed."
                    );
                  }}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-medium">Apply Hackathon Duty Leave concession</span>
              </label>
              <span className="text-[11px] font-mono text-indigo-600 font-semibold">+2 Days</span>
            </div>

          </div>

          {/* RIGHT: Slider Control & Subject Breakdown */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Draggable Slider Control */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-zinc-900 text-base">Classes to miss</h3>
                  <p className="text-xs text-zinc-500">Slide to simulate consecutive absences</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-mono font-extrabold text-xl text-indigo-900">
                  {classesToMiss}
                </div>
              </div>

              {/* Slider Input */}
              <input
                type="range"
                min="0"
                max="6"
                step="1"
                value={classesToMiss}
                onChange={(e) => setClassesToMiss(parseInt(e.target.value))}
                className="w-full h-3 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />

              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span>0 (Full Attendance)</span>
                <span>2 (Tomorrow)</span>
                <span>4</span>
                <span>6 (Debarment)</span>
              </div>
            </div>

            {/* Subject-Wise Risk Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-zinc-400 tracking-wider">
                  Course Breakdown Impact
                </span>
                <span className="text-xs font-mono text-zinc-500">75% Mandatory</span>
              </div>

              <div className="space-y-2.5">
                {student.courses.map((c) => {
                  const simulatedCourse = Number(
                    ((c.classesAttended / (c.classesConducted + (classesToMiss > 0 && c.isRisk ? 1 : 0))) * 100).toFixed(1)
                  );
                  const isCourseRisk = simulatedCourse < 75.0;

                  return (
                    <div
                      key={c.code}
                      className={`p-3 rounded-2xl border transition-colors flex items-center justify-between text-xs ${
                        isCourseRisk
                          ? "bg-rose-50/60 border-rose-200 text-rose-900"
                          : "bg-zinc-50/80 border-zinc-200/70 text-zinc-800"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold">{c.name}</span>
                          <span className="font-mono text-[10px] text-zinc-400">({c.code})</span>
                        </div>
                        <p className="text-[11px] text-zinc-500">{c.nextClass}</p>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-mono font-bold text-sm ${
                            isCourseRisk ? "text-rose-600" : "text-zinc-900"
                          }`}
                        >
                          {simulatedCourse}%
                        </span>
                        <p className="text-[10px] font-semibold text-zinc-400">
                          {isCourseRisk ? "⚠️ DEBAR RISK" : "Normal"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-[11px] text-zinc-500 font-mono text-center">
                Computer Networks (CS503) is already at 68.2%. Missing tomorrow triggers warning circular.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
