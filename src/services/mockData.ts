import {
  AgentState,
  CheckpointSnapshot,
  MemoryPage,
  TimelineEvent,
  AgentBranchNode
} from "../types";

const now = Date.now();
const TEN_MINS = 10 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

export const INITIAL_AGENTS: AgentState[] = [
  {
    id: "agent_enterprise_sales",
    name: "Enterprise Sales Deal Closer",
    role: "Autonomous B2B Pipeline Specialist",
    systemPrompt: "You are an AI Sales Agent driving multi-month Tesla contract negotiations, tracking stakeholders, legal redlines, and technical requirements across email, calls, and documents.",
    status: "running",
    activeGoal: "Close $2.4M Tesla Fleet Contract & Finalize Security Compliance Redlines",
    subGoals: [
      { id: "g1", description: "Incorporate ISO 27001 Security Addendum into Master Services Agreement", status: "completed", priority: "high" },
      { id: "g2", description: "Schedule CTO sync with VP of Infrastructure for benchmark validation", status: "in_progress", priority: "high" },
      { id: "g3", description: "Resolve SLA penalty terms with legal procurement team", status: "pending", priority: "medium" },
      { id: "g4", description: "Send revised pricing schedule for 50,000 endpoint expansion", status: "pending", priority: "low" }
    ],
    currentContextTokens: 94200,
    maxContextTokens: 128000,
    totalMemoryBytes: 6200000000, // 6.2 GB
    hotMemoryBytes: 385800000,    // ~385 MB Hot RAM
    warmMemoryBytes: 1200000000,   // ~1.2 GB Warm KV
    coldMemoryBytes: 3800000000,   // ~3.8 GB Cold Disk
    archiveMemoryBytes: 814200000, // ~814 MB S3 Zstd
    compressionRatio: 0.82,       // 82% overall compression
    recoveryTimeMs: 1120,          // 1.12s
    snapshotCount: 327,
    activeBranch: "main",
    executionSteps: 1842,
    uptimeSeconds: 432000,         // 5 days continuous
    createdAt: now - (5 * 24 * HOUR),
    updatedAt: now,
  },
  {
    id: "agent_code_refactor",
    name: "Monolith Migration Bot",
    role: "Legacy System Modernization Specialist",
    systemPrompt: "Refactor legacy Java Spring monolith into modular Rust microservices with backwards compatibility tests.",
    status: "idle",
    activeGoal: "Migrate Payment Gateway Service from Java to Rust Tokio microservice",
    subGoals: [
      { id: "c1", description: "Parse legacy Spring Security annotations into Rust JWT middleware", status: "completed", priority: "high" },
      { id: "c2", description: "Write integration tests matching 100% legacy API contract", status: "in_progress", priority: "high" }
    ],
    currentContextTokens: 42000,
    maxContextTokens: 128000,
    totalMemoryBytes: 3100000000,
    hotMemoryBytes: 168000000,
    warmMemoryBytes: 800000000,
    coldMemoryBytes: 1800000000,
    archiveMemoryBytes: 332000000,
    compressionRatio: 0.79,
    recoveryTimeMs: 890,
    snapshotCount: 142,
    activeBranch: "rust-refactor-v2",
    executionSteps: 890,
    uptimeSeconds: 172800,
    createdAt: now - (2 * 24 * HOUR),
    updatedAt: now - (10 * 60 * 1000),
  }
];

export const INITIAL_SNAPSHOTS: CheckpointSnapshot[] = [
  {
    id: "chk_snp_9921",
    agentId: "agent_enterprise_sales",
    label: "Post-Legal Redline Sync Snapshot",
    timestamp: now - (30 * 60 * 1000),
    triggerReason: "auto_interval",
    workingContextTokens: 91400,
    goalState: "Close $2.4M Tesla Fleet Contract & Finalize Security Compliance Redlines",
    subGoalsState: INITIAL_AGENTS[0].subGoals,
    memoryPagesCount: 42,
    compressedSizeKb: 1840,
    checksum: "8a4f91b2c3d4e5f6",
    branchName: "main",
  },
  {
    id: "chk_snp_9920",
    agentId: "agent_enterprise_sales",
    label: "Context Overflow Paging Checkpoint",
    timestamp: now - (2 * HOUR),
    triggerReason: "context_overflow",
    workingContextTokens: 122000,
    goalState: "Resolve Legal Redlines with Tesla Procurement",
    subGoalsState: INITIAL_AGENTS[0].subGoals,
    memoryPagesCount: 38,
    compressedSizeKb: 1720,
    checksum: "3f9e12a4b5c6d7e8",
    branchName: "main",
  },
  {
    id: "chk_snp_9919",
    agentId: "agent_enterprise_sales",
    label: "Branch Point: Custom Enterprise SLA Negotiation",
    timestamp: now - (6 * HOUR),
    triggerReason: "branch_fork",
    workingContextTokens: 78000,
    goalState: "Negotiate Custom SLA Terms for 99.999% Availability",
    subGoalsState: INITIAL_AGENTS[0].subGoals,
    memoryPagesCount: 31,
    compressedSizeKb: 1410,
    checksum: "1d2c3b4a5e6f7a8b",
    branchName: "sla-negotiation-v1",
  }
];

