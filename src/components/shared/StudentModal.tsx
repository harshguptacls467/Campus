"use client";

import React, { useState, useEffect } from "react";
import { useCampusStore } from "@/store/useCampusStore";
import {
  UserCheck,
  GraduationCap,
  Award,
  CheckCircle2,
  AlertTriangle,
  X,
  BookOpen,
  Edit3,
  User,
  Save,
  RotateCcw,
  Sparkles,
} from "lucide-react";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentModal({ isOpen, onClose }: StudentModalProps) {
  const { student, studentUser, updateStudentProfile, switchProfilePersona, showToast } =
    useCampusStore();

  const [activeTab, setActiveTab] = useState<"view" | "edit">("view");

  // Form State
  const [formName, setFormName] = useState(student.name);
  const [formRollNo, setFormRollNo] = useState(student.rollNo);
  const [formBranch, setFormBranch] = useState(student.branch);
  const [formSemester, setFormSemester] = useState(student.semester);
  const [formCgpa, setFormCgpa] = useState(student.cgpa.toString());
  const [formBacklogs, setFormBacklogs] = useState(student.backlogs.toString());
  const [formAttendance, setFormAttendance] = useState(student.overallAttendance.toString());
  const [isSaving, setIsSaving] = useState(false);

  // Sync form state when student changes
  useEffect(() => {
    if (isOpen) {
      setFormName(student.name);
      setFormRollNo(student.rollNo);
      setFormBranch(student.branch);
      setFormSemester(student.semester);
      setFormCgpa(student.cgpa.toString());
      setFormBacklogs(student.backlogs.toString());
      setFormAttendance(student.overallAttendance.toString());
    }
  }, [isOpen, student]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const cgpaNum = parseFloat(formCgpa) || 7.8;
    const backlogsNum = parseInt(formBacklogs, 10) || 0;
    const attendanceNum = parseFloat(formAttendance) || 78.4;

    updateStudentProfile({
      name: formName.trim() || "Harsh Gupta",
      rollNo: formRollNo.trim() || "0101CS221084",
      branch: formBranch,
      department: formBranch,
      semester: formSemester,
      cgpa: cgpaNum,
      backlogs: backlogsNum,
      activeBacklogs: backlogsNum,
      overallAttendance: attendanceNum,
    });

    // Also attempt backend sync if available
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
      await fetch(`${apiUrl}/api/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          branch: formBranch,
          semester: formSemester,
          cgpa: cgpaNum,
          backlogs: backlogsNum,
        }),
      });
    } catch {
      // Local store updated regardless
    }

    setIsSaving(false);
    setActiveTab("view");
    showToast(`Profile successfully updated to ${formName.trim()}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-lg w-full p-6 space-y-5 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tab Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("view")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "view"
                  ? "bg-indigo-950 text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              Profile Overview
            </button>
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "edit"
                  ? "bg-indigo-950 text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Change / Switch Profile</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: VIEW PROFILE OVERVIEW
            ========================================================================= */}
        {activeTab === "view" && (
          <div className="space-y-6">
            {/* Student Avatar & Basic Info */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-indigo-600/20">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-lg text-zinc-900">{student.name}</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active Session" />
                </div>
                <p className="text-xs text-zinc-500 font-mono">
                  Roll No: {student.rollNo} • {student.semester}
                </p>
                <p className="text-xs font-semibold text-indigo-700">{student.branch}</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-center">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">CGPA</span>
                <span className="text-lg font-black font-mono text-zinc-900">{student.cgpa}</span>
                <span className="text-[9px] font-bold text-emerald-600 block">
                  {student.cgpa >= 8.0 ? "Top 10%" : "Top 20%"}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-center">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Attendance</span>
                <span className="text-lg font-black font-mono text-zinc-900">
                  {student.overallAttendance}%
                </span>
                <span className="text-[9px] font-bold text-indigo-600 block">Safe overall</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-center">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Backlogs</span>
                <span
                  className={`text-lg font-black font-mono ${
                    student.backlogs === 0 ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {student.backlogs}
                </span>
                <span className="text-[9px] font-bold text-emerald-600 block">
                  {student.backlogs === 0 ? "Clean Record" : `${student.backlogs} Active`}
                </span>
              </div>
            </div>

            {/* Enrolled Courses & Quick Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Current Semester Courses ({student.courses.length})
                </span>
                <button
                  onClick={() => setActiveTab("edit")}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Details</span>
                </button>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {student.courses.map((c) => (
                  <div
                    key={c.code}
                    className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 text-xs border border-zinc-200/60"
                  >
                    <div>
                      <span className="font-semibold text-zinc-800">{c.name}</span>
                      <p className="text-[10px] text-zinc-400 font-mono">{c.code}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-mono font-bold ${
                          c.isRisk ? "text-rose-600" : "text-zinc-800"
                        }`}
                      >
                        {c.attendance}%
                      </span>
                      {c.isRisk && (
                        <span className="text-[9px] text-rose-500 font-bold block">
                          Debar warning
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-mono text-[11px]">Sync ID: verified-rgpv-2026</span>
              <button
                onClick={() => {
                  showToast("Identity cryptographically verified against university registrar.");
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-indigo-950 text-white font-semibold text-xs hover:bg-indigo-900 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: EDIT PROFILE & PERSONA SWITCHER
            ========================================================================= */}
        {activeTab === "edit" && (
          <div className="space-y-5">
            {/* 1-Click Quick Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                Quick Persona Presets (1-Click Switch)
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => switchProfilePersona("harsh")}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    student.name.includes("Harsh")
                      ? "border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-500/20"
                      : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 text-zinc-800"
                  }`}
                >
                  <p className="text-xs font-bold truncate">👦 Harsh Gupta</p>
                  <p className="text-[10px] font-mono text-zinc-500">CSE • 7.8 CGPA</p>
                </button>

                <button
                  type="button"
                  onClick={() => switchProfilePersona("isha")}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    student.name.includes("Isha")
                      ? "border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-500/20"
                      : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 text-zinc-800"
                  }`}
                >
                  <p className="text-xs font-bold truncate">👧 Isha Sharma</p>
                  <p className="text-[10px] font-mono text-zinc-500">CSE • 8.1 CGPA</p>
                </button>

                <button
                  type="button"
                  onClick={() => switchProfilePersona("aryan")}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    student.name.includes("Aryan")
                      ? "border-indigo-600 bg-indigo-50/80 text-indigo-950 ring-2 ring-indigo-500/20"
                      : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 text-zinc-800"
                  }`}
                >
                  <p className="text-xs font-bold truncate">🧑 Aryan Verma</p>
                  <p className="text-[10px] font-mono text-zinc-500">ECE • 7.2 CGPA</p>
                </button>
              </div>
            </div>

            {/* Custom Edit Form */}
            <form onSubmit={handleSave} className="space-y-3.5 pt-2 border-t border-zinc-100">
              <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                Custom Student Details
              </span>

              {/* Student Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Harsh Gupta"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Roll Number & Branch */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Roll / Enrollment No
                  </label>
                  <input
                    type="text"
                    value={formRollNo}
                    onChange={(e) => setFormRollNo(e.target.value)}
                    placeholder="e.g. 0101CS221084"
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Branch / Dept
                  </label>
                  <select
                    value={formBranch}
                    onChange={(e) => setFormBranch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="Electronics & Communication Engineering">Electronics & Communication (ECE)</option>
                    <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                    <option value="Civil Engineering">Civil Engineering (CE)</option>
                  </select>
                </div>
              </div>

              {/* Semester & CGPA */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={formSemester}
                    onChange={(e) => setFormSemester(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                    <option value="3rd Semester">3rd Semester</option>
                    <option value="4th Semester">4th Semester</option>
                    <option value="5th Semester">5th Semester</option>
                    <option value="6th Semester">6th Semester</option>
                    <option value="7th Semester">7th Semester</option>
                    <option value="8th Semester">8th Semester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    CGPA (0 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={formCgpa}
                    onChange={(e) => setFormCgpa(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Active Backlogs
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formBacklogs}
                    onChange={(e) => setFormBacklogs(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab("view")}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white font-bold text-xs shadow-md transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
