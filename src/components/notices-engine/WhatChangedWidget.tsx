"use client";

import React from "react";
import { GitCompare, ArrowRight, Check, AlertTriangle } from "lucide-react";

interface ChangeItem {
  field: string;
  oldVal: string;
  newVal: string;
  isDifferent: boolean;
}

interface WhatChangedWidgetProps {
  changes?: ChangeItem[];
}

export default function WhatChangedWidget({ changes }: WhatChangedWidgetProps) {
  if (!changes || changes.length === 0) return null;

  return (
    <div className="rounded-2xl p-4 bg-amber-50/70 border border-amber-200/90 text-amber-950 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500 text-white">
            <GitCompare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider font-extrabold text-amber-900">
              WHAT CHANGED FROM PREVIOUS CIRCULAR?
            </h4>
            <p className="text-[11px] text-amber-800">
              AI diff comparison against Circular EXAM/2026/388 (Issued Sept 28)
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold border border-amber-300">
          REVISION DETECTED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        {changes.map((item, idx) => {
          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all ${
                item.isDifferent
                  ? "bg-white border-amber-400 shadow-sm"
                  : "bg-white/60 border-amber-200 text-zinc-500"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-zinc-800">{item.field}</span>
                {item.isDifferent ? (
                  <span className="text-[9px] font-mono uppercase font-extrabold px-1.5 py-0.2 rounded bg-amber-500 text-white">
                    UPDATED
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-0.5">
                    <Check className="w-3 h-3 text-emerald-600" /> No change
                  </span>
                )}
              </div>

              {item.isDifferent ? (
                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                  <span className="line-through text-zinc-400">{item.oldVal}</span>
                  <ArrowRight className="w-3 h-3 text-amber-600 shrink-0" />
                  <span className="text-amber-700 bg-amber-100 px-1 py-0.5 rounded">
                    {item.newVal}
                  </span>
                </div>
              ) : (
                <p className="text-xs font-mono text-zinc-600">{item.newVal}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
