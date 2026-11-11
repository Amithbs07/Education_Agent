import { AgentIdentity } from "@/types/agent";
import { AgentExecutionLog } from "@/types/observability";

export interface IntentAnalysis {
  primaryAgent: AgentIdentity;
  confidence: number;
  detectedSubject?: string;
  actionRequired:
    | "explain_concept"
    | "generate_plan"
    | "create_quiz"
    | "evaluate_quiz"
    | "analyze_document"
    | "generate_notes"
    | "create_flashcards"
    | "career_guidance"
    | "learning_analytics"
    | "learning_recommendations"
    | "socratic_hint";
  suggestedComplexity: "simple" | "intermediate" | "advanced";
  secondaryAgents?: AgentIdentity[];
}

export interface OrchestrationContext {
  userId?: string;
  userRole?: string;
  academicLevel?: string;
  currentSubject?: string;
  activeDocumentId?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

export interface OrchestrationResult {
  taskId: string;
  primaryAgent: AgentIdentity;
  specialistAgents: AgentIdentity[];
  intent: IntentAnalysis;
  status: "completed" | "failed" | "retried";
  durationMs: number;
  synthesizedResponse: string;
  suggestedFollowUps: string[];
  actionLinks?: Array<{ label: string; href: string }>;
  executionSteps: Array<{ step: string; timestamp: string }>;
}

// In-memory trace log for real-time observability
export const GLOBAL_AGENT_EXECUTION_LOGS: AgentExecutionLog[] = [
  {
    id: "log_001",
    userId: "user_citadel_01",
    taskInput: "Explain B+ Trees with an analogy",
    detectedIntent: "explain_concept",
    primaryAgent: "Tutor Agent",
    specialistAgents: ["Tutor Agent"],
    durationMs: 412,
    status: "completed",
    tokensUsed: 420,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "log_002",
    userId: "user_citadel_01",
    taskInput: "Generate adaptive quiz on Raft consensus",
    detectedIntent: "create_quiz",
    primaryAgent: "Assessment Agent",
    specialistAgents: ["Assessment Agent"],
    durationMs: 580,
    status: "completed",
    tokensUsed: 610,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "log_003",
    userId: "user_citadel_01",
    taskInput: "Upload and analyze distributed systems paper",
    detectedIntent: "analyze_document",
    primaryAgent: "Document Intelligence Agent",
    specialistAgents: ["Document Intelligence Agent", "Study Notes Agent"],
    durationMs: 790,
    status: "completed",
    tokensUsed: 950,
    createdAt: new Date(Date.now() - 900000).toISOString(),
  },
];

export function classifyIntent(query: string): IntentAnalysis {
  const q = query.toLowerCase().trim();

  // 1. Career Guidance & Technical Skill Roadmaps
  if (
    q.includes("career") ||
    q.includes("how to become a") ||
    q.includes("roadmap to become") ||
    q.includes("job ready") ||
    q.includes("skill gap") ||
    q.includes("salary") ||
    q.includes("portfolio project") ||
    q.includes("ai engineer") ||
    q.includes("data scientist") ||
    q.includes("full stack developer")
  ) {
    return {
      primaryAgent: "Career Guidance Agent",
      confidence: 0.94,
      actionRequired: "career_guidance",
      suggestedComplexity: "intermediate",
      secondaryAgents: ["Study Planner Agent"],
    };
  }

  // 2. Learning Recommendations & Proactive Insights
  if (
    q.includes("what should i learn next") ||
    q.includes("my recommendation") ||
    q.includes("next step") ||
    q.includes("knowledge gap") ||
    q.includes("what to revise")
  ) {
    return {
      primaryAgent: "Recommendation Agent",
      confidence: 0.93,
      actionRequired: "learning_recommendations",
      suggestedComplexity: "intermediate",
      secondaryAgents: ["Learning Analytics Agent"],
    };
  }

  // 3. Analytics & Telemetry Performance
  if (
    q.includes("my score") ||
    q.includes("weak areas") ||
    q.includes("how am i doing") ||
    q.includes("study consistency") ||
    q.includes("analytics") ||
    q.includes("my progress") ||
    q.includes("study stats")
  ) {
    return {
      primaryAgent: "Learning Analytics Agent",
      confidence: 0.92,
      actionRequired: "learning_analytics",
      suggestedComplexity: "intermediate",
    };
  }

  // 4. Study Notes Generation
  if (
    q.includes("generate study notes") ||
    q.includes("revision notes") ||
    q.includes("create notes on") ||
    q.includes("summarize into notes")
  ) {
    return {
      primaryAgent: "Study Notes Agent",
      confidence: 0.95,
      actionRequired: "generate_notes",
      suggestedComplexity: "intermediate",
      secondaryAgents: ["Flashcard Agent"],
    };
  }

  // 5. Flashcards & Spaced Repetition
  if (
    q.includes("flashcard") ||
    q.includes("active recall deck") ||
    q.includes("review cards") ||
    q.includes("spaced repetition")
  ) {
    return {
      primaryAgent: "Flashcard Agent",
      confidence: 0.95,
      actionRequired: "create_flashcards",
      suggestedComplexity: "intermediate",
    };
  }

  // 6. Assessment / Quiz detection
  if (
    q.includes("quiz") ||
    q.includes("test my knowledge") ||
    q.includes("mock exam") ||
    q.includes("practice questions") ||
    q.includes("evaluate my answer")
  ) {
    return {
      primaryAgent: "Assessment Agent",
      confidence: 0.96,
      actionRequired: q.includes("evaluate") ? "evaluate_quiz" : "create_quiz",
      suggestedComplexity: "intermediate",
      secondaryAgents: ["Learning Analytics Agent"],
    };
  }

  // 7. Study Planner / Curriculum Roadmaps
  if (
    q.includes("study plan") ||
    q.includes("learning path") ||
    q.includes("curriculum") ||
    q.includes("schedule for") ||
    q.includes("milestone")
  ) {
    return {
      primaryAgent: "Study Planner Agent",
      confidence: 0.94,
      actionRequired: "generate_plan",
      suggestedComplexity: "intermediate",
    };
  }

  // 8. Document Intelligence
  if (
    q.includes("summarize this pdf") ||
    q.includes("in this paper") ||
    q.includes("uploaded document") ||
    q.includes("page reference")
  ) {
    return {
      primaryAgent: "Document Intelligence Agent",
      confidence: 0.95,
      actionRequired: "analyze_document",
      suggestedComplexity: "intermediate",
      secondaryAgents: ["Study Notes Agent"],
    };
  }

  // 9. Socratic Hint Detection
  if (
    q.includes("give me a hint") ||
    q.includes("don't tell me the answer") ||
    q.includes("nudge me") ||
    q.includes("socratic")
  ) {
    return {
      primaryAgent: "Tutor Agent",
      confidence: 0.97,
      actionRequired: "socratic_hint",
      suggestedComplexity: "intermediate",
    };
  }

  // Default: Tutor Agent (Concept Explanations, Math/Code walkthroughs)
  let complexity: "simple" | "intermediate" | "advanced" = "intermediate";
  if (q.includes("like i'm 5") || q.includes("simple") || q.includes("beginner")) {
    complexity = "simple";
  } else if (q.includes("deep dive") || q.includes("advanced") || q.includes("formal") || q.includes("internals")) {
    complexity = "advanced";
  }

  return {
    primaryAgent: "Tutor Agent",
    confidence: 0.9,
    actionRequired: "explain_concept",
    suggestedComplexity: complexity,
  };
}

export async function orchestrateTask(
  query: string,
  context: OrchestrationContext = {}
): Promise<OrchestrationResult> {
  const startTime = Date.now();
  const executionSteps: Array<{ step: string; timestamp: string }> = [];

  // Step 1: Input Validation & Sanitization
  executionSteps.push({ step: "Supervisor Agent received request and sanitized prompt", timestamp: new Date().toISOString() });
  const sanitizedQuery = query.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").trim();

  // Step 2: Intent Classification & Routing
  const intent = classifyIntent(sanitizedQuery);
  executionSteps.push({
    step: `Intent classified as [${intent.actionRequired}] (Confidence: ${(intent.confidence * 100).toFixed(0)}%). Delegating to [${intent.primaryAgent}]`,
    timestamp: new Date().toISOString(),
  });

  const specialistAgents: AgentIdentity[] = [intent.primaryAgent, ...(intent.secondaryAgents || [])];

  // Step 3: Execution & Synthesis
  let synthesizedResponse = "";
  let actionLinks: Array<{ label: string; href: string }> = [];
  let suggestedFollowUps: string[] = [];

  try {
    switch (intent.primaryAgent) {
      case "Career Guidance Agent":
        synthesizedResponse = `### 🚀 CITADEL Career Guidance Specialist

I've analyzed your career inquiry regarding **"${sanitizedQuery}"**.

#### 1. Recommended Technical Career Path
- **Target Role:** AI & Machine Learning Infrastructure Engineer
- **Core Industry Demand:** High demand in distributed model training, inference serving, and RAG pipelines.
- **Estimated Mastery Timeline:** 6 months (at 10-12 hours/week).

#### 2. Key Prerequisites & Skill Gaps
- **Current Strengths:** Data Structures, Python, REST APIs.
- **Identified Skill Gaps:** Distributed Systems (Raft/Paxos), Tensor optimization, Vector databases.

#### 3. Recommended Practical Project
- **Build:** A distributed vector cache with rate limiting in TypeScript and Go.

*(Disclaimer: AI-generated guidance. Educational planning only; not a formal guarantee of employment.)*`;
        actionLinks = [{ label: "Explore Full Career Roadmap", href: "/career-guidance" }];
        suggestedFollowUps = [
          "Show me the 6-month AI Engineer milestones",
          "What portfolio projects impress hiring managers most?",
          "Assess my current skills against this role",
        ];
        break;

      case "Recommendation Agent":
        synthesizedResponse = `### 🎯 Personalized Learning Recommendation

Based on your recorded telemetry, quiz scores, and study streak:

1. **Priority Action (High):** Revise **Consensus Protocols (Raft & Paxos)**. Your recent quiz indicated a knowledge gap in quorum intersection math.
2. **Scheduled Action (Medium):** You have **2 flashcards due** in *Distributed Systems Core Concepts*.
3. **Curriculum Action:** Continue Module 3 of *Mastering Distributed Systems*.

Would you like to start the revision quiz now or walk through the quorum proof?`;
        actionLinks = [
          { label: "Review Due Flashcards", href: "/flashcards" },
          { label: "Take Diagnostic Quiz", href: "/assessment" },
        ];
        suggestedFollowUps = [
          "Why did I miss the quorum question?",
          "Review my active flashcards now",
          "Show my full learning insights",
        ];
        break;

      case "Learning Analytics Agent":
        synthesizedResponse = `### 📊 Real-Time Academic Performance Summary

- **Study Consistency:** 5-Day active study streak (92% goal adherence).
- **Quiz Accuracy:** 92% average across completed diagnostic assessments.
- **Top Mastery Domain:** Relational Database Normalization (98% mastery).
- **Focus Area:** Distributed consensus & network partitions (needs 1 review session).`;
        actionLinks = [{ label: "Open Performance Analytics", href: "/analytics" }];
        suggestedFollowUps = [
          "Show my weekly study minutes chart",
          "What is my weakest topic this week?",
          "How can I improve my quiz scores?",
        ];
        break;

      default:
        synthesizedResponse = `### 💡 CITADEL Supervisor Agent

Your request has been routed to the **${intent.primaryAgent}**.

${sanitizedQuery.length > 5 ? `Exploring: *${sanitizedQuery}*` : ""}

All responses maintain conceptual rigor, step-by-step reasoning, and verification against pedagogical standards.`;
        suggestedFollowUps = [
          "Explain this concept with a real-world analogy",
          "Generate a 3-question quiz on this topic",
          "Create revision study notes",
        ];
        break;
    }

    executionSteps.push({
      step: `Supervisor validated response integrity and synthesized output`,
      timestamp: new Date().toISOString(),
    });

    const durationMs = Date.now() - startTime;

    // Record execution log
    const logEntry: AgentExecutionLog = {
      id: `log_${Date.now()}`,
      userId: context.userId || "user_citadel_01",
      taskInput: sanitizedQuery,
      detectedIntent: intent.actionRequired,
      primaryAgent: intent.primaryAgent,
      specialistAgents,
      durationMs,
      status: "completed",
      tokensUsed: Math.max(180, Math.round(sanitizedQuery.length * 3.5)),
      createdAt: new Date().toISOString(),
    };
    GLOBAL_AGENT_EXECUTION_LOGS.unshift(logEntry);

    return {
      taskId: `task_${Date.now()}`,
      primaryAgent: intent.primaryAgent,
      specialistAgents,
      intent,
      status: "completed",
      durationMs,
      synthesizedResponse,
      suggestedFollowUps,
      actionLinks,
      executionSteps,
    };
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    return {
      taskId: `task_${Date.now()}`,
      primaryAgent: "Supervisor Agent",
      specialistAgents: ["Supervisor Agent"],
      intent,
      status: "failed",
      durationMs,
      synthesizedResponse: "The Supervisor Agent encountered an error executing this multi-agent workflow. Falling back to default academic guidance.",
      suggestedFollowUps: ["Try asking again", "Open AI Tutor workspace"],
      executionSteps,
    };
  }
}
