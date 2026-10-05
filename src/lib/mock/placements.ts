export interface RequirementItem {
  name: string;
  required: string;
  studentValue: string;
  isSatisfied: boolean;
  blockerSeverity?: "critical" | "warning" | "none";
}

export interface DetailedPlacementOpportunity {
  id: string;
  company: string;
  role: string;
  packageText: string;
  deadlineText: string;
  matchScore: number;
  isEligible: boolean;
  eligibilityStatusText: "🟢 YOU ARE ELIGIBLE" | "🔴 NOT ELIGIBLE";
  summaryText: string;
  batch: string;
  requirements: RequirementItem[];
  matchBreakdown: {
    eligibilityPercent: number;
    skillsPercent: number;
    profileCompletenessPercent: number;
  };
  skillGap?: {
    skillName: string;
    explanation: string;
    actionLabel: string;
  };
  whyExplanation: string[];
  whySeeingThis?: string[];
  notEligibleReason?: {
    requiredCGPA: number;
    studentCGPA: number;
    difference: number;
    blockersSummary: {
      field: string;
      status: "blocker" | "passed";
      text: string;
    }[];
  };
  sourceDocument: {
    filename: string;
    uploadedAgo: string;
    officialNoticeTag: string;
    url?: string;
  };
  confidence: {
    level: "HIGH CONFIDENCE" | "MEDIUM CONFIDENCE" | "NEEDS VERIFICATION";
    reason: string;
  };
  nextSteps: {
    headline: string;
    deadlineNotice: string;
    actions: {
      id: string;
      label: string;
      type: "primary" | "secondary" | "reminder";
    }[];
  };
  preparationPlan?: {
    company: string;
    priorities: { priority: number; topic: string; why: string }[];
    sevenDaySchedule: { day: string; focus: string; hours: string }[];
  };
  suggestedQuestions: {
    question: string;
    answer: string;
  }[];
}

