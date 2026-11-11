import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/rag/extractor";
import { chunkText } from "@/lib/rag/chunker";
import { UploadedDocument, DocumentChunk } from "@/types/document";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const filename = file.name;
    const extension = filename.split(".").pop()?.toLowerCase();

    if (!["pdf", "docx", "txt", "md"].includes(extension || "")) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload PDF, DOCX, TXT, or Markdown." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Extract text and estimated pages
    const { text, estimatedPages } = await extractTextFromFile(
      buffer,
      extension as any,
      filename
    );

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract readable text from document. File may be encrypted or empty." },
        { status: 422 }
      );
    }

    // 2. Semantic Chunking
    const rawChunks = chunkText(text, 650, 100);
    const docId = `doc_${Date.now()}`;

    const documentChunks: DocumentChunk[] = rawChunks.map((c) => ({
      id: `chk_${docId}_${c.chunkIndex}`,
      documentId: docId,
      content: c.content,
      pageNumber: c.pageNumber || 1,
      chunkIndex: c.chunkIndex,
    }));

    // 3. AI Summary & Concept Extraction
    let summary = `Academic document containing ${rawChunks.length} indexed chunks across ${estimatedPages} page(s).`;
    let concepts: string[] = ["Foundational Principles", "Methodologies", "Case Analysis"];

    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const analysisPrompt = `Analyze the following academic document extract from "${filename}".
Provide:
1. A concise 2-3 sentence executive summary.
2. A comma-separated list of 4-6 key concepts covered.

Extract:
${text.slice(0, 3000)}`;

        const result = await model.generateContent(analysisPrompt);
        const analysisText = result.response.text();
        summary = analysisText.split("\n")[0].replace(/^1\.\s*/, "").trim();
        const conceptsLine = analysisText.split("\n").find((l) => l.toLowerCase().includes("concept"));
        if (conceptsLine) {
          concepts = conceptsLine.replace(/.*:\s*/, "").split(",").map((c) => c.trim());
        }
      } catch (geminiErr) {
        console.warn("Gemini doc analysis fallback:", geminiErr);
      }
    } else {
      // Heuristic Concept Extraction: identify capitalized terms and frequent words
      const words = text.match(/\b[A-Z][a-z]{3,}\b/g) || [];
      const freq: Record<string, number> = {};
      words.forEach((w) => {
        if (!["This", "That", "When", "With", "From", "Have"].includes(w)) {
          freq[w] = (freq[w] || 0) + 1;
        }
      });
      const topWords = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([w]) => w);

      if (topWords.length > 0) concepts = topWords;
      summary = `Processed and indexed "${filename}". Document covers ${concepts.join(", ")} with ${rawChunks.length} searchable semantic chunks.`;
    }

    const documentRecord: UploadedDocument = {
      id: docId,
      userId: "user_citadel_01",
      filename,
      fileType: extension as any,
      fileSize: file.size,
      totalPages: estimatedPages,
      summary,
      extractedConcepts: concepts,
      uploadedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      document: documentRecord,
      chunks: documentChunks,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process and index document" },
      { status: 500 }
    );
  }
}
