"use client";

import React from "react";
import { RequirementItem } from "@/lib/mock/placements";
import { Check, X, ShieldCheck, AlertCircle } from "lucide-react";

interface RequirementComparisonTableProps {
  requirements: RequirementItem[];
}

export default function RequirementComparisonTable({
  requirements,
}: RequirementComparisonTableProps) {
  return (
    <div className="rounded-2xl border border-zinc-200/90 overflow-hidden bg-white shadow-sm">
      <div className="px-5 py-3.5 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between text-xs font-mono">
        <span className="font-extrabold uppercase text-zinc-600">
          MANDATORY REQUIREMENTS VERIFICATION
        </span>
        <span className="text-zinc-400 text-[10px]">Cross-checked with profile</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-zinc-100 text-zinc-400 font-mono text-[11px]">
              <th className="py-3 px-5 font-bold uppercase">Requirement</th>
              <th className="py-3 px-5 font-bold uppercase">Required</th>
              <th className="py-3 px-5 font-bold uppercase">Your Profile</th>
              <th className="py-3 px-5 font-bold uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {requirements.map((req, idx) => (
              <tr
                key={req.name}
                style={{ animationDelay: `${idx * 80}ms` }}
                className={`transition-colors animate-in fade-in slide-in-from-left-1 duration-200 ${
                  req.isSatisfied ? "hover:bg-zinc-50/70" : "bg-rose-50/40 hover:bg-rose-50/70"
                }`}
              >
                <td className="py-3 px-5 font-extrabold text-zinc-900 font-sans text-xs sm:text-sm">
                  {req.name}
                </td>
                <td className="py-3 px-5 font-mono text-zinc-600">{req.required}</td>
                <td className="py-3 px-5 font-mono font-bold">
                  <span
                    className={
                      req.isSatisfied ? "text-zinc-900" : "text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded"
                    }
                  >
                    {req.studentValue}
                  </span>
                </td>
                <td className="py-3 px-5 text-right">
                  {req.isSatisfied ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Satisfied</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-mono text-[10px] font-bold">
                      <X className="w-3 h-3 text-rose-600" />
                      <span>Not Met</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
