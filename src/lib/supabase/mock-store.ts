import { StudentProfile, LearningActivity } from "@/types/student";
import { LearningPath, StudyTask, StudyNote, Flashcard } from "@/types/plan";
import { Quiz, QuizAttemptResult } from "@/types/quiz";
import { Conversation } from "@/types/agent";

export const DEFAULT_PROFILE: StudentProfile = {
  id: "student_001",
  userId: "user_citadel_01",
  email: "alex.student@citadel.edu",
  displayName: "Alex Vance",
  academicLevel: "undergraduate",
  primarySubjects: ["Computer Science", "Artificial Intelligence", "Linear Algebra"],
  targetGoals: [
    "Master System Design & Algorithms",
    "Prepare for Technical Placement Interviews",
    "Build a production-grade RAG pipeline",
  ],
  preferredLearningStyle: "visual_and_examples",
  knowledgeLevel: "intermediate",
  dailyStudyGoalMinutes: 75,
  streakDays: 5,
  createdAt: "2026-11-01T08:00:00Z",
  updatedAt: "2026-11-10T08:00:00Z",
};

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv_01",
    title: "Understanding B-Trees and Database Indexing",
    subject: "Database Engineering",
    agentType: "Tutor Agent",
    createdAt: "2026-11-09T14:30:00Z",
    updatedAt: "2026-11-09T15:10:00Z",
    messages: [
      {
        id: "m_1",
        role: "user",
        content: "Can you explain why databases prefer B+ Trees over regular Binary Search Trees for disk storage?",
        createdAt: "2026-11-09T14:30:00Z",
      },
      {
        id: "m_2",
        role: "assistant",
        agentIdentity: "Tutor Agent",
        content: `### Why Databases Choose B+ Trees Over Binary Search Trees

The fundamental reason comes down to **hardware architecture** and specifically **disk I/O cost**.

#### 1. The Block Storage Reality
Disks (both HDDs and NVMe SSDs) read and write data in **pages or blocks** (typically 4KB to 16KB), never individual bytes.
- A **Binary Search Tree (BST)** has a fan-out of only 2. For $1,000,000$ records, a balanced BST has a height of $\\approx 20$. In the worst case, traversing this means **20 separate random disk reads**.
- A **B+ Tree** has a high fan-out (often 100 to 500 children per node). For the same $1,000,000$ records, the tree height is only **3 or 4 levels**. That reduces disk I/O operations from 20 down to just 3!

#### 2. Key Differences in B+ Trees
- **All data records are stored in the leaf nodes**: Internal nodes only hold search keys for routing.
- **Linked Leaf Pointers**: Leaf nodes are linked as a doubly-linked list. When executing a range query (e.g. \`WHERE age BETWEEN 20 AND 30\`), the engine finds the first leaf and simply scans forward linearly!

\`\`\`sql
-- Range query enabled by B+ Tree linked leaf traversal
SELECT * FROM users WHERE score >= 85 AND score <= 95 ORDER BY score;
\`\`\`

Would you like to examine how node splitting works when an insertion occurs in a full page?`,
        suggestedFollowUps: [
          "Explain B+ Tree node splitting step-by-step",
          "What is the difference between Clustered and Non-Clustered Indexes?",
          "Generate a quick 3-question quiz on B+ Trees",
        ],
        createdAt: "2026-11-09T14:31:00Z",
      },
    ],
  },
];

