import { NextRequest, NextResponse } from "next/server";

interface FeedbackPayload {
  name?: string;
  email?: string;
  category: "tutor" | "documents" | "flashcards" | "billing" | "performance" | "bug" | "feature" | "other";
  subject: string;
  message: string;
  rating?: number;
  userId?: string;
}

// In-memory feedback collection for local/standalone operation
const feedbackStore: Array<FeedbackPayload & { id: string; ticketId: string; createdAt: string; status: string }> = [];

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FeedbackPayload;

    if (!body.category || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "Category, subject, and message are required fields." },
        { status: 400 }
      );
    }

    const ticketId = `CTDL-${Math.floor(100000 + Math.random() * 900000)}`;
    const newEntry = {
      id: crypto.randomUUID(),
      ticketId,
      name: body.name || "Anonymous Learner",
      email: body.email || "learner@citadel.ai",
      category: body.category,
      subject: body.subject,
      message: body.message,
      rating: body.rating || 5,
      userId: body.userId || "demo-user-1",
      createdAt: new Date().toISOString(),
      status: "received",
    };

    feedbackStore.unshift(newEntry);

    return NextResponse.json({
      success: true,
      ticketId,
      message: "Feedback received successfully. Our academic engineering team will review it shortly.",
      entry: newEntry,
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Internal server error while processing feedback." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    totalTickets: feedbackStore.length,
    recentTickets: feedbackStore.slice(0, 10),
  });
}
