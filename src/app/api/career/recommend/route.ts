import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CareerRecommendation, CareerCategory, CareerMilestone, CareerProject } from "@/types/career";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const {
      category = "ai_ml",
      targetRole = "AI/ML Systems Engineer",
      currentSkills = ["Python", "SQL", "Linear Algebra"],
      interests = ["Deep Learning", "Distributed Inference"],
      timelineMonths = 6,
    }: {
      category: CareerCategory;
      targetRole: string;
      currentSkills: string[];
      interests: string[];
      timelineMonths: number;
    } = await req.json();

    if (apiKey && apiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
          generationConfig: { responseMimeType: "application/json" },
          systemInstruction: `You are the CITADEL Career Guidance Specialist.
Generate a structured, realistic career roadmap for a technical role.
Include skill gap analysis comparing target requirements against student's current skills.
Never guarantee job placement or salary figures.
JSON shape:
{
  "careerTitle": "String",
  "overview": "String",
  "requiredSkills": ["Skill 1", "Skill 2"],
  "skillGaps": ["Gap 1", "Gap 2"],
  "milestones": [
    {
      "milestoneName": "String",
      "durationWeeks": 4,
      "topics": ["Topic 1"],
      "skillsAcquired": ["Skill 1"]
    }
  ],
  "projects": [
    {
      "title": "String",
      "difficulty": "intermediate",
      "description": "String",
      "techStack": ["Python", "PyTorch"],
      "keyOutcome": "String"
    }
  ],
  "recommendedNextAction": "String"
}`,
        });

        const prompt = `Generate technical career roadmap for:
Role: ${targetRole} (${category})
Current Skills: ${currentSkills.join(", ")}
Interests: ${interests.join(", ")}
Timeline: ${timelineMonths} months`;

        const result = await model.generateContent(prompt);
        const parsed = JSON.parse(result.response.text());

        const recommendation: CareerRecommendation = {
          id: `career_rec_${Date.now()}`,
          userId: "user_citadel_01",
          careerCategory: category,
          careerTitle: parsed.careerTitle || targetRole,
          overview: parsed.overview || "Structured career development path.",
          requiredSkills: parsed.requiredSkills || [],
          currentSkills: currentSkills,
          skillGaps: parsed.skillGaps || [],
          milestones: parsed.milestones || [],
          projects: parsed.projects || [],
          recommendedNextAction: parsed.recommendedNextAction || "Start Milestone 1.",
          createdAt: new Date().toISOString(),
        };

        return NextResponse.json({ success: true, recommendation });
      } catch (geminiError) {
        console.warn("Gemini career generation fallback:", geminiError);
      }
    }

    // Heuristic Pre-Engineered Career Tracks
    const recommendation = getHeuristicCareerTrack(category, targetRole, currentSkills, timelineMonths);
    return NextResponse.json({ success: true, recommendation });
  } catch (error: any) {
    console.error("Career recommendation API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate career recommendation" },
      { status: 500 }
    );
  }
}

