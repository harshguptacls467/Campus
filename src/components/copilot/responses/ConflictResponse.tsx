"use client";

import React, { useState } from "react";
import { useCampusStore } from "@/store/useCampusStore";
import {
  AlertTriangle,
  FileText,
  Globe,
  MessageCircle,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

export default function ConflictResponse() {
  const { showToast } = useCampusStore();
  const [showSourceDetails, setShowSourceDetails] = useState(false);

  const sources = [
    { name: "College Official Website", type: "Web Portal", date: "12 October • 5:00 PM", status: "Published August" },
    { name: "Uploaded Dean Circular", type: "Signed PDF", date: "11 October • 11:59 PM", status: "Issued Yesterday" },
    { name: "Student Council Broadcast", type: "WhatsApp Group", date: "11 October • 2:00 PM", status: "Class CR Forward" },
  ];

  return (
    <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-md p-6 sm:p-7 space-y-6 text-left max-w-2xl">
      
      {/* 1. WHAT? Conflict Alert Header */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>⚠ INFORMATION CONFLICT DETECTED</span>
        </div>

        <span className="text-[10px] font-mono uppercase font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
          NEEDS VERIFICATION · 3 SOURCES CONFLICT
        </span>
      </div>

      <div>
        <h3 className="text-xl font-extrabold text-zinc-950">
          When is the examination form deadline?
        </h3>
        <p className="text-xs text-zinc-600 leading-relaxed mt-1">
          Two sources agree on <strong>11 October</strong>, but the official college website displays <strong>12 October</strong>.
        </p>
      </div>

      {/* Discrepant Sources Display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {sources.map((src, i) => (
          <div key={i} className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">{src.type}</span>
            <p className="font-bold text-zinc-900">{src.name}</p>
            <p className="font-mono font-bold text-indigo-950 text-sm">{src.date}</p>
            <span className="text-[10px] text-zinc-500 font-mono block">{src.status}</span>
          </div>
        ))}
      </div>

      {/* 2. WHY & RECOMMENDATION */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5 text-xs text-amber-950">
        <span className="font-bold text-xs uppercase tracking-wider block font-mono text-amber-800">
          Copilot Recommendation:
        </span>
        <p className="leading-relaxed">
          The Signed Dean PDF issued yesterday is the most recently gazetted document, but the website CMS hasn&apos;t synchronized. We recommend adhering to <strong>11 October</strong> to eliminate late fine risk, and verifying with the examination cell.
        </p>
      </div>

      {/* 3. NOW WHAT? Actions */}
      <div className="pt-3 border-t border-zinc-200 flex items-center justify-between">
        <button
          onClick={() => setShowSourceDetails(!showSourceDetails)}
          className="text-xs text-indigo-700 font-bold hover:underline flex items-center gap-1"
        >
          <span>{showSourceDetails ? "Hide Document Hashes" : "View Cryptographic Sources"}</span>
          <ExternalLink className="w-3 h-3" />
        </button>

        <button
          onClick={() => showToast("Direct ticket logged with Examination Cell. Response expected within 2 hours.")}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm"
        >
          Flag to Exam Cell →
        </button>
      </div>

      {showSourceDetails && (
        <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-zinc-200 text-[11px] font-mono space-y-1 text-zinc-500">
          <p>• Dean Circular: SHA-256 (6a9f...e4) signed 2026-10-04</p>
          <p>• Web Portal: Static HTML last cache 2026-08-28</p>
          <p>• WhatsApp Broadcast: Forwarded from Student Council Rep (unverified channel)</p>
        </div>
      )}

    </div>
  );
}
