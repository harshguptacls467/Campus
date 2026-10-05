"use client";

import React, { useState } from "react";
import { useCampusStore } from "@/store/useCampusStore";
import { CampusNotice } from "@/data/mockCampusData";
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Radio,
  Clock,
  Layers,
  ShieldCheck,
  Send,
  RefreshCw,
} from "lucide-react";

export default function AdminNoticePortal() {
  const { notices, addNotice, showToast } = useCampusStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<string>("");
  const [uploadedResult, setUploadedResult] = useState<CampusNotice | null>(null);

  const simulateUploadNotice = () => {
    setIsProcessing(true);
    setUploadedResult(null);

    const stages = [
      "Reading document OCR...",
      "Extracting dates & hard cutoffs...",
      "Checking student eligibility & branches...",
      "Detecting actionable items & penalties...",
      "Creating structured notice entity...",
    ];

    stages.forEach((stage, i) => {
      setTimeout(() => {
        setCurrentStage(stage);
      }, i * 450);
    });

    setTimeout(() => {
      const newNotice: CampusNotice = {
        id: "notice-" + Date.now(),
        title: "Mid-Term Examination Schedule Revision Addendum",
        category: "Exams",
        officialRef: `CIRCULAR NO. EXAM/2026/${Math.floor(500 + Math.random() * 400)}`,
        datePublished: "Just now • Published via Admin Portal",
        rawText: `OFFICE OF CONTROLLER OF EXAMINATIONS
Dated: Today
All 5th Semester B.Tech candidates are informed that the timings for CS501 DBMS mid-term examination on 06/10/2026 are scheduled from 9:30 AM to 12:30 PM in Hall 302. Entry closes strictly at 9:15 AM. Barcode attendance will be mapped directly to university portal.`,
        structuredData: {
          headline: "DBMS Mid-Term Examination Timing & Hall Allocation",
          deadline: "Tomorrow • Reporting 9:15 AM",
          targetAudience: "B.Tech 5th Semester CSE Students",
          feesOrPackage: "Hall 302 Allocated • Barcode Roll Entry",
          keyPoints: [
            "Entry closes strictly at 9:15 AM",
            "Bring university RFID smartcard for instant scanner verification",
            "Calculator allowed for Normalization & Indexing section",
          ],
          actionLabel: "Acknowledge Seating Allocation",
          actionType: "form",
        },
      };

      addNotice(newNotice);
      setUploadedResult(newNotice);
      setIsProcessing(false);
      showToast("Notice processed & broadcasted to 1,248 student Copilot instances!");
    }, 2400);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#18181B] text-zinc-100 min-h-[85vh] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-mono font-medium mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>ADMINISTRATIVE INTELLIGENCE GATEWAY</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Campus Intelligence Portal
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Ingest institutional circulars, gazettes, and notices for automated student synthesis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
              Gemini 2.5 Extractor Live
            </span>
          </div>
        </div>

        {/* Live Admin Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
            <span className="text-[11px] font-mono uppercase text-zinc-500 block">Active Notices</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-white mt-1 block">24</span>
            <span className="text-[11px] text-zinc-400">across 6 departments</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
            <span className="text-[11px] font-mono uppercase text-zinc-500 block">Upcoming Deadlines</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 mt-1 block">8</span>
            <span className="text-[11px] text-zinc-400">next 7 days</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
            <span className="text-[11px] font-mono uppercase text-zinc-500 block">Campus Events</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-1 block">12</span>
            <span className="text-[11px] text-zinc-400">scheduled this month</span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
            <span className="text-[11px] font-mono uppercase text-zinc-500 block">Student Queries</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-400 mt-1 block">1,248</span>
            <span className="text-[11px] text-zinc-400">resolved without staff tickets</span>
          </div>
        </div>

        {/* Upload Notice Dropzone & Live Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Dropzone Card */}
          <div className="lg:col-span-6 space-y-4">
            <div
              onClick={simulateUploadNotice}
              className={`p-8 rounded-3xl border-2 border-dashed transition-all cursor-pointer text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] ${
                isProcessing
                  ? "bg-zinc-900/90 border-indigo-500"
                  : "bg-zinc-900/60 border-zinc-700 hover:border-indigo-400 hover:bg-zinc-900"
              }`}
            >
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-700 flex items-center justify-center mx-auto shadow-lg shadow-indigo-900/40">
                    <RefreshCw className="w-7 h-7 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Ingesting Notice</h3>
                    <p className="text-xs font-mono text-indigo-400 mt-1 animate-pulse">
                      {currentStage}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800 text-zinc-300 flex items-center justify-center mx-auto">
                    <UploadCloud className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
                      + DROP NOTICE HERE
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Drag &amp; drop official circular, dean memo or exam poster
                    </p>
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-mono">
                    SUPPORTS PDF / JPG / PNG / SCAN
                  </span>
                  <div className="pt-2">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
                    >
                      Click to Test AI Upload
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-zinc-500 font-mono text-center">
              Documents are parsed using zero-shot multimodal token extraction with verification against the university registrar schema.
            </p>
          </div>

          {/* Extracted Structured Notice Preview */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-zinc-400 tracking-wider">
                  Live Extraction Stream
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Instant Student Broadcast
                </span>
              </div>

              {uploadedResult ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">
                      Target Audience
                    </span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {uploadedResult.structuredData.targetAudience}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800">
                    <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block">
                      Hard Deadline / Timing
                    </span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {uploadedResult.structuredData.deadline}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono text-zinc-400 uppercase">Key Entities:</span>
                    {uploadedResult.structuredData.keyPoints.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-500">
                      Ref: {uploadedResult.officialRef}
                    </span>
                    <button
                      onClick={() => showToast("Simulated push notification dispatched to 1,248 student devices!")}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Push Broadcast</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-zinc-500 space-y-2 font-mono text-xs">
                  <FileText className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p>Upload a document on the left to inspect real-time AI structuring.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
