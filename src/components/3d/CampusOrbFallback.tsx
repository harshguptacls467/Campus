"use client";

import React from "react";
import { Sparkles, Calendar, Briefcase, GraduationCap, Clock } from "lucide-react";

export default function CampusOrbFallback() {
  return (
    <div className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] flex items-center justify-center select-none">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-transparent rounded-full filter blur-3xl pointer-events-none" />

      {/* SVG Network diagram with animated pulse */}
      <svg className="w-full h-full max-w-[420px] max-h-[420px]" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="160" fill="none" stroke="#E0E7FF" strokeWidth="1" strokeDasharray="4 4" className="animate-spin" style={{ animationDuration: "60s" }} />
        <circle cx="200" cy="200" r="100" fill="none" stroke="#EEF2FF" strokeWidth="1" />
        
        {/* Rays */}
        <line x1="200" y1="200" x2="110" y2="90" stroke="#C7D2FE" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="200" y1="200" x2="310" y2="120" stroke="#C7D2FE" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="200" y1="200" x2="290" y2="300" stroke="#C7D2FE" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="200" y1="200" x2="100" y2="290" stroke="#C7D2FE" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="200" y1="200" x2="200" y2="60" stroke="#C7D2FE" strokeWidth="1.5" strokeDasharray="2 2" />

        {/* Central Core */}
        <circle cx="200" cy="200" r="28" fill="#1E1B4B" />
        <circle cx="200" cy="200" r="14" fill="#6366F1" className="animate-pulse" />
      </svg>

      {/* Overlaid interactive HTML cards */}
      <div className="absolute top-[18%] left-[12%] bg-white/95 border border-zinc-200/90 shadow-md rounded-xl p-2.5 flex items-center gap-2 text-xs">
        <span className="p-1 rounded-md bg-amber-50 text-amber-600"><GraduationCap className="w-3.5 h-3.5" /></span>
        <div>
          <p className="font-semibold text-zinc-800">Exams</p>
          <p className="text-[10px] text-zinc-500">DBMS Tomorrow • 9:30 AM</p>
        </div>
      </div>

      <div className="absolute top-[22%] right-[10%] bg-white/95 border border-zinc-200/90 shadow-md rounded-xl p-2.5 flex items-center gap-2 text-xs">
        <span className="p-1 rounded-md bg-indigo-50 text-indigo-600"><Briefcase className="w-3.5 h-3.5" /></span>
        <div>
          <p className="font-semibold text-zinc-800">Placement</p>
          <p className="text-[10px] text-zinc-500">TCS Drive: 92% Match</p>
        </div>
      </div>

      <div className="absolute bottom-[18%] right-[14%] bg-white/95 border border-zinc-200/90 shadow-md rounded-xl p-2.5 flex items-center gap-2 text-xs">
        <span className="p-1 rounded-md bg-emerald-50 text-emerald-600"><Calendar className="w-3.5 h-3.5" /></span>
        <div>
          <p className="font-semibold text-zinc-800">Events</p>
          <p className="text-[10px] text-zinc-500">Smart Campus Hackathon</p>
        </div>
      </div>

      <div className="absolute bottom-[20%] left-[10%] bg-white/95 border border-zinc-200/90 shadow-md rounded-xl p-2.5 flex items-center gap-2 text-xs">
        <span className="p-1 rounded-md bg-rose-50 text-rose-600"><Clock className="w-3.5 h-3.5" /></span>
        <div>
          <p className="font-semibold text-zinc-800">Deadlines</p>
          <p className="text-[10px] text-zinc-500">Form Fill 10 Oct (₹0 fine)</p>
        </div>
      </div>

      <div className="absolute top-[8%] left-1/2 -translate-x-1/2 bg-indigo-900 text-indigo-100 text-[11px] font-medium px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-indigo-300" />
        <span>CAMPUS INTELLIGENCE LAYER</span>
      </div>
    </div>
  );
}
