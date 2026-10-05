export interface StudentProfile {
  name: string;
  avatar: string;
  branch: string;
  semester: string;
  rollNo: string;
  cgpa: number;
  backlogs: number;
  overallAttendance: number;
  courses: {
    code: string;
    name: string;
    attendance: number;
    classesConducted: number;
    classesAttended: number;
    nextClass: string;
    isRisk: boolean;
  }[];
}

export const CURRENT_STUDENT: StudentProfile = {
  name: "Isha Sharma",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  branch: "Computer Science & Engineering",
  semester: "5th Semester",
  rollNo: "22CSE084",
  cgpa: 8.1,
  backlogs: 0,
  overallAttendance: 77.4,
  courses: [
    {
      code: "CS501",
      name: "Database Management Systems",
      attendance: 82.0,
      classesConducted: 40,
      classesAttended: 33,
      nextClass: "Tomorrow, 09:30 AM (Exam)",
      isRisk: false,
    },
    {
      code: "CS502",
      name: "Operating Systems",
      attendance: 75.0,
      classesConducted: 36,
      classesAttended: 27,
      nextClass: "Wednesday, 11:30 AM",
      isRisk: false,
    },
    {
      code: "CS503",
      name: "Computer Networks",
      attendance: 68.2,
      classesConducted: 44,
      classesAttended: 30,
      nextClass: "Tomorrow, 02:00 PM",
      isRisk: true,
    },
    {
      code: "CS504",
      name: "Theory of Computation",
      attendance: 84.5,
      classesConducted: 39,
      classesAttended: 33,
      nextClass: "Thursday, 10:30 AM",
      isRisk: false,
    },
    {
      code: "CS505",
      name: "Artificial Intelligence Lab",
      attendance: 88.0,
      classesConducted: 25,
      classesAttended: 22,
      nextClass: "Friday, 02:00 PM",
      isRisk: false,
    },
  ],
};

export interface CampusNotice {
  id: string;
  title: string;
  category: "Exams" | "Placement" | "Academics" | "Events" | "Administration";
  rawText: string;
  datePublished: string;
  officialRef: string;
  structuredData: {
    headline: string;
    deadline: string;
    targetAudience: string;
    feesOrPackage?: string;
    keyPoints: string[];
    actionLabel: string;
    actionUrl?: string;
    actionType: "form" | "apply" | "calendar" | "download";
  };
}

