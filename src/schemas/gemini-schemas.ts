import { z } from "zod";

/**
 * Universal Source / Document Metadata Schema
 * Ensures every extracted entity preserves source traceability
 */
export const SourceMetadataSchema = z.object({
  document_id: z.string().nullable().default(null),
  source_name: z.string().nullable().default(null),
  source_url: z.string().nullable().default(null),
  file_name: z.string().nullable().default(null),
});

export type SourceMetadata = z.infer<typeof SourceMetadataSchema>;

/**
 * 1. NoticeExtraction Schema
 * Used for RGPV circulars, placement notifications, exam notices, and admin uploads
 */
export const NoticeEligibilitySchema = z.object({
  branches: z.array(z.string()).default([]),
  semesters: z.array(z.string()).default([]),
  minCgpa: z.number().nullable().default(null),
  maxBacklogs: z.number().nullable().default(null),
  description: z.string().nullable().default(null),
}).nullable().default(null);

export const NoticeActionItemSchema = z.object({
  type: z.enum(["form", "reminder", "calendar", "checklist", "application"]).default("reminder"),
  title: z.string(),
  due_at: z.string().nullable().default(null),
});

export const NoticeExtractionSchema = z.preprocess((val: any) => {
  if (val && typeof val === "object") {
    return {
      ...val,
      dates: Array.isArray(val.dates) ? val.dates : [],
      required_documents: Array.isArray(val.required_documents) ? val.required_documents : [],
      actions: Array.isArray(val.actions) ? val.actions : [],
      summary: val.summary || val.description || "",
      deadline: val.deadline || null,
      fee: val.fee || null,
    };
  }
  return val;
}, z.object({
  title: z.string().min(1, "Notice title is required"),
  category: z.enum(["Exams", "Placement", "Academics", "Scholarship", "General"]).default("General"),
  dates: z.array(z.string()).default([]),
  deadline: z.string().nullable().default(null),
  eligibility: NoticeEligibilitySchema,
  fee: z.string().nullable().default(null),
  required_documents: z.array(z.string()).default([]),
  actions: z.array(NoticeActionItemSchema).default([]),
  summary: z.string().default(""),
  source: SourceMetadataSchema.default({
    document_id: null,
    source_name: null,
    source_url: null,
    file_name: null,
  }),
}));

export type NoticeExtraction = z.infer<typeof NoticeExtractionSchema>;

/**
 * 2. SyllabusExtraction Schema
 * Used for university and course syllabus documents
 */
export const SyllabusUnitSchema = z.object({
  unitNumber: z.union([z.number(), z.string()]).default(1),
  unitTitle: z.string().default("Core Unit"),
  topics: z.array(z.string()).default([]),
});

export const SyllabusExtractionSchema = z.preprocess((val: any) => {
  if (val && typeof val === "object") {
    const allTopics: string[] = Array.isArray(val.topics) ? [...val.topics] : [];
    if (Array.isArray(val.units)) {
      for (const u of val.units) {
        if (Array.isArray(u.topics)) {
          for (const t of u.topics) {
            if (typeof t === "string" && !allTopics.includes(t)) {
              allTopics.push(t);
            }
          }
        }
      }
    }
    return {
      ...val,
      units: Array.isArray(val.units) ? val.units : [],
      topics: allTopics,
    };
  }
  return val;
}, z.object({
  subject: z.string().min(1, "Subject is required"),
  subjectCode: z.string().nullable().default(null),
  semester: z.string().nullable().default(null),
  branch: z.string().nullable().default(null),
  units: z.array(SyllabusUnitSchema).default([]),
  topics: z.array(z.string()).default([]),
  source: SourceMetadataSchema.default({
    document_id: null,
    source_name: null,
    source_url: null,
    file_name: null,
  }),
}));

export type SyllabusUnit = z.infer<typeof SyllabusUnitSchema>;
export type SyllabusExtraction = z.infer<typeof SyllabusExtractionSchema>;

/**
 * 3. TimetableExtraction Schema
 * Used for exam date-sheets and timetable notifications
 */
