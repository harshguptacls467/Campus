"use client";

import React, { useState } from "react";
import { useCampusStore } from "@/store/useCampusStore";
import {
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface TimelineDeadline {
  id: string;
  category: "Exam" | "Assignment" | "Placement" | "Administration" | "Hackathon";
  title: string;
  courseOrOrg: string;
  dueTime: string;
  proximityGroup: "Today" | "Tomorrow" | "In 2 Days" | "This Week" | "Next Week";
  distancePercent: number; // 0% = Now, 100% = Far
  isUrgent: boolean;
  actionLabel: string;
}

const DEADLINES: TimelineDeadline[] = [
  {
    id: "d-1",
    category: "Assignment",
    title: "DBMS Lab Record & Index Verification",
    courseOrOrg: "CS501 • Prof. Rao",
    dueTime: "Today • 5:00 PM (4h remaining)",
    proximityGroup: "Today",
    distancePercent: 12,
    isUrgent: true,
    actionLabel: "Submit PDF",
  },
  {
    id: "d-2",
    category: "Exam",
    title: "DBMS Mid-Semester Theory Exam",
    courseOrOrg: "Hall 302 • 100 Marks",
    dueTime: "Tomorrow • 09:30 AM",
    proximityGroup: "Tomorrow",
    distancePercent: 30,
    isUrgent: true,
    actionLabel: "Panic Plan",
  },
  {
    id: "d-3",
    category: "Placement",
    title: "TCS National Qualifier Drive Registration",
    courseOrOrg: "T&P Cell Portal",
    dueTime: "In 2 Days • 08 Oct 6:00 PM",
    proximityGroup: "In 2 Days",
    distancePercent: 50,
    isUrgent: false,
    actionLabel: "Verify Resume",
  },
  {
    id: "d-4",
    category: "Administration",
    title: "Odd Sem Examination Form Fill (No Late Fee)",
    courseOrOrg: "University ERP Portal",
    dueTime: "In 4 Days • 10 Oct 11:59 PM",
    proximityGroup: "This Week",
    distancePercent: 72,
    isUrgent: false,
    actionLabel: "Fill Form",
  },
  {
    id: "d-5",
    category: "Hackathon",
    title: "Smart Campus AI Hackathon Team Abstract",
    courseOrOrg: "CII Innovation Cell",
    dueTime: "In 8 Days • 14 Oct",
    proximityGroup: "Next Week",
    distancePercent: 92,
    isUrgent: false,
    actionLabel: "Draft Idea",
  },
];

export default function DeadlineTimeline() {
  const { setCurrentView, showToast } = useCampusStore();
  const [selectedGroup, setSelectedGroup] = useState<string>("All");

  const groups = ["All", "Today", "Tomorrow", "In 2 Days", "This Week", "Next Week"];

  const filtered = DEADLINES.filter((d) => {
    if (selectedGroup === "All") return true;
    return d.proximityGroup === selectedGroup;
  });

  return (
    <section className="py-16 sm:py-24 bg-[#FBFBFA] border-t border-zinc-200/80 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold mb-2">
              <Clock className="w-3.5 h-3.5 text-rose-600" />
              <span>RADAR DEADLINE TIMELINE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              Deadlines approaching you.
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base mt-1">
              Events and cutoffs visually converge as the clock ticks closer. Prioritized by penalty impact.
            </p>
          </div>

          {/* Group Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {groups.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGroup(g)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedGroup === g
                    ? "bg-zinc-900 text-white"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Proximity Track Simulation */}
        <div className="space-y-4">
          {filtered.map((item) => {
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white border border-zinc-200/90 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        item.isUrgent ? "bg-rose-500 animate-ping" : "bg-indigo-500"
                      }`}
                    />
                    <span className="font-bold text-sm sm:text-base text-zinc-900">
                      {item.title}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600">
                      {item.courseOrOrg}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono font-semibold ${
                        item.isUrgent ? "text-rose-600" : "text-zinc-600"
                      }`}
                    >
                      {item.dueTime}
                    </span>
                    <button
                      onClick={() => {
                        if (item.actionLabel === "Panic Plan") {
                          setCurrentView("panic");
                        } else {
                          showToast(`Opened action: "${item.actionLabel}" for ${item.title}`);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shrink-0 transition-colors"
                    >
                      {item.actionLabel}
                    </button>
                  </div>
                </div>

                {/* Convergence Meter Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.isUrgent
                          ? "bg-gradient-to-r from-rose-500 to-amber-500"
                          : "bg-gradient-to-r from-indigo-500 to-violet-500"
                      }`}
                      style={{ width: `${100 - item.distancePercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>NOW (Urgent)</span>
                    <span>Proximity Group: {item.proximityGroup}</span>
                    <span>Future</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => showToast("Exported all deadlines to your Outlook & Google Calendar!")}
            className="text-xs text-indigo-600 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Export complete deadline schedule (.ics)</span>
          </button>
        </div>

      </div>
    </section>
  );
}