export const SAMPLE_NOTICES: CampusNotice[] = [
  {
    id: "notice-exam-form",
    title: "Odd Semester Examination Form Notice",
    category: "Exams",
    officialRef: "CIRCULAR NO. EXAM/2026/419",
    datePublished: "Yesterday • 4:30 PM",
    rawText: `OFFICE OF THE CONTROLLER OF EXAMINATIONS
Ref: EXAM/2026/419                                Date: 04/10/2026
NOTICE FOR ALL B.TECH 5TH SEMESTER STUDENTS
It is hereby notified to all regular candidates of B.Tech 5th Semester (CSE/IT/ECE/ME) that the portal for filling up odd semester examination forms for session 2026-27 is active. The last date to submit the examination form online without late fine is 10th October 2026. After the stipulated date, a late fine of Rs. 500/- will be levied till 15th October 2026. Ensure no dues clearance before final submission. Admit cards will NOT be issued to students with attendance below 75%.
Sd/- Controller of Examinations`,
    structuredData: {
      headline: "5th Semester Examination Form Portal Active",
      deadline: "10 October 2026 (Without Late Fee)",
      targetAudience: "5th Sem B.Tech (All Branches)",
      feesOrPackage: "₹0 Normal • ₹500 Late Fine after 10 Oct",
      keyPoints: [
        "Online submission mandatory on university ERP",
        "Minimum 75% attendance enforced for admit card release",
        "Clear departmental dues before fee payment",
      ],
      actionLabel: "Submit Examination Form",
      actionType: "form",
    },
  },
  {
    id: "notice-tcs-drive",
    title: "TCS National Qualifier & Campus Hiring 2026",
    category: "Placement",
    officialRef: "T&P/DRIVE/2026/088",
    datePublished: "2 Hours ago",
    rawText: `TRAINING & PLACEMENT CELL
CIRCULAR: TCS RECRUITMENT DRIVE 2026
Tata Consultancy Services (TCS) invites applications from final & pre-final year engineering students for Ninja & Digital software engineering roles.
Eligibility Criteria:
- Minimum 7.5 CGPA throughout 10th, 12th & Graduation
- Maximum 1 backlog allowed at the time of interview (0 backlogs preferred)
- Branches: B.Tech CSE, IT, AI-DS, ECE
- Skill preferences: Java/Python, DSA, Docker/Cloud basics
Interested eligible candidates must register on the T&P portal and upload verified resume by 08 October 2026, 6:00 PM.`,
    structuredData: {
      headline: "TCS Campus Hiring Drive 2026 (Ninja & Digital)",
      deadline: "08 October 2026 • 6:00 PM",
      targetAudience: "B.Tech CSE, IT, ECE (CGPA ≥ 7.5)",
      feesOrPackage: "₹7.2 LPA (Digital) / ₹3.6 LPA (Ninja)",
      keyPoints: [
        "Eligibility verified: CGPA 8.1 qualifies you (cut-off: 7.5)",
        "Zero active backlogs requirement satisfied",
        "Recommended action: Brush up on Docker containerization basics",
      ],
      actionLabel: "Register for TCS Drive",
      actionType: "apply",
    },
  },
  {
    id: "notice-hackathon",
    title: "National Smart Campus AI Hackathon 2026",
    category: "Events",
    officialRef: "INNOVATION-CELL/HACK/04",
    datePublished: "Today • 11:00 AM",
    rawText: `CENTRE FOR INNOVATION & INCUBATION
Annual 36-Hour Hackathon Registrations Open!
Problem Statements: AI in Education, Campus Logistics, Sustainable Energy.
Prizes worth ₹2,50,000 + Direct Seed Funding Interviews.
Team Size: 2 to 4 members. University will provide 2-day attendance concession for all selected participants.
Abstract submission deadline: 14 October 2026.`,
    structuredData: {
      headline: "36-Hour Smart Campus AI Hackathon",
      deadline: "14 October 2026 (Abstract Submission)",
      targetAudience: "Open to all UG/PG students",
      feesOrPackage: "₹2,50,000 Prize Pool + Attendance Concession",
      keyPoints: [
        "2-day duty leave provided for selected participants",
        "Themes align with your current AI & Full-Stack coursework",
        "Team matching enabled in Campus Copilot",
      ],
      actionLabel: "Submit Hackathon Idea",
      actionType: "apply",
    },
  },
];

export interface PlacementOpportunity {
  id: string;
  company: string;
  role: string;
  ctc: string;
  matchScore: number;
  deadline: string;
  cgpaRequired: number;
  backlogsAllowed: number;
  eligibleBranches: string[];
  matchedSkills: string[];
  missingSkills: string[];
  userEligible: boolean;
  status: "Recruiting" | "Closes Soon" | "Shortlisting";
}

