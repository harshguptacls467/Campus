"use client";

import React from "react";
import { Clock, ArrowRight, FileText, CheckCircle2, ChevronRight } from "lucide-react";
import { RECENT_NOTICE_HISTORY, RecentNoticeHistoryItem } from "@/lib/mock/notices";
import { useCampusStore } from "@/store/useCampusStore";

interface RecentNoticesHistoryProps {
  onSelectNotice?: (noticeId: string) => void;
}

export default function RecentNoticesHistory({ onSelectNotice }: RecentNoticesHistoryProps) {
  const { showToast } = useCampusStore();

  return (
    <div className="rounded-3xl bg-white border border-zinc-200/90 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
            AUDIT TRAIL &amp; ARCHIVE
          </span>
          <h3 className="text-base font-extrabold text-zinc-950">YOUR RECENT NOTICES</h3>
        </div>
        <span className="text-xs font-mono text-zinc-500">Auto-synchronized</span>
      </div>

      <div className="divide-y divide-zinc-100">
        {RECENT_NOTICE_HISTORY.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (onSelectNotice) {
                onSelectNotice(
                  item.id === "hist-4" ? "notice-7th-sem-capstone" : "notice-exam-reg"
                );
              }
            }}
            className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 hover:bg-zinc-50/80 rounded-xl px-2.5 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 group-hover:bg-indigo-50 text-zinc-600 group-hover:text-indigo-600 flex items-center justify-center shrink-0 transition-colors">
                <FileText className="w-4 h-4" />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    • {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-zinc-500 text-[11px]">{item.date}</span>
                  <span className="text-zinc-300">•</span>
                  {/* Subtle clean visual indicator instead of giant badge */}
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${item.statusColor}`}>
                    {item.priorityText}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showToast(`Executing action: ${item.actionText} for ${item.title}`);
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors"
              >
                {item.actionText}
              </button>
              <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
