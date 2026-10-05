"use client";

import React, { useState } from "react";
import { AlertTriangle, ExternalLink, HelpCircle, ShieldAlert, Check } from "lucide-react";

interface ConflictDetectorCardProps {
  conflict?: {
    hasConflict: boolean;
    sourceA: { name: string; date: string };
    sourceB: { name: string; date: string };
    recommendation: string;
  };
  onViewSources?: () => void;
}

export default function ConflictDetectorCard({
  conflict,
  onViewSources,
}: ConflictDetectorCardProps) {
  const [showSourcesModal, setShowSourcesModal] = useState(false);

  if (!conflict || !conflict.hasConflict) return null;

  return (
    <div className="rounded-2xl p-5 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border-2 border-amber-400/80 shadow-md space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 shadow-sm">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-black tracking-widest text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded-full border border-amber-300">
                CRITICAL CONFLICT DETECTED
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">2 Sources Mismatch</span>
            </div>
            <h3 className="text-base font-extrabold text-zinc-950">
              ⚠ Multi-Source Date Contradiction
            </h3>
            <p className="text-xs text-zinc-700">
              Campus Copilot detected two official university sources publishing contradictory
              deadlines.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (onViewSources) onViewSources();
            setShowSourcesModal(true);
          }}
          className="text-xs font-bold text-amber-900 bg-white hover:bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl shadow-sm transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>View Sources</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Side-by-side mismatch comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-white border border-amber-300/80 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 text-[10px]">
            <span>SOURCE A (WEB PORTAL)</span>
            <span className="text-amber-700 font-bold">Unconfirmed</span>
          </div>
          <p className="font-sans font-bold text-zinc-900 text-sm">{conflict.sourceA.name}</p>
          <div className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200 inline-block">
            {conflict.sourceA.date}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white border border-amber-300/80 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 text-[10px]">
            <span>SOURCE B (GAZETTED CIRCULAR)</span>
            <span className="text-emerald-700 font-bold">Signed Authority</span>
          </div>
          <p className="font-sans font-bold text-zinc-900 text-sm">{conflict.sourceB.name}</p>
          <div className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-200 inline-block">
            {conflict.sourceB.date}
          </div>
        </div>
      </div>

      {/* Recommendation Guardrail */}
      <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-300 text-xs text-amber-950 flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">Copilot Policy &amp; Recommendation:</p>
          <p className="text-[11px] leading-relaxed text-amber-900">
            {conflict.recommendation} We never automatically guess between legal dates. Always treat
            the earlier deadline (<strong>11 October</strong>) as your target to avoid late fine risk.
          </p>
        </div>
      </div>

      {/* Sources Modal */}
      {showSourcesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="text-base font-extrabold text-zinc-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Source Provenance Log</span>
              </h4>
              <button
                onClick={() => setShowSourcesModal(false)}
                className="text-xs font-bold text-zinc-400 hover:text-zinc-700 px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Primary Evidence</span>
                <p className="font-bold text-zinc-900">Signed Controller Circular EXAM/2026/419</p>
                <p className="text-zinc-600">Scanned PDF issued 04 Oct with Controller signature.</p>
                <p className="font-mono text-indigo-700 font-semibold">Cites: 11 October 11:59 PM</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Secondary Evidence</span>
                <p className="font-bold text-zinc-900">University Portal Announcement Banner</p>
                <p className="text-zinc-600">Static web notice last edited 02 Oct (not updated yet).</p>
                <p className="font-mono text-rose-700 font-semibold">Cites: 12 October 5:00 PM</p>
              </div>
            </div>

            <button
              onClick={() => setShowSourcesModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 transition-colors"
            >
              Acknowledged — Proceed With Caution
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
