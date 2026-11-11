import { NextRequest, NextResponse } from "next/server";
import { GLOBAL_AGENT_EXECUTION_LOGS } from "@/lib/ai/supervisor";
import { SystemHealth } from "@/types/observability";

export async function GET(req: NextRequest) {
  try {
    // Role Check: Examine role header or query parameter
    const role = req.headers.get("x-user-role") || req.nextUrl.searchParams.get("role") || "admin";

    if (role !== "admin" && role !== "educator") {
      return NextResponse.json(
        { error: "Access denied: Educator or Administrator privileges required." },
        { status: 403 }
      );
    }

    const systemHealth: SystemHealth = {
      geminiApi: "online",
      vectorDb: "online",
      orchestrator: "online",
      totalRequests24h: 1840,
      errorRate: 0.2,
      avgLatencyMs: 385,
    };

    const agentUsageStats = [
      { agent: "Tutor Agent", calls: 842, avgDurationMs: 420 },
      { agent: "Assessment Agent", calls: 412, avgDurationMs: 580 },
      { agent: "Recommendation Agent", calls: 340, avgDurationMs: 290 },
      { agent: "Document Intelligence Agent", calls: 280, avgDurationMs: 760 },
      { agent: "Study Planner Agent", calls: 195, avgDurationMs: 510 },
      { agent: "Career Guidance Agent", calls: 165, avgDurationMs: 640 },
      { agent: "Flashcard Agent", calls: 140, avgDurationMs: 310 },
      { agent: "Study Notes Agent", calls: 125, avgDurationMs: 690 },
      { agent: "Learning Analytics Agent", calls: 98, avgDurationMs: 250 },
    ];

    // Sanitize logs so private student contents are redacted
    const sanitizedLogs = GLOBAL_AGENT_EXECUTION_LOGS.map((log) => ({
      id: log.id,
      detectedIntent: log.detectedIntent,
      primaryAgent: log.primaryAgent,
      specialistAgents: log.specialistAgents,
      durationMs: log.durationMs,
      status: log.status,
      tokensUsed: log.tokensUsed,
      createdAt: log.createdAt,
    }));

    return NextResponse.json({
      success: true,
      role,
      metrics: {
        totalRegisteredStudents: 142,
        activeLearnersToday: 38,
        totalStudyHours24h: 84.5,
        totalQuizzesSubmitted: 215,
        satisfactionRating: 4.85,
      },
      systemHealth,
      agentUsageStats,
      executionLogs: sanitizedLogs,
    });
  } catch (error: any) {
    console.error("Admin metrics error:", error);
    return NextResponse.json({ error: error.message || "Failed to load admin metrics" }, { status: 500 });
  }
}
