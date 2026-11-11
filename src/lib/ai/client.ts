import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

export const isGeminiConfigured = Boolean(apiKey && apiKey !== "your_gemini_api_key_here");

export function getGeminiModel(modelName: string = "gemini-1.5-flash") {
  if (!isGeminiConfigured) {
    return null;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
}

export async function generateEducationalText(
  systemInstruction: string,
  userPrompt: string,
  fallbackResponse: string
): Promise<string> {
  if (!isGeminiConfigured) {
    return fallbackResponse;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API execution error:", error);
    return fallbackResponse;
  }
}
