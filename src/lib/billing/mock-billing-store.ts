import { UserSubscription, UsageRecord, FeatureFlag } from "@/types/billing";
import { Institution, InstitutionMember, LearningGroup, GroupAssignment } from "@/types/institution";

export const MOCK_USER_SUBSCRIPTION: UserSubscription = {
  id: "sub_student_pro_01",
  userId: "user_citadel_01",
  planId: "pro",
  status: "active",
  currentPeriodStart: "2026-11-10T00:00:00Z",
  currentPeriodEnd: "2026-12-10T00:00:00Z",
  cancelAtPeriodEnd: false,
  paymentProvider: "stripe",
  customerId: "cus_citadel_alex_01",
  subscriptionId: "sub_1Qcitadel_live_01",
};

export const MOCK_USAGE_RECORD: UsageRecord = {
  userId: "user_citadel_01",
  periodMonth: "2026-11",
  aiRequestsCount: 68,
  tokensConsumed: 48200,
  documentsProcessed: 4,
  quizzesGenerated: 7,
  lastUpdated: new Date().toISOString(),
};

export const MOCK_INSTITUTIONS: Institution[] = [
  {
    id: "inst_apex_01",
    name: "Apex Institute of Technology",
    slug: "apex-tech",
    domain: "apex.edu",
    planTier: "institution",
    seatLimit: 250,
    seatsAllocated: 142,
    createdAt: "2026-09-01T08:00:00Z",
  },
  {
    id: "inst_stanford_stem",
    name: "Bay Area Polytechnic University",
    slug: "bayarea-poly",
    domain: "bapoly.edu",
    planTier: "institution",
    seatLimit: 500,
    seatsAllocated: 380,
    createdAt: "2026-08-15T08:00:00Z",
  },
];

export const MOCK_INSTITUTION_MEMBERS: InstitutionMember[] = [
  {
    id: "mem_01",
    institutionId: "inst_apex_01",
    userId: "user_prof_marcus",
    displayName: "Dr. Marcus Vance",
    email: "m.vance@apex.edu",
    role: "educator",
    status: "active",
    department: "Computer Science & Distributed Systems",
    joinedAt: "2026-09-02T10:00:00Z",
  },
  {
    id: "mem_02",
    institutionId: "inst_apex_01",
    userId: "user_prof_elena",
    displayName: "Prof. Elena Rostova",
    email: "e.rostova@apex.edu",
    role: "institution_admin",
    status: "active",
    department: "Artificial Intelligence & Data Systems",
    joinedAt: "2026-09-01T09:00:00Z",
  },
  {
    id: "mem_03",
    institutionId: "inst_apex_01",
    userId: "user_citadel_01",
    displayName: "Alex Vance",
    email: "alex.student@apex.edu",
    role: "student",
    status: "active",
    department: "Undergraduate Computer Science",
    joinedAt: "2026-09-05T11:00:00Z",
  },
  {
    id: "mem_04",
    institutionId: "inst_apex_01",
    userId: "user_student_jordan",
    displayName: "Jordan Lee",
    email: "j.lee@apex.edu",
    role: "student",
    status: "active",
    department: "Undergraduate Computer Science",
    joinedAt: "2026-09-06T14:00:00Z",
  },
];

export const MOCK_LEARNING_GROUPS: LearningGroup[] = [
  {
    id: "grp_cs401",
    institutionId: "inst_apex_01",
    educatorId: "user_prof_marcus",
    name: "CS401: Distributed Systems (Fall 2026)",
    description: "Consensus algorithms, replication protocols, CAP theorem, and event logs.",
    subject: "Distributed Systems",
    studentCount: 28,
    activeAssignmentsCount: 2,
    createdAt: "2026-09-10T08:00:00Z",
  },
  {
    id: "grp_ai602",
    institutionId: "inst_apex_01",
    educatorId: "user_prof_elena",
    name: "AI602: Advanced Neural Architectures",
    description: "Self-attention mechanisms, transformer scaling, and vector RAG pipelines.",
    subject: "Artificial Intelligence",
    studentCount: 18,
    activeAssignmentsCount: 1,
    createdAt: "2026-09-12T08:00:00Z",
  },
];

export const MOCK_GROUP_ASSIGNMENTS: GroupAssignment[] = [
  {
    id: "asg_01",
    groupId: "grp_cs401",
    title: "Diagnostic Assessment: Raft Leader Election & Quorums",
    assignmentType: "quiz",
    targetId: "quiz_01",
    dueDate: "2026-11-15",
    submissionCount: 22,
    totalStudents: 28,
    createdAt: "2026-11-05T10:00:00Z",
  },
  {
    id: "asg_02",
    groupId: "grp_cs401",
    title: "Implement Token Bucket Rate Limiter with Lua script",
    assignmentType: "task",
    targetId: "task_01",
    dueDate: "2026-11-12",
    submissionCount: 19,
    totalStudents: 28,
    createdAt: "2026-11-06T14:00:00Z",
  },
];

export const MOCK_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: "ff_rag",
    flagName: "rag_vector_search",
    isEnabled: true,
    description: "Enables pgvector semantic retrieval and citation grounding for documents.",
    rolloutPercentage: 100,
  },
  {
    id: "ff_proactive",
    flagName: "proactive_learning_insights",
    isEnabled: true,
    description: "Activates autonomous learning recommendations based on student telemetry.",
    rolloutPercentage: 100,
  },
  {
    id: "ff_gemini_pro",
    flagName: "gemini_pro_deep_reasoning",
    isEnabled: true,
    description: "Permits Pro and Institution tiers to use Gemini 1.5 Pro deep theoretical model.",
    rolloutPercentage: 100,
  },
  {
    id: "ff_byok",
    flagName: "byok_custom_api_keys",
    isEnabled: true,
    description: "Allows students and institutions to supply their own Gemini API credentials.",
    rolloutPercentage: 100,
  },
];
