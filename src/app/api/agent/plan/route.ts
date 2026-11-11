import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PLANNER_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { LearningPath, LearningModule } from "@/types/plan";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const {
      subject,
      currentLevel = "intermediate",
      targetGoal = "Master Core Principles",
      availableHoursPerWeek = 8,
      targetDate,
      profile,
    } = await req.json();

    if (!subject) {
      return NextResponse.json({ error: "Subject is required" }, { status: 400 });
    }

    // If Gemini is configured, use it for customized generation
    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
          systemInstruction: PLANNER_SYSTEM_PROMPT,
          generationConfig: { responseMimeType: "application/json" },
        });

        const prompt = `Generate a personalized learning path for:
Subject: ${subject}
Current Level: ${currentLevel}
Target Objective: ${targetGoal}
Study Commitment: ${availableHoursPerWeek} hours/week
Target Completion Date: ${targetDate || "in 6 weeks"}
Learner Academic Stage: ${profile?.academicLevel || "Undergraduate"}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const parsed = JSON.parse(text);

        const learningPath: LearningPath = {
          id: `path_${Date.now()}`,
          userId: profile?.userId || "user_citadel_01",
          title: parsed.title || `Mastering ${subject}`,
          subject: subject,
          targetRoleOrGoal: targetGoal,
          currentLevel: currentLevel as any,
          targetLevel: "advanced",
          targetDate: targetDate || new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString().split("T")[0],
          totalEstimatedHours: parsed.totalEstimatedHours || 28,
          completedHours: 0,
          progressPercentage: 0,
          modules: parsed.modules.map((m: any, idx: number) => ({
            id: `mod_${idx + 1}`,
            title: m.title,
            description: m.description,
            estimatedHours: m.estimatedHours || 6,
            objectives: m.objectives || [],
            keyTopics: m.keyTopics || [],
            recommendedResources: m.recommendedResources || [],
            practiceExercise: m.practiceExercise || "Complete hands-on implementation.",
            isCompleted: false,
          })),
          revisionSchedule: parsed.revisionSchedule || [
            { checkpointName: "Checkpoint 1: Core Fundamentals", targetDay: 7, focus: "Foundations & active recall" },
            { checkpointName: "Checkpoint 2: Mid-Curriculum Review", targetDay: 18, focus: "Edge cases & implementation" },
            { checkpointName: "Final Milestone: Comprehensive Capstone", targetDay: 30, focus: "Project synthesis" },
          ],
          createdAt: new Date().toISOString(),
        };

        return NextResponse.json({ success: true, learningPath });
      } catch (geminiError) {
        console.warn("Gemini plan generation error, falling back to pedagogical planner:", geminiError);
      }
    }

    // Heuristic Fallback Generator for Instant Offline Responsiveness
    const fallbackPath: LearningPath = generateFallbackLearningPath(
      subject,
      currentLevel,
      targetGoal,
      targetDate
    );

    return NextResponse.json({ success: true, learningPath: fallbackPath });
  } catch (error: any) {
    console.error("Plan API error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate learning path" }, { status: 500 });
  }
}

function generateFallbackLearningPath(
  subject: string,
  currentLevel: string,
  targetGoal: string,
  targetDate?: string
): LearningPath {
  const isAI = subject.toLowerCase().includes("ai") || subject.toLowerCase().includes("machine learning");
  const isWeb = subject.toLowerCase().includes("web") || subject.toLowerCase().includes("frontend") || subject.toLowerCase().includes("react");
  
  let modules: LearningModule[] = [];

  if (isAI) {
    modules = [
      {
        id: "mod_1",
        title: "Mathematical Foundations for Modern AI",
        description: "Linear algebra, matrix operations, gradient vectors, and probability distributions.",
        estimatedHours: 8,
        objectives: [
          "Understand eigenvalues, eigenvectors, and SVD decomposition",
          "Derive partial derivatives for multivariate loss functions",
        ],
        keyTopics: ["Dot products & projections", "Jacobians & Hessians", "Bayesian inference"],
        recommendedResources: [
          { title: "Linear Algebra Done Right (Axler)", type: "reading" },
          { title: "3Blue1Brown: Essence of Linear Algebra", type: "video" },
        ],
        practiceExercise: "Implement matrix multiplication and numerical gradient checking from scratch in NumPy.",
        isCompleted: false,
      },
      {
        id: "mod_2",
        title: "Deep Neural Networks & Optimization",
        description: "Multilayer perceptrons, activation functions, backpropagation derivation, and Adam optimizer.",
        estimatedHours: 10,
        objectives: [
          "Trace computational graphs through forward and backward passes",
          "Analyze vanishing and exploding gradients in deep architectures",
        ],
        keyTopics: ["ReLU vs GELU activations", "Batch normalization", "Momentum & Adam"],
        recommendedResources: [
          { title: "Deep Learning (Goodfellow, Bengio, Courville)", type: "reading" },
          { title: "PyTorch Official Optimization Tutorials", type: "documentation" },
        ],
        practiceExercise: "Build a 3-layer neural network with custom backprop without using PyTorch autograd.",
        isCompleted: false,
      },
      {
        id: "mod_3",
        title: "Attention Mechanisms & Transformer Architecture",
        description: "Self-attention, multi-head attention, positional encodings, and encoder-decoder topologies.",
        estimatedHours: 12,
        objectives: [
          "Deconstruct Scaled Dot-Product Attention equations mathematically",
          "Understand why Transformers scale quadratically with context length",
        ],
        keyTopics: ["Query-Key-Value matrices", "Causal masking", "FlashAttention optimizations"],
        recommendedResources: [
          { title: "Attention Is All You Need (Vaswani et al.)", type: "reading" },
          { title: "The Illustrated Transformer (Jay Alammar)", type: "reading" },
        ],
        practiceExercise: "Implement single-head Scaled Dot-Product Attention in Python with tensor dimension assertions.",
        isCompleted: false,
      },
    ];
  } else if (isWeb) {
    modules = [
      {
        id: "mod_1",
        title: "Advanced TypeScript & Component Architecture",
        description: "Generics, conditional types, union discrimination, and high-performance component state.",
        estimatedHours: 6,
        objectives: ["Master template literal and mapped types", "Eliminate any and unknown safely"],
        keyTopics: ["Discriminated unions", "Zod schema parsing", "Compound components"],
        recommendedResources: [
          { title: "Total TypeScript by Matt Pocock", type: "documentation" },
          { title: "React Component Patterns Guide", type: "reading" },
        ],
        practiceExercise: "Build a strongly-typed polymorphic button and table component in React.",
        isCompleted: false,
      },
      {
        id: "mod_2",
        title: "Full-Stack Next.js App Router & Server Actions",
        description: "Streaming SSR, React Server Components (RSC), Suspense boundaries, and mutation lifecycles.",
        estimatedHours: 10,
        objectives: ["Optimize initial page load with RSC", "Implement zero-bundle-size server actions"],
        keyTopics: ["Server Components vs Client Components", "Parallel & Intercepting Routes", "Revalidation strategies"],
        recommendedResources: [
          { title: "Next.js Official App Router Documentation", type: "documentation" },
        ],
        practiceExercise: "Construct an optimistic UI comment thread using useOptimistic and Next.js Server Actions.",
        isCompleted: false,
      },
    ];
  } else {
    // General rigorous academic syllabus
    modules = [
      {
        id: "mod_1",
        title: `Core Theoretical Fundamentals of ${subject}`,
        description: `First principles, definitions, core axioms, and historical evolution of ${subject}.`,
        estimatedHours: 6,
        objectives: ["Define all foundational terminology", "Identify primary theorems and boundary rules"],
        keyTopics: ["Axiomatic foundations", "Historical paradigm shifts", "Key analytical models"],
        recommendedResources: [
          { title: `Authoritative Text on ${subject}`, type: "reading" },
          { title: "MIT OpenCourseWare Lecture Series", type: "video" },
        ],
        practiceExercise: `Synthesize a 1-page executive summary comparing the two principal paradigms in ${subject}.`,
        isCompleted: false,
      },
      {
        id: "mod_2",
        title: `Mechanics, Methodologies & Problem Solving`,
        description: "In-depth procedural analysis, algorithmic derivations, and step-by-step case studies.",
        estimatedHours: 10,
        objectives: ["Solve complex benchmark problems independently", "Recognize failure modes and anti-patterns"],
        keyTopics: ["Procedural workflows", "Analytical techniques", "Common pitfalls & edge cases"],
        recommendedResources: [
          { title: "Standard Problem Workbook & Solutions", type: "practice" },
        ],
        practiceExercise: "Solve 5 non-trivial application scenarios without looking at reference solutions.",
        isCompleted: false,
      },
      {
        id: "mod_3",
        title: "Advanced Synthesis & Real-World Capstone",
        description: "Synthesizing individual modules into production-grade systems or research papers.",
        estimatedHours: 12,
        objectives: ["Deliver an end-to-end working artifact", "Defend architectural decisions under constraints"],
        keyTopics: ["System integration", "Performance optimization", "Security & verification"],
        recommendedResources: [
          { title: "Industry Whitepapers & Engineering Case Studies", type: "reading" },
        ],
        practiceExercise: "Execute and document an original capstone project demonstrating end-to-end competency.",
        isCompleted: false,
      },
    ];
  }

  const totalHours = modules.reduce((acc, m) => acc + m.estimatedHours, 0);

  return {
    id: `path_${Date.now()}`,
    userId: "user_citadel_01",
    title: `Mastery Curriculum: ${subject}`,
    subject,
    targetRoleOrGoal: targetGoal,
    currentLevel: currentLevel as any,
    targetLevel: "advanced",
    targetDate: targetDate || "2026-12-31",
    totalEstimatedHours: totalHours,
    completedHours: 0,
    progressPercentage: 0,
    modules,
    revisionSchedule: [
      { checkpointName: "Checkpoint 1: Core Fundamentals Review", targetDay: 7, focus: "Foundations & active recall" },
      { checkpointName: "Checkpoint 2: Mid-Term Problem Set", targetDay: 18, focus: "Complex problem derivation" },
      { checkpointName: "Final Checkpoint: Capstone Evaluation", targetDay: 30, focus: "Comprehensive synthesis" },
    ],
    createdAt: new Date().toISOString(),
  };
}