export const PLACEMENT_OPPORTUNITIES: PlacementOpportunity[] = [
  {
    id: "tcs-2026",
    company: "Tata Consultancy Services",
    role: "System Engineer / Digital Specialist",
    ctc: "₹7.2 – ₹9.0 LPA",
    matchScore: 92,
    deadline: "In 2 days (08 Oct)",
    cgpaRequired: 7.5,
    backlogsAllowed: 0,
    eligibleBranches: ["CSE", "IT", "ECE"],
    matchedSkills: ["Data Structures", "SQL / DBMS", "Python", "Algorithms", "System Design"],
    missingSkills: ["Docker & Containers"],
    userEligible: true,
    status: "Closes Soon",
  },
  {
    id: "zomato-sde",
    company: "Zomato",
    role: "Frontend Engineer (Product)",
    ctc: "₹14.0 – ₹18.0 LPA",
    matchScore: 95,
    deadline: "In 5 days (11 Oct)",
    cgpaRequired: 7.0,
    backlogsAllowed: 1,
    eligibleBranches: ["Any Tech Branch"],
    matchedSkills: ["TypeScript", "Next.js & React", "Tailwind CSS", "Web Performance"],
    missingSkills: ["GraphQL APIs"],
    userEligible: true,
    status: "Recruiting",
  },
  {
    id: "microsoft-intern",
    company: "Microsoft",
    role: "Software Engineering Intern (Summer '27)",
    ctc: "₹1,25,000 / month Stipend",
    matchScore: 84,
    deadline: "In 8 days (14 Oct)",
    cgpaRequired: 8.0,
    backlogsAllowed: 0,
    eligibleBranches: ["CSE", "IT"],
    matchedSkills: ["Object-Oriented Programming", "Graph Algorithms", "Operating Systems"],
    missingSkills: ["C# / .NET Core", "Azure Fundamentals"],
    userEligible: true,
    status: "Recruiting",
  },
  {
    id: "cisco-net",
    company: "Cisco Systems",
    role: "Network Software Engineer",
    ctc: "₹12.5 LPA",
    matchScore: 71,
    deadline: "In 12 days (18 Oct)",
    cgpaRequired: 7.5,
    backlogsAllowed: 0,
    eligibleBranches: ["CSE", "ECE"],
    matchedSkills: ["Computer Networks", "TCP/IP Protocol Suite", "Linux Shell"],
    missingSkills: ["CCNA Basics", "Packet Tracer Labs"],
    userEligible: true,
    status: "Shortlisting",
  },
];

export interface ConflictCase {
  id: string;
  topic: string;
  conflictSummary: string;
  sources: {
    sourceName: string;
    sourceType: "Web Portal" | "Signed PDF" | "WhatsApp Group" | "Notice Board";
    dateStated: string;
    detail: string;
    isSuperseded: boolean;
  }[];
  verifiedResolution: {
    actualDate: string;
    confidence: number;
    explanation: string;
    officialRef: string;
  };
}

export const CONFLICT_CASES: ConflictCase[] = [
  {
    id: "conflict-exam-date",
    topic: "End-Semester Examination Form Submission Deadline",
    conflictSummary: "Multiple campus channels give contradictory cutoff dates for form submission without fine.",
    sources: [
      {
        sourceName: "College Website Notice Board",
        sourceType: "Web Portal",
        dateStated: "10 October 2026, 5:00 PM",
        detail: "Standard academic calendar announcement from August 2026.",
        isSuperseded: true,
      },
      {
        sourceName: "Class Reps WhatsApp Group",
        sourceType: "WhatsApp Group",
        dateStated: "11 October 2026, 2:00 PM",
        detail: "Unverified message forwarded from student council rep.",
        isSuperseded: true,
      },
      {
        sourceName: "Official Dean of Academics Circular",
        sourceType: "Signed PDF",
        dateStated: "12 October 2026, 11:59 PM",
        detail: "Gazetted circular signed yesterday citing national holiday extension.",
        isSuperseded: false,
      },
    ],
    verifiedResolution: {
      actualDate: "12 October 2026 • 11:59 PM",
      confidence: 99.4,
      explanation:
        "The signed PDF circular (#ENG/EXAM/2026/104) uploaded yesterday supersedes both the static website schedule and informal WhatsApp messages. A 48-hour extension was granted due to server maintenance.",
      officialRef: "Dean Circular ENG/EXAM/2026/104",
    },
  },
  {
    id: "conflict-placement-cgpa",
    topic: "Zomato Campus Drive CGPA Cutoff",
    conflictSummary: "Placement portal states 7.5 CGPA, while company orientation slide stated 7.0 CGPA.",
    sources: [
      {
        sourceName: "T&P Student Portal",
        sourceType: "Web Portal",
        dateStated: "7.5 CGPA required",
        detail: "Default department filter template applied automatically.",
        isSuperseded: true,
      },
      {
        sourceName: "Zomato HR Campus Presentation",
        sourceType: "Signed PDF",
        dateStated: "7.0 CGPA with project portfolio",
        detail: "Confirmed live by Talent Acquisition Lead in pre-placement talk.",
        isSuperseded: false,
      },
    ],
    verifiedResolution: {
      actualDate: "7.0 CGPA (Verified)",
      confidence: 97.8,
      explanation:
        "T&P office issued an addendum confirming Zomato has relaxed the cut-off to 7.0 CGPA for candidates with verified GitHub repositories.",
      officialRef: "T&P Addendum #ZOMATO-ADD-02",
    },
  },
];

