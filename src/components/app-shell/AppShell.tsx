"use client";

import React, { useState } from "react";
import { useCampusStore, StudentAppView } from "@/store/useCampusStore";
import CommandPalette from "./CommandPalette";
import StudentModal from "../shared/StudentModal";
import {
  Sparkles,
  LayoutGrid,
  MessageSquare,
  FileText,
  GraduationCap,
  Briefcase,
  Calendar,
  Gauge,
  Bookmark,
  Search,
  Bell,
  Sliders,
  LogOut,
  ChevronRight,
  ExternalLink,
  Flame,
  Check,
  AlertCircle,
  Menu,
  X,
  BookOpen,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const {
    currentView,
    setCurrentView,
    studentUser,
    isNotificationsOpen,
    setIsNotificationsOpen,
    unreadNotificationsCount,
    markNotificationsRead,
    toggleCommandPalette,
    showToast,
  } = useCampusStore();

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems: { id: StudentAppView; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "overview", label: "Overview", icon: <LayoutGrid className="w-4 h-4" /> },
    { id: "copilot", label: "Ask Copilot", icon: <Sparkles className="w-4 h-4 text-indigo-500" />, badge: "AI" },
    { id: "study", label: "Study AI", icon: <BookOpen className="w-4 h-4 text-violet-500" />, badge: "PYQ" },
    { id: "notices", label: "Notices", icon: <FileText className="w-4 h-4" />, badge: "2 New" },
    { id: "exams", label: "Exams", icon: <GraduationCap className="w-4 h-4 text-amber-500" />, badge: "Tomorrow" },
    { id: "placements", label: "Placements", icon: <Briefcase className="w-4 h-4 text-blue-500" /> },
    { id: "events", label: "Events", icon: <Calendar className="w-4 h-4 text-emerald-500" /> },
    { id: "attendance", label: "Attendance", icon: <Gauge className="w-4 h-4 text-purple-500" />, badge: "78.4%" },
    { id: "saved", label: "Saved", icon: <Bookmark className="w-4 h-4 text-zinc-500" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col antialiased">
      {/* Global Command Palette */}
      <CommandPalette />

      {/* Verified Student Modal */}
      <StudentModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      <div className="flex-1 flex overflow-hidden">
        
        {/* =========================================================================
            DESKTOP LEFT SIDEBAR
            ========================================================================= */}
        <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-zinc-200/90 bg-white p-4 select-none shrink-0">
          
          <div className="space-y-6">
            {/* Brand Logo Header */}
            <div className="flex items-center justify-between px-2 pt-1">
              <button
                onClick={() => setCurrentView("overview")}
                className="flex items-center gap-2.5 text-left group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-900 to-violet-700 text-white flex items-center justify-center shadow-md shadow-indigo-950/20 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                </div>
                <div>
                  <h1 className="font-extrabold text-sm text-zinc-900 tracking-tight leading-tight">
                    Campus Copilot
                  </h1>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono tracking-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>RGPV Bhopal OS</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Intelligence Layer
              </div>
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-indigo-950 text-white shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? "text-indigo-300" : "text-zinc-400"}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? "bg-indigo-800 text-indigo-200"
                            : item.badge === "Tomorrow"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar: Profile & View Switcher */}
          <div className="pt-4 border-t border-zinc-100 space-y-2">
            
            {/* Student Profile Summary Pill */}
            <div
              onClick={() => setProfileModalOpen(true)}
              className="p-2.5 rounded-2xl bg-zinc-50/90 border border-zinc-200/80 hover:border-indigo-300 hover:bg-white cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {studentUser.firstName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-900 truncate leading-tight">
                    {studentUser.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono truncate">
                    CGPA {studentUser.cgpa} • 5th Sem
                  </p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            </div>

            {/* Switch to Public Presentation Landing Mode */}
            <button
              onClick={() => {
                setCurrentView("landing");
                showToast("Switched to Public Presentation Landing Page with 3D Hero!");
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-[11px] font-mono text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                <span>Public Landing Page</span>
              </span>
              <span className="text-[9px] uppercase px-1.5 py-0.2 bg-zinc-200/70 rounded">
                Showcase
              </span>
            </button>
          </div>

        </aside>

        {/* =========================================================================
            MAIN CONTENT AREA + TOPBAR
            ========================================================================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* Top Bar Header */}
          <header className="sticky top-0 z-30 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
            
            {/* Left: Global Search Command Trigger Button */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <button
                onClick={toggleCommandPalette}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 text-xs text-zinc-400 shadow-xs transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="truncate">Search campus notices, exams or ask AI...</span>
                </div>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-zinc-500 bg-zinc-100 rounded-md border border-zinc-200">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right: Live RGPV Badge, Semester Indicator, Notifications & Avatar */}
            <div className="flex items-center gap-3">
              
              {/* RGPV Live Scraped Badge */}
              <a
                href="https://www.rgpv.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50/90 border border-emerald-200/90 text-[11px] font-mono font-medium text-emerald-800 hover:bg-emerald-100 transition-colors shadow-xs"
                title="Real-time scraper connected to rgpv.ac.in"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-bold">rgpv.ac.in</span>
                <span className="text-emerald-600 font-semibold">• Live Scraped</span>
              </a>

              {/* Semester / Academic Cohort Indicator */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-zinc-200 text-xs font-mono font-medium text-zinc-600 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                <span>{studentUser.semester}</span>
                <span className="text-zinc-300">•</span>
                <span>{studentUser.department.split(" ")[0]}</span>
              </div>

              {/* Notification Bell with Badge & Popover */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    if (isNotificationsOpen) markNotificationsRead();
                  }}
                  className="relative p-2 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-600 transition-colors shadow-xs"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-mono font-bold flex items-center justify-center ring-2 ring-white">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Drawer */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-zinc-200 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900">Notifications</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          Live Feed
                        </span>
                      </div>
                      <button
                        onClick={markNotificationsRead}
                        className="text-[11px] text-zinc-400 hover:text-zinc-700"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-900 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-rose-600" />
                            <span>Exam Seating Plan</span>
                          </span>
                          <span className="text-[10px] text-rose-600 font-mono">35m ago</span>
                        </div>
                        <p className="text-zinc-700">
                          CS501 DBMS Mid-Sem allocated in Hall 302 Desk 14. Report by 9:15 AM tomorrow.
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-900">TCS Digital Registration</span>
                          <span className="text-[10px] text-zinc-400 font-mono">2h ago</span>
                        </div>
                        <p className="text-zinc-600">
                          Portal registration closes tomorrow at 12:00 PM. Verified resume ready.
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-900">Attendance Calculation</span>
                          <span className="text-[10px] text-zinc-400 font-mono">Today</span>
                        </div>
                        <p className="text-zinc-600">
                          Current attendance is 78.4%. Computer Networks remains at 68.2% warning state.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 text-center">
                      <button
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          setCurrentView("notices");
                        }}
                        className="text-xs text-indigo-700 font-bold hover:underline"
                      >
                        View all campus circulars →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Student Avatar button */}
              <button
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-white border border-zinc-200 hover:border-indigo-300 transition-colors shadow-xs"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-50">
                  {studentUser.firstName.charAt(0)}
                </div>
                <span className="text-xs font-bold text-zinc-800 hidden sm:inline">
                  {studentUser.firstName}
                </span>
              </button>

            </div>
          </header>

          {/* Dynamic Content View */}
          <main className="flex-1 pb-24 lg:pb-12">
            {children}
          </main>

        </div>

      </div>

      {/* =========================================================================
          MOBILE BOTTOM NAVIGATION DOCK
          ========================================================================= */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-zinc-200 px-3 py-2 flex items-center justify-around shadow-xl">
        <button
          onClick={() => {
            setCurrentView("overview");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
            currentView === "overview" ? "text-indigo-600" : "text-zinc-500"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            setCurrentView("copilot");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
            currentView === "copilot" ? "text-indigo-600" : "text-zinc-500"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Copilot</span>
        </button>

        {/* Center Floating Action AI Trigger */}
        <button
          onClick={() => {
            toggleCommandPalette();
          }}
          className="-mt-5 w-12 h-12 rounded-2xl bg-indigo-950 text-white flex items-center justify-center shadow-lg shadow-indigo-950/30 hover:scale-105 active:scale-95 transition-transform"
          aria-label="Quick Command Search"
        >
          <Search className="w-5 h-5 text-indigo-300" />
        </button>

        <button
          onClick={() => {
            setCurrentView("notices");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
            currentView === "notices" ? "text-indigo-600" : "text-zinc-500"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Notices</span>
        </button>

        <button
          onClick={() => {
            setCurrentView("placements");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
            currentView === "placements" ? "text-indigo-600" : "text-zinc-500"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Jobs</span>
        </button>
      </div>

    </div>
  );
}