export const INITIAL_PAGES: MemoryPage[] = [
  {
    id: "mem_pg_101",
    agentId: "agent_enterprise_sales",
    tier: "hot",
    tokenCount: 14200,
    sizeKb: 58,
    summary: "Active MSA Legal Redline Clauses #14-22 (Data Sovereignty & Liability Cap)",
    payload: "Detailed breakdown of Tesla legal counsel comments on clause 18.2 regarding cross-border data transfer between EU and US data centers.",
    timestamp: now - (12 * 60 * 1000),
    lastAccessedAt: now - (2 * 60 * 1000),
    accessCount: 14,
    status: "active",
    compressionRatio: 1.0,
  },
  {
    id: "mem_pg_102",
    agentId: "agent_enterprise_sales",
    tier: "hot",
    tokenCount: 28000,
    sizeKb: 112,
    summary: "CTO Meeting Transcript & Infrastructure Benchmark Requirements",
    payload: "Transcript from 45min call with Tesla Infrastructure VP discussing GPU cluster requirements, target latency (<15ms), and failover topology.",
    timestamp: now - (45 * 60 * 1000),
    lastAccessedAt: now - (5 * 60 * 1000),
    accessCount: 9,
    status: "active",
    compressionRatio: 1.0,
  },
  {
    id: "mem_pg_103",
    agentId: "agent_enterprise_sales",
    tier: "warm",
    tokenCount: 32000,
    sizeKb: 54, // compressed
    summary: "Historical Email Thread with Tesla Procurement Director (Day 1 - Day 14)",
    payload: "Complete email exchange regarding initial proposal pricing, volume discount tiers, and onboarding timeline.",
    timestamp: now - (3 * 24 * HOUR),
    lastAccessedAt: now - (1 * HOUR),
    accessCount: 28,
    status: "paged",
    compressionRatio: 0.42,
  },
  {
    id: "mem_pg_104",
    agentId: "agent_enterprise_sales",
    tier: "cold",
    tokenCount: 45000,
    sizeKb: 48, // compressed
    summary: "Competitor RFP Analysis & Pricing Benchmark Matrix (Archived Week 1)",
    payload: "Comparative breakdown of competitor proposals submitted to Tesla IT procurement team.",
    timestamp: now - (4 * 24 * HOUR),
    lastAccessedAt: now - (12 * HOUR),
    accessCount: 5,
    status: "compressed",
    compressionRatio: 0.22,
  }
];

export const INITIAL_EVENTS: TimelineEvent[] = [
  {
    id: "evt_init_1",
    agentId: "agent_enterprise_sales",
    timestamp: now - (10 * 60 * 1000),
    type: "checkpoint",
    title: "Automatic Checkpoint #327 Saved",
    details: "Snapshot saved successfully. Checksum: 0x8a4f91b2 | Context: 94.2k tokens | Payload: 1.84 MB compressed.",
    severity: "success",
  },
  {
    id: "evt_init_2",
    agentId: "agent_enterprise_sales",
    timestamp: now - (35 * 60 * 1000),
    type: "eviction",
    title: "Memory Pager: Hot -> Warm Eviction Executed",
    details: "Evicted 32,000 tokens of historical email threads to compressed Warm Vector store to maintain 128k context safety threshold.",
    severity: "info",
  },
  {
    id: "evt_init_3",
    agentId: "agent_enterprise_sales",
    timestamp: now - (2 * HOUR),
    type: "recovery",
    title: "Automatic Recovery Engine Triggered",
    details: "Process recovered after Cloud Run container migration in 1,120ms. Restored goals and active state from Checkpoint #326.",
    severity: "warning",
  },
  {
    id: "evt_init_4",
    agentId: "agent_enterprise_sales",
    timestamp: now - (6 * HOUR),
    type: "branch",
    title: "Created Execution Branch 'sla-negotiation-v1'",
    details: "Forked execution tree to test aggressive SLA penalty clause counter-offer.",
    severity: "info",
  }
];

export const INITIAL_BRANCHES: AgentBranchNode[] = [
  {
    id: "br_main",
    name: "main",
    createdAt: now - (5 * 24 * HOUR),
    status: "active",
    snapshotId: "chk_snp_9921",
    commitHash: "8a4f91b2",
  },
  {
    id: "br_sla",
    name: "sla-negotiation-v1",
    parentBranchId: "br_main",
    createdAt: now - (6 * HOUR),
    status: "active",
    snapshotId: "chk_snp_9919",
    commitHash: "1d2c3b4a",
  }
];
