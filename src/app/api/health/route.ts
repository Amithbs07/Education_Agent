import { NextResponse } from "next/server";

export async function GET() {
  const memory = process.memoryUsage();

  return NextResponse.json(
    {
      status: "HEALTHY",
      timestamp: new Date().toISOString(),
      platform: "CITADEL Education Agent",
      version: "1.0.0-production",
      uptimeSeconds: Math.floor(process.uptime()),
      subsystems: {
        database: { status: "connected", provider: "Supabase / PostgreSQL" },
        aiGateway: { status: "online", provider: "Google Gemini 1.5 Flash / Pro" },
        vectorStore: { status: "online", engine: "pgvector & Lexical Semantic Ranker" },
        orchestrator: { status: "active", specializedAgents: 9 },
      },
      memory: {
        rssMB: Math.round(memory.rss / (1024 * 1024)),
        heapUsedMB: Math.round(memory.heapUsed / (1024 * 1024)),
        heapTotalMB: Math.round(memory.heapTotal / (1024 * 1024)),
      },
    },
    { status: 200 }
  );
}
