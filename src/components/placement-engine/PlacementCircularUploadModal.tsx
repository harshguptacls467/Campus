"use client";

import React, { useState, useEffect } from "react";
import { UploadCloud, CheckCircle2, RefreshCw, X, Sparkles, FileText } from "lucide-react";

interface PlacementCircularUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (filename: string) => void;
}

const STAGES = [
  "Reading circular",
  "Extracting requirements",
  "Understanding eligibility",
  "Comparing your profile",
  "Preparing result",
];

export default function PlacementCircularUploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: PlacementCircularUploadModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [fileName, setFileName] = useState("TCS_Digital_Campus_Drive_2026.pdf");

  useEffect(() => {
    if (!isProcessing) return;

    const timer = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            setIsProcessing(false);
            onUploadSuccess(fileName);
            onClose();
          }, 600);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(timer);
  }, [isProcessing, fileName, onUploadSuccess, onClose]);

  if (!isOpen) return null;

  const handleStartSimulatedUpload = (name: string) => {
    setFileName(name);
    setCurrentStage(0);
    setIsProcessing(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
                PLACEMENT INTELLIGENCE
              </span>
              <h3 className="text-base font-extrabold text-zinc-950">
                Upload Placement Circular
              </h3>
            </div>
          </div>

          {!isProcessing && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Processing State */}
        {isProcessing ? (
          <div className="py-6 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center mx-auto shadow-md">
              <RefreshCw className="w-7 h-7 animate-spin text-indigo-600" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-zinc-950">
                Analyzing Placement Notice
              </h4>
              <p className="text-xs font-mono text-zinc-500">File: {fileName}</p>
            </div>

            {/* Sequence */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-left space-y-2 max-w-xs mx-auto text-xs font-mono">
              {STAGES.map((stg, idx) => {
                const isFinished = idx < currentStage;
                const isCurrent = idx === currentStage;
                return (
                  <div
                    key={stg}
                    className={`flex items-center gap-2 ${
                      isFinished
                        ? "text-emerald-800 font-bold"
                        : isCurrent
                        ? "text-indigo-700 font-extrabold"
                        : "text-zinc-400 opacity-60"
                    }`}
                  >
                    {isFinished ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-zinc-300 shrink-0" />
                    )}
                    <span>{stg}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Dropzone state */
          <div className="space-y-4">
            <div
              onClick={() => handleStartSimulatedUpload("TCS_Digital_Drive_2026.pdf")}
              className="border-2 border-dashed border-zinc-300 hover:border-indigo-500 hover:bg-indigo-50/40 rounded-3xl p-8 text-center cursor-pointer space-y-3 transition-all"
            >
              <FileText className="w-10 h-10 text-indigo-600 mx-auto" />
              <div>
                <p className="text-sm font-extrabold text-zinc-950">
                  Drop a placement notice here.
                </p>
                <p className="text-xs text-zinc-500 font-mono mt-1">
                  Drag &amp; drop PDF, image, or photographed notification
                </p>
              </div>

              <div className="pt-2">
                <span className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs inline-block shadow-sm">
                  Browse Files
                </span>
              </div>
            </div>

            {/* Quick Demo Pre-Packaged Circulars */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">
                Or Test Verified Recruiter Circulars:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleStartSimulatedUpload("TCS_Digital_Circular.pdf")}
                  className="p-3 rounded-xl bg-zinc-50 hover:bg-indigo-50 border border-zinc-200 text-left transition-colors group"
                >
                  <p className="font-bold text-zinc-900 group-hover:text-indigo-600">
                    TCS Digital Circular
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">Cutoff: 7.5 CGPA</p>
                </button>

                <button
                  onClick={() => handleStartSimulatedUpload("Google_STEP_Internship.pdf")}
                  className="p-3 rounded-xl bg-zinc-50 hover:bg-rose-50 border border-zinc-200 text-left transition-colors group"
                >
                  <p className="font-bold text-zinc-900 group-hover:text-rose-600">
                    Google STEP Circular
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">Cutoff: 8.0 CGPA</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
