"use client";

import React, { useState } from "react";
import { useCampusStore, StudentAppView } from "@/store/useCampusStore";
import AppShell from "@/components/app-shell/AppShell";
import StudentOverview from "@/components/overview/StudentOverview";
import CopilotCommandCenter from "@/components/copilot/CopilotCommandCenter";
import NoticesView from "@/components/views/NoticesView";
import ExamsView from "@/components/views/ExamsView";
import PlacementRadar from "@/components/landing/PlacementRadar";
import CampusPulse from "@/components/landing/CampusPulse";
import BunkOMeter from "@/components/attendance/BunkOMeter";
import SavedView from "@/components/views/SavedView";
import AdminNoticePortal from "@/components/admin/AdminNoticePortal";
import PlacementIntelligencePage from "@/components/placement-engine/PlacementIntelligencePage";
import StudyIntelligenceWorkspace from "@/components/study-intelligence/StudyIntelligenceWorkspace";
import Toast from "@/components/shared/Toast";

// Landing Page Components for Showcase mode
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import NoticeMagic from "@/components/landing/NoticeMagic";
import DeadlineTimeline from "@/components/landing/DeadlineTimeline";
import ConflictDetector from "@/components/landing/ConflictDetector";
import CampusInteractiveMap from "@/components/campus/CampusInteractiveMap";
import Footer from "@/components/landing/Footer";
import { Sparkles, ArrowRight } from "lucide-react";

export default function HomeApp() {
  const { currentView, setCurrentView, studentUser } = useCampusStore();

  // If in Public Presentation Showcase mode:
  if (currentView === "landing") {
    return (
      <div className="min-h-screen flex flex-col bg-[#FBFBFA] selection:bg-indigo-100 selection:text-indigo-950 font-sans pb-16 lg:pb-0">
        
        {/* Switcher Banner to Logged-In Student Experience */}
        <div className="bg-indigo-950 text-white text-xs font-mono py-2 px-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Campus Copilot • Student Operating System Active (Logged in as {studentUser.name})</span>
          </div>
          <button
            onClick={() => setCurrentView("overview")}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-800 hover:bg-indigo-700 text-white font-bold transition-colors"
          >
            <span>Enter Student App Shell</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Public Landing Navbar */}
        <Navbar />

        <main className="flex-1">
          <Hero />
          <HowItWorks />
          <NoticeMagic />
          <CampusPulse />
          <BunkOMeter />
          <DeadlineTimeline />
          <PlacementRadar />
          <ConflictDetector />
          <CampusInteractiveMap />
        </main>

        <Footer />
        <Toast />
      </div>
    );
  }

  // Admin View
  if (currentView === "admin") {
    return (
      <AppShell>
        <AdminNoticePortal />
        <Toast />
      </AppShell>
    );
  }

  // Master Logged-In Student Application Experience
  return (
    <AppShell>
      {currentView === "overview" && <StudentOverview />}
      {currentView === "copilot" && <CopilotCommandCenter />}
      {currentView === "study" && <StudyIntelligenceWorkspace />}
      {currentView === "notices" && <NoticesView />}
      {(currentView === "exams" || currentView === "panic") && <ExamsView />}
      {(currentView === "placements" || currentView === "opportunities") && <PlacementIntelligencePage />}
      {currentView === "events" && <CampusPulse />}
      {(currentView === "attendance" || currentView === "bunk") && <BunkOMeter />}
      {currentView === "deadlines" && <DeadlineTimeline />}
      {currentView === "map" && <CampusInteractiveMap />}
      {currentView === "saved" && <SavedView />}

      <Toast />
    </AppShell>
  );
}
