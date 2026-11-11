export type RecommendationPriority = "high" | "medium" | "low";

export type RecommendationCategory =
  | "weak_topic"
  | "due_flashcard"
  | "unfinished_path"
  | "practice_quiz"
  | "document_study"
  | "milestone_checkpoint";

export interface LearningRecommendation {
  id: string;
  userId: string;
  activity: string;
  reason: string;
  priority: RecommendationPriority;
  expectedOutcome: string;
  suggestedAction: string;
  actionHref: string;
  category: RecommendationCategory;
  isDismissed: boolean;
  createdAt: string;
}

export interface LearningInsight {
  todayRecommendedTask: string;
  topicsToRevise: string[];
  pendingGoals: string[];
  recommendedQuiz: string;
  upcomingReviews: number;
  weeklySummary: string;
}
