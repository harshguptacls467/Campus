"use client";

import React, { useState } from "react";
import { CONFLICT_CASES, ConflictCase } from "@/data/mockCampusData";
import { useCampusStore } from "@/store/useCampusStore";
import {
  ShieldAlert,
  ShieldCheck,
  Globe,
  FileText,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function ConflictDetector() {
  const { showToast } = useCampusStore();
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedState, setVerifiedState] = useState(true);

  const activeCase: ConflictCase = CONFLICT_CASES[activeCaseIndex];

  const handleVerifySource = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedState(true);
      showToast("Verified source: Dean's signed gazette (#ENG/EXAM/2026/104) confirmed 100% authoritative.");
    }, 600);
  };

  return (
    <section id="contradiction-detector" className="py-16 sm:py-24 bg-[#FBFBFA] border-t border-zinc-200/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold mb-3">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>CROSS-SOURCE RESOLUTION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            AI doesn&apos;t guess. It checks.
          </h2>
          <p className="text-zinc-600 text-base sm:text-lg mt-3">
            When campus websites, unofficial WhatsApp forwards, and dean circulars contradict each other,
            Campus Copilot cross-verifies digital signatures to protect students from penalties.
          </p>
        </div>

        {/* Conflict Detection Container */}
        <div className="rounded-3xl bg-white border border-zinc-300 shadow-xl shadow-zinc-900/5 p-6 sm:p-8 space-y-8">
          
          {/* Top Banner Alert */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-zinc-900">
                  ⚠ Information conflict detected
                </h3>
                <p className="text-xs text-zinc-600">
                  {activeCase.conflictSummary}
                </p>
              </div>
            </div>

            <button
              onClick={handleVerifySource}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
            >
              {isVerifying ? "Verifying cryptographic signatures..." : "Verify Source"}
            </button>
          </div>

          {/* Three Discrepant Sources Display */}
          <div>
            <p className="text-xs font-mono uppercase font-bold text-zinc-400 tracking-wider mb-3">
              Conflicting Sources Ingested
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeCase.sources.map((src, i) => {
                return (
                  <div
                    key={src.sourceName}
                    className={`p-4 rounded-2xl border transition-all ${
                      src.isSuperseded
                        ? "bg-zinc-50 border-zinc-200/90 opacity-75"
                        : "bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase text-zinc-400">
                        Source {i + 1}
                      </span>
                      {src.isSuperseded ? (
                        <span className="text-[10px] font-bold text-rose-600 px-1.5 py-0.5 rounded bg-rose-50">
                          Superseded
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 px-1.5 py-0.5 rounded bg-emerald-100 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Authoritative
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-zinc-900 mb-1">
                      {src.sourceName}
                    </h4>

                    <div className="text-lg font-extrabold font-mono text-zinc-900 my-2">
                      {src.dateStated}
                    </div>

                    <p className="text-[11px] text-zinc-500 leading-tight">
                      {src.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Verified Resolution Card */}
          {verifiedState && (
            <div className="p-5 rounded-2xl bg-zinc-950 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                    Official Copilot Resolution
                  </span>
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  Confidence Score: {activeCase.verifiedResolution.confidence}%
                </span>
              </div>

              <div className="text-xl sm:text-2xl font-black font-mono text-white">
                Actual Verified Deadline: {activeCase.verifiedResolution.actualDate}
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {activeCase.verifiedResolution.explanation}
              </p>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span>Reference: {activeCase.verifiedResolution.officialRef}</span>
                <button
                  onClick={() => showToast("Discrepancy notice flagged for all 5th Sem CSE students!")}
                  className="text-indigo-400 hover:text-indigo-300 font-bold"
                >
                  Broadcast to Classmates →
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
