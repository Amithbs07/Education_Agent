import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSupervisorSystemPrompt, getTutorSystemPrompt } from "@/lib/ai/prompts";
import { classifyIntent } from "@/lib/ai/supervisor";
import { createTextStream } from "@/lib/ai/stream-helper";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const {
      message,
      level = "intermediate",
      mode = "explain",
      history = [],
      profile,
    } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 1. Supervisor Agent Intent Classification
    const intent = classifyIntent(message);
    const assignedAgent = intent.primaryAgent;

    // 2. Build the tailored system prompt based on level & intent
    const systemPrompt =
      assignedAgent === "Tutor Agent"
        ? getTutorSystemPrompt(profile, level, mode)
        : getSupervisorSystemPrompt(profile);

    // 3. If Gemini API is configured and key is not placeholder
    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
          systemInstruction: systemPrompt,
        });

        // Format history for Gemini chat
        const geminiHistory = history.map((msg: any) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
          history: geminiHistory.slice(-6), // Send last 6 turns for context
        });

        const resultStream = await chat.sendMessageStream(message);

        const encoder = new TextEncoder();
        const customStream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of resultStream.stream) {
                const chunkText = chunk.text();
                controller.enqueue(encoder.encode(chunkText));
              }
              controller.close();
            } catch (err) {
              controller.error(err);
            }
          },
        });

        return new Response(customStream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Agent-Identity": assignedAgent,
          },
        });
      } catch (geminiError) {
        console.warn("Gemini API error, falling back to local pedagogical engine:", geminiError);
      }
    }

    // 4. Intelligent Educational Fallback Generator (Produces high-depth, structured pedagogical markdown)
    const educationalResponse = generatePedagogicalResponse(message, level, mode, assignedAgent);
    const stream = createTextStream(educationalResponse, 14, 18);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Agent-Identity": assignedAgent,
      },
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

function generatePedagogicalResponse(
  query: string,
  level: "simple" | "intermediate" | "advanced",
  mode: "explain" | "hint" | "example" | "socratic",
  agentIdentity: string
): string {
  const q = query.toLowerCase();

  if (mode === "hint" || q.includes("hint")) {
    return `### 💡 Socratic Hint from ${agentIdentity}

Before jumping directly to the answer, let's analyze the core constraint of your question:

1. **Guiding Question**: What is the fundamental physical or theoretical bottleneck at play here? Is it memory space, CPU computation cycles, or network latency?
2. **Mental Model**: Think about how an index in a physical book works. If you are searching for an author named "Turing", do you scan every page, or do you jump to the 'T' section and follow page references?
3. **Next Step**: Try to formalize what condition must hold true when you partition data across multiple machines.

*Would you like another small nudge, or are you ready to test your hypothesis?*`;
  }

  if (q.includes("b-tree") || q.includes("b+ tree") || q.includes("index")) {
    return `### Understanding B+ Trees & Database Indexing

**Level:** ${level.toUpperCase()} | **Agent:** ${agentIdentity}

#### 1. Real-World Analogy: The Multi-Floor Library
Imagine a massive national library containing 10 million books:
- In a **Binary Search Tree (BST)**, you have a gatekeeper who only tells you "Go Left" or "Go Right". To find your book, you must walk through **24 consecutive checkpoints**.
- In a **B+ Tree**, you have a master directory on the first floor that points you directly to the **Floor**, the **Aisle**, and the **Shelf** in just **3 steps**.

#### 2. Why Databases Demand B+ Trees
Disks and SSD controllers do not read single bytes—they read **Pages** (typically 4KB to 16KB):
- **High Fan-Out**: A single B+ tree page can hold hundreds of keys ($B \\approx 100$ to $500$).
- **Minimal Height**: For $N = 10,000,000$ rows, the height $h \\approx \\log_{B}(N) \\le 3$. That means at most **3 disk reads** to locate any row.
- **Doubly-Linked Leaves**: All row pointers reside exclusively in the leaf nodes, which are chained together horizontally.

\`\`\`sql
-- Range query: Traverses root to first leaf in 3 I/Os, then scans horizontally
SELECT order_id, customer_id, total_amount
FROM orders
WHERE created_at BETWEEN '2026-11-01' AND '2026-11-10';
\`\`\`

#### 3. ${level === "advanced" ? "Node Splitting Formalism" : "Step-by-Step Execution"}
When inserting a key into a full leaf node ($M$ keys):
1. The node splits into two nodes, each containing $\\lceil M/2 \\rceil$ keys.
2. The middle key is promoted to the parent non-leaf node.
3. If the parent is also full, the split cascades upwards toward the root. Tree height increases only when the root itself splits.

---
**Quick Comprehension Check:**
*Why does a table typically have only ONE Clustered Index, while having multiple Non-Clustered (Secondary) Indexes?*`;
  }

  if (q.includes("raft") || q.includes("consensus") || q.includes("paxos")) {
    return `### Consensus in Distributed Systems (The Raft Protocol)

**Level:** ${level.toUpperCase()} | **Agent:** ${agentIdentity}

#### 1. The Core Problem
In a distributed cluster, how do multiple independent servers agree on a sequence of state transitions when network partitions, packet delays, and node crashes can occur at any millisecond?

#### 2. The Three Server Roles in Raft
1. **Leader**: Handles all client requests, appends log entries, and directs followers.
2. **Follower**: Passive; responds to incoming Remote Procedure Calls (RPCs) from leaders and candidates.
3. **Candidate**: Initiates an election if heartbeats from the leader time out.

\`\`\`mermaid
flowchart LR
    Follower -->|Election Timeout| Candidate
    Candidate -->|Receives Majority Votes| Leader
    Leader -->|Discovers Higher Term| Follower
    Candidate -->|Discovers Higher Term| Follower
\`\`\`

#### 3. Leader Election Mechanism
- **Randomized Election Timers**: (typically 150ms – 300ms) prevent split-vote deadlocks where two nodes initiate elections simultaneously.
- **Quorum Requirement**: A candidate requires votes from a majority of nodes:
  $$\\text{Quorum} = \\lfloor N / 2 \\rfloor + 1$$
- For a 5-node cluster, a quorum is 3. A partition of 2 nodes cannot commit logs.

---
**Test Your Understanding:**
*If a network partition divides a 5-node cluster into {Node A, Node B} and {Node C, Node D, Node E}, which side can safely accept and commit client writes?*`;
  }

  // General academic prompt responder
  return `### Academic Insight: ${query}

**Assigned Specialist:** ${agentIdentity}  
**Complexity Target:** ${level.toUpperCase()}  

#### 1. Core Concept & High-Level Intuition
To master this topic, we break it down into first principles. The primary goal is understanding *why* the concept exists before examining *how* it functions mechanically.

#### 2. Fundamental Breakdown
- **Key Mechanism:** Notice how inputs transform through defined stages rather than arbitrary state changes.
- **Constraints & Edge Cases:** Every robust system or theorem specifies boundaries where assumptions break down.
- **Real-World Application:** In production software engineering and modern academic research, this paradigm directly prevents bottleneck failures.

#### 3. Step-by-Step Walkthrough
1. **Initial State:** Identify the preconditions and data structures involved.
2. **Execution Flow:** Trace the sequential invariants preserved across each step.
3. **Verification:** Confirm that post-conditions satisfy all correctness criteria.

---
*Would you like to explore a concrete code implementation, see a real-world analogy, or test yourself with a 3-question quiz?*`;
}
