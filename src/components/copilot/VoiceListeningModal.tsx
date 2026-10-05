"use client";

import React, { useState, useEffect } from "react";
import { Mic, X, Sparkles, Check, Globe } from "lucide-react";

interface VoiceListeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptionComplete: (text: string) => void;
}

const SAMPLE_VOICE_QUERIES = [
  "Kal mera DBMS ka exam hai, mujhe 3 ghante mein kya padhna chahiye?",
  "Am I eligible for today's TCS placement drive?",
  "Kal classes bunk kar sakti hu kya, attendance kitni giregi?",
  "What deadlines do I have before this weekend?",
];

export default function VoiceListeningModal({
  isOpen,
  onClose,
  onTranscriptionComplete,
}: VoiceListeningModalProps) {
  const [stage, setStage] = useState<"listening" | "understanding" | "done">("listening");
  const [selectedQueryIndex, setSelectedQueryIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStage("listening");
      return;
    }

    // Simulate realistic voice pipeline
    const timer1 = setTimeout(() => {
      setStage("understanding");
    }, 2400);

    const timer2 = setTimeout(() => {
      setStage("done");
      const chosenText = SAMPLE_VOICE_QUERIES[selectedQueryIndex];
      onTranscriptionComplete(chosenText);
      onClose();
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen, selectedQueryIndex, onClose, onTranscriptionComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-md w-full p-6 space-y-6 relative text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Minimal Audio Waveform Visualizer */}
        <div className="space-y-4 pt-2">
          <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-100 relative">
            <Mic className="w-7 h-7 text-indigo-600 animate-pulse" />
            <div className="absolute -inset-2 rounded-full border border-indigo-400/40 animate-ping pointer-events-none" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-zinc-950">
              {stage === "listening" && "Listening to campus voice query..."}
              {stage === "understanding" && "Understanding & mapping context..."}
              {stage === "done" && "Transcribed & routing to Copilot..."}
            </h3>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Supports English &amp; Hinglish natural campus phrasing
            </p>
          </div>

          {/* Oscillating Audio Bars */}
          <div className="flex items-center justify-center gap-1.5 h-10 py-1">
            {[18, 32, 24, 40, 28, 36, 20, 38, 22].map((height, i) => (
              <span
                key={i}
                className="w-1 bg-indigo-600 rounded-full transition-all duration-150"
                style={{
                  height: stage === "listening" ? `${height}px` : "8px",
                  animation: stage === "listening" ? `pulse 1s infinite ${i * 120}ms` : "none",
                }}
              />
            ))}
          </div>

          {/* Current Captured Speech Stream */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-mono text-zinc-800 text-left">
            <span className="text-[10px] text-zinc-400 block mb-1 uppercase font-semibold">
              Live Speech Recognition:
            </span>
            &ldquo;{SAMPLE_VOICE_QUERIES[selectedQueryIndex]}&rdquo;
          </div>
        </div>

        {/* Query Selector Quick Test Pills */}
        <div className="pt-2 border-t border-zinc-100 text-left space-y-1.5">
          <span className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">
            Simulate other voice queries:
          </span>
          <div className="flex flex-col gap-1">
            {SAMPLE_VOICE_QUERIES.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedQueryIndex(idx)}
                className={`text-left text-xs p-2 rounded-xl transition-all ${
                  selectedQueryIndex === idx
                    ? "bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            onTranscriptionComplete(SAMPLE_VOICE_QUERIES[selectedQueryIndex]);
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-indigo-950 text-white text-xs font-bold hover:bg-indigo-900 shadow-sm"
        >
          Send Voice Query to Copilot →
        </button>

      </div>
    </div>
  );
}