function getHeuristicCareerTrack(
  category: CareerCategory,
  targetRole: string,
  currentSkills: string[],
  timelineMonths: number
): CareerRecommendation {
  const tracks: Record<
    CareerCategory,
    {
      title: string;
      overview: string;
      required: string[];
      milestones: CareerMilestone[];
      projects: CareerProject[];
      nextAction: string;
    }
  > = {
    ai_ml: {
      title: "AI & Machine Learning Infrastructure Engineer",
      overview:
        "Specializes in designing, scaling, and operationalizing modern deep learning architectures, transformer pipelines, vector retrieval engines, and distributed model training.",
      required: [
        "PyTorch / Tensor Optimization",
        "Vector Embeddings & RAG Architectures",
        "Transformer Topologies (Self-Attention)",
        "Distributed Training (vLLM / Triton / CUDA basics)",
        "Python & C++ bindings",
      ],
      milestones: [
        {
          milestoneName: "Stage 1: Mathematical Foundations & Tensor Calculus",
          durationWeeks: 4,
          topics: ["SVD & Eigen decomposition", "Multivariate chain rule", "Loss landscapes"],
          skillsAcquired: ["NumPy autograd from scratch", "Matrix calculus"],
        },
        {
          milestoneName: "Stage 2: Deep Architectures & Attention Mechanisms",
          durationWeeks: 6,
          topics: ["Residual connections", "LayerNorm & GELU", "Scaled Dot-Product Attention"],
          skillsAcquired: ["PyTorch model authoring", "Attention layer implementation"],
        },
        {
          milestoneName: "Stage 3: High-Performance Inference & RAG Pipelines",
          durationWeeks: 6,
          topics: ["Vector indexing (HNSW / IVFFlat)", "Chunk windowing", "KV-cache optimization"],
          skillsAcquired: ["FastAPI inference servers", "pgvector integration"],
        },
        {
          milestoneName: "Stage 4: Distributed Serving & Capstone Deployment",
          durationWeeks: 8,
          topics: ["Model quantization (AWQ/GPTQ)", "Pipelined parallel inference", "vLLM / Triton"],
          skillsAcquired: ["Production LLM deployment", "Throughput benchmarking"],
        },
      ],
      projects: [
        {
          title: "High-Throughput Vector RAG Engine with Caching",
          difficulty: "intermediate",
          description:
            "Architect a semantic search and grounded question-answering pipeline using pgvector, asynchronous chunk processing, and embedding cache eviction.",
          techStack: ["Python", "FastAPI", "pgvector", "Gemini Embeddings"],
          keyOutcome: "Demonstrates production RAG indexing and sub-100ms vector lookups under load.",
        },
        {
          title: "Transformer Attention Engine from Scratch",
          difficulty: "advanced",
          description:
            "Implement multi-head attention and causal masking with rigorous tensor dimension asserts and compare latency against FlashAttention.",
          techStack: ["PyTorch", "Python", "NumPy", "CUDA Profiler"],
          keyOutcome: "Shows foundational mastery of generative AI model internals beyond high-level wrappers.",
        },
      ],
      nextAction: "Complete the Tensor Calculus review set and initiate Stage 1 exercises.",
    },
    full_stack: {
      title: "Senior Full Stack Systems Engineer",
      overview:
        "Designs resilient modern cloud web applications, reactive user interfaces, scalable REST/GraphQL APIs, and distributed database models.",
      required: [
        "TypeScript & Modern React (Next.js App Router)",
        "Database Architecture (PostgreSQL & Redis)",
        "API Design & Idempotency",
        "Tailwind CSS & Design Systems",
        "Docker & CI/CD Pipelines",
      ],
      milestones: [
        {
          milestoneName: "Stage 1: Advanced TypeScript & Component Architecture",
          durationWeeks: 4,
          topics: ["Generics & conditional types", "Discriminated unions", "Compound components"],
          skillsAcquired: ["Type-safe design systems", "Zero-runtime bugs"],
        },
        {
          milestoneName: "Stage 2: Next.js App Router & Server Actions",
          durationWeeks: 5,
          topics: ["React Server Components (RSC)", "Streaming SSR", "Optimistic mutations"],
          skillsAcquired: ["Full-stack Next.js architecture", "State management"],
        },
        {
          milestoneName: "Stage 3: Database Engineering & Caching",
          durationWeeks: 5,
          topics: ["Query optimization & EXPLAIN ANALYZE", "B+ Trees", "Redis distributed locking"],
          skillsAcquired: ["PostgreSQL indexing", "Cache-aside strategies"],
        },
        {
          milestoneName: "Stage 4: Cloud Infrastructure & Observability",
          durationWeeks: 6,
          topics: ["Docker containerization", "OpenTelemetry tracing", "Rate limiting"],
          skillsAcquired: ["Production deployment", "Zero-downtime releases"],
        },
      ],
      projects: [
        {
          title: "Collaborative Real-Time Workspace Platform",
          difficulty: "intermediate",
          description:
            "Build an interactive SaaS workspace with live WebSockets, optimistic UI updates, and role-based access control.",
          techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Supabase"],
          keyOutcome: "Full-stack portfolio asset showcasing responsive design and backend synchronization.",
        },
      ],
      nextAction: "Design a relational schema for a multi-tenant platform in PostgreSQL.",
    },
    cloud_computing: {
      title: "Cloud Infrastructure & DevOps Architect",
      overview:
        "Manages scalable multi-region cloud topology, Kubernetes orchestration, Infrastructure-as-Code (Terraform), and automated CI/CD deployment pipelines.",
      required: [
        "Kubernetes & Container Orchestration",
        "Terraform / OpenTofu (IaC)",
        "AWS / GCP Core Services",
        "Networking (VPC, Subnets, DNS, BGP)",
        "CI/CD with GitHub Actions",
      ],
      milestones: [
        {
          milestoneName: "Stage 1: Linux Internals & Networking",
          durationWeeks: 4,
          topics: ["Systemd & cgroups", "TCP/IP handshake", "iptables & namespaces"],
          skillsAcquired: ["Linux systems administration", "Network packet tracing"],
        },
        {
          milestoneName: "Stage 2: Containerization & Kubernetes",
          durationWeeks: 6,
          topics: ["Multi-stage Dockerfiles", "Pods, Deployments, Services", "Ingress controllers"],
          skillsAcquired: ["Cluster orchestration", "Helm charts"],
        },
        {
          milestoneName: "Stage 3: Infrastructure-as-Code (Terraform)",
          durationWeeks: 6,
          topics: ["State management", "Reusable modules", "VPC peering"],
          skillsAcquired: ["Cloud resource provisioning", "Security hardening"],
        },
      ],
      projects: [
        {
          title: "Zero-Downtime Blue-Green Deployment Cluster",
          difficulty: "advanced",
          description:
            "Provision a multi-node Kubernetes cluster using Terraform and configure automated canary releases with Prometheus monitoring.",
          techStack: ["Kubernetes", "Terraform", "Docker", "Prometheus", "GitHub Actions"],
          keyOutcome: "Demonstrates enterprise-grade cloud automation and high-availability operations.",
        },
      ],
      nextAction: "Containerize a microservice application and write a clean Dockerfile with multi-stage builds.",
    },
    data_analytics: {
      title: "Data Analytics & Business Intelligence Engineer",
      overview:
        "Transforms raw enterprise datasets into actionable predictive dashboards, analytical metrics, and statistical intelligence models.",
      required: [
        "Advanced SQL (Window Functions & CTEs)",
        "Python (Pandas & NumPy)",
        "Data Warehousing (Snowflake / BigQuery)",
        "BI Dashboards (Tableau / PowerBI)",
        "Statistical Hypothesis Testing",
      ],
      milestones: [
        {
          milestoneName: "Stage 1: Advanced SQL & Data Modeling",
          durationWeeks: 4,
          topics: ["Window functions (RANK, NTILE)", "Star schema design", "Aggregation rollups"],
          skillsAcquired: ["Complex analytical queries", "Dimensional modeling"],
        },
        {
          milestoneName: "Stage 2: Statistical Analysis with Python",
          durationWeeks: 5,
          topics: ["Pandas transformations", "A/B test hypothesis testing", "Regression modeling"],
          skillsAcquired: ["Data wrangling", "Statistical significance"],
        },
      ],
      projects: [
        {
          title: "E-Commerce User Retention & Churn Prediction Model",
          difficulty: "intermediate",
          description:
            "Analyze clickstream logs to identify churn indicators and build an automated cohort retention dashboard.",
          techStack: ["SQL", "Python", "Pandas", "Scikit-Learn"],
          keyOutcome: "Actionable executive dashboard with verified statistical metrics.",
        },
      ],
      nextAction: "Complete 10 advanced SQL window function challenges on real datasets.",
    },
    data_science: {
      title: "Applied Data Scientist & Predictive Modeler",
      overview:
        "Develops predictive statistical algorithms, feature engineering pipelines, and classification systems to solve high-impact organizational challenges.",
      required: [
        "Statistical Modeling & Probability",
        "Scikit-Learn & XGBoost",
        "Feature Engineering & Dimensionality Reduction",
        "MLOps & Model Tracking (MLflow)",
      ],
      milestones: [
        {
          milestoneName: "Stage 1: Exploratory Data Analysis & Feature Pipelines",
          durationWeeks: 4,
          topics: ["Missing value imputation", "Outlier detection", "PCA decomposition"],
          skillsAcquired: ["Feature engineering", "Data preprocessing"],
        },
        {
          milestoneName: "Stage 2: Supervised & Unsupervised Machine Learning",
          durationWeeks: 6,
          topics: ["Gradient boosted trees", "Random forests", "Clustering (K-Means, DBSCAN)"],
          skillsAcquired: ["Cross-validation", "Hyperparameter tuning"],
        },
      ],
      projects: [
        {
          title: "Credit Risk Default Scoring System",
          difficulty: "intermediate",
          description:
            "Train and tune an XGBoost model with SHAP interpretability values to predict loan default probabilities.",
          techStack: ["Python", "XGBoost", "SHAP", "Scikit-Learn"],
          keyOutcome: "Interpretable ML model with ROC-AUC evaluation and feature attribution analysis.",
        },
      ],
      nextAction: "Formulate a cross-validation strategy for an imbalanced classification problem.",
    },
    cybersecurity: {
      title: "Cybersecurity Analyst & Threat Mitigation Specialist",
      overview:
        "Protects digital enterprise assets through vulnerability assessment, cryptographic protocols, penetration testing, and incident response architecture.",
      required: [
        "Network Security & Protocols",
        "Cryptographic Primitives (RSA, AES, TLS 1.3)",
        "OWASP Top 10 Web Vulnerabilities",
        "Threat Modeling & SIEM Monitoring",
      ],
      milestones: [
        {
          milestoneName: "Stage 1: Network Defense & Cryptography",
          durationWeeks: 4,
          topics: ["Public key infrastructure (PKI)", "Diffie-Hellman exchange", "Packet sniffing"],
          skillsAcquired: ["Wireshark packet analysis", "TLS handshake validation"],
        },
        {
          milestoneName: "Stage 2: Application Security & Ethical Hacking",
          durationWeeks: 6,
          topics: ["SQL injection & XSS mitigation", "Authentication bypasses", "CSRF tokens"],
          skillsAcquired: ["Vulnerability auditing", "Secure coding practices"],
        },
      ],
      projects: [
        {
          title: "Automated API Vulnerability & Port Scanner",
          difficulty: "intermediate",
          description:
            "Construct a Python security scanner that detects open ports, misconfigured TLS certificates, and unauthenticated endpoints.",
          techStack: ["Python", "Nmap scripting", "Socket programming"],
          keyOutcome: "Security audit tool generating automated risk remediation reports.",
        },
      ],
      nextAction: "Audit a sample web application against the OWASP Top 10 security checklist.",
    },
    software_engineering: {
      title: "Senior Software Engineer (Systems & Algorithms)",
      overview:
        "Engineers core algorithmic systems, high-efficiency data structures, concurrent routines, and scalable service backends.",
      required: [
        "Advanced Algorithms & Complexity Analysis",
        "Object-Oriented & Functional Design Patterns",
        "Concurrent Programming (Mutexes, Channels)",
        "System Architecture & Microservices",
      ],
      milestones: [
        {
          milestoneName: "Stage 1: High-Performance Data Structures",
          durationWeeks: 4,
          topics: ["Self-balancing trees", "Tries & Bloom filters", "Disjoint set union"],
          skillsAcquired: ["Algorithmic efficiency", "Memory profiling"],
        },
        {
          milestoneName: "Stage 2: Concurrency & Multithreading",
          durationWeeks: 5,
          topics: ["Race conditions & deadlocks", "Atomic operations", "Producer-consumer patterns"],
          skillsAcquired: ["Thread-safe engineering", "Lock-free structures"],
        },
      ],
      projects: [
        {
          title: "High-Performance In-Memory Key-Value Store",
          difficulty: "advanced",
          description:
            "Build an in-memory key-value database with TTL expiration, append-only persistence (AOF), and concurrent read-write locks.",
          techStack: ["Go or Rust or TypeScript", "Socket programming", "Concurrency primitives"],
          keyOutcome: "Demonstrates systems programming depth, concurrency safety, and low-latency storage.",
        },
      ],
      nextAction: "Implement a thread-safe LRU cache with O(1) get and put operations.",
    },
    ui_ux: {
      title: "Lead Product Designer & Design Systems Engineer",
      overview:
        "Crafts intuitive user experiences, accessibility standards (WCAG 2.1 AA), interaction design, and scalable frontend UI component tokens.",
      required: [
        "User Research & Information Architecture",
        "Figma Component Systems & Auto Layout",
        "WCAG Accessibility Compliance",
        "Prototyping & Micro-Animations",
      ],
      milestones: [
        {
          milestoneName: "Stage 1: User Research & Wireframing",
          durationWeeks: 4,
          topics: ["User journey mapping", "Information architecture", "Low-fidelity wireframing"],
          skillsAcquired: ["Usability testing", "User empathy"],
        },
        {
          milestoneName: "Stage 2: Design Systems & Visual Hierarchy",
          durationWeeks: 5,
          topics: ["Design tokens", "Dark mode contrast ratios", "Typography scales"],
          skillsAcquired: ["Figma component variants", "Interactive prototyping"],
        },
      ],
      projects: [
        {
          title: "Complete Enterprise SaaS Design System",
          difficulty: "intermediate",
          description:
            "Create a full design token system in Figma with 40+ accessible components, dark/light modes, and interactive state variants.",
          techStack: ["Figma", "Design Tokens", "WCAG 2.1 Contrast Standards"],
          keyOutcome: "Professional design system ready for engineering handoff.",
        },
      ],
      nextAction: "Conduct an accessibility contrast audit on a multi-step user onboarding flow.",
    },
  };

  const selectedTrack = tracks[category] || tracks.ai_ml;

  // Calculate skill gaps
  const normalizedCurrent = currentSkills.map((s) => s.toLowerCase());
  const skillGaps = selectedTrack.required.filter(
    (req) => !normalizedCurrent.some((curr) => req.toLowerCase().includes(curr) || curr.includes(req.toLowerCase()))
  );

  return {
    id: `career_rec_${Date.now()}`,
    userId: "user_citadel_01",
    careerCategory: category,
    careerTitle: selectedTrack.title,
    overview: selectedTrack.overview,
    requiredSkills: selectedTrack.required,
    currentSkills,
    skillGaps: skillGaps.length > 0 ? skillGaps : ["Continuous production refinement"],
    milestones: selectedTrack.milestones,
    projects: selectedTrack.projects,
    recommendedNextAction: selectedTrack.nextAction,
    createdAt: new Date().toISOString(),
  };
}
