"use client";

import React, { useState } from "react";
import { DETAILED_NOTICES, DetailedNoticeData } from "@/lib/mock/notices";
import VisualUploadDropzone from "./VisualUploadDropzone";
import ProcessingPipelineVisual from "./ProcessingPipelineVisual";
import DocumentParticleCanvas from "./DocumentParticleCanvas";
import InteractiveDocumentPreview from "./InteractiveDocumentPreview";
import AiUnderstandingView from "./AiUnderstandingView";
import DocumentInsightSidebar from "./DocumentInsightSidebar";
import RecentNoticesHistory from "./RecentNoticesHistory";
import AdminIntelligencePublisher from "./AdminIntelligencePublisher";
import RgpvLiveFeedWidget from "./RgpvLiveFeedWidget";
import {
  Sparkles,
  UploadCloud,
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  ChevronRight,
  Layers,
  ArrowLeft,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useCampusStore } from "@/store/useCampusStore";

type EngineState = "idle" | "processing" | "analyzed" | "admin" | "error_demo";

export default function NoticeEnginePage() {
  const [engineState, setEngineState] = useState<EngineState>("analyzed");
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState<number>(0);
  const [uploadedFileName, setUploadedFileName] = useState<string>("Circular_EXAM_2026_419.pdf");
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<"original" | "summary">("summary");
  const { showToast } = useCampusStore();

  const currentNotice: DetailedNoticeData = DETAILED_NOTICES[currentNoticeIndex] || DETAILED_NOTICES[0];

  const handleStartUpload = (filename: string, noticeId?: string) => {
    setUploadedFileName(filename);
    if (noticeId === "notice-7th-sem-capstone") {
      setCurrentNoticeIndex(1);
    } else {
      setCurrentNoticeIndex(0);
    }
    setEngineState("processing");
  };

  const handleProcessingComplete = () => {
    setEngineState("analyzed");
    showToast(`Notice analyzed: ${currentNotice.title}`);
  };

  const handleSelectSample = (noticeId: string) => {
    if (noticeId === "notice-7th-sem-capstone") {
      setCurrentNoticeIndex(1);
      setUploadedFileName("Memo_DEAN_PROJECT_092.pdf");
    } else {
      setCurrentNoticeIndex(0);
      setUploadedFileName("Circular_EXAM_2026_419.pdf");
    }
    setEngineState("processing");
  };

  const handleHighlightSelect = (fieldId: string) => {
    setActiveHighlightId((prev) => (prev === fieldId ? null : fieldId));
    // Switch to original tab if on mobile so user sees the highlighted document
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileTab("original");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-mono font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CAMPUS NOTICE INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            Turn campus noise into clear actions.
          </h1>
          <p className="text-zinc-600 text-sm max-w-2xl">
            Upload any college notice. Campus Copilot will extract deadlines, detect conflicts,
            verify your personal eligibility, and turn it into decisions.
          </p>
        </div>

        {/* Engine State Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {engineState === "analyzed" && (
            <button
              onClick={() => setEngineState("idle")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-700 shadow-sm transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
              <span>Upload New Notice</span>
            </button>
          )}

          <button
            onClick={() => setEngineState(engineState === "admin" ? "analyzed" : "admin")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              engineState === "admin"
                ? "bg-indigo-950 text-white border-indigo-950"
                : "bg-white hover:bg-zinc-100 border-zinc-200 text-zinc-700 shadow-sm"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>{engineState === "admin" ? "Exit Admin Mode" : "Admin Publisher"}</span>
          </button>
        </div>
      </div>

      {/* Admin Mode Overlay */}
      {engineState === "admin" && (
        <AdminIntelligencePublisher onClose={() => setEngineState("analyzed")} />
      )}

      {/* Idle / Upload Dropzone State */}
      {engineState === "idle" && (
        <div className="space-y-6">
          <VisualUploadDropzone
            onFileSelect={handleStartUpload}
            onSelectSample={handleSelectSample}
          />

          {/* Quick Error Edge Case Tester */}
          <div className="text-center pt-2">
            <button
              onClick={() => setEngineState("error_demo")}
              className="text-xs font-mono text-zinc-400 hover:text-zinc-700 underline"
            >
              Test Unclear OCR / Low Confidence Edge Case State
            </button>
          </div>
        </div>
      )}

      {/* Processing State with Particle Flow Simulation */}
      {engineState === "processing" && (
        <div className="space-y-6 max-w-2xl mx-auto py-6">
          {/* Subtle Canvas Stream */}
          <DocumentParticleCanvas />

          <ProcessingPipelineVisual
            filename={uploadedFileName}
            onComplete={handleProcessingComplete}
          />
        </div>
      )}

      {/* Low OCR Confidence / Error Edge Case State */}
      {engineState === "error_demo" && (
        <div className="max-w-xl mx-auto p-8 rounded-3xl bg-rose-50/80 border-2 border-rose-300 text-center space-y-4 animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/30">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase font-black tracking-widest text-rose-800 bg-rose-200/80 px-2.5 py-0.5 rounded-full border border-rose-300">
              LOW OCR CONFIDENCE
            </span>
            <h3 className="text-xl font-extrabold text-rose-950 pt-1">
              We couldn&apos;t confidently read this notice.
            </h3>
            <p className="text-xs text-rose-800 leading-relaxed max-w-md mx-auto">
              The uploaded document appears to be blurred, cropped, or contains handwritten text with
              missing official stamps. We never invent extracted dates or eligibility rules.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setEngineState("idle")}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 transition-colors"
            >
              Upload a Clearer Image / PDF
            </button>
            <button
              onClick={() => handleSelectSample("notice-exam-reg")}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-950 font-bold text-xs hover:bg-rose-100 transition-colors"
            >
              Load Verified Sample Circular
            </button>
          </div>
        </div>
      )}

      {/* 5. Document Split View: Analyzed State */}
      {engineState === "analyzed" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Sample Switcher Pills Bar */}
          <div className="p-3 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase px-2 py-0.5 rounded bg-zinc-100">
                ACTIVE CIRCULAR:
              </span>
              <span className="text-xs font-extrabold text-zinc-900 truncate max-w-xs sm:max-w-md">
                {currentNotice.officialRef}
              </span>
            </div>

            {/* Quick Toggle between Eligible vs Not-For-You Test Cases */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentNoticeIndex(0)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  currentNoticeIndex === 0
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                }`}
              >
                Case 1: 5th Sem Exam (🟢 Eligible)
              </button>
              <button
                onClick={() => setCurrentNoticeIndex(1)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  currentNoticeIndex === 1
                    ? "bg-rose-600 text-white shadow-sm"
                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                }`}
              >
                Case 2: 7th Sem Viva (🔴 Not For You)
              </button>
            </div>
          </div>

          {/* Mobile Tabs Switcher */}
          <div className="flex lg:hidden items-center p-1 rounded-2xl bg-zinc-100 border border-zinc-200">
            <button
              onClick={() => setMobileTab("summary")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mobileTab === "summary"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              ✦ AI Understanding
            </button>
            <button
              onClick={() => setMobileTab("original")}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mobileTab === "original"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Original Notice PDF
            </button>
          </div>

          {/* Desktop Split View Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Interactive Original Document Preview */}
            <div
              className={`lg:col-span-5 xl:col-span-5 h-[760px] ${
                mobileTab === "original" ? "block" : "hidden lg:block"
              }`}
            >
              <InteractiveDocumentPreview
                notice={currentNotice}
                activeHighlightId={activeHighlightId}
                onHighlightClick={handleHighlightSelect}
              />
            </div>

            {/* Right Column: AI Understanding & Actions */}
            <div
              className={`lg:col-span-7 xl:col-span-5 space-y-6 ${
                mobileTab === "summary" ? "block" : "hidden lg:block"
              }`}
            >
              <AiUnderstandingView
                notice={currentNotice}
                activeHighlightId={activeHighlightId}
                onFieldClick={handleHighlightSelect}
              />
            </div>

            {/* Desktop Telemetry Insight Sidebar */}
            <div className="hidden xl:block xl:col-span-2 space-y-4">
              <DocumentInsightSidebar notice={currentNotice} />

              {/* Safety Model Callout */}
              <div className="p-4 rounded-3xl bg-indigo-50/60 border border-indigo-200/90 text-xs text-indigo-950 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  <span>Trust Guarantee</span>
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                  Extracted information is cross-referenced with official registrar gazettes. We
                  never assume without citation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 21. Live Scraped RGPV Portal Feed */}
      <div className="pt-6 border-t border-zinc-200">
        <RgpvLiveFeedWidget />
      </div>

      {/* 22. Recent Notices History Trail */}
      <div className="pt-2">
        <RecentNoticesHistory
          onSelectNotice={(id) => {
            if (id === "notice-7th-sem-capstone") {
              setCurrentNoticeIndex(1);
            } else {
              setCurrentNoticeIndex(0);
            }
            setEngineState("analyzed");
          }}
        />
      </div>
    </div>
  );
}
