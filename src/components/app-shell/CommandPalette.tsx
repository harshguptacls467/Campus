"use client";

import React, { useState, useEffect } from "react";
import { useCampusStore, StudentAppView } from "@/store/useCampusStore";
import {
  Search,
  Sparkles,
  Flame,
  Gauge,
  Briefcase,
  FileText,
  Calendar,
  Compass,
  ArrowRight,
  X,
  Bookmark,
  BookOpen,
} from "lucide-react";

export default function CommandPalette() {
  const {
    isCommandOpen,
    setIsCommandOpen,
    setCurrentView,
    submitPrompt,
    showToast,
  } = useCampusStore();

  const [query, setQuery] = useState("");

  // Keyboard shortcut listener for Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen(!isCommandOpen);
      } else if (e.key === "Escape" && isCommandOpen) {
        setIsCommandOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandOpen, setIsCommandOpen]);

  if (!isCommandOpen) return null;

  const quickActions: {
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    action: () => void;
    category: "AI Query" | "Navigation" | "Emergency";
  }[] = [
    {
      label: "Ask Copilot: Am I eligible for today's placement?",
      sublabel: "Check TCS Digital cutoffs & skill gap",
      icon: <Briefcase className="w-4 h-4 text-indigo-500" />,
      category: "AI Query",
      action: () => {
        submitPrompt("Am I eligible for today's placement?");
        setCurrentView("copilot");
        setIsCommandOpen(false);
      },
    },
    {
      label: "Open Study Intelligence: PYQ & Syllabus AI",
      sublabel: "Day-wise study plan, PYQ frequency analysis & units progress",
      icon: <BookOpen className="w-4 h-4 text-violet-500" />,
      category: "Navigation",
      action: () => {
        setCurrentView("study");
        setIsCommandOpen(false);
      },
    },
    {
      label: "Launch DBMS Panic Mode",
      sublabel: "180-minute high-yield syllabus sprint for tomorrow's exam",
      icon: <Flame className="w-4 h-4 text-rose-500" />,
      category: "Emergency",
      action: () => {
        setCurrentView("exams");
        setIsCommandOpen(false);
      },
    },
    {
      label: "Simulate Bunk-o-Meter Attendance",
      sublabel: "Test missing tomorrow's Computer Networks lab",
      icon: <Gauge className="w-4 h-4 text-purple-500" />,
      category: "AI Query",
      action: () => {
        setCurrentView("attendance");
        setIsCommandOpen(false);
      },
    },
    {
      label: "Go to Examination Form Notice",
      sublabel: "Deadline 11 Oct • Avoid ₹500 late fee",
      icon: <FileText className="w-4 h-4 text-emerald-500" />,
      category: "Navigation",
      action: () => {
        setCurrentView("notices");
        setIsCommandOpen(false);
      },
    },
    {
      label: "View Opportunity Radar",
      sublabel: "Personalized placement drives (TCS 92%, Zomato 95%)",
      icon: <Briefcase className="w-4 h-4 text-blue-500" />,
      category: "Navigation",
      action: () => {
        setCurrentView("placements");
        setIsCommandOpen(false);
      },
    },
    {
      label: "Open Saved Items & Cheatsheets",
      sublabel: "Bookmarked circulars and 2-page DBMS formula sheet",
      icon: <Bookmark className="w-4 h-4 text-amber-500" />,
      category: "Navigation",
      action: () => {
        setCurrentView("saved");
        setIsCommandOpen(false);
      },
    },
  ];

  const filtered = quickActions.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.sublabel.toLowerCase().includes(query.toLowerCase())
  );

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    submitPrompt(query);
    setCurrentView("copilot");
    setIsCommandOpen(false);
    setQuery("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-2xl w-full overflow-hidden">
        
        {/* Search Input Box */}
        <form onSubmit={handleCustomSearch} className="flex items-center gap-3 p-4 border-b border-zinc-200">
          <Search className="w-5 h-5 text-zinc-400 pl-1" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a campus query, command, or jump to section..."
            className="w-full bg-transparent text-sm sm:text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          {query ? (
            <button
              type="submit"
              className="px-3 py-1 rounded-xl bg-indigo-950 text-white text-xs font-semibold shrink-0"
            >
              Ask AI
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 rounded-md border border-zinc-200">
              ESC
            </kbd>
          )}
        </form>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={item.action}
                className="w-full text-left p-3 rounded-2xl hover:bg-zinc-100/80 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0 group-hover:bg-white">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-zinc-900">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-zinc-500 font-normal">
                      {item.sublabel}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-700 transition-colors" />
              </button>
            ))
          ) : (
            <div className="p-8 text-center space-y-2">
              <Sparkles className="w-6 h-6 text-indigo-400 mx-auto" />
              <p className="text-xs font-medium text-zinc-700">
                Ask Campus Copilot: &ldquo;{query}&rdquo;
              </p>
              <button
                onClick={() => {
                  submitPrompt(query);
                  setCurrentView("copilot");
                  setIsCommandOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-950 text-white text-xs font-semibold shadow-sm"
              >
                Send to Copilot
              </button>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-[#FAF9F6] border-t border-zinc-100 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span>Search notices, exams, placements &amp; timetable</span>
          <span>Press ↵ to select • ESC to close</span>
        </div>

      </div>
    </div>
  );
}
