export type InstitutionRole = "institution_admin" | "educator" | "student";

export interface Institution {
  id: string;
  name: string;
  slug: string;
  domain: string;
  planTier: "institution";
  seatLimit: number;
  seatsAllocated: number;
  createdAt: string;
}

export interface InstitutionMember {
  id: string;
  institutionId: string;
  userId: string;
  displayName: string;
  email: string;
  role: InstitutionRole;
  status: "active" | "invited" | "suspended";
  department: string;
  joinedAt: string;
}

export interface LearningGroup {
  id: string;
  institutionId: string;
  educatorId: string;
  name: string;
  description: string;
  subject: string;
  studentCount: number;
  activeAssignmentsCount: number;
  createdAt: string;
}

export interface GroupAssignment {
  id: string;
  groupId: string;
  title: string;
  assignmentType: "quiz" | "reading" | "task" | "path_module";
  targetId?: string;
  dueDate: string;
  submissionCount: number;
  totalStudents: number;
  createdAt: string;
}
