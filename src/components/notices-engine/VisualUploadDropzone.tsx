"use client";

import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  Camera,
  ClipboardPaste,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  Image as ImageIcon,
} from "lucide-react";

interface VisualUploadDropzoneProps {
  onFileSelect: (filename: string, noticeId?: string) => void;
  onSelectSample: (noticeId: string) => void;
}

export default function VisualUploadDropzone({
  onFileSelect,
  onSelectSample,
}: VisualUploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0].name, "notice-exam-reg");
    }
  };

  const handleNativeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0].name, "notice-exam-reg");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-3xl p-8 sm:p-12 border-2 transition-all duration-300 text-center overflow-hidden flex flex-col items-center justify-center min-h-[380px] ${
          isDragOver
            ? "border-indigo-600 bg-indigo-50/60 shadow-2xl scale-[1.01]"
            : "border-zinc-300/80 bg-white hover:border-indigo-300 shadow-md shadow-indigo-950/5"
        }`}
      >
        {/* Subtle AI Extraction Background Grid Lines */}
        <div className="absolute inset-0 bg-campus-grid opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[240px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Stack of Realistic Document Previews in Empty State */}
        {!isDragOver && (
          <div className="relative w-72 h-28 mb-4 pointer-events-none select-none hidden sm:block">
            {/* Card 1: Event Poster */}
            <div className="absolute top-1 left-2 w-48 p-2 rounded-xl bg-white border border-zinc-200/90 shadow-sm -rotate-6 opacity-75">
              <span className="text-[8px] font-mono uppercase text-pink-600 font-bold">Hackathon 2026</span>
              <p className="text-[10px] font-semibold text-zinc-700 truncate">Smart Campus AI Challenge</p>
            </div>

            {/* Card 2: Scholarship Notice */}
            <div className="absolute top-3 right-2 w-48 p-2 rounded-xl bg-white border border-zinc-200/90 shadow-sm rotate-6 opacity-75">
              <span className="text-[8px] font-mono uppercase text-emerald-600 font-bold">Scholarship Cell</span>
              <p className="text-[10px] font-semibold text-zinc-700 truncate">Merit Tuition Waiver Form</p>
            </div>

            {/* Card 3: Placement Circular */}
            <div className="absolute top-6 left-8 w-52 p-2.5 rounded-xl bg-white border border-indigo-200 shadow-md rotate-1 opacity-90">
              <span className="text-[8px] font-mono uppercase text-indigo-700 font-bold">T&amp;P Recruitment</span>
              <p className="text-[11px] font-bold text-zinc-900 truncate">TCS Digital &amp; Ninja Hiring</p>
            </div>
          </div>
        )}

        {/* Center Reactive Upload Badge */}
        {isDragOver ? (
          <div className="space-y-3 z-10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30">
              <UploadCloud className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-zinc-950">
                DROP NOTICE
              </h3>
              <p className="text-xs font-mono font-bold text-indigo-600 mt-1">
                ✦ AI IS READY TO EXTRACT
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 z-10">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mx-auto shadow-xs">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
                DROP A NOTICE HERE
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500">
                Drag &amp; drop PDF or photographed circular, or click below to browse
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="pt-1">
              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-bold shadow-md shadow-indigo-950/15 cursor-pointer transition-all hover:scale-[1.02]">
                <UploadCloud className="w-4 h-4 text-indigo-300" />
                <span>+ Upload Notice</span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={handleNativeInput}
                />
              </label>
            </div>

            <p className="text-[11px] font-mono text-zinc-400">
              SUPPORTS: PDF • JPG • PNG • SCANNED CIRCULARS • WHATSAPP FORWARDS
            </p>
          </div>
        )}

        {/* Secondary Ingestion Controls */}
        <div className="mt-8 pt-6 border-t border-zinc-200/70 w-full max-w-md flex flex-wrap items-center justify-center gap-3 z-10 text-xs">
          <button
            onClick={() => onFileSelect("camera_captured_notice.jpg", "notice-exam-reg")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors"
          >
            <Camera className="w-3.5 h-3.5 text-zinc-500" />
            <span>Take a photo</span>
          </button>

          <button
            onClick={() => onFileSelect("pasted_circular_text.txt", "notice-exam-reg")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-medium transition-colors"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-zinc-500" />
            <span>Paste notice text</span>
          </button>
        </div>

      </div>

      {/* Pre-packaged Realistic Demos to Test */}
      <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-mono">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-zinc-800">Quick Test Samples:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSelectSample("notice-exam-reg")}
            className="px-3 py-1.5 rounded-xl bg-white border border-indigo-200 text-indigo-900 font-bold shadow-2xs hover:bg-indigo-50 transition-colors"
          >
            Sample A: 5th Sem Exam Form (🟢 Eligible)
          </button>

          <button
            onClick={() => onSelectSample("notice-7th-sem-capstone")}
            className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-800 font-bold shadow-2xs hover:bg-rose-50 transition-colors"
          >
            Sample B: 7th Sem Notice (🔴 Not for you)
          </button>
        </div>
      </div>

    </div>
  );
}
