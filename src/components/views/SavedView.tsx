"use client";

import React from "react";
import { useCampusStore } from "@/store/useCampusStore";
import { STUDENT_NOTICES } from "@/lib/mock/notices";
import { STUDENT_OPPORTUNITIES } from "@/lib/mock/placements";
import {
  Bookmark,
  Sparkles,
  FileText,
  Briefcase,
  Trash2,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

export default function SavedView() {
  const { savedItemIds, toggleSaveItem, setCurrentView, showToast } = useCampusStore();

  const savedNotices = STUDENT_NOTICES.filter((n) => savedItemIds.includes(n.id));
  const savedOpportunities = STUDENT_OPPORTUNITIES.filter((o) => savedItemIds.includes(o.id));
  const hasSavedItems = savedNotices.length > 0 || savedOpportunities.length > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-zinc-200">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-mono font-bold mb-2">
          <Bookmark className="w-3.5 h-3.5" />
          <span>STUDENT OFFLINE VAULT</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight">
          Saved Items &amp; Bookmarks
        </h1>
        <p className="text-zinc-600 text-sm mt-1">
          Pinned circulars, placement criteria, and offline study cheatsheets for fast review.
        </p>
      </div>

      {hasSavedItems ? (
        <div className="space-y-6">
          {/* Saved Notices */}
          {savedNotices.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Saved Circulars ({savedNotices.length})
              </h3>
              <div className="space-y-3">
                {savedNotices.map((n) => (
                  <div
                    key={n.id}
                    className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                          {n.officialRef}
                        </span>
                        <span className="text-xs font-bold text-rose-600">Deadline: {n.deadline}</span>
                      </div>
                      <h4 className="font-bold text-base text-zinc-950">{n.title}</h4>
                      <p className="text-xs text-zinc-500 font-medium mt-0.5">{n.targetAudience} • {n.lateFee}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          toggleSaveItem(n.id);
                          showToast("Removed from saved.");
                        }}
                        className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => showToast(`Opened ${n.title}`)}
                        className="px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-semibold"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Placements */}
          {savedOpportunities.length > 0 && (
            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Pinned Opportunities ({savedOpportunities.length})
              </h3>
              <div className="space-y-3">
                {savedOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-5 rounded-3xl bg-white border border-zinc-200/90 shadow-xs flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-indigo-900">{opp.matchScore}% Match</span>
                        <span className="text-xs text-zinc-400 font-mono">• Deadline: {opp.deadline}</span>
                      </div>
                      <h4 className="font-bold text-base text-zinc-950">{opp.company}</h4>
                      <p className="text-xs text-zinc-500 font-medium mt-0.5">{opp.role} • {opp.package}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          toggleSaveItem(opp.id);
                          showToast("Removed from saved.");
                        }}
                        className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => showToast(`Applying for ${opp.company}...`)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-950 text-white text-xs font-semibold"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Section 17: Intelligent Empty State */
        <div className="p-12 text-center rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-950">
              Your campus is unusually quiet.
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              No saved circulars, pinned deadlines, or pending actions right now.
            </p>
          </div>
          <button
            onClick={() => setCurrentView("copilot")}
            className="px-4 py-2.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <span>Ask Copilot what you can work on</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
