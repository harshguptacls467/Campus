"use client";

import React, { useState } from "react";
import { CAMPUS_PULSE_ITEMS, CampusPulseItem } from "@/data/mockCampusData";
import { useCampusStore } from "@/store/useCampusStore";
import {
  Activity,
  Briefcase,
  Calendar,
  Clock,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function CampusPulse() {
  const { setCurrentView, submitPrompt, showToast } = useCampusStore();
  const [filterType, setFilterType] = useState<string>("all");

  const filteredItems = CAMPUS_PULSE_ITEMS.filter((item) => {
    if (filterType === "all") return true;
    return item.type === filterType;
  });

  const handleAction = (item: CampusPulseItem) => {
    if (item.type === "placement") {
      submitPrompt("Am I eligible for today's placement?");
      setCurrentView("copilot");
    } else if (item.type === "exam") {
      setCurrentView("panic");
    } else if (item.type === "alert") {
      setCurrentView("bunk");
    } else {
      showToast(`Added "${item.title}" to your student feed!`);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-zinc-200/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>CAMPUS PULSE STREAM</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              What&apos;s happening right now.
            </h2>
            <p className="text-zinc-600 text-sm sm:text-base mt-1">
              Live automated campus activity stream ingested across academic departments, placement cells, and student clubs.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All Activity" },
              { id: "placement", label: "Placements" },
              { id: "exam", label: "Exams" },
              { id: "event", label: "Events" },
              { id: "alert", label: "Alerts" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filterType === f.id
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Activity Stream */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-zinc-200 space-y-6">
          {filteredItems.map((item, index) => {
            return (
              <div
                key={item.id}
                className="relative group transition-transform duration-200 hover:-translate-x-1"
              >
                {/* Node marker on the vertical timeline */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full bg-white border-4 border-indigo-600 shadow-sm" />

                {/* Card Container */}
                <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-zinc-200/80 hover:border-indigo-300 hover:bg-white shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        {item.timeAgo}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                      {item.subtitle}
                    </p>
                  </div>

                  {item.actionText && (
                    <button
                      onClick={() => handleAction(item)}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-semibold border border-zinc-300 shadow-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                    >
                      <span>{item.actionText}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
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