export const INITIAL_LEARNING_PATHS: LearningPath[] = [
  {
    id: "path_01",
    userId: "user_citadel_01",
    title: "Mastering Distributed Systems & Cloud Architecture",
    subject: "Distributed Computing",
    targetRoleOrGoal: "Senior Infrastructure Engineer",
    currentLevel: "intermediate",
    targetLevel: "advanced",
    targetDate: "2026-12-15",
    totalEstimatedHours: 32,
    completedHours: 14,
    progressPercentage: 44,
    modules: [
      {
        id: "mod_1",
        title: "Network Fundamentals & The Fallacies of Distributed Computing",
        description: "Latency, bandwidth, network partitions, and packet lifecycle.",
        estimatedHours: 6,
        objectives: ["Understand CAP theorem trade-offs", "Analyze partial failure modes"],
        keyTopics: ["RPC vs Message Queues", "Idempotency keys", "Backoff & Jitter"],
        recommendedResources: [
          { title: "Designing Data-Intensive Applications (Ch. 8)", type: "reading" },
          { title: "Fallacies of Distributed Computing Explained", type: "documentation" },
        ],
        practiceExercise: "Implement an exponential backoff client with full jitter in TypeScript or Python.",
        isCompleted: true,
      },
      {
        id: "mod_2",
        title: "Consensus Protocols (Raft & Paxos)",
        description: "Leader election, log replication, and split-brain resolution.",
        estimatedHours: 10,
        objectives: ["Simulate Raft state transitions", "Handle leader crashes gracefully"],
        keyTopics: ["Term numbers", "Heartbeats", "Commit index", "Quorum rules"],
        recommendedResources: [
          { title: "The Secret Lives of Data: Raft Visualization", type: "visual_and_examples" as any },
          { title: "In Search of an Understandable Consensus Algorithm", type: "reading" },
        ],
        practiceExercise: "Diagram a 5-node cluster enduring a network partition isolating 2 nodes.",
        isCompleted: true,
      },
      {
        id: "mod_3",
        title: "Event-Driven Messaging & Partitioning Strategies",
        description: "Kafka architecture, consumer groups, offsets, and ordering guarantees.",
        estimatedHours: 8,
        objectives: ["Design high-throughput event logs", "Mitigate rebalance storms"],
        keyTopics: ["Partition keys", "Exactly-once semantics", "Dead-letter queues"],
        recommendedResources: [
          { title: "Apache Kafka Internal Architecture Guide", type: "documentation" },
        ],
        practiceExercise: "Build an event consumer that handles duplicate deliveries idempotently.",
        isCompleted: false,
      },
      {
        id: "mod_4",
        title: "Distributed Caching & Consistency Invalidation",
        description: "Cache-aside, write-through, write-behind, and dogpiling prevention.",
        estimatedHours: 8,
        objectives: ["Prevent cache stampedes", "Implement distributed Redis locks"],
        keyTopics: ["TTL jitter", "Cache stampede mutex", "Redlock algorithm"],
        recommendedResources: [
          { title: "High Scalability Caching Patterns", type: "reading" },
        ],
        practiceExercise: "Design a rate limiter using the Token Bucket algorithm with Redis scripts.",
        isCompleted: false,
      },
    ],
    revisionSchedule: [
      { checkpointName: "Checkpoint 1: CAP & Raft Mastery", targetDay: 7, focus: "Consensus edge cases" },
      { checkpointName: "Checkpoint 2: Kafka & Sharding Review", targetDay: 14, focus: "Partition rebalancing" },
      { checkpointName: "Final Mock Interview: System Design", targetDay: 21, focus: "End-to-end architecture" },
    ],
    createdAt: "2026-11-02T10:00:00Z",
  },
];

