"use client";

import React from "react";
import { useCampusStore, NavView } from "@/store/useCampusStore";
import { Sparkles, Heart, ShieldCheck, ArrowUp } from "lucide-react";

export default function Footer() {
  const { setCurrentView } = useCampusStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-zinc-800/80">
          
          {/* Brand & Mission */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Campus Copilot
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
                v2.5 Intelligence
              </span>
            </div>

            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Transforming scattered college circulars, deadlines, placement drives,
              and attendance risks into personalized, actionable decisions.
            </p>

            <p className="text-xs font-mono text-zinc-500">
              “Your Campus. One Intelligence.”
            </p>
          </div>

          {/* Quick Links Column 1 */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
              Student Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setCurrentView("copilot");
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Campus Command Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView("bunk");
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Bunk-o-Meter Attendance Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView("panic");
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  🚨 Panic Mode 180-Minute Study Sprint
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView("opportunities");
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Placement Radar &amp; AI Match Score
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
              Intelligence &amp; Infrastructure
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    setCurrentView("deadlines");
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Radar Deadline Convergence
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView("map");
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors"
                >
                  Interactive Campus Ecosystem Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView("admin");
                    scrollToTop();
                  }}
                  className="hover:text-white transition-colors text-indigo-400"
                >
                  Administrative Notice Ingestion Portal
                </button>
              </li>
              <li>
                <span className="text-zinc-500">
                  Powered by Gemini Multimodal Extraction
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <p>© 2026 Campus Copilot. Built for hackathon-winning student clarity.</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors self-start sm:self-auto"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
