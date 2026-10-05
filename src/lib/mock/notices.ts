export interface HighlightAnnotation {
  id: string;
  field: "deadline" | "eligibility" | "fee" | "documents";
  label: string;
  colorClass: string;
  exactSnippet: string;
}

export interface DetailedNoticeData {
  id: string;
  title: string;
  category: "Exams" | "Placement" | "Academics" | "Scholarship" | "Hostel";
  officialRef: string;
  publishedAgo: string;
  datePublished: string;
  rawText: string;
  rawExcerpt?: string;
  inShortSummary: string; // 5-second comprehension
  deadline: string;
  deadlineIso: string;
  targetAudience: string;
  branches: string[];
  semesterAllowed: string[];
  lateFee: string;
  requiredDocuments: string[];
  isEligibleForStudent: boolean;
  studentStatusReason: string;
  notForYouMessage?: string;
  whatChanged?: {
    field: string;
    oldVal: string;
    newVal: string;
    isDifferent: boolean;
  }[];
  conflictAlert?: {
    hasConflict: boolean;
    sourceA: { name: string; date: string };
    sourceB: { name: string; date: string };
    recommendation: string;
  };
  sources: {
    name: string;
    role: "Primary source" | "Last checked recently" | "Reference";
    docType: string;
    uploadedAgo: string;
  }[];
  confidence: "High confidence" | "Medium confidence" | "Needs verification";
  confidenceDetails: string;
  highlightAnnotations: HighlightAnnotation[];
  suggestedQuestions: {
    question: string;
    answerEnglish: string;
    answerHinglish: string;
  }[];
}

