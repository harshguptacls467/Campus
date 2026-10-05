"use client";

import React, { useState } from "react";
import { Calendar, Bell, Clock, Check, X, ShieldCheck } from "lucide-react";

interface ActionConfirmModalProps {
  isOpen: boolean;
  title: string;
  deadlineText: string;
  actionType: "calendar" | "reminder";
  onConfirm: (timing: string) => void;
  onClose: () => void;
}

export default function ActionConfirmModal({
  isOpen,
  title,
  deadlineText,
  actionType,
  onConfirm,
  onClose,
}: ActionConfirmModalProps) {
  const [selectedTiming, setSelectedTiming] = useState<string>("both");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-md w-full p-6 space-y-5 text-left">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
              {actionType === "calendar" ? <Calendar className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-950">
                {actionType === "calendar" ? "Confirm Calendar Sync" : "Set Smart Reminder"}
              </h3>
              <p className="text-xs text-zinc-500 font-mono">Action confirmation gate</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Detail Box */}
        <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-zinc-200/90 space-y-1.5">
          <p className="text-xs font-bold text-zinc-900">{title}</p>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-600">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Target: <strong>{deadlineText}</strong></span>
          </div>
        </div>

        {/* Reminder Options */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase text-zinc-400 font-bold block">
            Notify me:
          </span>
          <div className="space-y-1.5">
            {[
              { id: "1day", label: "1 day before deadline (Prep reminder)" },
              { id: "3hours", label: "3 hours before deadline (Urgent gate)" },
              { id: "both", label: "Both (Recommended for high priority)" },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-medium cursor-pointer transition-all ${
                  selectedTiming === opt.id
                    ? "bg-indigo-50 border-indigo-300 text-indigo-950"
                    : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                <span>{opt.label}</span>
                <input
                  type="radio"
                  name="reminderTiming"
                  value={opt.id}
                  checked={selectedTiming === opt.id}
                  onChange={() => setSelectedTiming(opt.id)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-zinc-600 hover:bg-zinc-100 text-xs font-semibold"
          >
            Not Now
          </button>
          <button
            onClick={() => {
              onConfirm(selectedTiming);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs shadow-md shadow-indigo-950/20"
          >
            {actionType === "calendar" ? "Confirm & Sync Calendar" : "Schedule Reminder"}
          </button>
        </div>

      </div>
    </div>
  );
}