export const INITIAL_TASKS: StudyTask[] = [
  {
    id: "task_01",
    userId: "user_citadel_01",
    learningPathId: "path_01",
    title: "Implement Token Bucket Rate Limiter with Lua script",
    subject: "Distributed Systems",
    dueDate: "2026-11-10",
    durationMinutes: 45,
    isCompleted: false,
    priority: "high",
    notes: "Review Redis atomic execution docs before starting.",
  },
  {
    id: "task_02",
    userId: "user_citadel_01",
    learningPathId: "path_01",
    title: "Review Raft Log Compaction & Snapshotting",
    subject: "Distributed Systems",
    dueDate: "2026-11-10",
    durationMinutes: 30,
    isCompleted: true,
    priority: "medium",
  },
  {
    id: "task_03",
    userId: "user_citadel_01",
    title: "Complete 15-question quiz on B+ Tree Indexing",
    subject: "Database Systems",
    dueDate: "2026-11-11",
    durationMinutes: 20,
    isCompleted: false,
    priority: "medium",
  },
  {
    id: "task_04",
    userId: "user_citadel_01",
    title: "Spaced-repetition flashcard review (32 cards due)",
    subject: "Algorithms",
    dueDate: "2026-11-10",
    durationMinutes: 15,
    isCompleted: false,
    priority: "high",
  },
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: "quiz_01",
    title: "Database Indexing & Query Execution",
    subject: "Computer Science",
    topic: "B+ Trees & Query Optimization",
    difficulty: "intermediate",
    totalQuestions: 4,
    createdAt: "2026-11-08T12:00:00Z",
    questions: [
      {
        id: "q1",
        type: "multiple_choice",
        prompt: "Why are leaf nodes in a B+ Tree connected via doubly-linked pointers?",
        options: [
          { id: "a", text: "To eliminate the need for an index root node" },
          { id: "b", text: "To enable high-performance sequential range scanning without traversing back up the tree" },
          { id: "c", text: "To enforce strict ACID transaction rollbacks" },
          { id: "d", text: "To compress string values automatically" },
        ],
        correctAnswer: "b",
        explanation: "In B+ Trees, all actual data records reside in the leaves. Linking them allows range queries (like BETWEEN 10 AND 50) to scan contiguous leaves directly without repeated root-to-leaf traversals.",
        conceptTested: "Range Query Optimization",
      },
      {
        id: "q2",
        type: "multiple_choice",
        prompt: "In a clustered index, where is the actual row data stored on disk?",
        options: [
          { id: "a", text: "In a separate unindexed heap table" },
          { id: "b", text: "In the internal non-leaf nodes" },
          { id: "c", text: "Directly in the leaf pages of the index itself" },
          { id: "d", text: "In the memory buffer pool exclusively" },
        ],
        correctAnswer: "c",
        explanation: "A clustered index physically sorts and stores table rows in the index's leaf pages. This is why a table can have only one clustered index.",
        conceptTested: "Clustered vs Secondary Indexes",
      },
      {
        id: "q3",
        type: "multiple_choice",
        prompt: "What does the CAP theorem state regarding distributed data stores under a network partition (P)?",
        options: [
          { id: "a", text: "You must sacrifice both Consistency and Availability" },
          { id: "b", text: "You must choose between Consistency (C) and Availability (A)" },
          { id: "c", text: "Network partitions can be prevented with dual fiber links" },
          { id: "d", text: "Data will replicate instantaneously without latency" },
        ],
        correctAnswer: "b",
        explanation: "When a network partition unavoidably occurs, the system must choose between returning errors/delays to maintain consistency, or returning stale data to stay available.",
        conceptTested: "CAP Theorem",
      },
      {
        id: "q4",
        type: "short_answer",
        prompt: "What algorithmic property guarantees that sending the same network request multiple times produces the identical side-effect as sending it once?",
        correctAnswer: "Idempotency",
        explanation: "Idempotence ensures safe retries across distributed networks without unintended duplicate state modifications (such as charging a credit card twice).",
        conceptTested: "Network Reliability & Idempotency",
      },
    ],
  },
];

export const INITIAL_ACTIVITIES: LearningActivity[] = [
  {
    id: "act_1",
    userId: "user_citadel_01",
    activityType: "tutor_chat",
    subject: "Database Engineering",
    durationMinutes: 40,
    details: { topic: "B+ Tree Indexing & Block Storage" },
    createdAt: "2026-11-09T15:10:00Z",
  },
  {
    id: "act_2",
    userId: "user_citadel_01",
    activityType: "quiz_completed",
    subject: "Distributed Systems",
    durationMinutes: 25,
    scorePercentage: 92,
    details: { quizTitle: "Consensus Protocols (Raft)", score: "4/4" },
    createdAt: "2026-11-08T16:20:00Z",
  },
  {
    id: "act_3",
    userId: "user_citadel_01",
    activityType: "task_completed",
    subject: "Distributed Systems",
    durationMinutes: 50,
    details: { task: "Simulate Raft state transitions" },
    createdAt: "2026-11-07T14:00:00Z",
  },
  {
    id: "act_4",
    userId: "user_citadel_01",
    activityType: "flashcard_reviewed",
    subject: "Algorithms",
    durationMinutes: 20,
    details: { cardsReviewed: 28 },
    createdAt: "2026-11-06T11:30:00Z",
  },
  {
    id: "act_5",
    userId: "user_citadel_01",
    activityType: "quiz_completed",
    subject: "Computer Science",
    durationMinutes: 30,
    scorePercentage: 85,
    details: { quizTitle: "Operating Systems Virtual Memory", score: "17/20" },
    createdAt: "2026-11-05T18:45:00Z",
  },
];

