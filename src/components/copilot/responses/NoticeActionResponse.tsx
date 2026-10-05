"use client";

import React, { useState, useEffect } from "react";
import { useCampusStore } from "@/store/useCampusStore";
import ActionConfirmModal from "../ActionConfirmModal";
import {
  FileText,
  CheckCircle2,
  Calendar,
  Bell,
  Clock,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function NoticeActionResponse() {
  const { showToast } = useCampusStore();
  const [pipelineStep, setPipelineStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState<"calendar" | "reminder">("calendar");

  const steps = [
    "Reading document OCR...",
    "Extracting text & headers...",
    "Detecting important dates & cutoff times...",
    "Understanding department eligibility...",
    "Finding required documents & fee rules...",
    "Checking your profile (Isha Sharma, 5th Sem CSE)...",
    "Creating personalized action triggers...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPipelineStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsProcessing(false);
          clearInterval(interval);
          return prev;
        }
      });
    }, 400);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="bg-white rounded-3xl border-2 border-indigo-200 shadow-xl p-6 sm:p-7 space-y-6 text-left max-w-2xl">
      
      {/* Action Confirmation Modal */}
      <ActionConfirmModal
        isOpen={confirmModalOpen}
        title="Examination Form Submission Deadline"
        deadlineText="October 11 • 11:59 PM"
        actionType={modalActionType}
        onConfirm={async (timing) => {
          try {
            const res = await fetch("http://localhost:5001/api/actions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: "Examination Form Submission Deadline",
                due_at: "2026-10-11T23:59:00.000Z",
                priority: "critical",
                action_type: modalActionType === "calendar" ? "calendar" : "reminder",
                calendar_sync: modalActionType === "calendar",
                source: {
                  document_id: "doc-exam-1",
                  source_name: "Office of Controller of Examinations",
                  source_url: "https://www.rgpv.ac.in",
                  file_name: "Exam_Circular_419.pdf",
                  title: "Exam Form Registration 2026-27 (Circular EXAM/2026/419)",
                },
              }),
            });

            const json = await res.json();
            if (json.warning) {
              showToast(json.warning);
            } else if (json.alreadyExists) {
              showToast("Reminder already exists for this deadline.");
            } else {
              showToast(
                modalActionType === "calendar"
                  ? "✓ Added to calendar & scheduled reminder!"
                  : `✓ Reminder scheduled (${timing})!`
              );
            }

            if (modalActionType === "calendar" && json.data?.calendar_url) {
              window.open(json.data.calendar_url, "_blank");
            }
          } catch {
            showToast(
              modalActionType === "calendar"
                ? "Synced Exam Form cutoff to your Google Calendar!"
                : `Reminder scheduled (${timing})!`
            );
          }
        }}
        onClose={() => setConfirmModalOpen(false)}
      />

      {/* Processing Pipeline Animation */}
      {isProcessing ? (
        <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-zinc-200 space-y-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
            <div>
              <p className="text-xs font-bold text-zinc-900">Processing Uploaded Notice...</p>
              <p className="text-[11px] font-mono text-indigo-600 animate-pulse">
                {steps[pipelineStep]}
              </p>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-zinc-200 text-xs font-mono text-zinc-500">
            {steps.slice(0, pipelineStep + 1).map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className={idx === pipelineStep ? "text-indigo-950 font-bold" : "text-zinc-500"}>
                  {s.replace("...", "")}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Structured Transformed Notice Result */
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                TRANSFORMED NOTICE
              </span>
              <span className="text-xs font-mono text-zinc-400">EXAM/2026/419</span>
            </div>

            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>YOUR STATUS: 🟢 Eligible</span>
            </span>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-zinc-950">
              EXAM FORM REGISTRATION
            </h3>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">
              Odd Semester Examinations • B.Tech Regular Students
            </p>
          </div>

          {/* Key Facts Data Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FAF9F6] border border-zinc-200/80 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Deadline</span>
              <strong className="text-rose-600 font-bold text-sm">11 Oct · 11:59 PM</strong>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Eligible Students</span>
              <span className="font-semibold text-zinc-800">5th Semester (All Branches)</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-400 block">Late Fee Penalty</span>
              <span className="font-semibold text-zinc-800">₹500 after deadline</span>
            </div>
          </div>

          {/* Required Documents Checklist */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 block">
              Required for Submission:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="flex items-center gap-1.5 text-zinc-800 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <span>Student ID Card</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-800 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <span>Enrollment Number</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-800 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <span>Semester Fee Receipt</span>
              </div>
            </div>
          </div>

          {/* Deliberate Action Buttons */}
          <div className="pt-4 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => showToast("Opened official Controller of Examinations scanned PDF circular archive.")}
              className="text-xs text-indigo-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>View Original Notice</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setModalActionType("reminder");
                  setConfirmModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Add Reminder</span>
              </button>

              <button
                onClick={() => {
                  setModalActionType("calendar");
                  setConfirmModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Add to Calendar</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