export const TimetableEntrySchema = z.preprocess((val: any) => {
  if (val && typeof val === "object") {
    const eDate = val.exam_date || val.examDate || "2026-10-15";
    const eTime = val.exam_time !== undefined ? val.exam_time : val.examTime !== undefined ? val.examTime : null;
    return {
      ...val,
      exam_date: eDate,
      examDate: eDate,
      exam_time: eTime,
      examTime: eTime,
    };
  }
  return val;
}, z.object({
  subject: z.string().min(1, "Subject is required"),
  exam_date: z.string().min(1, "Exam date is required"),
  examDate: z.string().optional(),
  exam_time: z.string().nullable().default(null),
  examTime: z.string().nullable().optional(),
  semester: z.string().nullable().default(null),
  day: z.string().nullable().default(null),
  source: SourceMetadataSchema.default({
    document_id: null,
    source_name: null,
    source_url: null,
    file_name: null,
  }),
}));

export const TimetableExtractionSchema = z.preprocess((val: any) => {
  if (val && typeof val === "object") {
    let entries = Array.isArray(val.entries) ? val.entries : [];
    if (entries.length === 0 && val.subject && (val.exam_date || val.examDate)) {
      entries = [
        {
          subject: val.subject,
          exam_date: val.exam_date || val.examDate,
          exam_time: val.exam_time || val.examTime || null,
          semester: val.semester || null,
          source: val.source,
        },
      ];
    }
    const firstEntry = entries[0];
    return {
      ...val,
      subject: val.subject || firstEntry?.subject || "Various Subjects",
      exam_date: val.exam_date || val.examDate || firstEntry?.exam_date || firstEntry?.examDate || null,
      exam_time: val.exam_time || val.examTime || firstEntry?.exam_time || firstEntry?.examTime || null,
      entries,
    };
  }
  return val;
}, z.object({
  subject: z.string().default("Various Subjects"),
  exam_date: z.string().nullable().default(null),
  exam_time: z.string().nullable().default(null),
  semester: z.string().nullable().default(null),
  entries: z.array(TimetableEntrySchema).default([]),
  source: SourceMetadataSchema.default({
    document_id: null,
    source_name: null,
    source_url: null,
    file_name: null,
  }),
}));

export type TimetableEntry = z.infer<typeof TimetableEntrySchema>;
export type TimetableExtraction = z.infer<typeof TimetableExtractionSchema>;

/**
 * 4. PYQExtraction Schema
 * Used for previous year question papers
 */
export const PyqQuestionItemSchema = z.preprocess((val: any) => {
  if (val && typeof val === "object") {
    const qText = val.questionText || val.question || val.text || "Question";
    return {
      ...val,
      questionText: qText,
      question: qText,
      questionNumber: val.questionNumber || val.question_number || null,
      frequency: typeof val.frequency === "number" ? val.frequency : 1,
    };
  }
  return val;
}, z.object({
  questionNumber: z.string().nullable().default(null),
  questionText: z.string().default("Question"),
  question: z.string().default("Question"),
  marks: z.number().nullable().default(null),
  unit: z.string().nullable().default(null),
  topic: z.string().nullable().default(null),
  frequency: z.number().default(1),
}));

export const PyqExtractionSchema = z.preprocess((val: any) => {
  if (val && typeof val === "object") {
    return {
      ...val,
      questions: Array.isArray(val.questions) ? val.questions : [],
    };
  }
  return val;
}, z.object({
  subject: z.string().min(1, "Subject is required"),
  year: z.union([z.string(), z.number()]).nullable().default(null),
  questions: z.array(PyqQuestionItemSchema).default([]),
  topic: z.string().nullable().default(null),
  unit: z.string().nullable().default(null),
  source: SourceMetadataSchema.default({
    document_id: null,
    source_name: null,
    source_url: null,
    file_name: null,
  }),
}));

export type PyqQuestionItem = z.infer<typeof PyqQuestionItemSchema>;
export type PyqExtraction = z.infer<typeof PyqExtractionSchema>;

/**
 * 5. NotesExtraction Schema
 * Used for student lecture notes and summaries
 */
export const NoteTopicDetailSchema = z.preprocess((val: any) => {
  if (val && typeof val === "object") {
    const kp = val.keyPoints || val.key_points || [];
    return {
      ...val,
      keyPoints: Array.isArray(kp) ? kp : [],
    };
  }
  return val;
}, z.object({
  topic: z.string().min(1, "Topic title is required"),
  summary: z.string().default(""),
  keyPoints: z.array(z.string()).default([]),
}));

