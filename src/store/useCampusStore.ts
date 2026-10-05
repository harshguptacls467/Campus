import { create } from "zustand";
import { CURRENT_STUDENT, SAMPLE_NOTICES, StudentProfile, CampusNotice } from "../data/mockCampusData";
import { CURRENT_STUDENT_USER, StudentUser } from "@/lib/mock/student";
import { TODAY_TIMELINE, TodayTimelineItem, CAMPUS_CHANGES } from "@/lib/mock/timeline";
import { STUDENT_NOTICES, StructuredNoticeItem } from "@/lib/mock/notices";
import { STUDENT_OPPORTUNITIES, StudentOpportunity } from "@/lib/mock/placements";
import { UPCOMING_EXAM, ExamIntel } from "@/lib/mock/exams";

export type StudentAppView =
  | "overview"
  | "copilot"
  | "notices"
  | "exams"
  | "placements"
  | "events"
  | "attendance"
  | "saved"
  | "study"
  | "landing"
  | "admin"
  | "bunk"
  | "panic"
  | "opportunities"
  | "deadlines"
  | "map";

export type NavView = StudentAppView;

export interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  timestamp: string;
  query?: string;
  text?: string;
  decisionType?: "eligibility" | "panic" | "attendance" | "deadlines" | "notices" | "conflict";
  data?: any;
}

interface CampusState {
  currentView: StudentAppView;
  setCurrentView: (view: StudentAppView) => void;
  student: StudentProfile;
  studentUser: StudentUser;
  setStudent: (student: StudentProfile) => void;
  updateStudentProfile: (updates: {
    name?: string;
    branch?: string;
    department?: string;
    semester?: string;
    rollNo?: string;
    cgpa?: number;
    backlogs?: number;
    activeBacklogs?: number;
    overallAttendance?: number;
    avatar?: string;
  }) => void;
  switchProfilePersona: (persona: "harsh" | "isha" | "aryan") => void;

  // Global Command Palette (Cmd+K / Ctrl+K)
  isCommandOpen: boolean;
  setIsCommandOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;

  // Notifications drawer
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  unreadNotificationsCount: number;
  markNotificationsRead: () => void;

  // Copilot Chat
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
  isAiTyping: boolean;
  setIsAiTyping: (typing: boolean) => void;
  submitPrompt: (prompt: string) => void;

  // Panic Mode
  isPanicModeActive: boolean;
  setPanicModeActive: (active: boolean) => void;
  activePanicTopicIndex: number;
  setActivePanicTopicIndex: (index: number) => void;
  completedPanicTopics: number[];
  togglePanicTopicDone: (index: number) => void;

  // Attendance Simulation
  classesToMiss: number;
  setClassesToMiss: (count: number) => void;

  // Admin notices
  notices: CampusNotice[];
  addNotice: (notice: CampusNotice) => void;

  // Saved Items
  savedItemIds: string[];
  toggleSaveItem: (id: string) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "copilot",
    timestamp: "1:45 PM",
    text: "Good afternoon, Harsh! I'm monitoring your 5th Sem CSE stream. You have the DBMS Mid-Sem exam tomorrow at 10:00 AM, and your Computer Networks attendance is hovering at 68.2%. What do you need to figure out?",
  },
  {
    id: "msg-2",
    sender: "user",
    timestamp: "1:46 PM",
    query: "Am I eligible for the TCS drive?",
  },
  {
    id: "msg-3",
    sender: "copilot",
    timestamp: "1:46 PM",
    decisionType: "eligibility",
    data: {
      isEligible: true,
      status: "eligible",
      company: "TCS Campus Drive 2026",
      role: "System Engineer / Digital Specialist",
      packageStr: "₹7.2 – ₹9.0 LPA",
      package: "₹7.2 – ₹9.0 LPA",
      matchScore: 92,
      tableData: [
        { requirement: "Branch Criteria", required: "CSE, IT, ECE", student: "CSE", passed: true },
        { requirement: "Minimum CGPA", required: "7.50 Cutoff", student: "8.10", passed: true },
        { requirement: "Active Backlogs", required: "0 Allowed", student: "0", passed: true },
        { requirement: "Graduation Cohort", required: "Batch 2027", student: "2027", passed: true },
      ],
      skillGap: {
        skill: "Docker containerization",
        note: "You meet all mandatory eligibility criteria. Docker containerization is listed as a preferred skill by the technical panel.",
      },
      whySeeingThis: [
        "You're in CSE 5th Semester",
        "Your CGPA is 8.1 (company cutoff: 7.5+)",
        "You have 0 active backlogs (0 allowed)",
      ],
      source: "TCS Placement Circular • Ref: T&P/DRIVE/2026/088",
      confidence: "High confidence",
    },
  },
];

