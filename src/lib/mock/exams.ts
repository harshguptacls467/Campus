export interface ExamIntel {
  id: string;
  courseCode: string;
  courseName: string;
  scheduledAt: string;
  timeRemaining: string;
  location: string;
  seatAllocation: string;
  prepPercentage: number;
  prepFactors: {
    syllabusCovered: number;
    pyqPractice: number;
    notesReviewed: boolean;
    highYieldFocus: number;
  };
  highYieldTopics: {
    title: string;
    weightage: string;
    confidence: "Ready" | "Needs Review" | "Untouched";
  }[];
}

export const UPCOMING_EXAM: ExamIntel = {
  id: "exam-dbms-midsem",
  courseCode: "CS501",
  courseName: "Database Management Systems",
  scheduledAt: "Tomorrow • 10:00 AM",
  timeRemaining: "18 hours left",
  location: "Academic Hall 302",
  seatAllocation: "Row C • Desk 14 (Barcode Entry)",
  prepPercentage: 64,
  prepFactors: {
    syllabusCovered: 68,
    pyqPractice: 60,
    notesReviewed: true,
    highYieldFocus: 72,
  },
  highYieldTopics: [
    { title: "Relational Normalization & BCNF Proofs", weightage: "14 Marks (Guaranteed)", confidence: "Needs Review" },
    { title: "SQL Joins, Group By & Correlated Subqueries", weightage: "12 Marks", confidence: "Ready" },
    { title: "ACID Properties & Two-Phase Locking (2PL)", weightage: "10 Marks", confidence: "Needs Review" },
    { title: "B+ Tree Index Insertion & Splits", weightage: "8 Marks", confidence: "Untouched" },
  ],
};