export const NotesExtractionSchema = z.preprocess((val: any) => {
  if (val && typeof val === "object") {
    const kp = val.key_points || val.keyPoints || [];
    return {
      ...val,
      topics: Array.isArray(val.topics) ? val.topics : [],
      key_points: Array.isArray(kp) ? kp : [],
    };
  }
  return val;
}, z.object({
  subject: z.string().min(1, "Subject is required"),
  unit: z.string().nullable().default(null),
  topic: z.string().nullable().default(null),
  content: z.string().default(""),
  topics: z.array(NoteTopicDetailSchema).default([]),
  key_points: z.array(z.string()).default([]),
  source: SourceMetadataSchema.default({
    document_id: null,
    source_name: null,
    source_url: null,
    file_name: null,
  }),
}));

export type NoteTopicDetail = z.infer<typeof NoteTopicDetailSchema>;
export type NotesExtraction = z.infer<typeof NotesExtractionSchema>;

/**
 * 6. CopilotResponse Schema
 * Grounded query answering for student command center
 */
export const CopilotSourceCitationSchema = z.preprocess((val: any) => {
  if (val && typeof val === "object") {
    return {
      title: val.title || "Campus Document",
      ref: val.ref || null,
      type: val.type || "Document",
      url: val.url || null,
      document_id: val.document_id || val.documentId || null,
    };
  }
  return val;
}, z.object({
  title: z.string().default("Campus Document"),
  ref: z.string().nullable().default(null),
  type: z.string().nullable().default("Document"),
  url: z.string().nullable().default(null),
  document_id: z.string().nullable().default(null),
}));

export const CopilotActionSchema = z.object({
  id: z.string().nullable().default(null),
  type: z.string().default("reminder"),
  title: z.string(),
  due_at: z.string().nullable().default(null),
  payload: z.any().nullable().default(null),
});

export const CopilotResponseSchema = z.preprocess((val: any) => {
  if (val && typeof val === "object") {
    return {
      ...val,
      answer: val.answer || val.text || "Information processed.",
      reason: val.reason || "",
      intent: val.intent || "general_query",
      confidence: val.confidence || "high",
      sources: Array.isArray(val.sources) ? val.sources : [],
      actions: Array.isArray(val.actions) ? val.actions : [],
      related_data: val.related_data !== undefined ? val.related_data : val.data !== undefined ? val.data : null,
    };
  }
  return val;
}, z.object({
  answer: z.string().min(1, "Answer cannot be empty"),
  reason: z.string().default(""),
  intent: z.string().default("general_query"),
  confidence: z.enum(["high", "medium", "low"]).default("high"),
  sources: z.array(CopilotSourceCitationSchema).default([]),
  actions: z.array(CopilotActionSchema).default([]),
  related_data: z.any().nullable().default(null),
}));

export type CopilotSourceCitation = z.infer<typeof CopilotSourceCitationSchema>;
export type CopilotAction = z.infer<typeof CopilotActionSchema>;
export type CopilotStructuredResponse = z.infer<typeof CopilotResponseSchema>;

/**
 * 7. StudyPlanResponse Schema
 * Day-wise personalized plan until exam
 */
export const StudyPlanTaskDetailSchema = z.preprocess((val: any) => {
  if (val && typeof val === "object") {
    const mins = typeof val.estimatedMinutes === "number" ? val.estimatedMinutes : typeof val.estimated_minutes === "number" ? val.estimated_minutes : 60;
    return {
      ...val,
      study_time: val.study_time || val.studyTime || `${mins} mins`,
      estimated_minutes: mins,
      priority: val.priority || "MEDIUM",
      recommended_source: val.recommended_source || val.recommendedSource || val.sourceReference || "Verified Course Material",
      pyq_practice: val.pyq_practice !== undefined ? val.pyq_practice : val.pyqPractice !== undefined ? val.pyqPractice : null,
      completed: Boolean(val.completed),
    };
  }
  return val;
}, z.object({
  id: z.string().optional(),
  subject: z.string(),
  topic: z.string(),
  unit: z.string().nullable().optional(),
  study_time: z.string().default("60 mins"),
  estimated_minutes: z.number().default(60),
  priority: z.enum(["HIGH", "MEDIUM", "LOW", "80_20"]).default("MEDIUM"),
  recommended_source: z.string().default("Verified Course Material"),
  pyq_practice: z.any().nullable().default(null),
  completed: z.boolean().default(false),
}));