export const DETAILED_PLACEMENTS: DetailedPlacementOpportunity[] = [
  {
    id: "tcs-digital",
    company: "TCS Digital",
    role: "Digital Specialist Engineer",
    packageText: "₹7.5 – ₹9.0 LPA",
    deadlineText: "Tomorrow · 11:59 PM",
    matchScore: 92,
    isEligible: true,
    eligibilityStatusText: "🟢 YOU ARE ELIGIBLE",
    summaryText: "You satisfy all mandatory eligibility criteria.",
    batch: "2027 Batch",
    requirements: [
      {
        name: "Branch",
        required: "CSE / IT",
        studentValue: "CSE ✓",
        isSatisfied: true,
        blockerSeverity: "none",
      },
      {
        name: "CGPA",
        required: "≥ 7.5",
        studentValue: "7.8 ✓",
        isSatisfied: true,
        blockerSeverity: "none",
      },
      {
        name: "Backlogs",
        required: "0 Active",
        studentValue: "0 ✓",
        isSatisfied: true,
        blockerSeverity: "none",
      },
      {
        name: "Graduation",
        required: "2027",
        studentValue: "2027 ✓",
        isSatisfied: true,
        blockerSeverity: "none",
      },
    ],
    matchBreakdown: {
      eligibilityPercent: 100,
      skillsPercent: 78,
      profileCompletenessPercent: 90,
    },
    skillGap: {
      skillName: "Docker",
      explanation:
        "Docker isn't required for eligibility, but it appears in the preferred skills section for Cloud Native track candidates.",
      actionLabel: "Learn Docker (40 min primer)",
    },
    whyExplanation: [
      "Your branch matches the mandatory requirement (CSE).",
      "Your CGPA (7.8) is above the minimum cutoff of 7.5.",
      "You have 0 active backlogs in your university academic history.",
      "Your graduation year (2027) precisely matches the eligible batch.",
    ],
    sourceDocument: {
      filename: "TCS Digital Placement Circular.pdf",
      uploadedAgo: "Today · 2:14 PM",
      officialNoticeTag: "Official Placement Notice • Circular #T&P/2026/088",
    },
    confidence: {
      level: "HIGH CONFIDENCE",
      reason:
        "All mandatory requirements were found in the placement circular and matched with your verified profile.",
    },
    nextSteps: {
      headline: "Apply before 11:59 PM",
      deadlineNotice: "T&P Portal closes registration in 18 hours.",
      actions: [
        { id: "apply", label: "Open Application", type: "primary" },
        { id: "reminder", label: "Add Reminder", type: "reminder" },
        { id: "prep", label: "Prepare for Interview", type: "secondary" },
      ],
    },
    preparationPlan: {
      company: "TCS Digital",
      priorities: [
        { priority: 1, topic: "Aptitude", why: "Round 1 speed filtration (Quantitative & Logic)" },
        { priority: 2, topic: "DSA", why: "Arrays, Trees & Graphs live coding questions" },
        { priority: 3, topic: "DBMS", why: "SQL joins, indexing & ACID properties" },
        { priority: 4, topic: "OOP", why: "Inheritance, Polymorphism & Design Patterns" },
      ],
      sevenDaySchedule: [
        { day: "Day 1-2", focus: "Speed Quantitative Aptitude & Numerical Ability", hours: "3 hrs/day" },
        { day: "Day 3-4", focus: "Binary Trees, Dynamic Programming & Graph BFS/DFS", hours: "4 hrs/day" },
        { day: "Day 5", focus: "Complex SQL Queries, Normalization & Indexing", hours: "3 hrs/day" },
        { day: "Day 6", focus: "OOP Concepts, Class Diagrams & Code Refactoring", hours: "3 hrs/day" },
        { day: "Day 7", focus: "TCS Previous Year Coding Simulator & Mock Test", hours: "4 hrs/day" },
      ],
    },
    suggestedQuestions: [
      {
        question: "What should I prepare for TCS?",
        answer:
          "TCS Digital focuses on 4 core pillars: Priority 1 Aptitude (Round 1 speed), Priority 2 DSA (Tree & Graph algorithms), Priority 3 DBMS (SQL joins), and Priority 4 OOP principles. Check the 7-day preparation schedule above.",
      },
      {
        question: "Why am I eligible?",
        answer:
          "You meet 100% of hard constraints: CSE branch, 7.8 CGPA (exceeds 7.5 cutoff), 0 active backlogs, and 2027 graduation year.",
      },
      {
        question: "What skills am I missing?",
        answer:
          "You are fully eligible. However, Docker is listed as a preferred skill which can boost your interview ranking. We recommend spending 40 mins on basic containerization.",
      },
      {
        question: "Summarize this placement notice",
        answer:
          "TCS Digital hiring for 2027 batch. Package ₹7.5-9.0 LPA. Online assessment comprises Advanced Aptitude + Coding. Deadline is tomorrow 11:59 PM.",
      },
      {
        question: "Create a preparation plan",
        answer:
          "We generated a dedicated 7-day tactical sprint: 2 days Aptitude, 2 days DSA, 1 day DBMS, 1 day OOP, and 1 day full mock assessment.",
      },
    ],
  },
  {
    id: "infosys-sp",
    company: "Infosys Specialist Programmer",
    role: "Specialist Programmer (L1)",
    packageText: "₹8.0 – ₹9.5 LPA",
    deadlineText: "In 3 Days · 08 Oct",
    matchScore: 84,
    isEligible: true,
    eligibilityStatusText: "🟢 YOU ARE ELIGIBLE",
    summaryText: "You satisfy all mandatory eligibility criteria.",
    batch: "2027 Batch",
    requirements: [
      {
        name: "Branch",
        required: "CSE / IT",
        studentValue: "CSE ✓",
        isSatisfied: true,
        blockerSeverity: "none",
      },
      {
        name: "CGPA",
        required: "≥ 7.0",
        studentValue: "7.8 ✓",
        isSatisfied: true,
        blockerSeverity: "none",
      },
      {
        name: "Backlogs",
        required: "0 Active",
        studentValue: "0 ✓",
        isSatisfied: true,
        blockerSeverity: "none",
      },
      {
        name: "Graduation",
        required: "2027",
        studentValue: "2027 ✓",
        isSatisfied: true,
        blockerSeverity: "none",
      },
    ],
    matchBreakdown: {
      eligibilityPercent: 100,
      skillsPercent: 72,
      profileCompletenessPercent: 88,
    },
    skillGap: {
      skillName: "Advanced Dynamic Programming",
      explanation:
        "Specialist Programmer coding assessments frequently test 2D/3D DP and Bitmasking techniques.",
      actionLabel: "Practice DP Patterns",
    },
    whyExplanation: [
      "Your branch matches the requirement (CSE).",
      "Your CGPA is 7.8 (above the 7.0 cutoff).",
      "Zero active backlogs.",
      "Graduation year is 2027.",
    ],
    sourceDocument: {
      filename: "Infosys_SP_Circular_2026.pdf",
      uploadedAgo: "Yesterday · 4:00 PM",
      officialNoticeTag: "T&P Gazette #INF/2026/041",
    },
    confidence: {
      level: "HIGH CONFIDENCE",
      reason: "All mandatory gates validated with departmental registrar records.",
    },
    nextSteps: {
      headline: "Registration Open — 3 Days Remaining",
      deadlineNotice: "HackWithInfy registration slot closes 08 Oct.",
      actions: [
        { id: "apply", label: "Open Application", type: "primary" },
        { id: "reminder", label: "Add Reminder", type: "reminder" },
        { id: "prep", label: "Prepare for Coding Round", type: "secondary" },
      ],
    },
    suggestedQuestions: [
      {
        question: "What is the assessment pattern?",
        answer: "3 competitive programming problems of hard difficulty within 3 hours.",
      },
      {
        question: "Why am I eligible?",
        answer: "Your 7.8 CGPA clears the 7.0 cutoff, with 0 backlogs in CSE 2027 batch.",
      },
    ],
  },
  {
    id: "google-step",
    company: "Google STEP",
    role: "Student Training in Engineering Program",
    packageText: "₹1,15,000 / month Stipend",
    deadlineText: "In 5 Days · 10 Oct",
    matchScore: 61,
    isEligible: false,
    eligibilityStatusText: "🔴 NOT ELIGIBLE",
    summaryText: "CGPA requirement not met (Requires 8.0, your CGPA is 7.8).",
    batch: "2027 Batch",
    requirements: [
      {
        name: "CGPA",
        required: "≥ 8.0",
        studentValue: "7.8 ✗",
        isSatisfied: false,
        blockerSeverity: "critical",
      },
      {
        name: "Branch",
        required: "CSE / IT / ECE",
        studentValue: "CSE ✓",
        isSatisfied: true,
        blockerSeverity: "none",
      },
      {
        name: "Backlogs",
        required: "0 Active",
        studentValue: "0 ✓",
        isSatisfied: true,
        blockerSeverity: "none",
      },
      {
        name: "Graduation",
        required: "2027",
        studentValue: "2027 ✓",
        isSatisfied: true,
        blockerSeverity: "none",
      },
    ],
    matchBreakdown: {
      eligibilityPercent: 0,
      skillsPercent: 82,
      profileCompletenessPercent: 90,
    },
    notEligibleReason: {
      requiredCGPA: 8.0,
      studentCGPA: 7.8,
      difference: 0.2,
      blockersSummary: [
        {
          field: "CGPA",
          status: "blocker",
          text: "Below required threshold (Required: 8.0, Your CGPA: 7.8, Difference: -0.2)",
        },
        {
          field: "Branch",
          status: "passed",
          text: "Matches eligible engineering program (CSE)",
        },
        {
          field: "Graduation Year",
          status: "passed",
          text: "Eligible cohort match (2027)",
        },
      ],
    },
    whyExplanation: [
      "The minimum academic threshold set by the company recruiter is 8.00 CGPA.",
      "Your verified university CGPA is currently 7.80.",
      "You are 0.20 grade points below the strict automated cutoff.",
    ],
    sourceDocument: {
      filename: "Google_STEP_Internship_2026.pdf",
      uploadedAgo: "02 Oct · 11:30 AM",
      officialNoticeTag: "Off-Campus Recruiter Referral Memo",
    },
    confidence: {
      level: "HIGH CONFIDENCE",
      reason: "Recruiter cutoff verified directly from published PDF eligibility schedule.",
    },
    nextSteps: {
      headline: "2 Better Matching Opportunities Found",
      deadlineNotice:
        "Don't worry — your profile is fully eligible for TCS Digital and Infosys SP.",
      actions: [
        { id: "matches", label: "Show Better Matches", type: "primary" },
        { id: "cgpa_plan", label: "Calculate CGPA Recovery", type: "secondary" },
      ],
    },
    suggestedQuestions: [
      {
        question: "Why am I not eligible?",
        answer:
          "Google STEP requires a minimum of 8.0 CGPA at the time of application. Your current CGPA is 7.8 (difference of 0.2).",
      },
      {
        question: "What opportunities am I eligible for?",
        answer:
          "You are fully eligible for TCS Digital (cutoff 7.5, 92% match) and Infosys Specialist Programmer (cutoff 7.0, 84% match).",
      },
    ],
  },
];

// For backward compatibility with existing views
export type StudentOpportunity = DetailedPlacementOpportunity;
export const STUDENT_OPPORTUNITIES: any[] = DETAILED_PLACEMENTS;
