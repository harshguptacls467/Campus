import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config";
import {
  Profile,
  DocumentRecord,
  NoticeRecord,
  PlacementRecord,
  ActionRecord,
  RgpvNoticeRecord,
  StudyMaterialRecord,
  PyqQuestionRecord,
} from "../types";

export let supabase: SupabaseClient | null = null;

if (config.supabaseUrl && (config.supabaseServiceKey || config.supabaseAnonKey)) {
  const key = (config.supabaseServiceKey || config.supabaseAnonKey) as string;
  supabase = createClient(config.supabaseUrl, key, {
    auth: { persistSession: false },
  });
}

// In-Memory Database fallback for offline local developer verification
export const inMemoryDb = {
  profiles: new Map<string, Profile>([
    [
      "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        name: "Harsh Gupta",
        branch: "CSE",
        semester: "5th Semester",
        cgpa: 7.8,
        backlogs: 0,
        graduation_year: 2027,
      },
    ],
  ]),
  documents: new Map<string, DocumentRecord>(),
  notices: new Map<string, NoticeRecord>([
    [
      "notice-exam-reg",
      {
        id: "notice-exam-reg",
        document_id: "doc-exam-1",
        title: "ODD SEMESTER EXAMINATION FORM REGISTRATION 2026-27",
        category: "Exams",
        deadline: "2026-10-11T23:59:00.000Z",
        eligibility: {
          branches: ["CSE", "AIML", "DS", "IT", "ECE"],
          semesters: ["5th Semester"],
          minAttendance: 75,
          description: "All regular B.Tech 5th semester students with >= 75% attendance",
        },
        fee: "₹500 after 11 October",
        required_documents: [
          "Student ID Card",
          "Enrollment Number (22CSE084)",
          "Current Semester Fee Receipt",
        ],
        priority: "high",
      },
    ],
  ]),
  placements: new Map<string, PlacementRecord>([
    [
      "tcs-digital",
      {
        id: "tcs-digital",
        document_id: "doc-tcs-1",
        company: "TCS Digital",
        criteria: {
          minCgpa: 7.5,
          branches: ["CSE", "IT", "ECE"],
          maxBacklogs: 0,
          graduationYear: 2027,
        },
        skills: ["Data Structures", "Algorithms", "SQL", "DBMS", "Python"],
        preferredSkills: ["Docker", "Cloud Basics"],
        deadline: "2026-10-06T23:59:00.000Z",
      },
    ],
    [
      "google-step",
      {
        id: "google-step",
        document_id: "doc-google-1",
        company: "Google STEP",
        criteria: {
          minCgpa: 8.0,
          branches: ["CSE", "IT"],
          maxBacklogs: 0,
          graduationYear: 2027,
        },
        skills: ["C++", "Java", "Python", "Data Structures"],
        deadline: "2026-10-10T17:00:00.000Z",
      },
    ],
  ]),
  actions: new Map<string, ActionRecord>(),
  rgpvNotices: new Map<string, RgpvNoticeRecord>(),
  studyMaterials: new Map<string, StudyMaterialRecord>(),
  pyqQuestions: new Map<string, PyqQuestionRecord>(),
  studyPlans: new Map<string, any>(),
};

export const DEFAULT_USER_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
