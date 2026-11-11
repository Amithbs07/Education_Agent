export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "short_answer"
  | "conceptual"
  | "application";

export type QuizDifficulty = "beginner" | "intermediate" | "advanced";

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: QuizOption[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  conceptTested: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: QuizDifficulty;
  questions: QuizQuestion[];
  totalQuestions: number;
  timeLimitMinutes?: number;
  createdAt: string;
}

export interface QuestionEvaluation {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  conceptTested: string;
}

export interface QuizAttemptResult {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  score: number;
  maxScore: number;
  percentage: number;
  evaluations: QuestionEvaluation[];
  strengths: string[];
  weakAreas: string[];
  suggestedAction: string;
  completedAt: string;
}