export interface PanicSprintTopic {
  timeBlock: string;
  durationMinutes: number;
  title: string;
  yieldScore: "Must Revise (90% Prob)" | "High Value" | "Quick Win";
  keyFormulasOrConcepts: string[];
  cheatSheetSummary: string;
}

export const DBMS_PANIC_PLAN: PanicSprintTopic[] = [
  {
    timeBlock: "00:00 – 00:35",
    durationMinutes: 35,
    title: "Relational Normalization & Functional Dependencies",
    yieldScore: "Must Revise (90% Prob)",
    keyFormulasOrConcepts: [
      "1NF (Atomic), 2NF (No partial dependency), 3NF (No transitive dependency)",
      "BCNF: For every X → Y, X must be a Super Key",
      "Lossless Decomposition test: R1 ∩ R2 → R1 or R1 ∩ R2 → R2",
    ],
    cheatSheetSummary: "Guaranteed 14-mark question in Section B. Focus on proving BCNF and finding minimal candidate keys.",
  },
  {
    timeBlock: "00:35 – 01:10",
    durationMinutes: 35,
    title: "SQL Joins, Group By & Nested Subqueries",
    yieldScore: "Must Revise (90% Prob)",
    keyFormulasOrConcepts: [
      "INNER vs LEFT vs FULL OUTER JOIN semantics",
      "HAVING vs WHERE (HAVING filters aggregated groups post-GROUP BY)",
      "Correlated subquery: WHERE EXISTS (SELECT 1 FROM ... WHERE outer.id = inner.id)",
    ],
    cheatSheetSummary: "Write clean indented queries. Don't forget aliasing on self-joins and handling NULLs with COALESCE.",
  },
  {
    timeBlock: "01:10 – 01:45",
    durationMinutes: 35,
    title: "ACID Properties, Transactions & Serializability",
    yieldScore: "High Value",
    keyFormulasOrConcepts: [
      "Conflict Serializability: Precedence graph has NO cycles",
      "Two-Phase Locking (2PL): Growing phase (acquire locks), Shrinking phase (release locks)",
      "Strict 2PL prevents cascading rollbacks",
    ],
    cheatSheetSummary: "Draw the precedence graph clearly. If arrow points back, cycle detected → not conflict serializable.",
  },
  {
    timeBlock: "01:45 – 02:20",
    durationMinutes: 35,
    title: "B+ Tree Indexing & Hash Indices",
    yieldScore: "High Value",
    keyFormulasOrConcepts: [
      "B+ Tree order m: Max children m, min children ⌈m/2⌉",
      "Leaves linked sequentially for rapid range queries",
      "Clustered index (orders data files) vs Unclustered index",
    ],
    cheatSheetSummary: "Diagram the leaf node insertion split. B+ tree keeps all data pointers exclusively in leaves.",
  },
  {
    timeBlock: "02:20 – 03:00",
    durationMinutes: 40,
    title: "Final High-Yield Mock Drill & Formula Sheet Review",
    yieldScore: "Quick Win",
    keyFormulasOrConcepts: [
      "Deadlock handling: Wait-Die vs Wound-Wait schemes",
      "RA vs SQL equivalents (σ, π, ⋈, ρ)",
      "Recovery algorithms: Write-Ahead Logging (WAL) & Checkpoints",
    ],
    cheatSheetSummary: "Take 10 minutes to breathe, review the 3-page summary sheet, and hydrate.",
  },
];

export interface CampusPulseItem {
  id: string;
  type: "placement" | "event" | "exam" | "hackathon" | "alert";
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  timeAgo: string;
  actionText?: string;
  interactiveLink?: string;
}

