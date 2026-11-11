export type AgentIdentity =
  | "Supervisor Agent"
  | "Tutor Agent"
  | "Study Planner Agent"
  | "Assessment Agent"
  | "Document Intelligence Agent"
  | "Study Notes Agent"
  | "Flashcard Agent"
  | "Career Guidance Agent"
  | "Learning Analytics Agent"
  | "Recommendation Agent";

export type AgentRole = "user" | "assistant" | "system";

export interface MessageSource {
  title: string;
  pageOrSection?: string;
  excerpt?: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  role: AgentRole;
  content: string;
  agentIdentity?: AgentIdentity;
  sources?: MessageSource[];
  hints?: string[];
  suggestedFollowUps?: string[];
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  subject: string;
  agentType: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface QuickActionPrompt {
  id: string;
  label: string;
  prompt: string;
  iconName: string;
  description: string;
}