export const useCampusStore = create<CampusState>((set, get) => ({
  // Default logged-in student view is "overview"
  currentView: "overview",
  setCurrentView: (view) => set({ currentView: view }),
  student: CURRENT_STUDENT,
  studentUser: CURRENT_STUDENT_USER,
  setStudent: (student) => set({ student }),

  updateStudentProfile: (updates) => {
    const prevStudent = get().student;
    const prevUser = get().studentUser;

    const newName = updates.name ?? prevUser.name;
    const firstName = newName.split(" ")[0];
    const newBranch = updates.branch ?? updates.department ?? prevStudent.branch;
    const newSem = updates.semester ?? prevStudent.semester;
    const newRoll = updates.rollNo ?? prevStudent.rollNo;
    const newCgpa = updates.cgpa ?? prevStudent.cgpa;
    const newBacklogs = updates.backlogs ?? updates.activeBacklogs ?? prevStudent.backlogs;
    const newAttendance = updates.overallAttendance ?? prevStudent.overallAttendance;
    const newAvatar = updates.avatar ?? prevStudent.avatar;

    const updatedStudent: StudentProfile = {
      ...prevStudent,
      name: newName,
      branch: newBranch,
      semester: newSem,
      rollNo: newRoll,
      cgpa: newCgpa,
      backlogs: newBacklogs,
      overallAttendance: newAttendance,
      avatar: newAvatar,
    };

    const updatedUser: StudentUser = {
      ...prevUser,
      name: newName,
      firstName,
      department: newBranch,
      semester: newSem,
      rollNo: newRoll,
      enrollmentNo: newRoll,
      cgpa: newCgpa,
      activeBacklogs: newBacklogs,
      overallAttendance: newAttendance,
      avatar: newAvatar,
    };

    set({ student: updatedStudent, studentUser: updatedUser });
    get().showToast(`Profile updated to ${newName}!`);
  },

  switchProfilePersona: (persona) => {
    if (persona === "harsh") {
      get().updateStudentProfile({
        name: "Harsh Gupta",
        branch: "Computer Science & Engineering",
        department: "Computer Science & Engineering",
        semester: "5th Semester",
        rollNo: "0101CS221084",
        cgpa: 7.8,
        backlogs: 0,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      });
    } else if (persona === "isha") {
      get().updateStudentProfile({
        name: "Isha Sharma",
        branch: "Computer Science & Engineering",
        department: "Computer Science & Engineering",
        semester: "5th Semester",
        rollNo: "0101CS221084",
        cgpa: 8.1,
        backlogs: 0,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      });
    } else if (persona === "aryan") {
      get().updateStudentProfile({
        name: "Aryan Verma",
        branch: "Electronics & Communication Engineering",
        department: "Electronics & Communication Engineering",
        semester: "7th Semester",
        rollNo: "0101EC211045",
        cgpa: 7.2,
        backlogs: 1,
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      });
    }
  },

  isCommandOpen: false,
  setIsCommandOpen: (open) => set({ isCommandOpen: open }),
  toggleCommandPalette: () => set((s) => ({ isCommandOpen: !s.isCommandOpen })),

  isNotificationsOpen: false,
  setIsNotificationsOpen: (open) => set({ isNotificationsOpen: open }),
  unreadNotificationsCount: 3,
  markNotificationsRead: () => set({ unreadNotificationsCount: 0 }),

  messages: INITIAL_MESSAGES,
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  clearMessages: () => set({ messages: [INITIAL_MESSAGES[0]] }),
  isAiTyping: false,
  setIsAiTyping: (typing) => set({ isAiTyping: typing }),

  isPanicModeActive: false,
  setPanicModeActive: (active) => set({ isPanicModeActive: active }),
  activePanicTopicIndex: 0,
  setActivePanicTopicIndex: (index) => set({ activePanicTopicIndex: index }),
  completedPanicTopics: [0],
  togglePanicTopicDone: (index) =>
    set((state) => {
      const exists = state.completedPanicTopics.includes(index);
      return {
        completedPanicTopics: exists
          ? state.completedPanicTopics.filter((i) => i !== index)
          : [...state.completedPanicTopics, index],
      };
    }),

  classesToMiss: 1,
  setClassesToMiss: (count) => set({ classesToMiss: count }),

  notices: SAMPLE_NOTICES,
  addNotice: (notice) => set((state) => ({ notices: [notice, ...state.notices] })),

  savedItemIds: ["not-1", "opp-tcs"],
  toggleSaveItem: (id) =>
    set((state) => {
      const exists = state.savedItemIds.includes(id);
      const updated = exists
        ? state.savedItemIds.filter((item) => item !== id)
        : [...state.savedItemIds, id];
      return { savedItemIds: updated };
    }),

  toastMessage: null,
  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      set({ toastMessage: null });
    }, 3200);
  },

  submitPrompt: (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      query: trimmed,
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isAiTyping: true,
    }));

    setTimeout(() => {
      const lower = trimmed.toLowerCase();
      let responseMsg: ChatMessage;

      if (lower.includes("dbms") || lower.includes("exam") || lower.includes("3 hours") || lower.includes("tomorrow")) {
        responseMsg = {
          id: "copilot-" + Date.now(),
          sender: "copilot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          decisionType: "panic",
          data: {
            exam: "Database Management Systems (CS501)",
            when: "Tomorrow, 10:00 AM (Hall 302)",
            planHours: 3,
            message: "I detected high exam urgency. I synthesized your syllabus into a 3-hour zero-waste sprint prioritizing 85% of previous year exam question weightage.",
          },
        };
      } else if (lower.includes("bunk") || lower.includes("attendance") || lower.includes("miss")) {
        responseMsg = {
          id: "copilot-" + Date.now(),
          sender: "copilot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          decisionType: "attendance",
          data: {
            currentAttendance: 78.4,
            simulatedAttendance: 75.8,
            verdict: "DEBAR RISK",
            classesMissed: 2,
            warning: "Missing both classes tomorrow drops your total semester attendance to 75.8% (right at the edge of the 75% cutoff), and crashes Computer Networks to 64.3%.",
          },
        };
      } else if (lower.includes("eligible") || lower.includes("tcs") || lower.includes("placement") || lower.includes("drive")) {
        responseMsg = {
          id: "copilot-" + Date.now(),
          sender: "copilot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          decisionType: "eligibility",
          data: {
            isEligible: true,
            status: "eligible",
            company: "TCS Campus Drive 2026",
            role: "System Engineer / Digital Specialist",
            packageStr: "₹7.2 – ₹9.0 LPA",
            package: "₹7.2 – ₹9.0 LPA",
            matchScore: 92,
            tableData: [
              { requirement: "Branch Criteria", required: "CSE, IT, ECE", student: "CSE", passed: true },
              { requirement: "Minimum CGPA", required: "7.50 Cutoff", student: "8.10", passed: true },
              { requirement: "Active Backlogs", required: "0 Allowed", student: "0", passed: true },
              { requirement: "Graduation Cohort", required: "Batch 2027", student: "2027", passed: true },
            ],
            skillGap: {
              skill: "Docker containerization",
              note: "You satisfy all cutoff criteria. A 45-minute crash course on Dockerfile and container commands will maximize your Digital interview rating.",
            },
            whySeeingThis: [
              "You're in CSE 5th Semester",
              "Your CGPA is 8.1 (company cutoff: 7.5+)",
              "You have 0 active backlogs (0 allowed)",
            ],
            source: "TCS Placement Circular • 4 Oct",
            confidence: "High confidence",
          },
        };
      } else if (lower.includes("due") || lower.includes("deadline") || lower.includes("week")) {
        responseMsg = {
          id: "copilot-" + Date.now(),
          sender: "copilot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          decisionType: "deadlines",
          data: {
            count: 4,
            deadlines: [
              { title: "DBMS Lab Record Submission", due: "Today, 5:00 PM", status: "Urgent" },
              { title: "DBMS Mid-Semester Exam", due: "Tomorrow, 10:00 AM", status: "Critical" },
              { title: "TCS Digital Registration", due: "Tomorrow, 12:00 PM", status: "Action Required" },
              { title: "Odd Sem Exam Form Fill", due: "11 Oct (Late fine ₹500 after)", status: "High Priority" },
            ],
          },
        };
      } else {
        responseMsg = {
          id: "copilot-" + Date.now(),
          sender: "copilot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: `Analyzing across campus registries for "${trimmed}"... Based on official circulars and your CSE 5th sem profile, all actions have been synchronized to your personal feed. Would you like me to add a reminder or run an eligibility verification?`,
        };
      }

      set((state) => ({
        messages: [...state.messages, responseMsg],
        isAiTyping: false,
      }));
    }, 600);
  },
}));
