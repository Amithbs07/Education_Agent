import { NextRequest, NextResponse } from "next/server";
import { orchestrateTask } from "@/lib/ai/supervisor";

export async function POST(req: NextRequest) {
  try {
    const { query, context = {} } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const result = await orchestrateTask(query, context);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Orchestration API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to orchestrate task" },
      { status: 500 }
    );
  }
}
