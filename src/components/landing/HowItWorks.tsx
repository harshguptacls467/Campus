"use client";

import React, { useState } from "react";
import {
  FileText,
  Camera,
  Mic,
  MessageSquare,
  Cpu,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      stepNumber: "01",
      title: "Information Enters",
      subtitle: "Unstructured, chaotic, scattered campus data",
      description:
        "Notices live in WhatsApp forwards, blurry photocopy circulars on notice boards, PDF portals, and word-of-mouth announcements. Copilot absorbs them all.",
      inputs: [
        { label: "Messy Circular PDFs", icon: <FileText className="w-4 h-4 text-rose-500" /> },
        { label: "Notice Board Photos", icon: <Camera className="w-4 h-4 text-amber-500" /> },
        { label: "CR WhatsApp Forwards", icon: <MessageSquare className="w-4 h-4 text-emerald-500" /> },
        { label: "Professor Audio Memos", icon: <Mic className="w-4 h-4 text-indigo-500" /> },
      ],
      badge: "ANY FORMAT INGESTION",
      badgeColor: "bg-zinc-100 text-zinc-700",
    },
    {
      stepNumber: "02",
      title: "AI Understands It",
      subtitle: "Semantic extraction with Gemini intelligence",
      description:
        "Every document is parsed for hard facts: cutoff dates, fine schedules, branch prerequisites, CGPA thresholds, and contradictory claims.",
      inputs: [
        { label: "Dates & Hard Deadlines", icon: <Clock className="w-4 h-4 text-indigo-600" /> },
        { label: "Eligibility & Cutoffs", icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" /> },
        { label: "Fine & Penalty Rules", icon: <AlertCircle className="w-4 h-4 text-amber-600" /> },
        { label: "Direct Action Items", icon: <Cpu className="w-4 h-4 text-purple-600" /> },
      ],
      badge: "ZERO HALLUCINATION VERIFICATION",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      stepNumber: "03",
      title: "Campus Copilot Acts",
      subtitle: "Personalized decisions delivered directly to you",
      description:
        "No more reading 4-page circulars to find if your branch is eligible. Copilot matches the notice against your real CGPA, branch, and timetable.",
      inputs: [
        { label: "1-Click Calendar Sync", icon: <CalendarCheck className="w-4 h-4 text-emerald-600" /> },
        { label: "Instant Eligibility Verdict", icon: <CheckCircle2 className="w-4 h-4 text-blue-600" /> },
        { label: "Panic Sprint Study Plan", icon: <Sparkles className="w-4 h-4 text-rose-600" /> },
        { label: "Debarment Threshold Alerts", icon: <AlertCircle className="w-4 h-4 text-purple-600" /> },
      ],
      badge: "IMMEDIATE RESOLUTION",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-zinc-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-mono font-medium mb-3">
            <span>HOW CAMPUS COPILOT WORKS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
            From fragmented chaos to personalized clarity.
          </h2>
          <p className="text-zinc-600 text-base sm:text-lg mt-3">
            Watch how unstructured campus signals convert into exact student decisions in three continuous stages.
          </p>
        </div>

        {/* Step Navigation Pill Selector */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-zinc-100 border border-zinc-200 shadow-inner">
            {steps.map((st, idx) => (
              <button
                key={st.stepNumber}
                onClick={() => setActiveStep(idx)}
                className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeStep === idx
                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    activeStep === idx ? "bg-indigo-950 text-white" : "bg-zinc-200 text-zinc-600"
                  }`}
                >
                  {st.stepNumber}
                </span>
                <span>{st.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Interactive Story Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const isCurrent = activeStep === idx;
            return (
              <div
                key={step.stepNumber}
                onClick={() => setActiveStep(idx)}
                className={`cursor-pointer rounded-3xl p-6 sm:p-7 border transition-all duration-300 relative flex flex-col justify-between ${
                  isCurrent
                    ? "bg-[#FAF9F6] border-indigo-400/80 shadow-xl shadow-indigo-900/5 ring-2 ring-indigo-500/10 scale-[1.02]"
                    : "bg-white border-zinc-200/80 hover:border-zinc-300 shadow-sm"
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-mono font-extrabold text-indigo-950">
                      Step {step.stepNumber}
                    </span>
                    <span
                      className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border ${step.badgeColor}`}
                    >
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 mb-1.5">{step.title}</h3>
                  <p className="text-xs font-medium text-indigo-600 mb-3">{step.subtitle}</p>
                  <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Micro Input / Processing Cards */}
                <div className="space-y-2 pt-4 border-t border-zinc-200/70">
                  <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    {idx === 0 ? "Sources Detected" : idx === 1 ? "Extracted Entities" : "Automated Outputs"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {step.inputs.map((item) => (
                      <div
                        key={item.label}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium ${
                          isCurrent
                            ? "bg-white border-zinc-200 text-zinc-800 shadow-xs"
                            : "bg-zinc-50 border-zinc-200/60 text-zinc-600"
                        }`}
                      >
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress bar line at bottom */}
                <div className="mt-6 pt-3 flex items-center justify-between text-xs font-semibold text-zinc-400">
                  <span>Phase {step.stepNumber} of 03</span>
                  {idx < 2 && (
                    <span className="flex items-center gap-1 text-indigo-600">
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
