"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useCampusStore } from "@/store/useCampusStore";
import {
  Sparkles,
  ArrowRight,
  Flame,
  Briefcase,
  AlertTriangle,
  FileCheck2,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import CampusOrbFallback from "../3d/CampusOrbFallback";

// Lazy-load the Three.js 3D scene without SSR
const CampusOrb = dynamic(() => import("../3d/CampusOrb"), {
  ssr: false,
  loading: () => <CampusOrbFallback />,
});

export default function Hero() {
  const { setCurrentView, submitPrompt } = useCampusStore();
  const [quickInput, setQuickInput] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sampleChips = [
    { label: "What's due this week?", icon: "📅" },
    { label: "Am I eligible for today's placement?", icon: "💼" },
    { label: "I have DBMS tomorrow", icon: "🚨" },
    { label: "Can I bunk tomorrow?", icon: "🏖️" },
  ];

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    submitPrompt(quickInput);
    setCurrentView("copilot");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-20 overflow-hidden bg-radial-glow bg-campus-grid">
      {/* Subtle background ambient blur blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-violet-500/6 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 shadow-xs text-xs font-semibold text-indigo-950 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              <span className="tracking-wider uppercase text-[11px] font-mono text-indigo-900">
                AI CAMPUS INTELLIGENCE
              </span>
              <span className="text-zinc-300">•</span>
              <span className="text-zinc-500 text-[11px] font-normal">Next-Gen Student Copilot</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-950 leading-[1.08]">
              Your campus,{" "}
              <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-950 via-indigo-800 to-violet-700 bg-clip-text text-transparent">
                finally understandable.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-zinc-600 max-w-xl leading-relaxed font-normal">
              Campus Copilot turns scattered notices, deadlines, placement circulars,
              syllabi and events into clear actions personalized for you.
            </p>

            {/* Interactive Search / Ask Input Bar */}
            <div className="pt-2 max-w-xl">
              <form
                onSubmit={handleHeroSubmit}
                className="flex items-center gap-2 p-1.5 bg-white border border-zinc-300/80 rounded-2xl shadow-lg shadow-zinc-900/5 focus-within:border-indigo-600 focus-within:ring-3 focus-within:ring-indigo-100 transition-all"
              >
                <div className="pl-3 text-zinc-400">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                </div>
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Ask anything about your campus, exams, attendance or drives..."
                  className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none py-2 px-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                >
                  <span>Ask AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-[11px] font-medium text-zinc-400 font-mono">Suggested:</span>
                {sampleChips.map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => {
                      submitPrompt(chip.label);
                      setCurrentView("copilot");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100/90 hover:bg-zinc-200/80 text-zinc-700 text-[11px] font-medium border border-zinc-200/60 transition-colors"
                  >
                    <span>{chip.icon}</span>
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setCurrentView("copilot");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-5 py-3 rounded-xl bg-indigo-900 hover:bg-indigo-950 text-white text-sm font-semibold shadow-md shadow-indigo-950/15 flex items-center gap-2 hover:-translate-y-0.5 transition-all group"
              >
                <Sparkles className="w-4 h-4 text-indigo-300 group-hover:rotate-12 transition-transform" />
                <span>Ask Campus Copilot</span>
                <ChevronRight className="w-4 h-4 text-indigo-300" />
              </button>

              <button
                onClick={() => {
                  setCurrentView("map");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-5 py-3 rounded-xl bg-white hover:bg-zinc-50 text-zinc-800 text-sm font-semibold border border-zinc-200 shadow-xs flex items-center gap-2 hover:-translate-y-0.5 transition-all"
              >
                <span>Explore the Campus</span>
                <ArrowRight className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            {/* Live Student Context Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-zinc-200/80">
              <div
                onClick={() => setCurrentView("panic")}
                className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 hover:border-rose-300 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-700">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Exam Tomorrow</span>
                </div>
                <p className="text-[11px] text-zinc-600 font-medium truncate mt-0.5">DBMS 9:30 AM</p>
              </div>

              <div
                onClick={() => setCurrentView("opportunities")}
                className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 hover:border-indigo-300 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>92% AI Match</span>
                </div>
                <p className="text-[11px] text-zinc-600 font-medium truncate mt-0.5">TCS Digital Drive</p>
              </div>

              <div
                onClick={() => setCurrentView("bunk")}
                className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 hover:border-purple-300 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-700">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>77.4% Attendance</span>
                </div>
                <p className="text-[11px] text-zinc-600 font-medium truncate mt-0.5">CN Risk: 68.2%</p>
              </div>

              <div
                onClick={() => {
                  const el = document.getElementById("contradiction-detector");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 hover:border-emerald-300 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Notice Conflict</span>
                </div>
                <p className="text-[11px] text-zinc-600 font-medium truncate mt-0.5">Dean PDF Verified</p>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive 3D Campus Intelligence Globe */}
          <div className="lg:col-span-5 relative">
            <div className="w-full max-w-[500px] mx-auto rounded-3xl border border-zinc-200/90 bg-white/75 backdrop-blur-xl shadow-2xl shadow-indigo-950/5 p-3 relative overflow-hidden">
              {/* Header inside 3D frame */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-zinc-700">
                    Live Campus Mesh
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md">
                  <span>6 NODES CONNECTED</span>
                </div>
              </div>

              {/* 3D Canvas Scene with client hydration guard */}
              <div className="w-full h-[380px] sm:h-[460px] md:h-[520px]">
                {isMounted ? <CampusOrb /> : <CampusOrbFallback />}
              </div>

              {/* Bottom Quick Action Banner inside 3D frame */}
              <div className="mt-2 p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                    LIVE
                  </span>
                  <span className="text-zinc-600 font-medium text-[11px]">
                    24 active notices synthesized for 5th Sem CSE
                  </span>
                </div>
                <button
                  onClick={() => setCurrentView("copilot")}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Explore →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
