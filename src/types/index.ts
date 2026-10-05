export interface Profile {
  id: string;
  name: string;
  branch: string;
  semester: string;
  cgpa: number;
  backlogs: number;
  graduation_year: number;
  skills?: string[];
}

export interface DocumentRecord {
  id: string;
  user_id: string;
  title: string;
  file_url: string;
  document_type: string;
  extracted_text: string | null;
  extracted_data: Record<string, any> | null;
  embedding?: number[] | null;
  created_at: string;
}

export interface NoticeRecord {
  id: string;
  document_id: string;
  title: string;
  category: "Exams" | "Placement" | "Academics" | "Scholarship" | "General";
  deadline: string | null;
  eligibility: {
    branches?: string[];
    semesters?: string[];
    minCgpa?: number | null;
    maxBacklogs?: number | null;
    minAttendance?: number;
    description?: string | null;
  } | null;
  fee: string | null;
  required_documents: string[];
  priority: "high" | "medium" | "low";
}

export interface PlacementCriteria {
  minCgpa: number;
  branches: string[];
  maxBacklogs: number;
  graduationYear: number;
}

export interface PlacementRecord {
  id: string;
  document_id: string;
  company: string;
  criteria: PlacementCriteria;
  skills: string[];
  preferredSkills?: string[];
  deadline: string | null;
}

