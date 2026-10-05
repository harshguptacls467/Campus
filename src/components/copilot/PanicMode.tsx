"use client";

import React, { useState, useEffect } from "react";
import { DBMS_PANIC_PLAN, PanicSprintTopic } from "@/data/mockCampusData";
import { useCampusStore } from "@/store/useCampusStore";
import {
  Flame,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function PanicMode() {
  const {
    activePanicTopicIndex,
    setActivePanicTopicIndex,
    completedPanicTopics,
    togglePanicTopicDone,
    showToast,
  } = useCampusStore();

  const [isRunning, setIsRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(180 * 60); // 180 minutes in seconds

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((sec) => sec - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsRunning(false);
      showToast("🎉 180-Minute Panic Plan Complete! You're ready for DBMS!");
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, showToast]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const activeTopic = DBMS_PANIC_PLAN[activePanicTopicIndex];

  return (
    <section className="py-12 sm:py-16 bg-[#18181B] text-zinc-100 min-h-[90vh] relative transition-colors duration-500">
      
      {/* Background ambient red/amber urgent glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-rose-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header Badge & Title */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
            <span>🚨 PANIC MODE ACTIVATED</span>
          </div>

          <div className="py-2">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase font-mono">
              3 HOURS • 1 EXAM • ZERO WASTE
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
              Database Management Systems (CS501) • Hall 302 • Tomorrow 09:30 AM
            </p>
          </div>

          {/* Large Countdown Clock & Control */}
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-4 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-rose-500" />
              <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-wider text-rose-400">
                {formatTimer(secondsRemaining)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsRunning(!isRunning);
                  showToast(isRunning ? "Timer paused." : "🔥 Panic study sprint started! Stay focused.");
                }}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                  isRunning
                    ? "bg-amber-500 text-zinc-950 hover:bg-amber-400"
                    : "bg-rose-600 text-white hover:bg-rose-500 shadow-lg shadow-rose-600/30"
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Plan</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Start 180-Minute Plan</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsRunning(false);
                  setSecondsRemaining(180 * 60);
                  showToast("Timer reset to 180 minutes.");
                }}
                className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sprint Timeline Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Timeline List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 uppercase tracking-wider px-1">
              <span>Sprint Roadmap</span>
              <span>
                {completedPanicTopics.length} / {DBMS_PANIC_PLAN.length} Done
              </span>
            </div>

            {DBMS_PANIC_PLAN.map((topic, idx) => {
              const isActive = activePanicTopicIndex === idx;
              const isCompleted = completedPanicTopics.includes(idx);

              return (
                <div
                  key={topic.timeBlock}
                  onClick={() => setActivePanicTopicIndex(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isActive
                      ? "bg-zinc-900 border-rose-500 shadow-lg shadow-rose-950/40"
                      : "bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-rose-400">
                      {topic.timeBlock}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        topic.yieldScore.includes("90%")
                          ? "bg-rose-950 text-rose-300 border border-rose-700"
                          : "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      {topic.yieldScore}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                    {topic.title}
                  </h3>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {topic.durationMinutes} mins
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePanicTopicDone(idx);
                        showToast(`Updated progress: "${topic.title}"`);
                      }}
                      className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-lg transition-colors ${
                        isCompleted
                          ? "text-emerald-400 bg-emerald-950/60 border border-emerald-800"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isCompleted ? "Completed" : "Mark Done"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Topic Deep-Dive & Cheat Sheet */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 sm:p-7 shadow-xl space-y-6">
              
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold bg-rose-950/70 px-2.5 py-0.5 rounded-md border border-rose-800">
                      Active Sprint Topic
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {activeTopic.timeBlock} ({activeTopic.durationMinutes} min)
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {activeTopic.title}
                  </h2>
                </div>

                <button
                  onClick={() => showToast("Downloading DBMS 2-Page Panic Cheatsheet PDF...")}
                  className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors shrink-0"
                  title="Download Cheatsheet"
                >
                  <FileDown className="w-5 h-5 text-rose-400" />
                </button>
              </div>

              {/* Strategic Tip */}
              <div className="p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800/80">
                <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                  Examiner Weightage Note
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {activeTopic.cheatSheetSummary}
                </p>
              </div>

              {/* High-Yield Formulas / Proofs */}
              <div className="space-y-2.5">
                <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  High-Yield Concepts to Write in Answer Sheet
                </p>
                <div className="space-y-2">
                  {activeTopic.keyFormulasOrConcepts.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs font-mono text-rose-200/90 flex items-start gap-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-mono">
                  Calculated against 5 years of mid-sem questions
                </span>
                <button
                  onClick={() => {
                    const next = (activePanicTopicIndex + 1) % DBMS_PANIC_PLAN.length;
                    setActivePanicTopicIndex(next);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Next Topic</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
