"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { AgentBadge } from "@/components/brand/AgentBadge";
import { CitadelLogo } from "@/components/brand/CitadelLogo";
import { ChatMessage, AgentIdentity } from "@/types/agent";
import { INITIAL_CONVERSATIONS, DEFAULT_PROFILE } from "@/lib/supabase/mock-store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  PlusCircle,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Search,
  BookOpen,
  Brain,
  Lightbulb,
  FileText,
  SlidersHorizontal,
  GraduationCap,
} from "lucide-react";

export default function AITutorPage() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState(INITIAL_CONVERSATIONS[0].id);
  const [searchFilter, setSearchFilter] = useState("");
  
  // Explanation complexity & mode controls
  const [level, setLevel] = useState<"simple" | "intermediate" | "advanced">("intermediate");
  const [mode, setMode] = useState<"explain" | "hint" | "example" | "socratic">("explain");

  // Chat state
  const [inputMessage, setInputMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeAgentIdentity, setActiveAgentIdentity] = useState<AgentIdentity>("Tutor Agent");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isStreaming]);

  const handleCreateNewConversation = () => {
    const newConv = {
      id: `conv_${Date.now()}`,
      title: "New Learning Session",
      subject: "General Academic",
      agentType: "Tutor Agent",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_welcome_${Date.now()}`,
          role: "assistant" as const,
          agentIdentity: "Tutor Agent" as AgentIdentity,
          content: `Hello! I'm your **CITADEL AI Tutor**. What topic or problem would you like to explore today?
          
You can ask me to explain a concept step-by-step, give real-world analogies, derive proofs, or guide you with Socratic hints.`,
          suggestedFollowUps: [
            "Explain how the Raft consensus algorithm works",
            "What is the difference between TCP and UDP?",
            "How does backpropagation compute gradients in neural networks?",
          ],
          createdAt: new Date().toISOString(),
        },
      ],
    };

    setConversations([newConv, ...conversations]);
    setActiveConvId(newConv.id);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isStreaming) return;

    setInputMessage("");

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: query,
      createdAt: new Date().toISOString(),
    };

    // Append user message immediately
    const updatedMessages = [...currentConversation.messages, userMessage];
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, messages: updatedMessages } : c))
    );

    setIsStreaming(true);

    // Placeholder assistant message
    const assistantMsgId = `asst_${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: "assistant",
      agentIdentity: activeAgentIdentity,
      content: "",
      createdAt: new Date().toISOString(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, messages: [...updatedMessages, initialAssistantMsg] }
          : c
      )
    );

    try {
      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          conversationId: activeConvId,
          level,
          mode,
          history: updatedMessages,
          profile: DEFAULT_PROFILE,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to receive response from AI agent");
      }

      // Check agent identity header from supervisor routing
      const assignedAgent = (response.headers.get("X-Agent-Identity") as AgentIdentity) || "Tutor Agent";
      setActiveAgentIdentity(assignedAgent);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== activeConvId) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      agentIdentity: assignedAgent,
                      content: accumulatedText,
                      suggestedFollowUps: [
                        `Explain this in ${level === "simple" ? "advanced" : "simpler"} terms`,
                        "Give me a real-world code example",
                        "Create a quick 3-question quiz on this",
                      ],
                    }
                  : m
              ),
            };
          })
        );
      }
    } catch (err: any) {
      console.error("Stream reading error:", err);
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeConvId) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: "An error occurred while communicating with the AI Agent. Please verify your connection or API key.",
                  }
                : m
            ),
          };
        })
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const quickActionPrompts = [
    { label: "Explain this topic", icon: Sparkles, mode: "explain" as const },
    { label: "Give me an analogy", icon: Lightbulb, mode: "example" as const },
    { label: "Socratic hint", icon: Brain, mode: "hint" as const },
    { label: "Simplify (ELI5)", icon: GraduationCap, mode: "explain" as const, targetLevel: "simple" as const },
  ];

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-7.5rem)] rounded-2xl overflow-hidden glass-panel border border-white/5">
        {/* Left: Chat Sessions History Sidebar */}
        <div className="w-72 bg-[#090d18]/90 border-r border-white/5 flex flex-col hidden md:flex">
          {/* Header & New Chat button */}
          <div className="p-4 border-b border-white/5 space-y-3">
            <button
              onClick={handleCreateNewConversation}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Tutoring Session</span>
            </button>

            {/* Conversation Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search sessions..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-300 placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations
              .filter((c) =>
                c.title.toLowerCase().includes(searchFilter.toLowerCase())
              )
              .map((c) => {
                const isActive = c.id === activeConvId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-violet-950/60 border border-violet-500/40 text-white shadow-glow"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-violet-400 font-mono">
                        {c.subject}
                      </span>
                      <span className="text-[9px] text-gray-500">
                        {new Date(c.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-200 truncate mt-1">
                      {c.title}
                    </p>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right: Active Chat Conversation Workspace */}
        <div className="flex-1 flex flex-col bg-[#07090e]/60">
          {/* Top Session Bar with Level Controls */}
          <div className="h-14 px-6 border-b border-white/5 flex items-center justify-between bg-[#0a0e1a]/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <AgentBadge agent={activeAgentIdentity} size="sm" />
              <h2 className="text-xs font-semibold text-white truncate max-w-xs sm:max-w-md">
                {currentConversation.title}
              </h2>
            </div>

            {/* Explanation Level Selector */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 ml-1.5 mr-0.5" />
              {(["simple", "intermediate", "advanced"] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium text-[11px] transition-all ${
                    level === lvl
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Flow Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {currentConversation.messages.map((msg) => {
              const isAssistant = msg.role === "assistant";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAssistant ? "items-start" : "items-end"}`}
                >
                  {/* Sender identity header */}
                  <div className="flex items-center gap-2 mb-1.5 px-1">
                    {isAssistant ? (
                      <AgentBadge agent={msg.agentIdentity || "Tutor Agent"} size="sm" />
                    ) : (
                      <span className="text-[11px] text-gray-400 font-medium">You</span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-2xl sm:max-w-3xl rounded-2xl p-5 text-sm leading-relaxed transition-all ${
                      isAssistant
                        ? "bg-[#101524] border border-white/10 text-gray-200 shadow-card-glass"
                        : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-glow"
                    }`}
                  >
                    {isAssistant ? (
                      <div className="prose prose-invert max-w-none text-sm space-y-3 prose-headings:font-display prose-headings:text-white prose-p:text-gray-200 prose-pre:bg-[#07090e] prose-pre:border prose-pre:border-white/10 prose-code:text-sky-300">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content || (isStreaming ? "Thinking and compiling explanation..." : "")}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}

                    {/* Action Bar for Assistant Messages */}
                    {isAssistant && msg.content && (
                      <div className="flex items-center justify-between pt-3 mt-4 border-t border-white/5 text-gray-400">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyText(msg.content, msg.id)}
                            className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
                            title="Copy response"
                          >
                            {copiedMessageId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleSendMessage(currentConversation.messages.slice(-2)[0]?.content || "Explain again")}
                            className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
                            title="Regenerate"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
                            title="Helpful"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
                            title="Unhelpful"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-[10px] text-gray-500 font-mono">
                          Verified Pedagogical Engine
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Suggested Follow-Ups Pills */}
                  {isAssistant && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 max-w-2xl">
                      {msg.suggestedFollowUps.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="text-xs px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-violet-950/40 text-gray-300 hover:text-violet-300 border border-white/5 hover:border-violet-500/30 transition-all flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3 h-3 text-sky-400" />
                          <span>{prompt}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Prompts Bar */}
          <div className="px-6 py-2 border-t border-white/5 bg-[#0a0e1a]/40 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
              Quick Prompt:
            </span>
            {quickActionPrompts.map((act, i) => {
              const Icon = act.icon;
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (act.targetLevel) setLevel(act.targetLevel);
                    setMode(act.mode);
                    handleSendMessage(
                      `${act.label} for: ${currentConversation.messages.slice(-1)[0]?.content.slice(0, 50) || "Distributed Systems"}`
                    );
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-violet-600/20 text-gray-300 hover:text-white border border-white/5 hover:border-violet-500/30 text-xs font-medium transition-all whitespace-nowrap"
                >
                  <Icon className="w-3 h-3 text-violet-400" />
                  <span>{act.label}</span>
                </button>
              );
            })}
          </div>

          {/* Message Input Box */}
          <div className="p-4 border-t border-white/5 bg-[#0a0e1a]/90">
            <div className="relative flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-2xl p-2 focus-within:border-violet-500/50 focus-within:bg-white/[0.06] transition-all">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                title="Attach Document or Notes"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder="Ask about any concept, problem, or topic (Press Enter to send)..."
                className="flex-1 bg-transparent border-none text-sm text-white placeholder-gray-500 focus:outline-none resize-none py-1 max-h-32"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isStreaming}
                className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-sky-500 hover:from-violet-500 hover:to-sky-400 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-glow transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500 px-2 pt-2">
              <span>Shift + Enter for new line</span>
              <span>CITADEL Multi-Agent Supervisor Active</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