export interface ActionRecord {
  id: string;
  user_id: string;
  type: "form" | "reminder" | "calendar" | "checklist" | "application";
  action_type?: "form" | "reminder" | "calendar" | "checklist" | "application";
  title: string;
  due_at: string | null;
  priority: "critical" | "high" | "medium" | "low";
  status: "pending" | "completed" | "dismissed";
  source_id: string | null;
  source?: {
    document_id?: string | null;
    source_name?: string | null;
    source_url?: string | null;
    file_name?: string | null;
    title?: string | null;
  } | null;
  calendar_synced?: boolean;
  calendar_event_id?: string | null;
  calendar_url?: string | null;
  has_conflict?: boolean;
  conflict_warning?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateActionInput {
  title: string;
  due_at?: string | null;
  priority?: "critical" | "high" | "medium" | "low";
  action_type?: "form" | "reminder" | "calendar" | "checklist" | "application";
  type?: "form" | "reminder" | "calendar" | "checklist" | "application";
  source?: {
    document_id?: string | null;
    source_name?: string | null;
    source_url?: string | null;
    file_name?: string | null;
    title?: string | null;
  } | null;
  source_id?: string | null;
  calendar_sync?: boolean;
  has_conflict?: boolean;
  conflict_warning?: string | null;
}

export interface UpdateActionInput {
  title?: string;
  due_at?: string | null;
  priority?: "critical" | "high" | "medium" | "low";
  action_type?: "form" | "reminder" | "calendar" | "checklist" | "application";
  type?: "form" | "reminder" | "calendar" | "checklist" | "application";
  status?: "pending" | "completed" | "dismissed";
  calendar_sync?: boolean;
  has_conflict?: boolean;
  conflict_warning?: string | null;
}

export interface CriteriaVerificationItem {
  name: string;
  required: string;
  studentValue: string;
  satisfied: boolean;
  severity: "critical" | "warning" | "none";
}

export interface EligibilityResult {
  eligible: boolean;
  matchScore: number;
  criteria: CriteriaVerificationItem[];
  skillGaps: string[];
  reason: string;
  source: {
    company: string;
    documentTitle: string;
    noticeId?: string;
  };
}

export interface MissingSkillItem {
  skill: string;
  type: "required" | "preferred";
  importance: "high" | "medium";
  description?: string;
}

export interface MissingCriteriaItem {
  name: string;
  required: string;
  actual: string;
  satisfied: boolean;
  severity: "critical" | "warning" | "none";
  gap_description?: string;
}

export interface RecommendedResourceItem {
  skill: string;
  document_id: string | null;
  document_title: string;
  resource_type: "uploaded_notes" | "uploaded_pyq" | "uploaded_syllabus" | "campus_reference";
  relevance: string;
  matched_topics?: string[];
}

export interface PlacementGapAnalysis {
  eligibility: {
    eligible: boolean;
    matchScore: number;
    status: "eligible" | "conditionally_eligible" | "not_eligible";
    reason: string;
    criteria_summary: {
      total: number;
      met: number;
      unmet: number;
    };
  };
  gaps: {
    missing_criteria: MissingCriteriaItem[];
    missing_skills: MissingSkillItem[];
    total_gaps: number;
  };
  priority: "critical" | "high" | "medium" | "low";
  preparation_time: {
    total_hours: number;
    estimated_duration: string;
    daily_recommended_minutes: number;
  };
  resources: RecommendedResourceItem[];
  action: {
    type: string;
    title: string;
    view?: string;
    deadline: string | null;
    next_step: string;
  };
  source: {
    company: string;
    placement_id: string;
    document_title: string;
  };
}

export interface CopilotResponse {
  answer: string;
  reason?: string;
  intent?: string;
  confidence: "high" | "medium" | "low";
  sources: {
    title: string;
    ref?: string | null;
    type?: string | null;
    url?: string | null;
    document_id?: string | null;
  }[];
  actions: {
    id: string | null;
    type: string;
    title: string;
    due_at?: string | null;
    payload?: any;
  }[];
  related_data?: any;
}

export interface RgpvNoticeRecord {
  id: string;
  title: string;
  category: "Exams" | "Academics" | "Placement" | "Events" | "Admission" | "General" | null;
  date: string | null;
  deadline: string | null;
  eligibility: string | null;
  description: string | null;
  document_url: string | null;
  source_name: string;
  source_url: string;
  published_at: string | null;
  fetched_at: string;
  content_hash: string;
  embedding?: number[] | null;
}

export interface RgpvSyncResult {
  totalFetched: number;
  newInserted: number;
  updated: number;
  skipped: number;
  errors: number;
  lastSyncedAt: string;
  notices: RgpvNoticeRecord[];
}

// ==========================================
// STUDY INTELLIGENCE TYPES
// ==========================================

export type StudyDocumentType = "syllabus" | "timetable" | "pyq" | "notes" | "unknown";

export interface SyllabusUnit {
  unitNumber: number | string;
  unitTitle: string;
  topics: string[];
}

export interface SyllabusData {
  subject: string;
  subjectCode?: string | null;
  semester?: string | null;
  branch?: string | null;
  units: SyllabusUnit[];
}

export interface TimetableEntry {
  subject: string;
  subjectCode?: string | null;
  examDate: string;
  examTime?: string | null;
  day?: string | null;
}

export interface TimetableData {
  semester?: string | null;
  branch?: string | null;
  entries: TimetableEntry[];
}

export interface PyqQuestion {
  questionNumber?: string | null;
  unit?: string | null;
  question: string;
  marks?: number | null;
  frequency?: number;
  year?: string | number | null;
}

export interface PyqData {
  subject: string;
  year: string | number | null;
  semester?: string | null;
  questions: PyqQuestion[];
}

export interface NoteTopic {
  topic: string;
  summary: string;
  keyPoints?: string[];
}

export interface NotesData {
  subject: string;
  unit?: string | null;
  topic: string;
  content: string;
  topics?: NoteTopic[];
}

export interface StudyMaterialRecord {
  id: string;
  user_id: string;
  document_id: string;
  file_url: string;
  file_name: string;
  mime_type: string;
  study_type: "syllabus" | "timetable" | "pyq" | "notes";
  subject: string;
  extracted_text: string | null;
  structured_data: SyllabusData | TimetableData | PyqData | NotesData;
  created_at: string;
}

export interface StudyPlanTask {
  id?: string;
  day: number;
  date: string;
  subject: string;
  topic: string;
  unit?: string | null;
  studyTime: string; // e.g. "60 mins"
  estimatedMinutes: number; // for backward compatibility with UI
  priority: "HIGH" | "MEDIUM" | "LOW" | "80_20";
  recommendedSource: string; // recommended notes / source reference
  sourceMaterial?: "syllabus" | "pyq" | "notes" | "timetable"; // for backward compatibility with UI
  sourceReference?: string; // for backward compatibility with UI
  pyqPractice: {
    action: string;
    questionCount?: number;
    recommendedYears?: string[];
    sampleQuestion?: string;
  } | string;
  pyqFrequency?: number;
  completed?: boolean;
}

export interface StudyPlanDay {
  day: number;
  date: string;
  totalMinutes: number;
  tasks: StudyPlanTask[];
}

export interface StudyPlanExamInput {
  subject: string;
  examDate: string;
  examTime?: string | null;
  day?: string | null;
}

export interface StudyPlanRequest {
  user_id?: string;
  subject?: string;
  exams?: StudyPlanExamInput[];
  examDates?: Record<string, string> | string;
  targetExamDate?: string;
  availableHoursPerDay: number;
  startDate?: string;
  syllabusTopics?: string[] | Array<{ topic: string; unit?: string }>;
  pyqTopicFrequency?: Record<string, number> | Array<{ topic: string; frequency: number; years?: string[] }>;
  uploadedNotes?: Array<{ topic: string; notesTitle?: string; keyPoints?: string[] }>;
  prefer8020Plan?: boolean;
}

export interface StudyPlanResponse {
  planId?: string;
  subject: string;
  examDate: string | null;
  daysRemaining: number;
  totalAvailableHours: number;
  is8020Plan: boolean;
  priorityRule: string;
  summary: string;
  reasoningInsights?: string[];
  dailySchedule: StudyPlanDay[];
  highPriorityTopics: string[];
  sourcesUsed: {
    hasSyllabus: boolean;
    hasTimetable: boolean;
    hasPyqs: boolean;
    hasNotes: boolean;
    materialsCount: number;
    documentTitles: string[];
  };
  revisionAndMockSessions: {
    totalSessions: number;
    description: string;
  };
  createdAt?: string;
}

export interface PyqQuestionRecord {
  id: string;
  material_id: string;
  user_id: string;
  subject: string;
  year: string | null;
  question_number?: string | null;
  question_text: string;
  marks: number | null;
  mapped_unit: string | null;
  mapped_topic: string | null;
  source_file: string;
  created_at: string;
}

export interface PyqAnalysisItem {
  topic: string;
  unit: string | null;
  questionCount: number;
  yearsAsked: string[];
  priority: "HIGH" | "MEDIUM" | "LOW";
  relatedQuestions: {
    id: string;
    question: string;
    marks: number | null;
    year: string | null;
    sourceFile?: string;
  }[];
}

export interface PyqAnalysisResponse {
  subject: string;
  totalQuestionsAnalyzed: number;
  uniqueTopicsCount: number;
  highYieldTopicsCount: number;
  topics: PyqAnalysisItem[];
}

export type {
  TodayTaskItem,
  StudentTodayResponse,
} from "../schemas";
