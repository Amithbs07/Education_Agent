import { NextRequest, NextResponse } from "next/server";
import { QuizQuestion, QuizAttemptResult, QuestionEvaluation } from "@/types/quiz";

export async function POST(req: NextRequest) {
  try {
    const {
      quizId,
      quizTitle,
      subject,
      questions,
      userAnswers,
    }: {
      quizId: string;
      quizTitle: string;
      subject: string;
      questions: QuizQuestion[];
      userAnswers: Record<string, string>;
    } = await req.json();

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: "Questions array is required" }, { status: 400 });
    }

    let correctCount = 0;
    const evaluations: QuestionEvaluation[] = [];
    const strengths: string[] = [];
    const weakAreas: string[] = [];

    questions.forEach((q) => {
      const userAns = (userAnswers[q.id] || "").trim();
      const correctAns = (q.correctAnswer || "").trim();

      // Check match: exact or case-insensitive
      const isCorrect =
        userAns.toLowerCase() === correctAns.toLowerCase() ||
        (q.type === "short_answer" &&
          (userAns.toLowerCase().includes(correctAns.toLowerCase()) ||
            correctAns.toLowerCase().includes(userAns.toLowerCase())));

      if (isCorrect) {
        correctCount++;
        strengths.push(q.conceptTested);
      } else {
        weakAreas.push(q.conceptTested);
      }

      evaluations.push({
        questionId: q.id,
        userAnswer: userAns || "No answer provided",
        correctAnswer: correctAns,
        isCorrect,
        explanation: q.explanation,
        conceptTested: q.conceptTested,
      });
    });

    const maxScore = questions.length;
    const percentage = Math.round((correctCount / maxScore) * 100);

    let suggestedAction = "Review all concepts and proceed to the next module.";
    if (percentage === 100) {
      suggestedAction = `Flawless conceptual mastery! You are ready to tackle the advanced project or proceed to the next milestone in ${subject}.`;
    } else if (percentage >= 75) {
      suggestedAction = `Solid performance (${percentage}%). Target your review on: ${weakAreas.join(", ")} before taking the next milestone quiz.`;
    } else {
      suggestedAction = `Identified knowledge gaps in: ${weakAreas.join(", ")}. We recommend asking your AI Tutor to walk through these concepts with concrete analogies.`;
    }

    const attemptResult: QuizAttemptResult = {
      id: `attempt_${Date.now()}`,
      quizId,
      quizTitle,
      subject,
      score: correctCount,
      maxScore,
      percentage,
      evaluations,
      strengths: Array.from(new Set(strengths)),
      weakAreas: Array.from(new Set(weakAreas)),
      suggestedAction,
      completedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, result: attemptResult });
  } catch (error: any) {
    console.error("Evaluation API error:", error);
    return NextResponse.json({ error: error.message || "Failed to evaluate quiz" }, { status: 500 });
  }
}
