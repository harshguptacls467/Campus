export interface TodayTimelineItem {
  id: string;
  time: string;
  category: "Academics" | "Placement" | "Events" | "Administration" | "Exam";
  title: string;
  locationOrPortal: string;
  importance: "normal" | "action-required" | "high-priority";
  source: string;
  actionText: string;
  actionType: "view" | "register" | "panic" | "submit" | "calendar";
}

export const TODAY_TIMELINE: TodayTimelineItem[] = [
  {
    id: "today-1",
    time: "09:30 AM",
    category: "Academics",
    title: "DBMS Lecture & Mid-Term Revision",
    locationOrPortal: "Hall 302 • Prof. Rao",
    importance: "normal",
    source: "Academic Timetable 2026",
    actionText: "View Lecture Notes",
    actionType: "view",
  },
  {
    id: "today-2",
    time: "12:00 PM",
    category: "Placement",
    title: "TCS Digital Drive Registration Closes",
    locationOrPortal: "T&P Student Portal",
    importance: "action-required",
    source: "T&P Circular #088 • 2h ago",
    actionText: "Register Now",
    actionType: "register",
  },
  {
    id: "today-3",
    time: "04:00 PM",
    category: "Events",
    title: "AI Club Orientation & Hackathon Warmup",
    locationOrPortal: "Ramanujan Auditorium",
    importance: "normal",
    source: "Student Council Broadcast",
    actionText: "RSVP Attend",
    actionType: "calendar",
  },
  {
    id: "today-4",
    time: "11:59 PM",
    category: "Administration",
    title: "Exam Form Submission Deadline (Zero Late Fee)",
    locationOrPortal: "Controller of Exams ERP",
    importance: "high-priority",
    source: "Dean Signed PDF #ENG/EXAM/104",
    actionText: "Submit Form",
    actionType: "submit",
  },
];

export interface CampusChangeItem {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  diffBefore: string;
  diffAfter: string;
  timestamp: string;
  verifiedSource: string;
}

export const CAMPUS_CHANGES: CampusChangeItem[] = [
  {
    id: "ch-1",
    type: "critical",
    title: "Exam form deadline moved forward",
    diffBefore: "14 Oct",
    diffAfter: "11 Oct • 11:59 PM",
    timestamp: "45m ago",
    verifiedSource: "Dean Academic Circular Gazetted",
  },
  {
    id: "ch-2",
    type: "warning",
    title: "Infosys Campus Drive CGPA cutoff updated",
    diffBefore: "CGPA 7.0",
    diffAfter: "CGPA 7.5 (You qualify at 8.1)",
    timestamp: "2h ago",
    verifiedSource: "Placement Cell Addendum",
  },
  {
    id: "ch-3",
    type: "info",
    title: "Generative AI Hackathon duty leave confirmed",
    diffBefore: "Attendance Debar Risk",
    diffAfter: "+2 Days Concession for Participants",
    timestamp: "Today",
    verifiedSource: "Dean Student Affairs Memo",
  },
];