export const CAMPUS_PULSE_ITEMS: CampusPulseItem[] = [
  {
    id: "pulse-1",
    type: "placement",
    title: "TCS Campus Hiring 2026 Registered",
    subtitle: "Eligible: 5th Sem CSE/IT with CGPA ≥ 7.5. Portal closes Thursday.",
    badge: "Placement Drive",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    timeAgo: "18m ago",
    actionText: "Verify Eligibility",
  },
  {
    id: "pulse-2",
    type: "exam",
    title: "DBMS Mid-Semester Seating Plan Released",
    subtitle: "Hall 302, Row C, Desk 14 • Report by 9:15 AM tomorrow.",
    badge: "Tomorrow 9:30 AM",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    timeAgo: "45m ago",
    actionText: "Open Panic Plan",
  },
  {
    id: "pulse-3",
    type: "event",
    title: "Generative AI Workshop & Google Cloud Arcade",
    subtitle: "Ramanujan Auditorium • Live demo with Gemini 2.5 Pro.",
    badge: "Tech Talk • 4 PM",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    timeAgo: "2h ago",
    actionText: "Add to Calendar",
  },
  {
    id: "pulse-4",
    type: "hackathon",
    title: "National Smart Campus AI Hackathon",
    subtitle: "₹2.5 Lakh pool + 2 days duty leave for accepted teams.",
    badge: "Registrations Open",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    timeAgo: "3h ago",
    actionText: "Find Teammates",
  },
  {
    id: "pulse-5",
    type: "alert",
    title: "Computer Networks Attendance Alert",
    subtitle: "Current: 68.2%. Missing 1 more lab triggers exam debarment notice.",
    badge: "Debarment Warning",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    timeAgo: "5h ago",
    actionText: "Test Bunk-o-Meter",
  },
];

export interface CampusBuilding {
  id: string;
  name: string;
  code: string;
  category: "Academic" | "Placement" | "Auditorium" | "Library" | "Recreation";
  activeEventsCount: number;
  openStatus: string;
  highlight: string;
  coords: { x: number; y: number };
}

export const CAMPUS_BUILDINGS: CampusBuilding[] = [
  {
    id: "bldg-cs",
    name: "Computer Science & Engineering Block",
    code: "Block-A",
    category: "Academic",
    activeEventsCount: 3,
    openStatus: "Open till 8:00 PM",
    highlight: "DBMS Mid-Sem exam tomorrow in Hall 302. AI Lab running on 2nd floor.",
    coords: { x: 30, y: 35 },
  },
  {
    id: "bldg-library",
    name: "Central Knowledge Center & Library",
    code: "Library",
    category: "Library",
    activeEventsCount: 1,
    openStatus: "24x7 Exam Study Zone",
    highlight: "84 seats currently vacant on 3rd floor quiet zone. Free Wi-Fi 6 active.",
    coords: { x: 55, y: 48 },
  },
  {
    id: "bldg-tnp",
    name: "Training & Corporate Placement Cell",
    code: "Tower-C",
    category: "Placement",
    activeEventsCount: 2,
    openStatus: "Open till 6:00 PM",
    highlight: "TCS drive registration desk active. Resume validation kiosk available.",
    coords: { x: 75, y: 28 },
  },
  {
    id: "bldg-audi",
    name: "Ramanujan University Auditorium",
    code: "Audi-1",
    category: "Auditorium",
    activeEventsCount: 1,
    openStatus: "Event Starts 4:00 PM",
    highlight: "AI Club Tech Talk: LLMs in production & hands-on Gemini deployment.",
    coords: { x: 22, y: 68 },
  },
  {
    id: "bldg-cafeteria",
    name: "Student Activity Center & Cafe",
    code: "SAC",
    category: "Recreation",
    activeEventsCount: 4,
    openStatus: "Open till 10:30 PM",
    highlight: "Hackathon team formation meetup at 5:30 PM today.",
    coords: { x: 68, y: 72 },
  },
];
