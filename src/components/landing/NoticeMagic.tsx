"use client";

import React, { useState } from "react";
import { SAMPLE_NOTICES, CampusNotice } from "@/data/mockCampusData";
import { useCampusStore } from "@/store/useCampusStore";
import {
  FileText,
  ScanLine,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

export default function NoticeMagic() {
  const { showToast, studentUser } = useCampusStore();
  const [selectedNoticeId, setSelectedNoticeId] = useState<string>("notice-exam-form");
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const activeNotice: CampusNotice =
    SAMPLE_NOTICES.find((n) => n.id === selectedNoticeId) || SAMPLE_NOTICES[0];

  const handleSelectNotice = (id: string) => {
    setIsScanning(true);
    setSelectedNoticeId(id);
    setTimeout(() => {
      setIsScanning(false);
    }, 700);
  };

  return (
    <section id="notice-magic" className="py-20 sm:py-28 bg-[#FBFBFA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE KILLER WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950">
            From notice to &ldquo;done&rdquo;.
          </h2>
          <p className="text-zinc-600 text-base sm:text-lg mt-3">
            Stop reading 3-page bureaucratic college circulars. Campus Copilot extracts
            deadlines, verifies student eligibility, and produces a one-click action.
          </p>

          {/* Notice Switcher Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-xs font-mono text-zinc-400 mr-1">Select sample document:</span>
            {SAMPLE_NOTICES.map((n) => (
              <button
                key={n.id}
                onClick={() => handleSelectNotice(n.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedNoticeId === n.id
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400"
                }`}
              >
                {n.title}
              </button>
            ))}
          </div>
        </div>

        {/* Live Transformation Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* LEFT: Realistic Messy College Notice */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-zinc-500" />
                Raw Campus Circular (Notice Board)
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {activeNotice.officialRef}
              </span>
            </div>

            {/* Document Paper Container */}
            <div className="flex-1 bg-white rounded-3xl p-6 sm:p-8 border border-zinc-300 shadow-md relative overflow-hidden font-mono text-xs leading-relaxed text-zinc-700 select-none">
              
              {/* College Header Stamp */}
              <div className="border-b-2 border-zinc-800 pb-3 mb-4 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-900">
                  OFFICE OF THE REGISTRAR & DEAN OF ACADEMICS
                </p>
                <p className="text-[10px] text-zinc-500">
                  NATIONAL INSTITUTE OF TECHNOLOGY & SCIENCES • CAMPUS WIDE CIRCULAR
                </p>
              </div>

              {/* Official Seal Watermark */}
              <div className="absolute right-6 top-24 opacity-[0.06] pointer-events-none">
                <div className="w-36 h-36 rounded-full border-4 border-zinc-900 flex items-center justify-center font-bold text-center text-[10px] uppercase rotate-12">
                  OFFICIAL SEAL<br />VERIFIED 2026
                </div>
              </div>

              {/* Notice Content */}
              <div className="space-y-3 font-mono text-xs text-zinc-800 whitespace-pre-line leading-relaxed">
                {activeNotice.rawText}
              </div>

              {/* Scanner Line Overlay */}
              {isScanning && (
                <div className="absolute left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_15px_#6366F1] animate-scan z-20" />
              )}

              {/* Bottom footer simulation */}
              <div className="mt-8 pt-4 border-t border-dashed border-zinc-300 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Dispatch: {activeNotice.datePublished}</span>
                <span className="text-zinc-600 font-semibold">Status: Signed & Gazetted</span>
              </div>
            </div>
          </div>

          {/* CENTER: Transformation Indicator for Desktop */}
          <div className="hidden lg:flex lg:col-span-1 items-center justify-center flex-col gap-2">
            <div className="w-10 h-10 rounded-full bg-indigo-950 text-white flex items-center justify-center shadow-lg shadow-indigo-950/20">
              {isScanning ? (
                <RefreshCw className="w-5 h-5 text-indigo-300 animate-spin" />
              ) : (
                <ArrowRight className="w-5 h-5 text-indigo-300" />
              )}
            </div>
            <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 tracking-wider">
              Gemini AI
            </span>
          </div>

          {/* RIGHT: Structured AI Extraction & Action Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-mono font-semibold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                AI Intelligence &amp; Direct Action
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Extracted &amp; Verified
              </span>
            </div>

            {/* Extracted Action Box */}
            <div className="flex-1 bg-white rounded-3xl p-6 sm:p-7 border-2 border-indigo-200 shadow-xl shadow-indigo-950/5 relative flex flex-col justify-between">
              
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-100">
                    {activeNotice.category}
                  </span>
                  <span className="text-xs font-bold text-zinc-500">
                    CSE 5th Sem Matched
                  </span>
                </div>

                <h3 className="text-xl font-bold text-zinc-950 leading-snug mb-4">
                  {activeNotice.structuredData.headline}
                </h3>

                {/* Extracted Key Facts Grid */}
                <div className="space-y-3 mb-5">
                  <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 mt-0.5">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Deadline</p>
                      <p className="text-xs font-bold text-zinc-900 mt-0.5">
                        {activeNotice.structuredData.deadline}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 mt-0.5">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Target Group</p>
                      <p className="text-xs font-bold text-zinc-900 mt-0.5">
                        {activeNotice.structuredData.targetAudience}
                      </p>
                    </div>
                  </div>

                  {activeNotice.structuredData.feesOrPackage && (
                    <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 mt-0.5">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Financial / Package Details</p>
                        <p className="text-xs font-bold text-zinc-900 mt-0.5">
                          {activeNotice.structuredData.feesOrPackage}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Key Points Bullet List */}
                <div className="space-y-1.5 mb-6">
                  <p className="text-[11px] font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                    Key Action Points
                  </p>
                  {activeNotice.structuredData.keyPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-zinc-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-200 space-y-2">
                <button
                  onClick={() => {
                    showToast(`Action Triggered: "${activeNotice.structuredData.actionLabel}" for ${studentUser.name}!`);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-950/20 transition-all hover:scale-[1.01]"
                >
                  <span>{activeNotice.structuredData.actionLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-300" />
                </button>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                  <span>Source: {activeNotice.officialRef}</span>
                  <button
                    onClick={() => showToast("Synced to your Google Calendar & Notification feed!")}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    + Add to Calendar
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
