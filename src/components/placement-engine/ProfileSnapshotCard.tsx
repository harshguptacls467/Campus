"use client";

import React from "react";
import { User, CheckCircle2, Award, Edit3, ArrowRight } from "lucide-react";
import { useCampusStore } from "@/store/useCampusStore";

export default function ProfileSnapshotCard() {
  const { studentUser, showToast } = useCampusStore();

  return (
    <div className="rounded-3xl bg-white border border-zinc-200/90 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            <User className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
              VERIFIED IDENTITY
            </span>
            <h4 className="text-sm font-extrabold text-zinc-950">YOUR PROFILE</h4>
          </div>
        </div>

        <button
          onClick={() => showToast("Profile editor loaded. Verified via University Registrar.")}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Update Profile</span>
        </button>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-black text-zinc-950">{studentUser.name}</h3>
        <p className="text-xs font-mono text-zinc-500">
          CSE · {studentUser.semester} • Roll: {studentUser.rollNo}
        </p>
      </div>

      {/* Snapshot Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
        <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
          <span className="text-[10px] text-zinc-400 block uppercase font-sans">CGPA</span>
          <span className="text-sm font-extrabold text-zinc-950">7.8</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
          <span className="text-[10px] text-zinc-400 block uppercase font-sans">Backlogs</span>
          <span className="text-sm font-extrabold text-emerald-700">0</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
          <span className="text-[10px] text-zinc-400 block uppercase font-sans">Graduation</span>
          <span className="text-sm font-extrabold text-zinc-950">2027</span>
        </div>
      </div>

      {/* Profile Completeness Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="font-sans font-bold text-zinc-700">Profile completeness</span>
          <span className="font-mono font-extrabold text-indigo-700">86%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
            style={{ width: "86%" }}
          />
        </div>
        <p className="text-[10px] text-zinc-400 font-sans">
          Upload resume &amp; GitHub profile to unlock remaining 14%.
        </p>
      </div>
    </div>
  );
}
