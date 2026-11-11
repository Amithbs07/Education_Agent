import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_PROFILE,
  INITIAL_ACTIVITIES,
  INITIAL_TASKS,
  INITIAL_LEARNING_PATHS,
  INITIAL_FLASHCARDS,
  INITIAL_QUIZZES,
} from "@/lib/supabase/mock-store";
import { LearningRecommendation, LearningInsight } from "@/types/recommendation";

let inMemoryRecommendations: LearningRecommendation[] = [
  {
    id: "rec_1",
    userId: "user_citadel_01",
    activity: "Revise Distributed Consensus Quorums",
    reason: "Your recent quiz attempt on Distributed Systems showed an accuracy gap in Quorum Calculation math.",
    priority: "high",
    expectedOutcome: "Solidify why floor(N/2)+1 guarantees overlap across network partitions before moving to Raft log compaction.",
    suggestedAction: "Complete a 3-question targeted drill on consensus quorums.",
    actionHref: "/assessment",
    category: "weak_topic",
    isDismissed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "rec_2",
    userId: "user_citadel_01",
    activity: "Complete 2 Due Spaced Retrieval Flashcards",
    reason: "Your SM-2 memory retention curve indicates that cards on 'Synchronous vs Asynchronous' and 'Split-Brain' are due today.",
    priority: "high",
    expectedOutcome: "Maintain optimal 90%+ long-term retention index without forgetting interval decay.",
    suggestedAction: "Run 2-minute active recall review.",
    actionHref: "/flashcards",
    category: "due_flashcard",
    isDismissed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "rec_3",
    userId: "user_citadel_01",
    activity: "Continue Module 3: Event-Driven Messaging & Partitions",
    reason: "You have completed 44% of your 'Mastering Distributed Systems' roadmap. Module 3 is currently active.",
    priority: "medium",
    expectedOutcome: "Master Kafka consumer group rebalances and partition keys before next week's checkpoint.",
    suggestedAction: "Implement idempotent message processing exercise.",
    actionHref: "/learning-paths",
    category: "unfinished_path",
    isDismissed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "rec_4",
    userId: "user_citadel_01",
    activity: "Explore Grounded Q&A on Raft Consensus Paper",
    reason: "You have an indexed academic paper 'In Search of an Understandable Consensus Algorithm' in your Document Library.",
    priority: "low",
    expectedOutcome: "Understand how the authors mathematically formalized election safety.",
    suggestedAction: "Ask the Document Intelligence Agent about Section 5.4.",
    actionHref: "/documents",
    category: "document_study",
    isDismissed: false,
    createdAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const activeRecs = inMemoryRecommendations.filter((r) => !r.isDismissed);

    const insight: LearningInsight = {
      todayRecommendedTask: "Implement Token Bucket Rate Limiter with Lua script",
      topicsToRevise: ["Consensus Quorums (Raft)", "B+ Tree Node Splitting"],
      pendingGoals: [
        "Master System Design & Algorithms",
        "Prepare for Technical Placement Interviews",
      ],
      recommendedQuiz: "Consensus Protocols & Fault Tolerance Diagnostic",
      upcomingReviews: 2,
      weeklySummary:
        "High study momentum this week (5-day streak, 165 total minutes studied). Quiz accuracy remains strong at 92%. Focus your next study block on distributed network partitions.",
    };

    return NextResponse.json({
      success: true,
      recommendations: activeRecs,
      insights: insight,
    });
  } catch (error: any) {
    console.error("Recommendations API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load recommendations" },
      { status: 500 }
    );
  }
}

// Dismiss a recommendation
export async function PUT(req: NextRequest) {
  try {
    const { id } = await req.json();
    inMemoryRecommendations = inMemoryRecommendations.map((r) =>
      r.id === id ? { ...r, isDismissed: true } : r
    );
    return NextResponse.json({ success: true, dismissedId: id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to dismiss" }, { status: 500 });
  }
}
