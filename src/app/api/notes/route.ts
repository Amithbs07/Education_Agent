import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NOTES_GENERATOR_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { StudyNote } from "@/types/plan";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const {
      topic = "Distributed Systems Consensus",
      subject = "Computer Science",
      sourceContent,
    } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
          systemInstruction: NOTES_GENERATOR_SYSTEM_PROMPT,
        });

        const prompt = `Generate comprehensive, exam-ready study notes for:
Topic: ${topic}
Subject: ${subject}
${sourceContent ? `Grounded in source content:\n${sourceContent.slice(0, 3000)}` : ""}`;

        const result = await model.generateContent(prompt);
        const markdown = result.response.text();

        const newNote: StudyNote = {
          id: `note_${Date.now()}`,
          userId: "user_citadel_01",
          title: `${topic} Master Study Guide`,
          subject,
          topic,
          contentMarkdown: markdown,
          keyDefinitions: [
            { term: topic, definition: "Core educational domain principle." },
            { term: "Invariant", definition: "A condition that remains true across all valid state transitions." },
          ],
          examSummary: `High-yield focus for exams: Master core proofs, time/space trade-offs, and boundary conditions for ${topic}.`,
          quickRevisionPoints: [
            "Review first-principles mechanism",
            "Memorize asymptotic bounds",
            "Be prepared to trace step-by-step state transitions",
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return NextResponse.json({ success: true, note: newNote });
      } catch (geminiError) {
        console.warn("Gemini note generation fallback:", geminiError);
      }
    }

    // Heuristic Study Notes Synthesizer
    const newNote = generateFallbackNote(topic, subject, sourceContent);
    return NextResponse.json({ success: true, note: newNote });
  } catch (error: any) {
    console.error("Notes API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate study notes" },
      { status: 500 }
    );
  }
}

function generateFallbackNote(
  topic: string,
  subject: string,
  sourceContent?: string
): StudyNote {
  const markdown = `# ${topic} – Master Revision Notes

## 1. Executive Summary
${topic} represents a foundational pillar in **${subject}**. Mastery requires understanding the theoretical invariants, practical hardware or algorithmic trade-offs, and failure mode mitigation.

## 2. Key Definitions & Formal Terminology
- **Primary Mechanism**: The sequential invariant that governs state transitions without introducing anomalies.
- **Boundary Invariant**: The structural guarantees that must hold true before and after each computational step.
- **Failure Mode**: Conditions under which standard assumptions (e.g. zero latency, perfect memory) break down.

## 3. Step-by-Step Mechanical Breakdown
1. **Initialization State**: Establish configuration parameters and verify sanity preconditions.
2. **Transition Execution**: Propagate state mutations through atomic checkpoints.
3. **Commit & Verification**: Confirm that all replicas or downstream consumers have acknowledged consistency.

\`\`\`typescript
// Conceptual Invariant Preservation Example
interface StateRecord {
  term: number;
  isCommitted: boolean;
  payload: Record<string, unknown>;
}

function verifyInvariant(record: StateRecord): boolean {
  return record.term > 0 && record.isCommitted;
}
\`\`\`

## 4. Exam High-Yield Summary
- Always distinguish between average-case and worst-case bounds.
- When answering exam questions, state the **assumptions** first, write the **governing equation or algorithm**, and conclude with the **edge cases**.

## 5. Quick Active Recall Questions
- *What is the primary trade-off between space complexity and query execution latency?*
- *How does the system recover if a partition isolates a minority sub-cluster?*
`;

  return {
    id: `note_${Date.now()}`,
    userId: "user_citadel_01",
    title: `${topic} Master Study Guide`,
    subject,
    topic,
    contentMarkdown: markdown,
    keyDefinitions: [
      { term: topic, definition: `Primary concept within ${subject}.` },
      { term: "Monotonicity", definition: "A sequence or property that never reverses direction." },
      { term: "Idempotence", definition: "Operations that can be executed repeatedly with identical side effects." },
    ],
    examSummary: `Essential for exams: Be prepared to derive the step-by-step mechanism and analyze boundary edge cases.`,
    quickRevisionPoints: [
      "Review definitions of primary terms",
      "Trace step-by-step code/formula walkthrough",
      "Solve quick active recall questions without reference notes",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
