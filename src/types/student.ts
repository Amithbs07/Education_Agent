export type AcademicLevel =
  | "school"
  | "undergraduate"
  | "graduate"
  | "competitive_exam"
  | "professional"
  | "self_learner";

export type KnowledgeLevel = "beginner" | "intermediate" | "advanced";

export type LearningStyle =
  | "visual_and_examples"
  | "step_by_step"
  | "socratic_hints"
  | "practical_projects"
  | "theoretical";

export interface StudentProfile {
  id: string;
  userId: string;
  email: string;
  displayName: string;
  academicLevel: AcademicLevel;
  primarySubjects: string[];
  targetGoals: string[];
  preferredLearningStyle: LearningStyle;
  knowledgeLevel: KnowledgeLevel;
  dailyStudyGoalMinutes: number;
  streakDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface LearningActivity {
  id: string;
  userId: string;
  activityType:
    | "tutor_chat"
    | "quiz_completed"
    | "note_saved"
    | "flashcard_reviewed"
    | "task_completed"
    | "path_milestone";
  subject: string;
  durationMinutes: number;
  scorePercentage?: number;
  details?: Record<string, any>;
  createdAt: string;
}