export const DETAILED_NOTICES: DetailedNoticeData[] = [
  {
    id: "notice-exam-reg",
    title: "RGPV ODD SEMESTER EXAMINATION FORM REGISTRATION 2026-27",
    category: "Exams",
    officialRef: "CIRCULAR NO. RGPV/EXAM/2026/419",
    datePublished: "04 October 2026",
    publishedAgo: "Yesterday • 4:30 PM",
    inShortSummary:
      "5th semester students of UIT-RGPV and affiliated colleges must submit their online odd semester examination form on rgpv.ac.in by 11 October at 11:59 PM. A ₹500 late fee applies afterward under RGPV Ordinance No. 4. You are registered in 5th Semester CSE (0101CS221084) and eligible.",
    deadline: "11 October 2026 · 11:59 PM",
    deadlineIso: "2026-10-11T23:59:00",
    targetAudience: "5th Semester B.Tech Students (RGPV Bhopal)",
    branches: ["CSE", "AIML", "DS", "IT", "ECE"],
    semesterAllowed: ["5th Semester"],
    lateFee: "₹500 after 11 October",
    requiredDocuments: [
      "Student ID Card",
      "Enrollment Number (0101CS221084)",
      "Current Semester Fee Receipt",
    ],
    isEligibleForStudent: true,
    studentStatusReason:
      "The notice strictly applies to regular B.Tech candidates of Rajiv Gandhi Proudyogiki Vishwavidyalaya. Your profile is verified as UIT-RGPV B.Tech 5th Semester Computer Science with 78.4% attendance (exceeds the 75% cutoff enforced under RGPV Ordinance No. 4).",
    whatChanged: [
      {
        field: "Submission Deadline",
        oldVal: "14 October 2026",
        newVal: "11 October 2026",
        isDifferent: true,
      },
      {
        field: "Late Fine Penalty",
        oldVal: "₹500",
        newVal: "₹500",
        isDifferent: false,
      },
      {
        field: "Eligible Branches",
        oldVal: "All B.Tech Regular (RGPV)",
        newVal: "All B.Tech Regular (RGPV)",
        isDifferent: false,
      },
    ],
    conflictAlert: {
      hasConflict: true,
      sourceA: { name: "RGPV Web Portal (www.rgpv.ac.in)", date: "12 October 2026 • 5:00 PM" },
      sourceB: { name: "Controller Signed Gazette (RGPV)", date: "11 October 2026 • 11:59 PM" },
      recommendation:
        "Two campus sources contain different deadlines. The RGPV Controller's signed circular is the most recent legal authority, but verify with the examination cell before acting.",
    },
    sources: [
      {
        name: "Uploaded RGPV Controller Circular (PDF)",
        role: "Primary source",
        docType: "Gazetted Signed PDF • RGPV Bhopal",
        uploadedAgo: "Uploaded 2h ago",
      },
      {
        name: "RGPV Official Web Portal (www.rgpv.ac.in)",
        role: "Last checked recently",
        docType: "Live Scraped Announcement",
        uploadedAgo: "Last verified 15m ago",
      },
      {
        name: "RGPV Academic Calendar & Ordinance No. 4",
        role: "Reference",
        docType: "Registrar Gazette (M.P. State)",
        uploadedAgo: "Updated August 2026",
      },
    ],
    confidence: "High confidence",
    confidenceDetails: "Cross-referenced directly with official live notices from https://www.rgpv.ac.in/ and RGPV Examination Gazette.",
    rawText: `RAJIV GANDHI PROUDYOGIKI VISHWAVIDYALAYA, BHOPAL
(STATE TECHNOLOGICAL UNIVERSITY OF MADHYA PRADESH)
AIRPORT ROAD, GANDHI NAGAR, BHOPAL - 462033
OFFICE OF THE CONTROLLER OF EXAMINATIONS
CIRCULAR REF: RGPV/EXAM/2026/419                          DATE: 04/10/2026

SUBJECT: FILLING UP OF ODD SEMESTER EXAMINATION FORMS (SESSION 2026-27)

It is hereby notified for the information of all regular students of B.Tech 5th Semester (CSE/AIML/DS/IT/ECE) of University Teaching Departments (UTDs) and affiliated colleges that the university examination portal (rgpv.ac.in) for filling up odd-semester examination forms is now open.

1. SUBMISSION SCHEDULE:
   The last date for filling up examination forms online without late fee is 11th October 2026 up to 11:59 PM.
   
2. LATE FINE SCHEDULE:
   A late fine of Rs. 500/- will be automatically levied for forms submitted between 12th October and 15th October 2026. No examination forms will be entertained under any circumstance thereafter.

3. MANDATORY ELIGIBILITY & PREREQUISITES (RGPV ORDINANCE NO. 4):
   - Candidates must possess valid student ID and university enrollment number (e.g. 0101CS221084).
   - Proof of full tuition fee payment (fee receipt) must be attached.
   - Minimum 75% attendance is strictly enforced for generation of electronic admit cards.

Students facing portal connectivity issues should report to Room 102, Administrative & Examination Block, RGPV Bhopal before 10th October 4:00 PM.

Sd/-
Controller of Examinations
Rajiv Gandhi Proudyogiki Vishwavidyalaya, Bhopal`,
    rawExcerpt: `RAJIV GANDHI PROUDYOGIKI VISHWAVIDYALAYA, BHOPAL
CIRCULAR REF: RGPV/EXAM/2026/419                               DATE: 04/10/2026
SUBJECT: FILLING UP OF ODD SEMESTER EXAMINATION FORMS (SESSION 2026-27)
Last date without late fee on rgpv.ac.in: 11 October 2026 up to 11:59 PM. Late fine of Rs. 500/- will be levied between 12-15 October under RGPV Ordinance No. 4.`,
    highlightAnnotations: [
      {
        id: "hl-deadline",
        field: "deadline",
        label: "Deadline",
        colorClass: "bg-amber-200/90 text-amber-900 border-amber-400",
        exactSnippet: "11th October 2026 up to 11:59 PM",
      },
      {
        id: "hl-eligibility",
        field: "eligibility",
        label: "Eligibility",
        colorClass: "bg-blue-200/90 text-blue-900 border-blue-400",
        exactSnippet: "B.Tech 5th Semester (CSE/AIML/DS/IT/ECE)",
      },
      {
        id: "hl-fee",
        field: "fee",
        label: "Late Fee",
        colorClass: "bg-emerald-200/90 text-emerald-900 border-emerald-400",
        exactSnippet: "late fine of Rs. 500/- will be automatically levied",
      },
      {
        id: "hl-docs",
        field: "documents",
        label: "Required Documents",
        colorClass: "bg-purple-200/90 text-purple-900 border-purple-400",
        exactSnippet: "student ID and enrollment number. Proof of full tuition fee payment (fee receipt)",
      },
    ],
    suggestedQuestions: [
      {
        question: "Who is eligible for this notice?",
        answerEnglish:
          "All regular students of B.Tech 5th Semester in CSE, AIML, DS, IT, and ECE with at least 75% attendance are eligible.",
        answerHinglish:
          "Ye notice 5th semester ke regular B.Tech students (CSE, AIML, IT, ECE) ke liye hai jinki attendance 75% se upar hai.",
      },
      {
        question: "What happens if I miss the 11 October deadline?",
        answerEnglish:
          "A late fine of ₹500 will be added from 12 October to 15 October. After 15 October, no forms will be accepted and you won't get an admit card.",
        answerHinglish:
          "Agar 11 October ke baad form bhara to ₹500 fine lagega 15 October tak. Uske baad portal band ho jayega.",
      },
      {
        question: "Is notice ka matlab kya hai?",
        answerEnglish:
          "This notice requires 5th semester students to complete the odd semester exam form before 11 Oct 11:59 PM to avoid a ₹500 late fee.",
        answerHinglish:
          "Is notice ka main point ye hai ki 5th sem students ko odd-sem exam form 11 October 11:59 PM tak bina late fee ke submit karna hai. Baad me ₹500 fine lagega.",
      },
      {
        question: "What documents do I need to keep ready?",
        answerEnglish:
          "You need your Student ID Card, Enrollment Number (22CSE084), and Semester Fee Payment Receipt.",
        answerHinglish:
          "Aapko apna Student ID card, Enrollment number, aur semester fee receipt upload karni hogi.",
      },
    ],
  },
  {
    id: "notice-7th-sem-capstone",
    title: "FINAL YEAR CAPSTONE PROJECT & PLACEMENT VIVA",
    category: "Academics",
    officialRef: "CIRCULAR NO. DEAN/PROJECT/2026/092",
    datePublished: "02 October 2026",
    publishedAgo: "3 days ago",
    inShortSummary:
      "This circular pertains exclusively to 7th Semester B.Tech candidates submitting their final major project proposals and industrial internship clearances.",
    deadline: "18 October 2026 · 5:00 PM",
    deadlineIso: "2026-10-18T17:00:00",
    targetAudience: "7th Semester Final Year Students",
    branches: ["All Branches"],
    semesterAllowed: ["7th Semester"],
    lateFee: "Project grade penalty after cutoff",
    requiredDocuments: ["Industry Mentor Sign-off", "Synopsis Report"],
    isEligibleForStudent: false,
    studentStatusReason:
      "This notice is exclusively for 7th semester graduating seniors. Your profile is registered as 5th Semester.",
    notForYouMessage:
      "This notice is for 7th semester students. Your profile: 5th Semester. Don't worry — you don't need to take action.",
    sources: [
      {
        name: "Dean of Academics Notice Board",
        role: "Primary source",
        docType: "Official PDF Memo",
        uploadedAgo: "3 days ago",
      },
    ],
    confidence: "High confidence",
    confidenceDetails: "Audience verified against curriculum handbook.",
    rawText: `OFFICE OF THE DEAN (ACADEMIC AFFAIRS)
NOTICE FOR FINAL YEAR STUDENTS (7TH SEMESTER)
Ref: DEAN/PROJECT/2026/092                                 Date: 02/10/2026

All candidates of B.Tech 7th Semester are hereby informed that the Major Capstone Project synopsis and internship clearance certificate must be submitted to departmental coordinators by 18 October 2026, 5:00 PM. No evaluations will proceed without industry mentor signoff.`,
    highlightAnnotations: [
      {
        id: "hl-7th-sem",
        field: "eligibility",
        label: "Target Audience",
        colorClass: "bg-rose-200 text-rose-900 border-rose-400",
        exactSnippet: "All candidates of B.Tech 7th Semester",
      },
    ],
    suggestedQuestions: [
      {
        question: "Do I need to do anything for this notice?",
        answerEnglish:
          "No action needed from you. You are in 5th semester, and this requirement only applies to 7th semester students.",
        answerHinglish:
          "Aapko kuch nahi karna hai. Ye circular 7th semester seniors ke liye hai, aap 5th semester me ho.",
      },
    ],
  },
];

