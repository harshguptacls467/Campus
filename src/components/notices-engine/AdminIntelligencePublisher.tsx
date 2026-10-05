"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Edit3,
  Send,
  Eye,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";
import { useCampusStore } from "@/store/useCampusStore";

interface AdminIntelligencePublisherProps {
  onClose?: () => void;
}

type AdminStep = "upload" | "processing" | "review" | "published";

export default function AdminIntelligencePublisher({
  onClose,
}: AdminIntelligencePublisherProps) {
  const [step, setStep] = useState<AdminStep>("upload");
  const [adminVerified, setAdminVerified] = useState(false);
  const { showToast } = useCampusStore();

  // Form states for review
  const [title, setTitle] = useState("ODD SEMESTER EXAMINATION FORM REGISTRATION 2026-27");
  const [audience, setAudience] = useState("B.Tech 5th Semester (CSE/AIML/DS/IT/ECE)");
  const [deadline, setDeadline] = useState("11 October 2026 • 11:59 PM");
  const [category, setCategory] = useState("Exams");
  const [priority, setPriority] = useState("High");
  const [actionLabel, setActionLabel] = useState("Complete Examination Form (Portal Link)");
  const [source, setSource] = useState("Controller Circular Ref: EXAM/2026/419 (Signed Gazette)");

  const handleSimulateProcessing = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("review");
    }, 1800);
  };

  const handlePublish = () => {
    if (!adminVerified) {
      alert("Safety Rule: Admin must verify AI extracted fields before publishing to students.");
      return;
    }
    setStep("published");
    showToast("Notice verified and published to 4,200 eligible students!");
  };

  return (
    <div className="rounded-3xl bg-white border border-zinc-200/90 shadow-2xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto animate-in zoom-in-95 duration-200">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-900 text-white shadow-md shadow-indigo-900/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase font-black tracking-widest text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              FACULTY / ADMIN PORTAL
            </span>
            <h2 className="text-xl font-black text-zinc-950 mt-0.5">
              Publish Campus Intelligence
            </h2>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs font-bold text-zinc-400 hover:text-zinc-700 px-3 py-1.5 rounded-lg hover:bg-zinc-100"
          >
            ✕ Close
          </button>
        )}
      </div>

      {/* Trust Pipeline Indicator */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              step !== "upload" ? "bg-emerald-500" : "bg-zinc-400"
            }`}
          />
          <span className="font-bold text-zinc-800">1. AI Extracted</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-zinc-300" />
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              adminVerified ? "bg-emerald-500" : "bg-amber-400 animate-pulse"
            }`}
          />
          <span className="font-bold text-zinc-800">2. Admin Verified</span>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-zinc-300" />
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              step === "published" ? "bg-emerald-500" : "bg-zinc-400"
            }`}
          />
          <span className="font-bold text-zinc-800">3. Student Broadcast</span>
        </div>
      </div>

      {/* Step 1: Upload Notice */}
      {step === "upload" && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-zinc-300 hover:border-indigo-400 rounded-2xl p-8 text-center bg-zinc-50/60 cursor-pointer space-y-3 transition-colors">
            <Upload className="w-10 h-10 text-indigo-600 mx-auto" />
            <div>
              <p className="font-extrabold text-sm text-zinc-900">
                Upload Official Circular PDF, Gazette Scan or Circular Image
              </p>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                Accepted: PDF, PNG, JPG, scanned mimeographed sheets
              </p>
            </div>
            <button
              onClick={handleSimulateProcessing}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Simulate Upload: Circular_EXAM_419.pdf
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Processing Flow */}
      {step === "processing" && (
        <div className="p-8 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-4 font-mono text-xs">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto" />
          <div className="space-y-1">
            <p className="font-bold text-zinc-900 text-sm">Reading notice...</p>
            <p className="text-zinc-500">
              Extracting information → Detecting target audience → Finding deadlines → Checking conflicts...
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Review & Safety Check */}
      {step === "review" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-zinc-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>READY TO PUBLISH (AI PROPOSAL)</span>
            </h3>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
              Edit any field before student broadcast
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-zinc-700 block">Notice Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-700 block">Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-700 block">Extracted Deadline</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-medium font-mono text-amber-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-zinc-700 block">Category &amp; Priority</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-1/2 px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-medium"
                />
                <input
                  type="text"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-1/2 px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-rose-700 font-bold"
                />
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-zinc-700 block">Primary Action Trigger</label>
              <input
                type="text"
                value={actionLabel}
                onChange={(e) => setActionLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-medium"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-zinc-700 block">Source &amp; Reference</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-medium font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Admin Safety Checkbox Rule */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <Lock className="w-4 h-4 text-amber-700" />
              <span>SAFETY GUARD: MANDATORY ADMIN VERIFICATION</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              AI should never directly publish an important notice without faculty or admin signoff.
              Please confirm the extracted dates and audience match the original controller memo.
            </p>

            <label className="flex items-center gap-2.5 pt-1 cursor-pointer font-bold select-none">
              <input
                type="checkbox"
                checked={adminVerified}
                onChange={(e) => setAdminVerified(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-zinc-300"
              />
              <span>I have reviewed the original PDF and verify the AI extraction is accurate.</span>
            </label>
          </div>

          {/* Publish Trigger */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep("upload")}
              className="text-xs font-bold text-zinc-500 hover:text-zinc-800"
            >
              Discard &amp; Start Over
            </button>

            <button
              onClick={handlePublish}
              disabled={!adminVerified}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Verified Intelligence</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Published State */}
      {step === "published" && (
        <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-emerald-950">
              Notice Intelligence Successfully Published
            </h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Circular Ref: EXAM/2026/419 has been dispatched to 4,200 eligible student timelines
              with automated calendar reminders.
            </p>
          </div>
          <button
            onClick={() => setStep("upload")}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-colors"
          >
            Publish Another Notice
          </button>
        </div>
      )}
    </div>
  );
}
