export interface LearningModule {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  objectives: string[];
  keyTopics: string[];
  recommendedResources: {
    title: string;
    type: "reading" | "video" | "practice" | "documentation";
    url?: string;
  }[];
  practiceExercise: string;
  isCompleted: boolean;
}

export interface LearningPath {
  id: string;
  userId: string;
  title: string;
  subject: string;
  targetRoleOrGoal: string;
  currentLevel: "beginner" | "intermediate" | "advanced";
  targetLevel: "beginner" | "intermediate" | "advanced";
  targetDate: string;
  totalEstimatedHours: number;
  completedHours: number;
  progressPercentage: number;
  modules: LearningModule[];
  revisionSchedule: {
    checkpointName: string;
    targetDay: number;
    focus: string;
  }[];
  createdAt: string;
}

export interface StudyTask {
  id: string;
  userId: string;
  learningPathId?: string;
  title: string;
  subject: string;
  dueDate: string;
  durationMinutes: number;
  isCompleted: boolean;
  priority: "high" | "medium" | "low";
  notes?: string;
}

export interface StudyNote {
  id: string;
  userId: string;
  title: string;
  subject: string;
  topic: string;
  contentMarkdown: string;
  keyDefinitions: { term: string; definition: string }[];
  examSummary: string;
  quickRevisionPoints: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  userId: string;
  deckTitle: string;
  subject: string;
  front: string;
  back: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueDate: string;
  createdAt: string;
}