export interface RecentNoticeHistoryItem {
  id: string;
  title: string;
  category: string;
  date: string;
  priorityText: string;
  statusColor: string;
  actionText: string;
}

export const RECENT_NOTICE_HISTORY: RecentNoticeHistoryItem[] = [
  {
    id: "hist-1",
    title: "RGPV Odd Sem Exam Form Registration 2026-27",
    category: "Exams",
    date: "Deadline 11 Oct",
    priorityText: "High priority • Action required",
    statusColor: "text-rose-600 bg-rose-50 border-rose-200",
    actionText: "Fill Form",
  },
  {
    id: "hist-2",
    title: "Imprenditore 5.0 by E-Cell RGPV",
    category: "Events",
    date: "29-30 Oct 2026",
    priorityText: "₹3L Grant Pool • 2-Day Duty Leave",
    statusColor: "text-purple-700 bg-purple-50 border-purple-200",
    actionText: "RSVP",
  },
  {
    id: "hist-3",
    title: "Online Nanotechnology Certification (SoNT RGPV)",
    category: "Academics",
    date: "Closes 10 Oct",
    priorityText: "AICTE Accredited • Eligible",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    actionText: "Register",
  },
  {
    id: "hist-4",
    title: "CLC Vacant Position for B.Tech CSE (AI & ML) - SoIT RGPV",
    category: "Admission",
    date: "Merit List",
    priorityText: "Institutional Round • SoIT",
    statusColor: "text-blue-700 bg-blue-50 border-blue-200",
    actionText: "View Seats",
  },
  {
    id: "hist-5",
    title: "NIDAR 2026-27: Largest Student Drone Tournament (RGPV)",
    category: "Events",
    date: "Live Competition",
    priorityText: "Sports Complex • Eligible",
    statusColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
    actionText: "Join Team",
  },
  {
    id: "hist-6",
    title: "DigiLocker Marksheets & Degree on ABC ID (RGPV/REG/2942)",
    category: "General",
    date: "Sync Active",
    priorityText: "Verified • NAD ABC ID",
    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    actionText: "Link ABC ID",
  },
  {
    id: "hist-7",
    title: "Challenge Persuasion / Revaluation Notice (RGPV/EXAM/2979)",
    category: "Exams",
    date: "Within 15 Days",
    priorityText: "B.Tech Regular & Ex • Open",
    statusColor: "text-amber-700 bg-amber-50 border-amber-200",
    actionText: "Inspect",
  },
];

export type StructuredNoticeItem = DetailedNoticeData;
export const STUDENT_NOTICES: StructuredNoticeItem[] = DETAILED_NOTICES;

