"use client";

import React, { useState, useEffect } from "react";
import { useCampusStore } from "@/store/useCampusStore";
import { TodayTaskItem, StudentTodayResponse } from "@/types";
import {
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  RefreshCw,
  Calendar,
  Briefcase,
  FileText,
  BookOpen,
  Info,
  ShieldCheck,
  Plus,
  X,
  Bell,
  ExternalLink,
  Check,
} from "lucide-react";

export default function WhatShouldIDoTodayWidget() {
  const { setCurrentView, showToast, studentUser } = useCampusStore();
  const [data, setData] = useState<StudentTodayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  const [dismissedTaskIds, setDismissedTaskIds] = useState<Set<string>>(new Set());
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDueAt, setReminderDueAt] = useState("");
  const [reminderPriority, setReminderPriority] = useState<"critical" | "high" | "medium" | "low">("high");
  const [reminderType, setReminderType] = useState<"reminder" | "checklist" | "form" | "application">("reminder");
  const [reminderCalendarSync, setReminderCalendarSync] = useState(false);
  const [reminderSource, setReminderSource] = useState("");
  const [submittingReminder, setSubmittingReminder] = useState(false);

  const fetchTodayBriefing = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const res = await fetch("http://localhost:5001/api/student/today");
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setData(json.data);
          // Sync any completed tasks
          const completed = new Set<string>();
          for (const t of json.data.tasks || []) {
            if (t.completed) completed.add(t.id);
          }
          setCompletedTaskIds(completed);
        }
      } else {
        // Use client-side fallback if server returned error
        useClientFallback();
      }
    } catch {
      useClientFallback();
    } finally {
      setLoading(false);
      setRefreshing(false);
      if (isManualRefresh) {
        showToast("Refreshed: Today's AI priorities re-synthesized.");
      }
    }
  };

  const handleDismissTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = new Set(dismissedTaskIds);
    updated.add(taskId);
    setDismissedTaskIds(updated);
    showToast("✓ Task dismissed from today's list.");

    try {
      await fetch("http://localhost:5001/api/student/today/task", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, dismissed: true, status: "dismissed" }),
      });
      const cleanId = taskId.replace(/^today-action-/, "");
      await fetch(`http://localhost:5001/api/actions/${cleanId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "dismissed" }),
      });
    } catch {
      // Local state already updated
    }
  };

  const handleCreateReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim()) {
      showToast("Please provide a title for the reminder.");
      return;
    }

    setSubmittingReminder(true);
    try {
      const res = await fetch("http://localhost:5001/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: reminderTitle.trim(),
          due_at: reminderDueAt ? new Date(reminderDueAt).toISOString() : null,
          priority: reminderPriority,
          action_type: reminderType,
          calendar_sync: reminderCalendarSync,
          source: {
            source_name: reminderSource.trim() || "Student Reminder",
          },
        }),
      });

      const json = await res.json();
      if (json.warning) {
        showToast(json.warning);
      } else if (json.alreadyExists) {
        showToast("Reminder already exists for this deadline.");
      } else {
        showToast("✓ Reminder successfully scheduled!");
      }

      if (reminderCalendarSync && json.data?.calendar_url) {
        window.open(json.data.calendar_url, "_blank");
      }

      setIsAddReminderOpen(false);
      setReminderTitle("");
      setReminderDueAt("");
      setReminderPriority("high");
      setReminderType("reminder");
      setReminderCalendarSync(false);
      setReminderSource("");
      fetchTodayBriefing(false);
    } catch {
      showToast("Failed to schedule reminder. Please try again.");
    } finally {
      setSubmittingReminder(false);
    }
  };

  const useClientFallback = () => {
    const fallbackData: StudentTodayResponse = {
      date: "Monday, 5 Oct 2026",
      student: {
        name: studentUser.name || "Harsh Gupta",
        branch: studentUser.department || "CSE",
        semester: studentUser.semester || "5th Semester",
        cgpa: studentUser.cgpa || 7.85,
      },
      summary:
        "TCS Digital drive closes tomorrow (eligible with 7.85 CGPA), Odd Sem Exam form registration deadline is approaching on 11 Oct, and DBMS exam countdown is at 10 days.",
      urgent_count: 3,
      study_minutes: 105,
      ai_reasoning:
        "Prioritized based on nearest hard deadline (11 Oct), verified eligibility for TCS Digital, and high-frequency PYQ topics for upcoming CS-501 examination.",
      tasks: [
        {
          id: "today-placement-tcs-digital",
          title: "Register for TCS Digital Recruitment Drive",
          reason: "Eligible: CSE branch matches with 7.85 CGPA (> 7.5 minimum cutoff) and 0 backlogs. Portal registration closes in 24 hours.",
          priority: "critical",
          estimated_time: "20 mins",
          due_date: "2026-10-06T23:59:00.000Z",
          category: "placement",
          action: {
            type: "application",
            title: "Open TCS Portal",
            target_url: null,
            view: "placements",
            payload: { placementId: "tcs-digital" },
          },
          source: {
            document_id: "doc-tcs-1",
            source_name: "Training & Placement Cell",
            source_url: null,
            file_name: "TCS_Digital_Circular.pdf",
          },
          completed: false,
        },
        {
          id: "today-notice-exam-reg",
          title: "Submit ODD SEMESTER EXAMINATION FORM REGISTRATION 2026-27",
          reason: "Urgent university deadline on 11 October. ₹500 late fee applies thereafter.",
          priority: "critical",
          estimated_time: "15 mins",
          due_date: "2026-10-11T23:59:00.000Z",
          category: "deadline",
          action: {
            type: "form",
            title: "Fill Exam Form",
            target_url: null,
            view: "notices",
            payload: { noticeId: "notice-exam-reg" },
          },
          source: {
            document_id: "doc-exam-1",
            source_name: "Office of Controller of Examinations",
            source_url: "https://www.rgpv.ac.in",
            file_name: "Exam_Circular_419.pdf",
          },
          completed: false,
        },
        {
          id: "today-exam-prep-dbms",
          title: "Database Management Systems (DBMS) Mid-Sem Prep (10 Days Left)",
          reason: "Exam scheduled on 15 October 2026 (Morning Shift). Dedicated high-yield revision recommended.",
          priority: "high",
          estimated_time: "60 mins",
          due_date: "2026-10-15T00:00:00.000Z",
          category: "exam",
          action: {
            type: "calendar",
            title: "Open Exam Workspace",
            target_url: null,
            view: "exams",
            payload: { subject: "Database Management Systems (DBMS)" },
          },
          source: {
            document_id: "doc-tt-5th-sem",
            source_name: "RGPV Odd Semester Examination Date-Sheet 2026",
            source_url: "https://www.rgpv.ac.in/exam/timetable",
            file_name: "BTech_5th_Sem_Timetable.pdf",
          },
          completed: false,
        },
        {
          id: "today-pyq-normalization",
          title: "PYQ High-Yield Drill: BCNF & 3NF Normalization",
          reason: "Appeared in 4 recent RGPV exams (2023, 2024, 2025). Historically accounts for ~14 marks.",
          priority: "high",
          estimated_time: "45 mins",
          due_date: "2026-10-15T00:00:00.000Z",
          category: "study",
          action: {
            type: "study",
            title: "Solve PYQ Questions",
            target_url: null,
            view: "study",
            payload: { topic: "BCNF & 3NF Normalization" },
          },
          source: {
            document_id: "doc-pyq-dbms-2025",
            source_name: "RGPV Previous 3-Year Question Bank",
            source_url: null,
            file_name: "CS501_PYQ_Analysis.json",
          },
          completed: false,
        },
        {
          id: "today-action-attendance",
          title: "Verify DAA Lab Attendance (>75% for Admit Card)",
          reason: "Mandatory RGPV Ordinance No. 4 attendance verification before hall ticket release.",
          priority: "medium",
          estimated_time: "10 mins",
          due_date: "2026-10-10T18:00:00.000Z",
          category: "action",
          action: {
            type: "checklist",
            title: "Check Attendance",
            target_url: null,
            view: "attendance",
            payload: null,
          },
          source: {
            document_id: "doc-ord-4",
            source_name: "RGPV Statutory Ordinance No. 4",
            source_url: null,
            file_name: "Ordinance_4.pdf",
          },
          completed: false,
        },
      ],
    };
    setData(fallbackData);
  };

  useEffect(() => {
    fetchTodayBriefing();
  }, []);

  const toggleTaskCompletion = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowCompleted = !completedTaskIds.has(taskId);

    const updated = new Set(completedTaskIds);
    if (isNowCompleted) {
      updated.add(taskId);
      showToast("✓ Task marked as completed.");
    } else {
      updated.delete(taskId);
    }
    setCompletedTaskIds(updated);

    try {
      await fetch("http://localhost:5001/api/student/today/task", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, completed: isNowCompleted }),
      });
    } catch {
      // local state already updated
    }
  };

  const handleActionClick = (task: TodayTaskItem) => {
    if (task.action.view) {
      setCurrentView(task.action.view as any);
    } else {
      showToast(`Action Triggered: ${task.action.title}`);
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "critical":
        return {
          cardBg: "bg-rose-50/60 hover:bg-rose-50/90 border-rose-200/90",
          badgeBg: "bg-rose-100 text-rose-800 border-rose-200",
          iconColor: "text-rose-600",
          label: "CRITICAL",
        };
      case "high":
        return {
          cardBg: "bg-amber-50/60 hover:bg-amber-50/90 border-amber-200/90",
          badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
          iconColor: "text-amber-600",
          label: "HIGH PRIORITY",
        };
      case "medium":
        return {
          cardBg: "bg-indigo-50/40 hover:bg-indigo-50/70 border-indigo-200/70",
          badgeBg: "bg-indigo-100 text-indigo-800 border-indigo-200",
          iconColor: "text-indigo-600",
          label: "SCHEDULED",
        };
      default:
        return {
          cardBg: "bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200",
          badgeBg: "bg-zinc-100 text-zinc-700 border-zinc-200",
          iconColor: "text-zinc-500",
          label: "ROUTINE",
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "placement":
        return <Briefcase className="w-3.5 h-3.5 text-emerald-600" />;
      case "exam":
        return <Calendar className="w-3.5 h-3.5 text-rose-600" />;
      case "study":
        return <BookOpen className="w-3.5 h-3.5 text-indigo-600" />;
      case "deadline":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-zinc-600" />;
    }
  };

  const allTasks = data?.tasks || [];
  const tasks = allTasks.filter((t) => !dismissedTaskIds.has(t.id));
  const pendingTasks = tasks.filter((t) => !completedTaskIds.has(t.id));
  const completedCount = tasks.filter((t) => completedTaskIds.has(t.id)).length;

  return (
    <div className="space-y-4">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-950 text-indigo-300 flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-zinc-950 tracking-tight">
                What Should I Do Today?
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                AI Briefing
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-medium">
              Synthesized from RGPV circulars, timetable, PYQs &amp; placement eligibility
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddReminderOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Reminder</span>
          </button>

          <button
            onClick={() => fetchTodayBriefing(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-zinc-500 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "Synthesizing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* AI Synthesis Summary Card */}
      {data?.summary && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950 via-zinc-900 to-indigo-900 text-white shadow-md space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-300 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Campus Operating Briefing • {data.date}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                {data.urgent_count} Urgent
              </span>
              {data.study_minutes > 0 && (
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                  ~{data.study_minutes}m Study
                </span>
              )}
            </div>
          </div>
          <p className="text-sm font-medium text-zinc-100 leading-relaxed">
            {data.summary}
          </p>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-zinc-400 font-mono text-xs">
            Synthesizing campus priorities...
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-zinc-200 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-sm text-zinc-800">You are completely caught up!</h4>
            <p className="text-xs text-zinc-500">No urgent deadlines, pending forms, or overdue tasks detected.</p>
          </div>
        ) : (
          tasks.map((task) => {
            const isCompleted = completedTaskIds.has(task.id);
            const style = getPriorityStyle(task.priority);

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? "bg-zinc-50/80 border-zinc-200 opacity-60"
                    : `${style.cardBg} shadow-xs`
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Interactive Completion Toggle */}
                  <button
                    onClick={(e) => toggleTaskCompletion(task.id, e)}
                    className="mt-0.5 text-zinc-400 hover:text-emerald-600 transition-colors shrink-0"
                    title={isCompleted ? "Mark pending" : "Mark completed"}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-300 hover:text-zinc-500" />
                    )}
                  </button>

                  <div className="flex-1 space-y-2">
                    {/* Priority & Category Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-md border ${style.badgeBg}`}
                      >
                        {style.label}
                      </span>

                      <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-500 bg-white/80 border border-zinc-200/60 px-2 py-0.5 rounded-md">
                        {getCategoryIcon(task.category)}
                        <span className="capitalize">{task.category}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-500">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>{task.estimated_time}</span>
                      </div>

                      {task.due_date && (
                        <div className="flex items-center gap-1 text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                          <span>Due: {new Date(task.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h4
                      className={`font-bold text-sm sm:text-base text-zinc-950 leading-snug ${
                        isCompleted ? "line-through text-zinc-400" : ""
                      }`}
                    >
                      {task.title}
                    </h4>

                    {/* Qualitative AI Reason */}
                    <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                      <span className="font-semibold text-zinc-700">Why today: </span>
                      {task.reason}
                    </p>

                    {/* Source Metadata & Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-200/50">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                        <FileText className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="truncate max-w-[240px]">
                          {task.source.source_name || task.source.file_name || "Campus Verification"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                        {/* Google Calendar Link if present */}
                        {task.action.payload?.calendarUrl && (
                          <a
                            href={task.action.payload.calendarUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                            title="Add to Google Calendar"
                          >
                            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Add to Calendar</span>
                            <ExternalLink className="w-3 h-3 text-zinc-400" />
                          </a>
                        )}

                        {/* Mark Done / Pending Button */}
                        <button
                          onClick={(e) => toggleTaskCompletion(task.id, e)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs ${
                            isCompleted
                              ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isCompleted ? "Mark Pending" : "Mark Done"}</span>
                        </button>

                        {/* Dismiss Button */}
                        <button
                          onClick={(e) => handleDismissTask(task.id, e)}
                          className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-zinc-200 hover:border-rose-200 text-zinc-600 hover:text-rose-700 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                          title="Dismiss from today's list"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Dismiss</span>
                        </button>

                        {/* Primary View / Launch Action */}
                        <button
                          onClick={() => handleActionClick(task)}
                          className="px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                        >
                          <span>{task.action.title}</span>
                          <ArrowRight className="w-3 h-3 text-zinc-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {completedCount > 0 && (
        <div className="text-right text-xs font-mono text-zinc-400 pr-1">
          {completedCount} of {tasks.length} tasks completed today
        </div>
      )}

      {/* Add Reminder / Deadline Action Modal */}
      {isAddReminderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-2xl max-w-lg w-full p-6 space-y-5 text-left">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-950">Add Reminder or Deadline</h3>
                  <p className="text-xs text-zinc-500 font-mono">Create an actionable academic or campus item</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddReminderOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReminderSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-800 mb-1">
                  Action Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Submit Mid-Term Minor Project Report"
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Due Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    value={reminderDueAt}
                    onChange={(e) => setReminderDueAt(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Priority</label>
                  <select
                    value={reminderPriority}
                    onChange={(e) => setReminderPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                  >
                    <option value="critical">Critical (&le; 2 days / urgent)</option>
                    <option value="high">High (This week)</option>
                    <option value="medium">Medium (Routine)</option>
                    <option value="low">Low (Flexible)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Action Type</label>
                  <select
                    value={reminderType}
                    onChange={(e) => setReminderType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-white"
                  >
                    <option value="reminder">Reminder Notification</option>
                    <option value="checklist">Checklist Item</option>
                    <option value="form">Form / Portal Submission</option>
                    <option value="application">Application / Placement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-zinc-800 mb-1">Source / Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. HOD Notice, Faculty Advisory"
                    value={reminderSource}
                    onChange={(e) => setReminderSource(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Google Calendar Sync Option */}
              <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-indigo-700" />
                  <div>
                    <p className="font-bold text-indigo-950">Add to Google Calendar</p>
                    <p className="text-[11px] text-indigo-700">Generates instant calendar invite link</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={reminderCalendarSync}
                  onChange={(e) => setReminderCalendarSync(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddReminderOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-600 hover:bg-zinc-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReminder}
                  className="px-5 py-2.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white font-bold shadow-md shadow-indigo-950/20 disabled:opacity-50"
                >
                  {submittingReminder ? "Scheduling..." : "Create Reminder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
