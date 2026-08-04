import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Code2, 
  Check, 
  Copy, 
  Layers, 
  ShieldCheck, 
  FileJson,
  Cpu
} from 'lucide-react';

export const RFCSpecificationView: React.FC = () => {
  const [activeRfc, setActiveRfc] = useState<'rfc001' | 'rfc002' | 'rfc003' | 'rfc004'>('rfc001');
  const [copied, setCopied] = useState(false);

  const rfcs = {
    rfc001: {
      title: 'RFC-001: Agent State Format (ASF-1.0)',
      category: 'Data Format Standard',
      status: 'PROPOSED STANDARD',
      abstract: 'Defines the canonical JSON schema for long-running AI Agent states, decoupling identity, goal graph, working context, long-term memory, and tool state.',
      specText: `[RFC-001: Agent State Format Schema v1.0.0]

AgentState
├── Identity (agent_id, name, framework, status)
├── Goal Graph (activeGoal, rootGoalId, subGoals[])
├── Working Memory (hotRamPages[], activeContextTokens, maxContextWindow)
├── Long-Term Memory (warmPages[], coldArchivePages[])
├── Tool State (registeredTools[], lastCallResult)
├── Execution Graph (currentNodeId, activeBranch, stepsCompleted)
├── Snapshots (checkpointList[])
└── Event Log (appendOnlyAuditTrail[])`
    },
    rfc002: {
      title: 'RFC-002: Memory Paging & Priority Scoring Protocol',
      category: 'Algorithmic Protocol',
      status: 'PROPOSED STANDARD',
      abstract: 'Defines the mathematical eviction and classification formula for moving agent memory items between Hot RAM, Warm Cache, and Cold Storage.',
      specText: `[RFC-002: Memory Paging Priority Score Protocol]

Formula:
Priority Score = 0.35 × GoalRelevance + 0.30 × AccessFrequency + 0.20 × Recency + 0.15 × DependencyWeight

Tier Classification Rules:
- Score >= 0.70 ➔ HOT RAM (LLM Context Window)
- 0.35 <= Score < 0.70 ➔ WARM CACHE (Embedded RocksDB / KV Store)
- Score < 0.35 ➔ COLD ARCHIVE (Compressed S3 Blob Store)`
    },
    rfc003: {
      title: 'RFC-003: Checkpoint Interchange & Storage Adapter Interface',
      category: 'Storage API Standard',
      status: 'PROPOSED STANDARD',
      abstract: 'Specifies the pluggable storage interface enabling seamless switching between JSON files, SQLite, PostgreSQL, RocksDB, Redis, and S3 object stores.',
      specText: `[RFC-003: Storage Adapter Interface Specification]

interface BaseStorageAdapter {
  save(key: string, value: AgentState): Promise<string>; // Returns SHA-256 checksum
  load(key: string): Promise<AgentState | null>;
  listSnapshots(agentId: string): Promise<SnapshotMetadata[]>;
  deleteSnapshot(snapshotId: string): Promise<boolean>;
}`
    },
    rfc004: {
      title: 'RFC-004: Crash Recovery & Event Sourcing Lifecycle Protocol',
      category: 'Runtime Protocol',
      status: 'PROPOSED STANDARD',
      abstract: 'Defines the finite state machine lifecycle and append-only event sourcing log required for guaranteed process crash recovery.',
      specText: `[RFC-004: State Machine Lifecycle]

State Transitions:
RUNNING ➔ CHECKPOINT ➔ CRASH (kill -9) ➔ COLD BOOT ➔ RECOVERY ➔ RESUME ➔ BRANCH ➔ MERGE ➔ ROLLBACK

Event Sourcing Requirement:
All state changes MUST emit an immutable, timestamped, checksummed event into the eventLog array before returning execution control to the agent.`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rfcs[activeRfc].specText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-black/10 p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                Infrastructure Standard Specifications
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Open Standard Protocol
              </span>
            </div>
            <h2 className="text-xl font-bold text-black mt-2">
              CheckpointOS RFC Standard Specifications
            </h2>
            <p className="text-sm text-black/60 mt-1 max-w-3xl">
              Like Kubernetes, gRPC, and OpenTelemetry, CheckpointOS publishes formal Request for Comments (RFC) specifications to establish the industry standard for AI Agent memory operating systems.
            </p>
          </div>
        </div>
      </div>

      {/* RFC Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'rfc001', label: 'RFC-001', name: 'Agent State Format' },
          { id: 'rfc002', label: 'RFC-002', name: 'Memory Paging Score' },
          { id: 'rfc003', label: 'RFC-003', name: 'Storage Adapters' },
          { id: 'rfc004', label: 'RFC-004', name: 'Crash & Event Sourcing' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveRfc(item.id as any)}
            className={`p-3.5 rounded-xl border text-left transition ${
              activeRfc === item.id 
                ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-sm' 
                : 'bg-white border-black/10 hover:bg-[#F8F9FA] text-black'
            }`}
          >
            <div className="text-xs font-mono font-bold uppercase">{item.label}</div>
            <div className="text-xs font-bold mt-1 line-clamp-1">{item.name}</div>
          </button>
        ))}
      </div>

      {/* Active RFC Content Box */}
      <div className="bg-white rounded-xl border border-black/10 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/10">
          <div>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase font-mono">
              {rfcs[activeRfc].status}
            </span>
            <h3 className="text-lg font-bold text-black mt-1">{rfcs[activeRfc].title}</h3>
          </div>

          <button
            onClick={handleCopy}
            className="text-xs text-black/60 hover:text-black flex items-center gap-1 font-mono bg-[#F8F9FA] px-3 py-1.5 rounded border border-black/10 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied Specification' : 'Copy Spec Text'}
          </button>
        </div>

        <p className="text-xs text-black/70 leading-relaxed font-medium">
          {rfcs[activeRfc].abstract}
        </p>

        <pre className="bg-[#1E1E1E] text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-black/10">
          {rfcs[activeRfc].specText}
        </pre>
      </div>
    </div>
  );
};
