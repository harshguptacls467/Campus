"use client";

import React, { useState } from "react";
import { DETAILED_PLACEMENTS, DetailedPlacementOpportunity } from "@/lib/mock/placements";
import PlacementDecisionCard from "./PlacementDecisionCard";
import NotEligibleCard from "./NotEligibleCard";
import ProfileSnapshotCard from "./ProfileSnapshotCard";
import PlacementCircularUploadModal from "./PlacementCircularUploadModal";
import PlacementGapAnalysisCard from "./PlacementGapAnalysisCard";
import AskCopilotJobBar from "./AskCopilotJobBar";
import {
  Briefcase,
  UploadCloud,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Award,
} from "lucide-react";
import { useCampusStore } from "@/store/useCampusStore";

export default function PlacementIntelligencePage() {
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>("tcs-digital");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { showToast } = useCampusStore();

  const selectedOpportunity =
    DETAILED_PLACEMENTS.find((o) => o.id === selectedOpportunityId) || DETAILED_PLACEMENTS[0];

  const handleSelectOpportunity = (id: string) => {
    setSelectedOpportunityId(id);
    const element = document.getElementById("decision-result-anchor");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleUploadSuccess = (filename: string) => {
    if (filename.toLowerCase().includes("google")) {
      setSelectedOpportunityId("google-step");
    } else {
      setSelectedOpportunityId("tcs-digital");
    }
    showToast(`Circular extracted & verified: ${filename}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-24 lg:pb-12">
      
      {/* 1. Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-b from-indigo-950/5 via-white to-white border border-zinc-200/80 p-8 sm:p-12 text-center space-y-5 overflow-hidden shadow-xs">
        
        {/* Subtle AI Pipeline Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-bold mx-auto">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PROFILE ──► REQUIREMENTS ──► MATCH ──► ACTION</span>
        </div>

        <div className="space-y-2 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
            Don&apos;t just find opportunities.
            <br />
            <span className="text-indigo-600">Know your chances.</span>
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Campus Copilot compares every recruiter circular with your verified academic profile,
            explains the decision, identifies gaps, and tells you what to do next.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              const el = document.getElementById("decision-result-anchor");
              if (el) el.scrollIntoView({ behavior: "smooth" });
              showToast("Evaluating profile against current opportunities...");
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Check My Eligibility</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 font-extrabold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <UploadCloud className="w-4 h-4 text-indigo-600" />
            <span>Upload Placement Circular</span>
          </button>
        </div>
      </div>

      {/* 2. Curated Opportunity List (MVP AI Selection) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-zinc-400">
              CURATED BY CAMPUS COPILOT
            </span>
            <h3 className="text-lg font-black text-zinc-950">Active Recruiter Drives</h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {DETAILED_PLACEMENTS.length} Priority Opportunities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DETAILED_PLACEMENTS.map((opp) => {
            const isSelected = opp.id === selectedOpportunityId;
            return (
              <div
                key={opp.id}
                onClick={() => setSelectedOpportunityId(opp.id)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? opp.isEligible
                      ? "bg-white border-emerald-500 shadow-md ring-2 ring-emerald-400/30"
                      : "bg-white border-rose-500 shadow-md ring-2 ring-rose-400/30"
                    : "bg-white border-zinc-200/90 hover:border-zinc-300 shadow-xs"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-base text-zinc-950">{opp.company}</h4>
                      <p className="text-xs text-zinc-500 truncate">{opp.role}</p>
                    </div>

                    <span
                      className={`text-xs font-mono font-black px-2 py-0.5 rounded-full border ${
                        opp.isEligible
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-rose-50 text-rose-800 border-rose-200"
                      }`}
                    >
                      {opp.matchScore}% Match
                    </span>
                  </div>

                  <p className="text-xs font-mono text-zinc-600 bg-zinc-50 p-2 rounded-xl border border-zinc-200/70">
                    {opp.packageText} • {opp.batch}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {opp.isEligible ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-800">🟢 Eligible</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span className="text-rose-800">🔴 Not Eligible</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-bold">
                  <span className={isSelected ? "text-indigo-600 font-extrabold" : "text-zinc-500"}>
                    {opp.isEligible ? "Check Why →" : "See Reason →"}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? "text-indigo-600 translate-x-1" : "text-zinc-400"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Intelligence Grid: Result ↔ Profile Snapshot */}
      <div id="decision-result-anchor" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 Cols: The Big Result (Eligible vs Not Eligible) */}
        <div className="lg:col-span-8 space-y-6">
          {selectedOpportunity.isEligible ? (
            <PlacementDecisionCard
              opportunity={selectedOpportunity}
              onOpenPreparationPlan={() => {
                const el = document.getElementById("ask-copilot-anchor");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              onAddReminder={() => showToast(`Reminder set for ${selectedOpportunity.company} deadline!`)}
            />
          ) : (
            <NotEligibleCard
              requiredCGPA={selectedOpportunity.notEligibleReason?.requiredCGPA || 8.0}
              studentCGPA={selectedOpportunity.notEligibleReason?.studentCGPA || 7.8}
              difference={selectedOpportunity.notEligibleReason?.difference || 0.2}
              blockers={selectedOpportunity.notEligibleReason?.blockersSummary || []}
              onShowBetterMatches={() => setSelectedOpportunityId("tcs-digital")}
            />
          )}

          {/* Real Backend Gap Analysis Engine (Deterministic + Gemini + Uploaded Material Matching) */}
          <PlacementGapAnalysisCard
            placementId={selectedOpportunity.id}
            companyName={selectedOpportunity.company}
          />

          {/* Ask Copilot Grounded Bar */}
          <div id="ask-copilot-anchor">
            <AskCopilotJobBar opportunity={selectedOpportunity} />
          </div>
        </div>

        {/* Right 4 Cols: Verified Profile Snapshot & Trust Telemetry */}
        <div className="lg:col-span-4 space-y-6">
          <ProfileSnapshotCard />

          {/* AI Decision Transparency Callout */}
          <div className="rounded-3xl bg-zinc-50 border border-zinc-200/90 p-6 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-zinc-950">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Campus Copilot Trust Policy</span>
            </div>
            <p className="text-zinc-600 leading-relaxed font-sans">
              Unlike generic resume scanners, Campus Copilot extracts official placement gazettes
              and evaluates your verified university registrar record without fabricating
              eligibility.
            </p>
            <div className="pt-2 border-t border-zinc-200 flex items-center justify-between font-mono text-[10px] text-zinc-400">
              <span>Registrar Sync: Active</span>
              <span className="text-emerald-700 font-bold">100% Deterministic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Placement Notice Modal */}
      <PlacementCircularUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* 19. Mobile Sticky Bottom CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-zinc-200 shadow-xl flex items-center justify-between z-40">
        <div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase block">
            {selectedOpportunity.company}
          </span>
          <span
            className={`text-xs font-bold ${
              selectedOpportunity.isEligible ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {selectedOpportunity.isEligible ? "🟢 Eligible" : "🔴 Not Eligible"} • {selectedOpportunity.matchScore}% Match
          </span>
        </div>

        {selectedOpportunity.isEligible ? (
          <button
            onClick={() => showToast("Opening Application Form...")}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
          >
            Apply Now
          </button>
        ) : (
          <button
            onClick={() => setSelectedOpportunityId("tcs-digital")}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-xs shadow-sm"
          >
            Show Better Matches
          </button>
        )}
      </div>
    </div>
  );
}
