"use client";

import React, { useState } from "react";
import { Calendar, Bell, Clock, CheckCircle2, X, AlertCircle } from "lucide-react";
import { useCampusStore } from "@/store/useCampusStore";

interface AddToCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  deadlineText: string;
}

export function AddToCalendarModal({
  isOpen,
  onClose,
  title,
  deadlineText,
}: AddToCalendarModalProps) {
  const [selectedReminder, setSelectedReminder] = useState<"1day" | "3hours" | "both">("both");
  const [isAdded, setIsAdded] = useState(false);
  const { showToast } = useCampusStore();

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsAdded(true);
    setTimeout(() => {
      showToast(`Event "${title}" added to your calendar with alerts.`);
      setIsAdded(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-zinc-200 space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
                CAMPUS CALENDAR SYNC
              </span>
              <h3 className="text-base font-extrabold text-zinc-950">Add to Calendar</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Event Preview Card */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
            DEADLINE EVENT
          </span>
          <h4 className="text-sm font-extrabold text-zinc-900">{title}</h4>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-600">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{deadlineText}</span>
          </div>
        </div>

        {/* Reminder Options */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-800 block">
            Notification Alerts (Push &amp; In-App):
          </label>
          <div className="space-y-2 text-xs">
            <label
              onClick={() => setSelectedReminder("1day")}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                selectedReminder === "1day"
                  ? "bg-indigo-50 border-indigo-600 text-indigo-950 font-bold"
                  : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <span>1 day before (10 Oct • 10:00 AM)</span>
              <input
                type="radio"
                name="cal-reminder"
                checked={selectedReminder === "1day"}
                onChange={() => setSelectedReminder("1day")}
                className="text-indigo-600"
              />
            </label>

            <label
              onClick={() => setSelectedReminder("3hours")}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                selectedReminder === "3hours"
                  ? "bg-indigo-50 border-indigo-600 text-indigo-950 font-bold"
                  : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <span>3 hours before (11 Oct • 8:59 PM)</span>
              <input
                type="radio"
                name="cal-reminder"
                checked={selectedReminder === "3hours"}
                onChange={() => setSelectedReminder("3hours")}
                className="text-indigo-600"
              />
            </label>

            <label
              onClick={() => setSelectedReminder("both")}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                selectedReminder === "both"
                  ? "bg-indigo-50 border-indigo-600 text-indigo-950 font-bold ring-1 ring-indigo-500"
                  : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>Both (Recommended for hard cutoffs)</span>
              </div>
              <input
                type="radio"
                name="cal-reminder"
                checked={selectedReminder === "both"}
                onChange={() => setSelectedReminder("both")}
                className="text-indigo-600"
              />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-bold text-xs hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isAdded}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            {isAdded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Added!</span>
              </>
            ) : (
              <span>Add Event</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

interface SetReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  noticeTitle: string;
}

export function SetReminderModal({ isOpen, onClose, noticeTitle }: SetReminderModalProps) {
  const [option, setOption] = useState<string>("1day");
  const [isScheduled, setIsScheduled] = useState(false);
  const { showToast } = useCampusStore();

  if (!isOpen) return null;

  const handleSchedule = () => {
    setIsScheduled(true);
    setTimeout(() => {
      showToast(`Reminder scheduled for "${noticeTitle}".`);
      setIsScheduled(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-zinc-200 space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
                INTELLIGENT ALERT
              </span>
              <h3 className="text-base font-extrabold text-zinc-950">
                When should we remind you?
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-600">
          Campus Copilot will send a push notification with direct link to the exam registration
          portal.
        </p>

        {/* Options */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { id: "tomorrow", label: "Tomorrow morning", time: "8:00 AM" },
            { id: "1day", label: "1 day before", time: "10 Oct • 10 AM" },
            { id: "3hours", label: "3 hours before", time: "11 Oct • 8 PM" },
            { id: "custom", label: "Custom time", time: "Pick slot" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setOption(item.id)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                option === item.id
                  ? "bg-purple-50 border-purple-600 text-purple-950 font-bold ring-1 ring-purple-500 shadow-sm"
                  : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-white"
              }`}
            >
              <p className="font-extrabold">{item.label}</p>
              <p className="text-[10px] font-mono text-zinc-500 mt-0.5">{item.time}</p>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-bold text-xs hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={isScheduled}
            className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5"
          >
            {isScheduled ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Scheduled!</span>
              </>
            ) : (
              <span>Schedule Alert</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
