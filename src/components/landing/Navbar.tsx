"use client";

import React, { useState, useEffect } from "react";
import { useCampusStore, NavView } from "@/store/useCampusStore";
import {
  Sparkles,
  Flame,
  Gauge,
  Briefcase,
  Compass,
  ShieldCheck,
  Menu,
  X,
  UserCheck,
  BellRing,
} from "lucide-react";

export default function Navbar() {
  const { currentView, setCurrentView, student, showToast } = useCampusStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: { label: string; view: NavView; icon: React.ReactNode; badge?: string }[] = [
    { label: "Copilot", view: "copilot", icon: <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> },
    { label: "Notice Magic", view: "landing", icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> },
    { label: "Bunk-o-Meter", view: "bunk", icon: <Gauge className="w-3.5 h-3.5 text-purple-500" />, badge: "77.4%" },
    { label: "Panic Mode", view: "panic", icon: <Flame className="w-3.5 h-3.5 text-rose-500" />, badge: "DBMS" },
    { label: "Opportunities", view: "opportunities", icon: <Briefcase className="w-3.5 h-3.5 text-blue-500" /> },
    { label: "Campus Map", view: "map", icon: <Compass className="w-3.5 h-3.5 text-zinc-500" /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF9F6]/85 backdrop-blur-md border-b border-zinc-200/80 shadow-sm py-2.5"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => {
              setCurrentView("landing");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-900/10 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-4 h-4 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-zinc-900 group-hover:text-indigo-950 transition-colors">
                  Campus Copilot
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono tracking-tight -mt-0.5 hidden sm:block">
                One Campus. One Intelligence.
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-md px-2 py-1.5 rounded-full border border-zinc-200/70 shadow-sm">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    setCurrentView(item.view);
                    if (item.view === "landing") {
                      window.scrollTo({ top: 700, behavior: "smooth" });
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? "bg-zinc-700 text-zinc-200"
                          : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Switcher */}
            <button
              onClick={() => setCurrentView(currentView === "admin" ? "landing" : "admin")}
              className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all flex items-center gap-1.5 ${
                currentView === "admin"
                  ? "bg-indigo-950 text-white border-indigo-900 shadow-sm"
                  : "bg-white/80 text-zinc-600 border-zinc-200/80 hover:bg-zinc-100"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Admin Mode</span>
            </button>

            {/* Student Profile Pill */}
            <button
              onClick={() => {
                showToast(`Active Student: ${student.name} • ${student.semester} ${student.branch} • CGPA ${student.cgpa}`);
              }}
              title="Click to view student profile"
              className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-zinc-200/90 shadow-sm hover:border-indigo-300 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-indigo-50">
                {student.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-semibold text-zinc-800 leading-tight">
                  {student.name.split(" ")[0]}
                </p>
                <p className="text-[10px] text-zinc-400 font-mono leading-none">
                  CSE 5th Sem
                </p>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => {
                setCurrentView("copilot");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-semibold shadow-sm hover:shadow transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-300 group-hover:rotate-12 transition-transform" />
              <span>Ask Copilot</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-3 bg-white/95 backdrop-blur-xl border border-zinc-200 rounded-2xl shadow-xl space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setCurrentView(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                  currentView === item.view
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between px-2">
              <span className="text-xs text-zinc-500 font-mono">Logged in as {student.name}</span>
              <button
                onClick={() => {
                  setCurrentView("admin");
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-indigo-600 font-medium"
              >
                Admin Panel →
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