export const StudyPlanDayDetailSchema = z.preprocess((val: any) => {
  if (val && typeof val === "object") {
    return {
      ...val,
      total_minutes: typeof val.total_minutes === "number" ? val.total_minutes : typeof val.totalMinutes === "number" ? val.totalMinutes : 0,
      tasks: Array.isArray(val.tasks) ? val.tasks : [],
    };
  }
  return val;
}, z.object({
  day: z.number(),
  date: z.string(),
  total_minutes: z.number().default(0),
  tasks: z.array(StudyPlanTaskDetailSchema).default([]),
}));

export const StudyPlanRevisionItemSchema = z.object({
  day: z.number().nullable().default(null),
  date: z.string().nullable().default(null),
  title: z.string(),
  type: z.string().default("formula_recall"),
  description: z.string(),
  duration_minutes: z.number().default(60),
});

export const StudyPlanPyqPracticeItemSchema = z.object({
  topic: z.string(),
  question_count: z.number().default(1),
  years_asked: z.array(z.string()).default([]),
  action: z.string(),
  sample_question: z.string().nullable().default(null),
});

export const StudyPlanResponseSchema = z.preprocess((val: any) => {
  if (val && typeof val === "object") {
    const dailyPlan = val.daily_plan || val.dailySchedule || [];
    const priorityTopics = val.priority_topics || val.highPriorityTopics || [];
    const revisionPlan = val.revision_plan || (val.revisionAndMockSessions ? [
      {
        day: null,
        date: null,
        title: "Pre-Exam Mock & Formula Revision",
        type: "mock_exam",
        description: val.revisionAndMockSessions.description || "Pre-exam revision",
        duration_minutes: 150,
      },
    ] : []);

    return {
      exam: val.exam || val.subject || "Course Examination",
      date: val.date || val.examDate || null,
      total_days: val.total_days || val.daysRemaining || 5,
      daily_plan: dailyPlan,
      priority_topics: priorityTopics,
      revision_plan: revisionPlan,
      pyq_practice: Array.isArray(val.pyq_practice) ? val.pyq_practice : [],
      source: val.source || {
        document_id: null,
        source_name: null,
        source_url: null,
        file_name: null,
      },
    };
  }
  return val;
}, z.object({
  exam: z.string(),
  date: z.string().nullable().default(null),
  total_days: z.number(),
  daily_plan: z.array(StudyPlanDayDetailSchema).default([]),
  priority_topics: z.array(z.string()).default([]),
  revision_plan: z.array(StudyPlanRevisionItemSchema).default([]),
  pyq_practice: z.array(StudyPlanPyqPracticeItemSchema).default([]),
  source: SourceMetadataSchema.default({
    document_id: null,
    source_name: null,
    source_url: null,
    file_name: null,
  }),
}));

export type StudyPlanTaskDetail = z.infer<typeof StudyPlanTaskDetailSchema>;
export type StudyPlanDayDetail = z.infer<typeof StudyPlanDayDetailSchema>;
export type StudyPlanRevisionItem = z.infer<typeof StudyPlanRevisionItemSchema>;
export type StudyPlanPyqPracticeItem = z.infer<typeof StudyPlanPyqPracticeItemSchema>;
export type StudyPlanStructuredResponse = z.infer<typeof StudyPlanResponseSchema>;

/**
 * 8. StudentTodayResponse Schema ("What Should I Do Today?")
 * Combines RGPV deadlines, exams, syllabus progress, PYQs, study plan, placements & actions
 */
