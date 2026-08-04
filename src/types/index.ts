export type MemoryTier = 'hot' | 'warm' | 'cold' | 'archive';

export interface MemoryPage {
  id: string;
  agentId: string;
  tier: MemoryTier;
  tokenCount: number;
  sizeKb: number;
  summary: string;
  payload: string;
  timestamp: number;
  lastAccessedAt: number;
  accessCount: number;
  status: 'active' | 'paged' | 'compressed' | 'evicted';
  compressionRatio: number;
}

export type AgentStatus = 'running' | 'idle' | 'paused' | 'crashed' | 'recovering' | 'completed';

export interface SubGoal {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'high' | 'medium' | 'low';
}

export interface AgentState {
  id: string;
  name: string;
  role: string;
  systemPrompt: string;
  status: AgentStatus;
  activeGoal: string;
  subGoals: SubGoal[];
  currentContextTokens: number;
  maxContextTokens: number;
  totalMemoryBytes: number;
  hotMemoryBytes: number;
  warmMemoryBytes: number;
  coldMemoryBytes: number;
  archiveMemoryBytes: number;
  compressionRatio: number;
  recoveryTimeMs: number;
  snapshotCount: number;
  activeBranch: string;
  executionSteps: number;
  uptimeSeconds: number;
  createdAt: number;
  updatedAt: number;
}

export type CheckpointTrigger = 
  | 'auto_interval' 
  | 'context_overflow' 
  | 'user_manual' 
  | 'pre_crash' 
  | 'branch_fork'
  | 'goal_achieved';

export interface CheckpointSnapshot {
  id: string;
  agentId: string;
  label: string;
  timestamp: number;
  triggerReason: CheckpointTrigger;
  workingContextTokens: number;
  goalState: string;
  subGoalsState: SubGoal[];
  memoryPagesCount: number;
  compressedSizeKb: number;
  checksum: string;
  parentSnapshotId?: string;
  branchName: string;
  rawStateSnapshot?: string;
}

export type EventSeverity = 'info' | 'warning' | 'error' | 'success';

export interface TimelineEvent {
  id: string;
  agentId: string;
  timestamp: number;
  type: 
    | 'checkpoint' 
    | 'crash' 
    | 'recovery' 
    | 'eviction' 
    | 'hydration' 
    | 'branch' 
    | 'merge' 
    | 'goal_update' 
    | 'ai_step';
  title: string;
  details: string;
  severity: EventSeverity;
  metadata?: Record<string, any>;
}

export interface AgentBranchNode {
  id: string;
  name: string;
  parentBranchId?: string;
  createdAt: number;
  status: 'active' | 'merged' | 'archived';
  snapshotId: string;
  commitHash: string;
}

export type SDKLanguage = 'python' | 'typescript' | 'rust' | 'go';

export interface AgentStepPayload {
  prompt: string;
  agentId: string;
  simulateMemoryLoad?: boolean;
}

export interface RuntimeMetrics {
  totalAgents: number;
  activeSnapshots: number;
  totalPagedMemoryBytes: number;
  avgRecoveryLatencyMs: number;
  overallCompressionRatio: number;
  uptimeSeconds: number;
}

// --- Step 2: External DB Dump & Persistence ---
export type DatabaseEngine = 'postgresql' | 'rocksdb' | 'sqlite_cold' | 'redis_kv';

export interface DatabaseDumpConfig {
  engine: DatabaseEngine;
  host: string;
  port: number;
  databaseName: string;
  autoDumpIntervalSec: number;
  useSsl: boolean;
  compression: 'zstd' | 'gzip' | 'none';
  status: 'connected' | 'syncing' | 'disconnected' | 'error';
  lastSyncedAt?: number;
}

export interface MemoryDumpRecord {
  id: string;
  agentId: string;
  timestamp: number;
  dumpType: 'full_snapshot' | 'incremental_delta' | 'session_backup';
  snapshotId: string;
  checksumSha256: string;
  compressedSizeKb: number;
  uncompressedSizeKb: number;
  recordsCount: number;
  engineUsed: DatabaseEngine;
  status: 'persisted' | 'restoring' | 'corrupted';
}

// --- Step 3: Branch Merging & Auto-Diff Engine ---
export interface MergeConflictItem {
  id: string;
  type: 'goal_state' | 'memory_page' | 'context_tokens' | 'execution_step';
  title: string;
  sourceValue: string;
  targetValue: string;
  baseValue?: string;
  resolutionStrategy?: 'ours' | 'theirs' | 'smart_ai_merge';
  resolvedValue?: string;
  isResolved: boolean;
}

export interface BranchMergeDiff {
  sourceBranch: string;
  targetBranch: string;
  commonAncestorSnapshotId: string;
  aheadCommits: number;
  behindCommits: number;
  hasConflicts: boolean;
  conflicts: MergeConflictItem[];
  pagesAdded: number;
  pagesModified: number;
  pagesRemoved: number;
  contextDeltaTokens: number;
}

// --- Step 4: Microservices Cluster & Distributed Orchestration ---
export interface MicroserviceNode {
  id: string;
  nodeName: string;
  region: string;
  role: 'orchestrator' | 'worker' | 'pager_sidecar' | 'db_replica';
  status: 'online' | 'degraded' | 'syncing' | 'offline';
  cpuUsagePct: number;
  memoryUsageMb: number;
  maxMemoryMb: number;
  activeAgentsCount: number;
  assignedPageIds: string[];
  grpcLatencyMs: number;
  ipAddress: string;
}

export interface ClusterMessageBus {
  id: string;
  timestamp: number;
  fromNodeId: string;
  toNodeId: string;
  action: 'page_migration' | 'state_heartbeat' | 'checkpoint_broadcast' | 'task_delegation';
  payloadSummary: string;
  latencyMs: number;
}

