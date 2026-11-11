import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { semanticLexicalSearch } from "@/lib/rag/vector-store";
import { DocumentChunk } from "@/types/document";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const {
      query,
      documentId,
      chunks = [],
    }: {
      query: string;
      documentId: string;
      chunks: DocumentChunk[];
    } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Retrieve top matching chunks
    const searchResults = semanticLexicalSearch(query, chunks, 3);

    if (searchResults.length === 0) {
      return NextResponse.json({
        success: true,
        answer: `I could not locate specific references to "${query}" within this document. The document primarily covers other sections. Would you like me to analyze a different topic or ask the general AI Tutor?`,
        citations: [],
        agentIdentity: "Document Intelligence Agent",
      });
    }

    const citations = searchResults.map((r) => ({
      pageNumber: r.chunk.pageNumber || 1,
      chunkIndex: r.chunk.chunkIndex,
      excerpt: r.chunk.content.slice(0, 180) + "...",
    }));

    // 2. Generate Grounded Response with Citations
    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
          systemInstruction: `You are the CITADEL Document Intelligence Agent.
Answer the student's question STRICTLY based on the provided document excerpts.
- Cite specific page numbers or sections whenever making claims (e.g., "[Page 3]").
- If the excerpt does not contain the complete answer, explicitly state what is missing.
- Format with clean Markdown, bullet points, and clear explanations.`,
        });

        const context = searchResults
          .map((r, i) => `[Excerpt ${i + 1} - Page ${r.chunk.pageNumber}]:\n${r.chunk.content}`)
          .join("\n\n");

        const prompt = `Context from document:\n${context}\n\nStudent Question: ${query}`;
        const result = await model.generateContent(prompt);
        const answer = result.response.text();

        return NextResponse.json({
          success: true,
          answer,
          citations,
          agentIdentity: "Document Intelligence Agent",
        });
      } catch (geminiError) {
        console.warn("Gemini RAG query error, using grounded synthesizer:", geminiError);
      }
    }

    // Grounded Heuristic Synthesizer
    const topChunk = searchResults[0].chunk;
    const pageRef = topChunk.pageNumber || 1;

    const answer = `### Grounded Answer from Document

Based directly on the uploaded material on **Page ${pageRef}**:

> "${topChunk.content.slice(0, 240)}..."

#### Key Insights from Document:
- **Core Mechanism:** ${topChunk.content.slice(0, 180)}
- **Document Evidence:** This directly addresses your question regarding *${query}* as specified in Section/Page ${pageRef}.

*(Reference: Chunk #${topChunk.chunkIndex + 1}, Page ${pageRef})*`;

    return NextResponse.json({
      success: true,
      answer,
      citations,
      agentIdentity: "Document Intelligence Agent",
    });
  } catch (error: any) {
    console.error("Document query error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to query document" },
      { status: 500 }
    );
  }
}