export const TodayTaskItemSchema = z.preprocess((val: any) => {
  if (val && typeof val === "object") {
    return {
      ...val,
      id: val.id || `task-today-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      estimated_time: val.estimated_time || val.estimatedTime || "30 mins",
      due_date: val.due_date || val.dueDate || null,
      priority: val.priority ? String(val.priority).toLowerCase() : "medium",
      category: val.category ? String(val.category).toLowerCase() : "action",
      action: typeof val.action === "string" ? {
        type: "reminder",
        title: val.action,
        target_url: null,
        view: null,
        payload: null,
      } : {
        type: val.action?.type || "reminder",
        title: val.action?.title || val.title || "Take Action",
        target_url: val.action?.target_url || val.action?.targetUrl || null,
        view: val.action?.view || null,
        payload: val.action?.payload || null,
      },
      source: val.source || {
        document_id: null,
        source_name: null,
        source_url: null,
        file_name: null,
      },
      completed: Boolean(val.completed),
    };
  }
  return val;
}, z.object({
  id: z.string(),
  title: z.string().min(1, "Task title is required"),
  reason: z.string().default("Priority requirement identified from campus data"),
  priority: z.enum(["critical", "high", "medium", "low"]).default("medium"),
  estimated_time: z.string().default("30 mins"),
  due_date: z.string().nullable().default(null),
  category: z.enum(["deadline", "exam", "study", "placement", "action"]).default("action"),
  action: z.object({
    type: z.string().default("reminder"),
    title: z.string(),
    target_url: z.string().nullable().default(null),
    view: z.string().nullable().default(null),
    payload: z.any().nullable().default(null),
  }),
  source: SourceMetadataSchema.default({
    document_id: null,
    source_name: null,
    source_url: null,
    file_name: null,
  }),
  completed: z.boolean().default(false),
}));

export const StudentTodayResponseSchema = z.preprocess((val: any) => {
  if (val && typeof val === "object") {
    const tasks = Array.isArray(val.tasks) ? val.tasks : [];
    const urgentCount = typeof val.urgent_count === "number" ? val.urgent_count :
      tasks.filter((t: any) => t.priority === "critical" || t.priority === "high").length;
    return {
      ...val,
      date: val.date || new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" }),
      summary: val.summary || "Prioritized daily briefing based on live campus records.",
      tasks,
      urgent_count: urgentCount,
      study_minutes: typeof val.study_minutes === "number" ? val.study_minutes : 0,
      ai_reasoning: val.ai_reasoning || val.aiReasoning || "",
    };
  }
  return val;
}, z.object({
  date: z.string(),
  student: z.object({
    name: z.string(),
    branch: z.string(),
    semester: z.string(),
    cgpa: z.number(),
  }),
  summary: z.string(),
  tasks: z.array(TodayTaskItemSchema).default([]),
  urgent_count: z.number().default(0),
  study_minutes: z.number().default(0),
  ai_reasoning: z.string().default(""),
}));

export type TodayTaskItem = z.infer<typeof TodayTaskItemSchema>;
export type StudentTodayResponse = z.infer<typeof StudentTodayResponseSchema>;

/**
 * =========================================================================
 * JSON REPAIR AND STRICT VALIDATION UTILITY
 * =========================================================================
 */

/**
 * Clean and repair potentially malformed JSON strings returned from LLMs:
 * - Strips Markdown code blocks (```json ... ``` or ``` ...)
 * - Extracts valid outermost JSON object or array
 * - Removes illegal trailing commas
 * - Normalizes undefined/NaN tokens to null
 */
export function repairJsonString(rawText: string): string {
  if (!rawText || typeof rawText !== "string") {
    return "{}";
  }

  let text = rawText.trim();

  // 1. Remove Markdown code blocks
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "");
    text = text.replace(/\s*```$/, "");
    text = text.trim();
  }

  // 2. Find boundary of first JSON object { or array [
  const firstBrace = text.indexOf("{");
  const firstBracket = text.indexOf("[");

  let startIdx = -1;
  let isArray = false;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    isArray = false;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    isArray = true;
  }

  if (startIdx !== -1) {
    const endChar = isArray ? "]" : "}";
    const lastIdx = text.lastIndexOf(endChar);
    if (lastIdx > startIdx) {
      text = text.substring(startIdx, lastIdx + 1);
    }
  }

  // 3. Remove trailing commas before closing braces/brackets (common LLM JSON flaw)
  text = text.replace(/,\s*([\]}])/g, "$1");

  // 4. Replace unquoted special tokens
  text = text.replace(/:\s*undefined\b/g, ": null");
  text = text.replace(/:\s*NaN\b/g, ": null");

  return text;
}

/**
 * Safely parse and validate Gemini output with a Zod schema.
 * If JSON parsing fails or validation fails, it provides descriptive error details
 * and returns the validated fallback.
 */
export function safeValidateGeminiOutput<T>(
  schema: z.ZodType<T>,
  rawOutput: string,
  fallback: T
): { success: boolean; data: T; error?: string } {
  try {
    const cleaned = repairJsonString(rawOutput);
    const parsed = JSON.parse(cleaned);

    const validationResult = schema.safeParse(parsed);
    if (validationResult.success) {
      return { success: true, data: validationResult.data };
    }

    console.warn("Zod schema validation failed for Gemini output:", validationResult.error.format());
    return {
      success: false,
      data: fallback,
      error: validationResult.error.message,
    };
  } catch (err: any) {
    console.warn("JSON repair/parse failed for Gemini output:", err?.message || err);
    return {
      success: false,
      data: fallback,
      error: err?.message || "Invalid JSON output from Gemini",
    };
  }
}
