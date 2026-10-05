"use client";

import React, { useState } from "react";
import { PLACEMENT_OPPORTUNITIES, PlacementOpportunity } from "@/data/mockCampusData";
import { useCampusStore } from "@/store/useCampusStore";
import {
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function PlacementRadar() {
  const { student, showToast, submitPrompt, setCurrentView } = useCampusStore();
  const [selectedOpp, setSelectedOpp] = useState<PlacementOpportunity | null>(null);

  return (
    <section id="opportunities" className="py-16 sm:py-24 bg-white border-t border-zinc-200/80 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold mb-3">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>PLACEMENT RADAR &amp; RESUME FIT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-950 tracking-tight">
            Don&apos;t just find opportunities. Know your chances.
          </h2>
          <p className="text-zinc-600 text-base sm:text-lg mt-3">
            Campus Copilot cross-references recruiter job descriptions with your verified academic record,
            coursework, and project stack.
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLACEMENT_OPPORTUNITIES.map((opp) => {
            return (
              <div
                key={opp.id}
                className="rounded-3xl p-6 bg-[#FAF9F6] border border-zinc-200/90 hover:border-indigo-400 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-xl text-zinc-900">
                          {opp.company}
                        </h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            opp.status === "Closes Soon"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {opp.status}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-zinc-500 mt-0.5">
                        {opp.role} • <strong className="text-zinc-800">{opp.ctc}</strong>
                      </p>
                    </div>

                    {/* AI Match Score Badge */}
                    <div className="text-right">
                      <div className="inline-flex flex-col items-end">
                        <span className="text-2xl font-black font-mono text-indigo-900 leading-none">
                          {opp.matchScore}%
                        </span>
                        <span className="text-[9px] font-mono font-bold uppercase text-zinc-400 mt-1">
                          AI Match Score
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Criteria Checks */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-white border border-zinc-200 text-xs">
                      <span className="text-[10px] font-mono text-zinc-400 block">CGPA</span>
                      <div className="flex items-center gap-1 font-bold text-zinc-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{student.cgpa} / {opp.cgpaRequired}</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-zinc-200 text-xs">
                      <span className="text-[10px] font-mono text-zinc-400 block">Branch</span>
                      <div className="flex items-center gap-1 font-bold text-zinc-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>CSE ✓</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-zinc-200 text-xs">
                      <span className="text-[10px] font-mono text-zinc-400 block">Backlogs</span>
                      <div className="flex items-center gap-1 font-bold text-zinc-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>0 Active ✓</span>
                      </div>
                    </div>
                  </div>

                  {/* Skill Fit vs Gap */}
                  <div className="space-y-2 mb-5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase mr-1">
                        Matched:
                      </span>
                      {opp.matchedSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium"
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>

                    {opp.missingSkills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-mono text-amber-700 uppercase mr-1">
                          Skill Gap:
                        </span>
                        {opp.missingSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium"
                          >
                            ⚠ {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-zinc-200/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">
                    Deadline: {opp.deadline}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        submitPrompt(`Am I eligible for the ${opp.company} drive?`);
                        setCurrentView("copilot");
                      }}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900"
                    >
                      See why →
                    </button>
                    <button
                      onClick={() => showToast(`Applied to ${opp.company} with verified resume!`)}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center text-xs font-mono text-zinc-400">
          AI Match Scores are synthesized from official hiring criteria and syllabus competencies.
        </div>

      </div>
    </section>
  );
}
