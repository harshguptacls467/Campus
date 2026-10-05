"use client";

import React, { useState } from "react";
import { CAMPUS_BUILDINGS, CampusBuilding } from "@/data/mockCampusData";
import { useCampusStore } from "@/store/useCampusStore";
import {
  Compass,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  BookOpen,
  Briefcase,
  Coffee,
  Users,
} from "lucide-react";

export default function CampusInteractiveMap() {
  const { setCurrentView, showToast } = useCampusStore();
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("bldg-cs");

  const selectedBuilding =
    CAMPUS_BUILDINGS.find((b) => b.id === selectedBuildingId) || CAMPUS_BUILDINGS[0];

  return (
    <section id="campus-map" className="py-16 sm:py-24 bg-white border-t border-zinc-200/80 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-mono font-bold mb-3">
            <Compass className="w-3.5 h-3.5 text-zinc-600" />
            <span>INTERACTIVE CAMPUS LOCATOR</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            Campus Ecosystem Map
          </h2>
          <p className="text-zinc-600 text-base sm:text-lg mt-3">
            Live occupancy, exam halls, recruiting suites, and quiet study zones mapped across campus facilities.
          </p>
        </div>

        {/* Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Visual Map Schematic with Interactive Pins */}
          <div className="lg:col-span-7 rounded-3xl bg-[#FAF9F6] border-2 border-zinc-200/90 p-6 relative min-h-[420px] flex items-center justify-center overflow-hidden shadow-inner">
            
            {/* Campus Schematic Grid Background */}
            <div className="absolute inset-0 bg-campus-grid opacity-60" />

            {/* Connecting Pathways between buildings */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 30 35 L 55 48 L 75 28 M 55 48 L 22 68 M 55 48 L 68 72"
                stroke="#E4E4E7"
                strokeWidth="1.2"
                strokeDasharray="2 2"
                fill="none"
              />
            </svg>

            {/* Interactive Building Pins */}
            {CAMPUS_BUILDINGS.map((b) => {
              const isSelected = selectedBuildingId === b.id;
              return (
                <div
                  key={b.id}
                  style={{ left: `${b.coords.x}%`, top: `${b.coords.y}%` }}
                  onClick={() => setSelectedBuildingId(b.id)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all z-20`}
                >
                  {/* Glowing halo when selected */}
                  {isSelected && (
                    <div className="absolute -inset-3 rounded-full bg-indigo-500/20 animate-ping" />
                  )}

                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-md transition-all ${
                      isSelected
                        ? "bg-indigo-950 text-white border-indigo-900 scale-110"
                        : "bg-white text-zinc-800 border-zinc-300 hover:border-indigo-400 hover:scale-105"
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-300" : "text-indigo-600"}`} />
                    <span className="text-xs font-bold whitespace-nowrap">{b.code}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>

                  {/* Micro Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-zinc-900 text-white text-[10px] font-mono whitespace-nowrap pointer-events-none z-30 shadow-md">
                    {b.name} ({b.activeEventsCount} events)
                  </div>
                </div>
              );
            })}

            {/* Bottom Map Legend */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-zinc-500 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-200">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Real-time Active Nodes</span>
              </span>
              <span>Click any node to inspect</span>
            </div>

          </div>

          {/* RIGHT: Detailed Information Panel for Selected Building */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-[#FAF9F6] border border-zinc-200 shadow-md space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedBuilding.category}
                </span>
                <span className="text-xs font-mono text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {selectedBuilding.openStatus}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-zinc-950">
                  {selectedBuilding.name}
                </h3>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">
                  Designation: {selectedBuilding.code} • {selectedBuilding.activeEventsCount} Active Happenings
                </p>
              </div>

              {/* Highlight Note */}
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 space-y-1">
                <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Live Copilot Intelligence
                </p>
                <p className="text-xs text-zinc-700 leading-relaxed font-medium">
                  {selectedBuilding.highlight}
                </p>
              </div>

              {/* Facility Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 font-mono block">Wi-Fi Quality</span>
                  <span className="font-bold text-zinc-900">Campus-Fast (520 Mbps)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 font-mono block">Occupancy</span>
                  <span className="font-bold text-emerald-700">Moderate (42% Full)</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    showToast(`Navigating to ${selectedBuilding.name}. Added location pin to Copilot.`);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Navigate to {selectedBuilding.code}</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
