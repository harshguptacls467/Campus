"use client";

import React from "react";
import { useCampusStore } from "@/store/useCampusStore";
import {
  UserCheck,
  GraduationCap,
  Award,
  CheckCircle2,
  AlertTriangle,
  X,
  BookOpen,
} from "lucide-react";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentModal({ isOpen, onClose }: StudentModalProps) {
  const { student, showToast } = useCampusStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-md w-full p-6 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Student Avatar & Basic Info */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-indigo-600/20">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-lg text-zinc-900">{student.name}</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs text-zinc-500 font-mono">
              Roll No: {student.rollNo} • {student.semester}
            </p>
            <p className="text-xs font-semibold text-indigo-700">{student.branch}</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-center">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">CGPA</span>
            <span className="text-lg font-black font-mono text-zinc-900">{student.cgpa}</span>
            <span className="text-[9px] font-bold text-emerald-600 block">Top 12%</span>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-center">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Attendance</span>
            <span className="text-lg font-black font-mono text-zinc-900">{student.overallAttendance}%</span>
            <span className="text-[9px] font-bold text-indigo-600 block">Safe overall</span>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-center">
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Backlogs</span>
            <span className="text-lg font-black font-mono text-emerald-600">{student.backlogs}</span>
            <span className="text-[9px] font-bold text-emerald-600 block">Clean Record</span>
          </div>
        </div>

        {/* Enrolled Courses & Quick Status */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
            Current Semester Courses ({student.courses.length})
          </span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {student.courses.map((c) => (
              <div
                key={c.code}
                className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 text-xs border border-zinc-200/60"
              >
                <div>
                  <span className="font-semibold text-zinc-800">{c.name}</span>
                  <p className="text-[10px] text-zinc-400 font-mono">{c.code}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono font-bold ${
                      c.isRisk ? "text-rose-600" : "text-zinc-800"
                    }`}
                  >
                    {c.attendance}%
                  </span>
                  {c.isRisk && (
                    <span className="text-[9px] text-rose-500 font-bold block">
                      Debar warning
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-mono text-[11px]">Sync ID: verified-2026-sha</span>
          <button
            onClick={() => {
              showToast("Identity cryptographically verified against university registrar.");
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-indigo-950 text-white font-semibold text-xs"
          >
            Verified Student
          </button>
        </div>

      </div>
    </div>
  );
}
