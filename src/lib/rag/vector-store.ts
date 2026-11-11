import { GoogleGenerativeAI } from "@google/generative-ai";
import { DocumentChunk } from "@/types/document";

const apiKey = process.env.GEMINI_API_KEY;

export interface SearchResult {
  chunk: DocumentChunk;
  score: number;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export async function computeEmbedding(text: string): Promise<number[] | null> {
  if (!apiKey || apiKey === "your_gemini_api_key_here") return null;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (err) {
    console.warn("Gemini embedding error, using lexical semantic ranker:", err);
    return null;
  }
}

export function semanticLexicalSearch(
  query: string,
  chunks: DocumentChunk[],
  topK: number = 3
): SearchResult[] {
  if (!chunks || chunks.length === 0) return [];

  const queryTerms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const scored = chunks.map((chunk) => {
    const content = chunk.content.toLowerCase();
    let score = 0;

    queryTerms.forEach((term) => {
      // Frequency match
      const regex = new RegExp(`\\b${term}\\b`, "g");
      const matches = content.match(regex);
      if (matches) {
        score += matches.length * 2.5;
      } else if (content.includes(term)) {
        score += 1.0;
      }
    });

    // Exact phrase bonus
    if (content.includes(query.toLowerCase().trim())) {
      score += 10.0;
    }

    return { chunk, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((r) => r.score > 0);
}
