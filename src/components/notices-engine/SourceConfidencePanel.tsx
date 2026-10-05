"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, AlertCircle, FileCheck2, ExternalLink } from "lucide-react";

interface SourceItem {
  name: string;
  role: "Primary source" | "Last checked recently" | "Reference";
  docType: string;
  uploadedAgo: string;
}

interface SourceConfidencePanelProps {
  sources: SourceItem[];
  confidence: "High confidence" | "Medium confidence" | "Needs verification";
  confidenceDetails: string;
}

export default function SourceConfidencePanel({
  sources,
  confidence,
  confidenceDetails,
}: SourceConfidencePanelProps) {
  const getConfidenceBadge = () => {
    switch (confidence) {
      case "High confidence":
        return {
          icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
          title: "HIGH CONFIDENCE",
          badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-300",
          subtext: "Multiple official institutional channels corroborate this information.",
        };
      case "Medium confidence":
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
          title: "MEDIUM CONFIDENCE",
          badgeColor: "bg-blue-50 text-blue-800 border-blue-300",
          subtext: "Single reliable gazetted document.",
        };
      case "Needs verification":
      default:
        return {
          icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
          title: "NEEDS VERIFICATION",
          badgeColor: "bg-amber-50 text-amber-800 border-amber-300",
          subtext: "Conflicting or incomplete institutional information found.",
        };
    }
  };

  const badge = getConfidenceBadge();

  return (
    <div className="rounded-2xl p-5 bg-white border border-zinc-200/90 shadow-sm space-y-4">
      {/* Trust & Confidence Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
            TRUST &amp; PROVENANCE
          </span>
          <h4 className="text-xs font-bold text-zinc-900 mt-0.5">INFORMATION SOURCES &amp; AUDIT</h4>
        </div>

        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${badge.badgeColor}`}>
          {badge.icon}
          <span>{badge.title}</span>
        </div>
      </div>

      <p className="text-[11px] text-zinc-600 leading-relaxed font-sans">
        {confidenceDetails || badge.subtext}
      </p>

      {/* Sources List */}
      <div className="space-y-2">
        {sources.map((src, idx) => (
          <div
            key={idx}
            onClick={() => alert(`Inspecting provenance: ${src.name} (${src.docType})`)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <div>
                <p className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">
                  {src.name}
                </p>
                <p className="text-[10px] text-zinc-400 font-mono">
                  {src.docType} • {src.uploadedAgo}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-600 font-semibold">
                {src.role}
              </span>
              <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