export const INITIAL_NOTES: StudyNote[] = [
  {
    id: "note_01",
    userId: "user_citadel_01",
    title: "Database Normalization Master Guide (1NF to BCNF)",
    subject: "Database Engineering",
    topic: "Relational Schema Normalization",
    contentMarkdown: `# Database Normalization Master Guide

## 1. Executive Summary
Normalization is the process of structuring relational database schemas to **minimize redundancy** and **prevent insertion, update, and deletion anomalies** without losing information.

## 2. Key Definitions
- **Functional Dependency ($X \\rightarrow Y$)**: Attribute $Y$ is functionally dependent on $X$ if each value of $X$ determines exactly one value of $Y$.
- **Superkey**: A set of attributes that uniquely identifies every tuple in a relation.
- **Candidate Key**: A minimal superkey (no extraneous attributes).
- **Prime Attribute**: An attribute that forms part of any candidate key.

## 3. The Normal Forms
### First Normal Form (1NF)
- Each column must contain atomic (indivisible) values.
- No repeating groups or arrays stored in single attributes.

### Second Normal Form (2NF)
- Must be in 1NF.
- **No partial dependency**: No non-prime attribute may depend on a proper subset of any candidate key.

### Third Normal Form (3NF)
- Must be in 2NF.
- **No transitive dependency**: No non-prime attribute may depend on another non-prime attribute ($X \\rightarrow Y \\rightarrow Z$).

### Boyce-Codd Normal Form (BCNF)
- For every non-trivial functional dependency $X \\rightarrow Y$, **$X$ must be a superkey**.
- Stricter than 3NF; eliminates anomalies where a prime attribute is determined by a non-superkey.

## 4. Exam High-Yield Points
1. Decompositions must be **lossless join** (can reconstruct original relation via natural join).
2. Decompositions should ideally be **dependency-preserving**, though BCNF cannot always preserve all functional dependencies without cross-table joins.
`,
    keyDefinitions: [
      { term: "Functional Dependency", definition: "A constraint between two sets of attributes in a relation." },
      { term: "Candidate Key", definition: "A minimal set of attributes uniquely identifying every record." },
      { term: "Lossless Join", definition: "Property guaranteeing no phantom tuples are generated upon join." },
    ],
    examSummary: "Remember: 2NF removes partial key dependencies. 3NF removes transitive dependencies. BCNF requires determinants to be superkeys.",
    quickRevisionPoints: [
      "Atomic values only for 1NF",
      "Full functional dependency on entire candidate key for 2NF",
      "No non-key attribute determines another non-key attribute for 3NF",
      "BCNF determinant must always be a superkey",
    ],
    createdAt: "2026-11-05T10:00:00Z",
    updatedAt: "2026-11-08T11:20:00Z",
  },
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: "fc_1",
    userId: "user_citadel_01",
    deckTitle: "Distributed Systems Core Concepts",
    subject: "Distributed Systems",
    front: "What is the difference between Synchronous and Asynchronous network communication?",
    back: "Synchronous communication blocks the caller until the receiver responds, requiring both to be available. Asynchronous communication decouples time and availability by sending messages to a broker/queue without waiting.",
    easeFactor: 2.5,
    intervalDays: 2,
    repetitions: 3,
    dueDate: "2026-11-10",
    createdAt: "2026-11-04T09:00:00Z",
  },
  {
    id: "fc_2",
    userId: "user_citadel_01",
    deckTitle: "Distributed Systems Core Concepts",
    subject: "Distributed Systems",
    front: "What is Split-Brain syndrome in distributed clusters?",
    back: "A state where a cluster becomes partitioned into two or more sub-clusters, each mistakenly believing the other is dead and electing its own leader, leading to conflicting data writes.",
    easeFactor: 2.6,
    intervalDays: 4,
    repetitions: 4,
    dueDate: "2026-11-10",
    createdAt: "2026-11-03T10:00:00Z",
  },
  {
    id: "fc_3",
    userId: "user_citadel_01",
    deckTitle: "Database Internals",
    subject: "Computer Science",
    front: "Why does WAL (Write-Ahead Logging) write sequentially instead of modifying data pages directly?",
    back: "Sequential disk writes to an append-only log are orders of magnitude faster than random writes to data pages. In case of crash, recovery simply replays committed WAL records.",
    easeFactor: 2.5,
    intervalDays: 1,
    repetitions: 1,
    dueDate: "2026-11-11",
    createdAt: "2026-11-06T15:00:00Z",
  },
];

