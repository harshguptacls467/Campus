import { GoogleGenAI } from "@google/genai";
import { config } from "../config";
import { inMemoryDb, supabase, DEFAULT_USER_ID } from "../db/supabase";
import {
  Profile,
  TodayTaskItem,
  StudentTodayResponse,
  NoticeRecord,
  RgpvNoticeRecord,
  PlacementRecord,
  ActionRecord,
  StudyMaterialRecord,
  TimetableData,
  PyqData,
} from "../types";
import {
  StudentTodayResponseSchema,
  TodayTaskItemSchema,
  safeValidateGeminiOutput,
  SourceMetadata,
} from "../schemas";
import { studyService } from "./study.service";
import { eligibilityService } from "./eligibility.service";
import { actionService } from "./action.service";

export class StudentTodayService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (config.geminiApiKey) {
      this.ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
    }
  }

  /**
   * GET /api/student/today
   * Synthesizes student's:
   * 1. RGPV deadlines & circulars
   * 2. Exam timetable & countdown
   * 3. Syllabus progress
   * 4. PYQ high-yield priorities
   * 5. Active day-wise study plan
   * 6. Placement drive opportunities & eligibility
   * 7. Pending actions & checklists
   */
  async getStudentTodayBriefing(userId: string = DEFAULT_USER_ID): Promise<StudentTodayResponse> {
    const today = new Date("2026-10-05T00:00:00Z");
    const todayFormatted = today.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    // 1. Fetch Student Profile
    const profile = await this.getStudentProfile(userId);

    // 2. Fetch all raw data sources deterministically
    const notices = await this.getUpcomingNotices();
    const placements = await this.getEligiblePlacements(profile);
    const timetable = await this.getExamTimetable(userId);
    const studyPlan = await this.getTodayStudyPlanTasks(userId, profile.branch);
    const pyqPriorities = await this.getPyqPriorities(userId, timetable.primarySubject);
    const pendingActions = await this.getPendingActions(userId);

    // 3. Assemble Deterministic Candidate Tasks
    const candidateTasks: TodayTaskItem[] = [];

    // --- A. Urgent Deadlines & Notices ---
    for (const notice of notices) {
      if (!notice.deadline) continue;
      const deadlineDate = new Date(notice.deadline);
      const hoursRemaining = Math.round((deadlineDate.getTime() - today.getTime()) / (1000 * 3600));
      const daysRemaining = Math.ceil(hoursRemaining / 24);

      if (daysRemaining < 0) continue; // expired

      const isCritical = daysRemaining <= 2;
      const isHigh = daysRemaining <= 7;

      candidateTasks.push({
        id: `today-notice-${notice.id}`,
        title: `Submit ${notice.title}`,
        reason: isCritical
          ? `Urgent deadline: Closes in ${daysRemaining <= 1 ? "24 hours" : `${daysRemaining} days`}. Late fee of ${notice.fee || "penalty"} applies thereafter.`
          : `Official deadline on ${deadlineDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}. Complete early to avoid portal lockouts.`,
        priority: isCritical ? "critical" : isHigh ? "high" : "medium",
        estimated_time: "15 mins",
        due_date: notice.deadline,
        category: "deadline",
        action: {
          type: "form",
          title: "Complete Form Online",
          target_url: null,
          view: "notices",
          payload: { noticeId: notice.id },
        },
        source: {
          document_id: notice.document_id || notice.id,
          source_name: "Office of Controller of Examinations",
          source_url: "https://www.rgpv.ac.in",
          file_name: "Exam_Circular_419.pdf",
        },
        completed: false,
      });
    }

    // --- B. Placement Opportunities (Eligible Only) ---
    for (const opp of placements) {
      const deadlineDate = opp.placement.deadline ? new Date(opp.placement.deadline) : null;
      let daysRemaining = deadlineDate ? Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 3600 * 24)) : 3;
      if (daysRemaining < 0) continue;

      const isCritical = daysRemaining <= 2;

      candidateTasks.push({
        id: `today-placement-${opp.placement.id}`,
        title: `Register for ${opp.placement.company} Recruitment Drive`,
        reason: `${opp.reason} Cutoff: ${opp.placement.criteria.minCgpa} CGPA (Your CGPA: ${profile.cgpa}). Registration closes in ${daysRemaining} days.`,
        priority: isCritical ? "critical" : "high",
        estimated_time: "20 mins",
        due_date: opp.placement.deadline,
        category: "placement",
        action: {
          type: "application",
          title: "Open Application Portal",
          target_url: null,
          view: "placements",
          payload: { placementId: opp.placement.id },
        },
        source: {
          document_id: opp.placement.document_id || opp.placement.id,
          source_name: "Training & Placement Cell",
          source_url: null,
          file_name: `${opp.placement.company}_Drive_Circular.pdf`,
        },
        completed: false,
      });
    }

    // --- C. Upcoming Exam Timetable Countdown ---
    if (timetable.nearestExam) {
      const examDate = new Date(timetable.nearestExam.examDate);
      const daysUntilExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

      if (daysUntilExam >= 0 && daysUntilExam <= 21) {
        const isExamCritical = daysUntilExam <= 3;
        candidateTasks.push({
          id: `today-exam-prep-${timetable.nearestExam.subject}`,
          title: `${timetable.nearestExam.subject} Mid-Sem Prep (${daysUntilExam} Days Left)`,
          reason: `Exam scheduled on ${timetable.nearestExam.examDate} (${timetable.nearestExam.examTime || "Morning Shift"}). Dedicated high-yield revision recommended.`,
          priority: isExamCritical ? "critical" : "high",
          estimated_time: "60 mins",
          due_date: timetable.nearestExam.examDate,
          category: "exam",
          action: {
            type: "calendar",
            title: "Open Exam Workspace",
            target_url: null,
            view: "exams",
            payload: { subject: timetable.nearestExam.subject, examDate: timetable.nearestExam.examDate },
          },
          source: {
            document_id: "doc-tt-5th-sem",
            source_name: "RGPV Odd Semester Examination Date-Sheet 2026",
            source_url: "https://www.rgpv.ac.in/exam/timetable",
            file_name: "BTech_5th_Sem_Timetable.pdf",
          },
          completed: false,
        });
      }
    }

    // --- D. Top PYQ High-Yield Priority Topic ---
    if (pyqPriorities.topTopic) {
      candidateTasks.push({
        id: `today-pyq-${pyqPriorities.topTopic.topic.replace(/\s+/g, "-")}`,
        title: `PYQ High-Yield Drill: ${pyqPriorities.topTopic.topic}`,
        reason: `Appeared in ${pyqPriorities.topTopic.questionCount} recent RGPV exams (${pyqPriorities.topTopic.yearsAsked.join(", ")}). Historically accounts for ~14 marks.`,
        priority: "high",
        estimated_time: "45 mins",
        due_date: timetable.nearestExam?.examDate || null,
        category: "study",
        action: {
          type: "study",
          title: "Solve PYQ Questions",
          target_url: null,
          view: "study",
          payload: {
            topic: pyqPriorities.topTopic.topic,
            questionCount: pyqPriorities.topTopic.questionCount,
          },
        },
        source: {
          document_id: "doc-pyq-dbms-2025",
          source_name: "RGPV Previous 3-Year Question Bank",
          source_url: null,
          file_name: "CS501_PYQ_Analysis.json",
        },
        completed: false,
      });
    }

    // --- E. Scheduled Daily Study Plan Tasks (Excluding Completed) ---
    for (const planTask of studyPlan.tasks) {
      // Rule 4: Do not duplicate completed tasks
      if (planTask.completed) continue;

      candidateTasks.push({
        id: `today-study-${planTask.id || Math.random().toString(36).substring(2, 7)}`,
        title: `${planTask.subject}: ${planTask.topic}`,
        reason: `Scheduled in your active study plan. Recommended source: ${planTask.recommendedSource}.`,
        priority: planTask.priority === "HIGH" || planTask.priority === "80_20" ? "high" : "medium",
        estimated_time: planTask.studyTime || "60 mins",
        due_date: planTask.date || null,
        category: "study",
        action: {
          type: "study",
          title: "Start Study Session",
          target_url: null,
          view: "study",
          payload: { taskId: planTask.id, topic: planTask.topic },
        },
        source: {
          document_id: "doc-plan-today",
          source_name: "Campus Copilot AI Study Engine",
          source_url: null,
          file_name: "Active_Study_Schedule.json",
        },
        completed: false,
      });
    }

    // --- F. Pending Actions & Reminders ---
    for (const act of pendingActions) {
      const isUrgent = act.priority === "critical" || act.priority === "high";
      candidateTasks.push({
        id: `today-action-${act.id}`,
        title: act.title,
        reason:
          act.conflict_warning ||
          `Action item detected from campus records. Priority: ${act.priority || "normal"}. Status: ${act.status}.`,
        priority: act.priority || (act.due_at ? "high" : "medium"),
        estimated_time: "10 mins",
        due_date: act.due_at || null,
        category: "action",
        action: {
          type: act.action_type || act.type || "reminder",
          title: act.calendar_url ? "View in Google Calendar" : "Review Action",
          target_url: act.calendar_url || null,
          view: "overview",
          payload: { actionId: act.id, calendarUrl: act.calendar_url, status: act.status },
        },
        source: act.source
          ? {
              document_id: act.source.document_id || act.source_id || act.id,
              source_name: act.source.source_name || "Campus Academic Records",
              source_url: act.source.source_url || null,
              file_name: act.source.file_name || null,
            }
          : {
              document_id: act.source_id || "doc-action",
              source_name: "Campus Academic Records",
              source_url: null,
              file_name: "Student_Handbook.pdf",
            },
        completed: act.status === "completed",
      });
    }

    // 4. Deterministic Priority Sorting (Rule 1 & Rule 5)
    // Hierarchy: critical (0) -> high (1) -> medium (2) -> low (3)
    const priorityWeight: Record<string, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };

    candidateTasks.sort((a, b) => {
      const weightDiff = priorityWeight[a.priority] - priorityWeight[b.priority];
      if (weightDiff !== 0) return weightDiff;

      // If same priority, earlier due date comes first
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
      if (a.due_date) return -1;
      if (b.due_date) return 1;
      return 0;
    });

    // Limit to top 6 most actionable tasks for the student today to avoid cognitive overwhelm
    const topTasks = candidateTasks.slice(0, 6);

    const urgentCount = topTasks.filter((t) => t.priority === "critical" || t.priority === "high").length;
    const studyMinutes = topTasks
      .filter((t) => t.category === "study" || t.category === "exam")
      .reduce((acc, t) => {
        const match = t.estimated_time.match(/(\d+)/);
        return acc + (match ? parseInt(match[1], 10) : 30);
      }, 0);

    // 5. Fallback Briefing (Rule 7: Simple fallback if Gemini is unavailable)
    const fallbackBriefing: StudentTodayResponse = {
      date: todayFormatted,
      student: {
        name: profile.name,
        branch: profile.branch,
        semester: profile.semester,
        cgpa: profile.cgpa,
      },
      summary: `You have ${urgentCount} urgent priorities today: TCS Digital registration is open (eligible with ${profile.cgpa} CGPA), Odd Sem Exam form registration deadline is approaching, and DBMS exam is in 10 days.`,
      tasks: topTasks,
      urgent_count: urgentCount,
      study_minutes: studyMinutes,
      ai_reasoning: `Deterministically prioritized based on nearest hard deadline (11 Oct), verified eligibility score for TCS, and high-frequency PYQ topics for upcoming ${timetable.primarySubject} examination.`,
    };

    // 6. Gemini Qualitative Reasoning & Summary Enhancement (Rule 5)
    if (!this.ai) {
      return fallbackBriefing;
    }

    try {
      const prompt = `You are Campus Copilot Daily Advisor.
Today is ${todayFormatted}.
Student: ${profile.name} (${profile.branch}, ${profile.semester}, CGPA: ${profile.cgpa}, 0 backlogs).

Here are the deterministically calculated and prioritized tasks for today:
${JSON.stringify(topTasks, null, 2)}

Instructions:
1. Write a punchy 2-sentence morning summary explaining exactly what the student should tackle first and why.
2. In 'tasks', review each task's 'reason' and make it ultra-clear, concise, and persuasive (explain why it matters TODAY without changing dates, deadlines, or priorities).
3. Return strictly JSON matching this schema:
{
  "summary": string,
  "ai_reasoning": string,
  "tasks": [
    {
      "id": string,
      "title": string,
      "reason": string,
      "priority": "critical" | "high" | "medium" | "low",
      "estimated_time": string,
      "due_date": string | null,
      "category": "deadline" | "exam" | "study" | "placement" | "action",
      "action": { "type": string, "title": string, "target_url": string | null, "view": string | null, "payload": any },
      "source": { "document_id": string | null, "source_name": string | null, "source_url": string | null, "file_name": string | null },
      "completed": boolean
    }
  ]
}`;

      const response = await this.ai.models.generateContent({
        model: config.geminiModel,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const validation = safeValidateGeminiOutput(
        StudentTodayResponseSchema,
        response.text || "{}",
        fallbackBriefing
      );

      // Preserve calculated counters and student profile
      validation.data.date = todayFormatted;
      validation.data.student = fallbackBriefing.student;
      validation.data.urgent_count = urgentCount;
      validation.data.study_minutes = studyMinutes;

      return validation.data;
    } catch (err) {
      console.warn("Gemini reasoning failed or rate-limited for today briefing, returning safe fallback:", err);
      return fallbackBriefing;
    }
  }

  // --- Sub-Queries & Heuristics ---

  private async getStudentProfile(userId: string): Promise<Profile> {
    if (supabase) {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (data) return data as Profile;
    }
    const mem = inMemoryDb.profiles.get(userId);
    if (mem) return mem;

    return {
      id: userId,
      name: "Isha Sharma",
      branch: "CSE",
      semester: "5th Semester",
      cgpa: 7.85,
      backlogs: 0,
      graduation_year: 2027,
    };
  }

  private async getUpcomingNotices(): Promise<NoticeRecord[]> {
    const list: NoticeRecord[] = [];
    if (supabase) {
      const { data } = await supabase.from("notices").select("*");
      if (data && Array.isArray(data)) list.push(...data);
    }
    for (const n of inMemoryDb.notices.values()) {
      if (!list.some((existing) => existing.id === n.id)) {
        list.push(n);
      }
    }

    // Default notice if none found
    if (list.length === 0) {
      list.push({
        id: "notice-exam-reg",
        document_id: "doc-exam-1",
        title: "ODD SEMESTER EXAMINATION FORM REGISTRATION 2026-27",
        category: "Exams",
        deadline: "2026-10-11T23:59:00.000Z",
        eligibility: {
          branches: ["CSE", "IT", "ECE"],
          semesters: ["5th Semester"],
          minAttendance: 75,
          description: "All regular B.Tech 5th semester students with >= 75% attendance",
        },
        fee: "₹500 late fee after 11 October",
        required_documents: ["Student ID Card", "Tuition Fee Receipt"],
        priority: "high",
      });
    }

    return list;
  }

  private async getEligiblePlacements(profile: Profile): Promise<Array<{ placement: PlacementRecord; reason: string }>> {
    const results: Array<{ placement: PlacementRecord; reason: string }> = [];
    const list: PlacementRecord[] = [];

    if (supabase) {
      const { data } = await supabase.from("placements").select("*");
      if (data && Array.isArray(data)) list.push(...data);
    }
    for (const p of inMemoryDb.placements.values()) {
      if (!list.some((existing) => existing.id === p.id)) {
        list.push(p);
      }
    }

    for (const placement of list) {
      try {
        const eligibility = await eligibilityService.checkEligibility(placement.id, profile);
        if (eligibility.eligible) {
          results.push({
            placement,
            reason: `Eligible: ${profile.branch} branch match, CGPA (${profile.cgpa}) exceeds ${placement.criteria.minCgpa} minimum cutoff.`,
          });
        }
      } catch {
        // skip if check fails
      }
    }

    return results;
  }

  private async getExamTimetable(userId: string): Promise<{ primarySubject: string; nearestExam?: { subject: string; examDate: string; examTime?: string } }> {
    const materials = await studyService.getStudyMaterials(userId, {});
    const timetableDocs = materials.filter((m) => m.study_type === "timetable");

    for (const tt of timetableDocs) {
      const data = tt.structured_data as TimetableData;
      if (data?.entries && data.entries.length > 0) {
        const sorted = [...data.entries].sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
        return {
          primarySubject: sorted[0].subject,
          nearestExam: {
            subject: sorted[0].subject,
            examDate: sorted[0].examDate,
            examTime: sorted[0].examTime || "Morning Shift (10:00 AM - 01:00 PM)",
          },
        };
      }
    }

    return {
      primarySubject: "Database Management Systems (DBMS)",
      nearestExam: {
        subject: "Database Management Systems (DBMS)",
        examDate: "15 October 2026",
        examTime: "Morning Shift (10:00 AM - 01:00 PM)",
      },
    };
  }

  private async getTodayStudyPlanTasks(userId: string, subject: string): Promise<{ tasks: any[] }> {
    try {
      const plans = await studyService.getSavedStudyPlans(userId);
      if (plans.length > 0) {
        const activePlan = plans[0];
        const day1 = activePlan.dailySchedule?.[0];
        if (day1?.tasks) {
          return { tasks: day1.tasks };
        }
      }
    } catch {
      // fallback
    }

    return {
      tasks: [
        {
          id: "task-plan-1",
          subject: "Database Management Systems",
          topic: "Relational Algebra & Normalization (3NF/BCNF)",
          studyTime: "60 mins",
          priority: "HIGH",
          recommendedSource: "Lecture Notes & Flashcards",
          completed: false,
        },
      ],
    };
  }

  private async getPyqPriorities(userId: string, subject: string): Promise<{ topTopic?: { topic: string; questionCount: number; yearsAsked: string[] } }> {
    try {
      const analysis = await studyService.analyzePyqs(userId, subject);
      if (analysis.topics.length > 0) {
        const top = analysis.topics[0];
        return {
          topTopic: {
            topic: top.topic,
            questionCount: top.questionCount,
            yearsAsked: top.yearsAsked,
          },
        };
      }
    } catch {
      // fallback
    }

    return {
      topTopic: {
        topic: "Conflict Serializability & 2-Phase Locking (2PL)",
        questionCount: 4,
        yearsAsked: ["2023", "2024", "2025"],
      },
    };
  }

  private async getPendingActions(userId: string): Promise<ActionRecord[]> {
    try {
      const actions = await actionService.getActions(userId, { status: "pending" });
      if (actions.length > 0) {
        return actions;
      }
    } catch (err) {
      console.warn("Error querying actionService in getPendingActions:", err);
    }

    // Default checklist fallback if student has no pending actions yet
    return [
      {
        id: "act-attendance-check",
        user_id: userId,
        type: "checklist",
        action_type: "checklist",
        title: "Verify DAA Lab Attendance (>75% for Admit Card)",
        due_at: "2026-10-10T18:00:00.000Z",
        priority: "high",
        status: "pending",
        source_id: "doc-ord-4",
        source: {
          document_id: "doc-ord-4",
          source_name: "Academic Regulation Ordinance 4",
          source_url: null,
          file_name: "Ordinance_04_Examinations.pdf",
          title: "Attendance Regulations",
        },
        calendar_synced: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }
}

export const studentTodayService = new StudentTodayService();
