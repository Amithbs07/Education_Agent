export type CareerCategory =
  | "ai_ml"
  | "data_analytics"
  | "data_science"
  | "full_stack"
  | "cybersecurity"
  | "cloud_computing"
  | "software_engineering"
  | "ui_ux";

export interface CareerMilestone {
  milestoneName: string;
  durationWeeks: number;
  topics: string[];
  skillsAcquired: string[];
}

export interface CareerProject {
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  techStack: string[];
  keyOutcome: string;
}

export interface CareerRecommendation {
  id: string;
  userId: string;
  careerCategory: CareerCategory;
  careerTitle: string;
  overview: string;
  requiredSkills: string[];
  currentSkills: string[];
  skillGaps: string[];
  milestones: CareerMilestone[];
  projects: CareerProject[];
  recommendedNextAction: string;
  createdAt: string;
}

export interface CareerProfile {
  id: string;
  userId: string;
  interests: string[];
  currentSkills: string[];
  targetRole: string;
  targetTimelineMonths: number;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  updatedAt: string;
}