export const INITIAL_DOCUMENTS = [
  {
    id: "doc_raft_01",
    userId: "user_citadel_01",
    filename: "In_Search_of_an_Understandable_Consensus_Algorithm_Raft.pdf",
    fileType: "pdf" as const,
    fileSize: 458000,
    totalPages: 18,
    summary:
      "Raft is a consensus algorithm for managing a replicated log. It produces a result equivalent to (multi-)Paxos and is as efficient as Paxos, but its structure is different: Raft separates consensus into leader election, log replication, and safety.",
    extractedConcepts: [
      "Leader Election",
      "Log Replication",
      "Safety Invariant",
      "Split-Brain Prevention",
      "Term Numbers",
    ],
    uploadedAt: "2026-11-08T09:15:00Z",
  },
  {
    id: "doc_db_02",
    userId: "user_citadel_01",
    filename: "Database_Storage_Engines_and_B_Trees.md",
    fileType: "md" as const,
    fileSize: 124000,
    totalPages: 6,
    summary:
      "Comprehensive analysis of disk-based vs in-memory storage architectures. Contrasts B+ Tree branch fan-out, block paging, and sequential leaf traversals against LSM-Trees and SSTables.",
    extractedConcepts: [
      "B+ Tree Fan-Out",
      "Leaf Pointer Linking",
      "Clustered Indexing",
      "Write Amplification",
    ],
    uploadedAt: "2026-11-07T14:30:00Z",
  },
];

export const INITIAL_DOCUMENT_CHUNKS = [
  {
    id: "chk_raft_1",
    documentId: "doc_raft_01",
    content:
      "Raft implements consensus by first electing a distinguished leader, then giving the leader complete responsibility for managing the replicated log. The leader accepts log entries from clients, replicates them on other servers, and tells servers when it is safe to apply log entries to their state machines. A leader can fail or become disconnected from the other servers, in which case a new leader is elected.",
    pageNumber: 3,
    chunkIndex: 0,
  },
  {
    id: "chk_raft_2",
    documentId: "doc_raft_01",
    content:
      "Leader election uses randomized election timers to resolve split votes. Each candidate begins with a randomized timer (e.g., 150-300ms). The first candidate whose timer expires transitions to Candidate state, votes for itself, and broadcasts RequestVote RPCs to all peers. If it receives votes from a majority (floor(N/2)+1), it becomes leader and broadcasts periodic heartbeats.",
    pageNumber: 5,
    chunkIndex: 1,
  },
  {
    id: "chk_raft_3",
    documentId: "doc_raft_01",
    content:
      "Safety in Raft: If a server has applied a log entry at a given index to its state machine, no other server will ever apply a different log entry for the same index. The Election Restriction states that a voter denies its vote if its own log is more up-to-date than the candidate's log. This guarantees that the leader elected in any term already contains all entries committed in previous terms.",
    pageNumber: 8,
    chunkIndex: 2,
  },
  {
    id: "chk_db_1",
    documentId: "doc_db_02",
    content:
      "In a B+ Tree, every node except the root contains between ceil(M/2) and M keys. Crucially, internal nodes store only search routing keys and child page IDs; all row pointers and payload attributes are strictly stored in the leaf pages. Leaves are doubly linked to permit contiguous sequential scans across ranges without re-traversing internal nodes.",
    pageNumber: 2,
    chunkIndex: 0,
  },
];

