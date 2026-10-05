"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, RefreshCw, Sparkles, Layers, ArrowRight } from "lucide-react";
import { useCampusStore } from "@/store/useCampusStore";

interface ProcessingPipelineVisualProps {
  filename: string;
  onComplete: () => void;
}

export default function ProcessingPipelineVisual({
  filename,
  onComplete,
}: ProcessingPipelineVisualProps) {
  const { studentUser } = useCampusStore();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const STAGES = [
    { id: 1, text: "Reading document OCR & layout" },
    { id: 2, text: "Extracting important information" },
    { id: 3, text: "Detecting dates & hard deadlines" },
    { id: 4, text: "Identifying eligibility & semester cutoffs" },
    { id: 5, text: "Finding required documents & late fine rules" },
    { id: 6, text: `Checking relevance to you (${studentUser.name}, ${studentUser.semester})` },
    { id: 7, text: "Creating personalized actions & calendar reminders" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < STAGES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setIsDone(true);
          setTimeout(() => {
            onComplete();
          }, 900);
          return prev;
        }
      });
    }, 420);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="rounded-3xl bg-white border-2 border-indigo-200/90 shadow-2xl p-8 sm:p-10 max-w-2xl mx-auto space-y-6 text-center animate-in zoom-in-95 duration-200">
      
      {/* Top Spinning AI Node */}
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 border-2 border-indigo-200 text-indigo-700 flex items-center justify-center mx-auto shadow-md shadow-indigo-100">
        {isDone ? (
          <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-in zoom-in" />
        ) : (
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
        )}
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-700 font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200">
          MULTIMODAL DOCUMENT EXTRACTION
        </span>

        <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-950 pt-1">
          {isDone ? "Notice Understood & Synthesized" : "Campus Copilot is Reading"}
        </h3>
        <p className="text-xs text-zinc-500 font-mono">
          File: {filename} • Verifying against university registry
        </p>
      </div>

      {/* Sequential Processing Pipeline */}
      <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-zinc-200/90 text-left space-y-2.5 max-w-md mx-auto text-xs font-mono">
        {STAGES.map((stg, idx) => {
          const isFinished = idx < currentStageIndex || isDone;
          const isCurrent = idx === currentStageIndex && !isDone;

          return (
            <div
              key={stg.id}
              className={`flex items-center gap-2.5 transition-all duration-200 ${
                isFinished
                  ? "text-zinc-800 font-medium"
                  : isCurrent
                  ? "text-indigo-950 font-bold scale-[1.01]"
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
              <span className="truncate">{stg.text}</span>
            </div>
          );
        })}
      </div>

      {/* Success Banner */}
      {isDone && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 animate-in fade-in flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>✓ 4 important details found • 1 action required • 1 reminder available</span>
        </div>
      )}

    </div>
  );
}
