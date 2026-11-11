export interface AgentExecutionLog {
  id: string;
  userId: string;
  taskInput: string;
  detectedIntent: string;
  primaryAgent: string;
  specialistAgents: string[];
  durationMs: number;
  status: "completed" | "failed" | "retried";
  tokensUsed: number;
  errorMessage?: string;
  createdAt: string;
}

export interface SystemHealth {
  geminiApi: "online" | "degraded" | "offline";
  vectorDb: "online" | "degraded" | "offline";
  orchestrator: "online" | "degraded" | "offline";
  totalRequests24h: number;
  errorRate: number;
  avgLatencyMs: number;
}

export type UserRole = "student" | "educator" | "admin";

export interface UserRoleRecord {
  id: string;
  userId: string;
  email: string;
  role: UserRole;
  createdAt: string;
}
