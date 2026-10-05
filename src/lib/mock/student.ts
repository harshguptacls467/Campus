export interface StudentUser {
  id: string;
  name: string;
  firstName: string;
  avatar: string;
  email: string;
  rollNo: string;
  department: string;
  degree: string;
  semester: string;
  section: string;
  cgpa: number;
  graduationYear?: string;
  profileCompleteness?: number;
  activeBacklogs: number;
  overallAttendance: number;
  campusPriorityScore: number; // e.g. 7.8 / 10
  university?: string;
  institute?: string;
  enrollmentNo?: string;
  abcId?: string;
  prioritySummary: {
    deadlinesCount: number;
    placementCount: number;
    examsCount: number;
    eventsCount: number;
  };
}

export const CURRENT_STUDENT_USER: StudentUser = {
  id: "std-22cse084",
  name: "Isha Sharma",
  firstName: "Isha",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  email: "isha.sharma@uitrgpv.ac.in",
  rollNo: "0101CS221084",
  enrollmentNo: "0101CS221084",
  university: "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal",
  institute: "UIT-RGPV Bhopal (University Institute of Technology)",
  abcId: "RGPV-ABC-9482-1084",
  department: "Computer Science & Engineering",
  degree: "B.Tech",
  semester: "5th Semester",
  section: "Section B",
  cgpa: 7.8,
  graduationYear: "2027",
  profileCompleteness: 86,
  activeBacklogs: 0,
  overallAttendance: 78.4,
  campusPriorityScore: 7.8,
  prioritySummary: {
    deadlinesCount: 2,
    placementCount: 1,
    examsCount: 2,
    eventsCount: 1,
  },
};
