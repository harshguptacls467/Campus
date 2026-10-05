"use client";

import React from "react";
import {
  Calendar,
  Users,
  AlertOctagon,
  UserCheck,
  CheckSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { DetailedNoticeData } from "@/lib/mock/notices";

interface DocumentInsightSidebarProps {
  notice: DetailedNoticeData;
}

export default function DocumentInsightSidebar({ notice }: DocumentInsightSidebarProps) {
  return (
    <div className="rounded-3xl bg-white border border-zinc-200/90 shadow-md p-5 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h4 className="font-extrabold text-zinc-950 font-sans tracking-tight">
            NOTICE INSIGHTS
          </h4>
        </div>
        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
          TELEMETRY
        </span>
      </div>

      <div className="space-y-3">
        {/* Deadline */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
          <div className="flex items-center gap-2 text-zinc-600">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-sans font-medium">Deadline</span>
          </div>
          <span className="font-bold text-zinc-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
            {notice.deadline.split("·")[0]}
          </span>
        </div>

        {/* Audience */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
          <div className="flex items-center gap-2 text-zinc-600">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-sans font-medium">Audience</span>
          </div>
          <span className="font-bold text-zinc-900">
            {notice.semesterAllowed ? notice.semesterAllowed.join(", ") : "All"}
          </span>
        </div>

        {/* Priority */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
          <div className="flex items-center gap-2 text-zinc-600">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            <span className="font-sans font-medium">Priority</span>
          </div>
          <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            {notice.isEligibleForStudent ? "High" : "Low"}
          </span>
        </div>

        {/* Your Status */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
          <div className="flex items-center gap-2 text-zinc-600">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-sans font-medium">Your status</span>
          </div>
          <span
            className={`font-bold px-2 py-0.5 rounded border ${
              notice.isEligibleForStudent
                ? "text-emerald-800 bg-emerald-50 border-emerald-300"
                : "text-zinc-600 bg-zinc-100 border-zinc-200"
            }`}
          >
            {notice.isEligibleForStudent ? "Eligible" : "Not For You"}
          </span>
        </div>

        {/* Action Required */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
          <div className="flex items-center gap-2 text-zinc-600">
            <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-sans font-medium">Action required</span>
          </div>
          <span className="font-bold text-zinc-900">
            {notice.isEligibleForStudent ? "Yes (1 Step)" : "None"}
          </span>
        </div>

        {/* Confidence */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
          <div className="flex items-center gap-2 text-zinc-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-sans font-medium">Confidence</span>
          </div>
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {notice.confidence === "High confidence" ? "High" : "Medium"}
          </span>
        </div>
      </div>
    </div>
  );
}
