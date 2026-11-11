import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Flashcard } from "@/types/plan";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const {
      topic = "Distributed Systems Core Concepts",
      subject = "Distributed Systems",
      sourceContent,
      count = 4,
    } = await req.json();

    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
          generationConfig: { responseMimeType: "application/json" },
          systemInstruction: `You are the CITADEL Flashcards Specialist.
Generate high-yield active recall flashcards.
Output JSON format:
{
  "deckTitle": "String",
  "cards": [
    {
      "front": "Sharp, probing question or concept prompt",
      "back": "Clear, concise, authoritative pedagogical answer"
    }
  ]
}`,
        });

        const prompt = `Generate ${count} spaced-repetition flashcards for:
Topic: ${topic}
Subject: ${subject}
${sourceContent ? `Source Text: ${sourceContent.slice(0, 2500)}` : ""}`;

        const result = await model.generateContent(prompt);
        const parsed = JSON.parse(result.response.text());

        const cards: Flashcard[] = (parsed.cards || []).map((c: any, i: number) => ({
          id: `fc_${Date.now()}_${i}`,
          userId: "user_citadel_01",
          deckTitle: parsed.deckTitle || topic,
          subject,
          front: c.front,
          back: c.back,
          easeFactor: 2.5,
          intervalDays: 1,
          repetitions: 0,
          dueDate: new Date().toISOString().split("T")[0],
          createdAt: new Date().toISOString(),
        }));

        return NextResponse.json({ success: true, deckTitle: parsed.deckTitle || topic, cards });
      } catch (geminiError) {
        console.warn("Gemini flashcard fallback:", geminiError);
      }
    }

    // Heuristic Flashcards Generator
    const cards = generateFallbackDeck(topic, subject);
    return NextResponse.json({ success: true, deckTitle: topic, cards });
  } catch (error: any) {
    console.error("Flashcards API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}

// Spaced Repetition Review (SM-2 Algorithm)
export async function PUT(req: NextRequest) {
  try {
    const {
      cardId,
      rating, // "hard" | "good" | "easy"
      currentEaseFactor = 2.5,
      currentInterval = 1,
      currentReps = 0,
    } = await req.json();

    let easeFactor = currentEaseFactor;
    let intervalDays = currentInterval;
    let repetitions = currentReps;

    if (rating === "hard") {
      repetitions = 0;
      intervalDays = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    } else if (rating === "good") {
      repetitions += 1;
      intervalDays = repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.round(intervalDays * easeFactor);
    } else if (rating === "easy") {
      repetitions += 1;
      intervalDays = repetitions === 1 ? 2 : repetitions === 2 ? 6 : Math.round(intervalDays * (easeFactor + 0.15));
      easeFactor += 0.15;
    }

    const nextDueDate = new Date(Date.now() + intervalDays * 24 * 3600 * 1000)
      .toISOString()
      .split("T")[0];

    return NextResponse.json({
      success: true,
      cardId,
      easeFactor: Number(easeFactor.toFixed(2)),
      intervalDays,
      repetitions,
      nextDueDate,
    });
  } catch (error: any) {
    console.error("SM-2 review update error:", error);
    return NextResponse.json({ error: error.message || "Review calculation failed" }, { status: 500 });
  }
}

function generateFallbackDeck(topic: string, subject: string): Flashcard[] {
  return [
    {
      id: `fc_${Date.now()}_1`,
      userId: "user_citadel_01",
      deckTitle: topic,
      subject,
      front: `What is the core theoretical invariant established by ${topic}?`,
      back: "It preserves correctness across distributed state transitions by enforcing monotonic ordering and consensus quorums.",
      easeFactor: 2.5,
      intervalDays: 1,
      repetitions: 0,
      dueDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    },
    {
      id: `fc_${Date.now()}_2`,
      userId: "user_citadel_01",
      deckTitle: topic,
      subject,
      front: "Why do systems prioritize sequential append-only writes over in-place disk modifications?",
      back: "Sequential disk I/O operates at peak throughput and avoids random head seeks, making write-ahead logs orders of magnitude faster and crash-resilient.",
      easeFactor: 2.5,
      intervalDays: 2,
      repetitions: 1,
      dueDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    },
    {
      id: `fc_${Date.now()}_3`,
      userId: "user_citadel_01",
      deckTitle: topic,
      subject,
      front: "Under what specific condition will a majority quorum vote fail to elect a leader in Raft?",
      back: "If network partitions isolate more than floor(N/2) nodes simultaneously, preventing any candidate from gathering a strict majority of cluster votes.",
      easeFactor: 2.6,
      intervalDays: 4,
      repetitions: 2,
      dueDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    },
  ];
}
