"use client";

import React, { useState, useRef, useEffect } from "react";
import { DetailedNoticeData, HighlightAnnotation } from "@/lib/mock/notices";
import {
  FileText,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";

interface InteractiveDocumentPreviewProps {
  notice: DetailedNoticeData;
  activeHighlightId: string | null;
  onHighlightClick: (fieldId: string) => void;
}

export default function InteractiveDocumentPreview({
  notice,
  activeHighlightId,
  onHighlightClick,
}: InteractiveDocumentPreviewProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightedRef = useRef<HTMLSpanElement>(null);

  // Auto-scroll to highlighted section when activeHighlightId changes
  useEffect(() => {
    if (activeHighlightId && highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeHighlightId]);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(140, Math.max(80, prev + delta)));
  };

  return (
    <div className="flex flex-col h-full rounded-3xl bg-zinc-100 border border-zinc-200/90 overflow-hidden shadow-inner">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-zinc-200 text-xs text-zinc-700">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-zinc-900 truncate block max-w-[200px] sm:max-w-xs">
              {notice.officialRef}.pdf
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              Scanned Official Circular • 2 Pages
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-zinc-100 rounded-lg p-0.5 border border-zinc-200 text-zinc-600">
            <button
              onClick={() => handleZoom(-10)}
              disabled={zoomLevel <= 80}
              className="p-1 hover:bg-white rounded hover:text-zinc-900 transition-colors disabled:opacity-40"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono font-bold px-1.5 min-w-[36px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => handleZoom(10)}
              disabled={zoomLevel >= 140}
              className="p-1 hover:bg-white rounded hover:text-zinc-900 transition-colors disabled:opacity-40"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <a
            href={`#download-${notice.id}`}
            onClick={(e) => {
              e.preventDefault();
              alert("Downloading original institutional PDF circular with digital seal.");
            }}
            className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
            title="Download Original PDF"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Highlighting Legend */}
      <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-200/80 flex items-center gap-2 text-[11px] overflow-x-auto select-none">
        <span className="text-zinc-400 font-mono text-[10px] uppercase font-bold shrink-0">
          AI Detection:
        </span>
        <button
          onClick={() => onHighlightClick("hl-deadline")}
          className={`px-2 py-0.5 rounded-md font-medium border text-[10px] transition-all shrink-0 ${
            activeHighlightId === "hl-deadline"
              ? "ring-2 ring-amber-500 bg-amber-200 text-amber-950 font-bold"
              : "bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200"
          }`}
        >
          ● Deadline (Yellow)
        </button>
        <button
          onClick={() => onHighlightClick("hl-eligibility")}
          className={`px-2 py-0.5 rounded-md font-medium border text-[10px] transition-all shrink-0 ${
            activeHighlightId === "hl-eligibility"
              ? "ring-2 ring-blue-500 bg-blue-200 text-blue-950 font-bold"
              : "bg-blue-100 text-blue-900 border-blue-300 hover:bg-blue-200"
          }`}
        >
          ● Eligibility (Blue)
        </button>
        <button
          onClick={() => onHighlightClick("hl-fee")}
          className={`px-2 py-0.5 rounded-md font-medium border text-[10px] transition-all shrink-0 ${
            activeHighlightId === "hl-fee"
              ? "ring-2 ring-emerald-500 bg-emerald-200 text-emerald-950 font-bold"
              : "bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200"
          }`}
        >
          ● Late Fee (Mint)
        </button>
        <button
          onClick={() => onHighlightClick("hl-docs")}
          className={`px-2 py-0.5 rounded-md font-medium border text-[10px] transition-all shrink-0 ${
            activeHighlightId === "hl-docs"
              ? "ring-2 ring-purple-500 bg-purple-200 text-purple-950 font-bold"
              : "bg-purple-100 text-purple-900 border-purple-300 hover:bg-purple-200"
          }`}
        >
          ● Required Docs (Violet)
        </button>
      </div>

      {/* Document Sheet Viewer */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-6 bg-zinc-200/70 flex justify-center items-start"
      >
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
          className="transition-transform duration-150 ease-out w-full max-w-[620px] bg-white rounded-xl shadow-xl p-8 sm:p-10 border border-zinc-300/80 font-serif text-zinc-800 text-sm leading-relaxed relative min-h-[780px]"
        >
          {/* Institutional Watermark / Header */}
          <div className="text-center border-b-2 border-zinc-800 pb-4 mb-6">
            <div className="w-14 h-14 rounded-full border-2 border-zinc-800 mx-auto mb-2 flex flex-col items-center justify-center font-bold text-[10px] tracking-wider leading-none text-zinc-900 bg-zinc-50">
              <span>RGPV</span>
              <span className="text-[7px] text-zinc-500 font-sans">BHOPAL</span>
            </div>
            <h2 className="text-sm sm:text-base font-black tracking-wide uppercase text-zinc-950">
              RAJIV GANDHI PROUDYOGIKI VISHWAVIDYALAYA, BHOPAL
            </h2>
            <p className="text-[10px] font-sans font-semibold tracking-wider text-zinc-700 uppercase">
              (STATE TECHNOLOGICAL UNIVERSITY OF MADHYA PRADESH)
            </p>
            <p className="text-[9.5px] font-sans text-zinc-500">
              Airport Bypass Road, Gandhi Nagar, Bhopal - 462033 | www.rgpv.ac.in
            </p>
            <p className="text-[10px] font-sans font-medium text-zinc-600 mt-1">
              OFFICE OF THE CONTROLLER OF EXAMINATIONS • EXAM WING
            </p>
            <div className="flex items-center justify-between text-[11px] font-sans text-zinc-600 font-semibold mt-3 pt-2 border-t border-zinc-200">
              <span className="font-mono text-zinc-900">REF: {notice.officialRef}</span>
              <span>DATE: {notice.datePublished}</span>
            </div>
          </div>

          {/* Subject Banner */}
          <div className="text-center my-4 py-1.5 px-3 bg-zinc-100/90 rounded border border-zinc-300 font-sans font-bold text-xs sm:text-sm uppercase text-zinc-900">
            SUBJECT: {notice.title}
          </div>

          {/* Notice Body with Clickable Contextual Highlights */}
          <div className="space-y-4 text-xs sm:text-[13px] leading-relaxed text-zinc-800 font-serif">
            <p>
              It is hereby notified for the information of all regular students of{" "}
              <span
                ref={activeHighlightId === "hl-eligibility" ? highlightedRef : null}
                onClick={() => onHighlightClick("hl-eligibility")}
                className={`cursor-pointer px-1.5 py-0.5 rounded transition-all font-sans font-semibold border ${
                  activeHighlightId === "hl-eligibility"
                    ? "bg-blue-300/90 text-blue-950 border-blue-500 shadow-md ring-2 ring-blue-400"
                    : "bg-blue-100/90 text-blue-900 border-blue-300 hover:bg-blue-200"
                }`}
                title="Click to view eligibility in AI panel"
              >
                B.Tech 5th Semester (CSE / AIML / DS / IT / ECE)
              </span>{" "}
              that the university examination portal for filling up odd-semester examination forms
              is now live and accepting registrations.
            </p>

            <div className="space-y-3 pl-2 border-l-2 border-zinc-300 my-4 font-sans text-xs">
              {/* Item 1: Submission Schedule */}
              <div className="space-y-1">
                <p className="font-bold text-zinc-950">1. SUBMISSION SCHEDULE &amp; DEADLINE:</p>
                <p className="text-zinc-700">
                  The last date for filling up examination forms online without late fee is{" "}
                  <span
                    ref={activeHighlightId === "hl-deadline" ? highlightedRef : null}
                    onClick={() => onHighlightClick("hl-deadline")}
                    className={`cursor-pointer px-1.5 py-0.5 rounded transition-all font-bold font-mono border ${
                      activeHighlightId === "hl-deadline"
                        ? "bg-amber-300 text-amber-950 border-amber-500 shadow-md ring-2 ring-amber-400"
                        : "bg-amber-200/90 text-amber-950 border-amber-400 hover:bg-amber-300"
                    }`}
                    title="Click to view deadline actions"
                  >
                    11th October 2026 up to 11:59 PM
                  </span>
                  . Candidates are advised not to wait till the last hour.
                </p>
              </div>

              {/* Item 2: Late Fine Schedule */}
              <div className="space-y-1">
                <p className="font-bold text-zinc-950">2. LATE FINE SCHEDULE:</p>
                <p className="text-zinc-700">
                  A{" "}
                  <span
                    ref={activeHighlightId === "hl-fee" ? highlightedRef : null}
                    onClick={() => onHighlightClick("hl-fee")}
                    className={`cursor-pointer px-1.5 py-0.5 rounded transition-all font-bold font-mono border ${
                      activeHighlightId === "hl-fee"
                        ? "bg-emerald-300 text-emerald-950 border-emerald-500 shadow-md ring-2 ring-emerald-400"
                        : "bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200"
                    }`}
                    title="Click to view late fee details"
                  >
                    late fine of Rs. 500/- will be automatically levied
                  </span>{" "}
                  for forms submitted between 12th October and 15th October 2026. No forms will be
                  accepted thereafter under any grounds.
                </p>
              </div>

              {/* Item 3: Prerequisites & Documents */}
              <div className="space-y-1">
                <p className="font-bold text-zinc-950">3. MANDATORY PREREQUISITES &amp; DOCUMENTS:</p>
                <div className="text-zinc-700">
                  Candidates must keep ready:{" "}
                  <span
                    ref={activeHighlightId === "hl-docs" ? highlightedRef : null}
                    onClick={() => onHighlightClick("hl-docs")}
                    className={`cursor-pointer px-1.5 py-0.5 rounded transition-all font-medium border ${
                      activeHighlightId === "hl-docs"
                        ? "bg-purple-300 text-purple-950 border-purple-500 shadow-md ring-2 ring-purple-400"
                        : "bg-purple-100 text-purple-900 border-purple-300 hover:bg-purple-200"
                    }`}
                    title="Click to view document checklist"
                  >
                    Student ID card, Enrollment number, and Tuition Fee Receipt
                  </span>
                  . Minimum 75% attendance is strictly enforced for generation of hall tickets.
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-600 font-sans italic pt-2">
              For portal payment or technical queries, contact University e-Gov Cell (egov.rgpv.ac.in) or Exam Helpdesk 0755-4944401.
            </p>
          </div>

          {/* Official Signatures & Seal */}
          <div className="mt-12 pt-6 border-t border-zinc-200 flex items-end justify-between font-sans">
            <div className="flex items-center gap-2 text-zinc-500 text-[10px]">
              <div className="w-14 h-14 rounded-full border border-dashed border-indigo-400 flex flex-col items-center justify-center text-center p-1 text-indigo-700 bg-indigo-50/50">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span className="text-[8px] font-bold uppercase tracking-tight">RGPV AI Verified</span>
              </div>
              <div className="space-y-0.5 font-mono">
                <p className="font-bold text-zinc-700">RGPV GAZETTE HASH #2819F</p>
                <p>Digital Signature: RGPV CA Valid</p>
                <p>Source: www.rgpv.ac.in/notices</p>
              </div>
            </div>

            <div className="text-right text-xs text-zinc-900">
              <p className="font-serif italic text-base">Sd/-</p>
              <p className="font-bold">Controller of Examinations</p>
              <p className="text-[11px] text-zinc-500">Rajiv Gandhi Proudyogiki Vishwavidyalaya</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Status Pill on Bottom */}
      <div className="px-4 py-2 bg-white/95 border-t border-zinc-200/90 flex items-center justify-between text-xs text-zinc-600">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-medium">
            Click any highlight in document to inspect AI reasoning.
          </span>
        </div>
        <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
          OCR ACCURACY 99.4%
        </span>
      </div>
    </div>
  );
}
