import React, { useState } from 'react';
import { 
  Check, 
  X, 
  HelpCircle, 
  ShieldCheck, 
  Zap, 
  GitBranch, 
  Layers, 
  Cpu, 
  Database, 
  Scale, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CompetitiveComparisonView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'frameworks' | 'paging' | 'recovery'>('all');

  const comparisonRows = [
    {
      feature: 'Multi-Framework Support',
      desc: 'One persistence engine for LangGraph, OpenAI Agents, CrewAI, AutoGen & Mastra',
      checkpointos: true,
      langgraph: 'LangGraph only',
      autogen: 'AutoGen only',
      crewai: 'CrewAI only',
      category: 'frameworks'
    },
    {
      feature: 'Algorithmic Memory Paging (RFC-002)',
      desc: 'Priority scoring (0.35Relevance + 0.30Access + 0.20Recency + 0.15Dependency) into Hot/Warm/Cold tiers',
      checkpointos: true,
      langgraph: false,
      autogen: false,
      crewai: false,
      category: 'paging'
    },
    {
      feature: 'POSIX Process Crash Recovery (`kill -9`)',
      desc: 'Automatic cold-boot state restoration from disk/database without app code modification',
      checkpointos: true,
      langgraph: 'Manual setup required',
      autogen: false,
      crewai: false,
      category: 'recovery'
    },
    {
      feature: 'Git-like Speculative Branching & Merging',
      desc: 'runtime.branch() and runtime.merge() with 3-way delta conflict resolution',
      checkpointos: true,
      langgraph: 'Basic time-travel only',
      autogen: false,
      crewai: false,
      category: 'frameworks'
    },
    {
      feature: 'Formal Agent State Format Standard (RFC-001)',
      desc: 'Standardized schema: Identity, Goal Graph, Working Context, Long-term Memory, Tool State, Event Log',
      checkpointos: true,
      langgraph: 'Unstructured dict',
      autogen: 'Unstructured dict',
      crewai: 'Unstructured dict',
      category: 'frameworks'
    },
    {
      feature: 'Pluggable Storage Adapters',
      desc: 'Swap JSON, SQLite, PostgreSQL, RocksDB, Redis, and S3 seamlessly',
      checkpointos: true,
      langgraph: 'PostgreSQL/Sqlite adapters only',
      autogen: 'DB backends only',
      crewai: 'Mem0 / SQLite only',
      category: 'recovery'
    },
    {
      feature: 'Sub-12ms Checkpoint Latency (P99)',
      desc: 'Zero-copy snapshot encoding verified under 100k step stress tests',
      checkpointos: true,
      langgraph: 'Varies by DB driver',
      autogen: 'Not benchmarked',
      crewai: 'Not benchmarked',
      category: 'recovery'
    },
    {
      feature: 'Append-Only Event Sourcing Trail',
      desc: 'Immutable checksummed audit log of every state transition, tool call, and recovery event',
      checkpointos: true,
      langgraph: 'Partial checkpointer state',
      autogen: false,
      crewai: false,
      category: 'recovery'
    }
  ];

  const filteredRows = comparisonRows.filter(row => {
    if (selectedCategory === 'all') return true;
    return row.category === selectedCategory;
  });

  const renderStatus = (value: boolean | string) => {
    if (value === true) {
      return (
        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
          <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
          Native Support
        </span>
      );
    }
    if (value === false) {
      return (
        <span className="inline-flex items-center gap-1 font-semibold text-black/40 bg-gray-100 px-2 py-0.5 rounded text-xs">
          <X className="w-3.5 h-3.5 text-black/30" />
          No Support
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
        {value}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-black/10 p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" />
                Infrastructure Comparison Matrix
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                Why CheckpointOS vs LangGraph Checkpoints?
              </span>
            </div>
            <h2 className="text-xl font-bold text-black mt-2">
              CheckpointOS vs. Existing Framework Checkpointers
            </h2>
            <p className="text-sm text-black/60 mt-1 max-w-3xl">
              LangGraph, CrewAI, and AutoGen provide basic framework-locked state dictionaries. <strong>CheckpointOS is a framework-agnostic Memory Operating System</strong> that brings algorithmic memory paging, process crash recovery, pluggable storage adapters, and speculative branching to any AI agent.
            </p>
          </div>

          <div className="bg-[#1E1E1E] text-emerald-400 p-3 rounded-lg text-xs font-mono">
            <div className="text-white/40 text-[10px] uppercase font-sans">The Core Killer Feature</div>
            <code className="font-bold text-white block mt-1">
              3-Line Persistence + Memory Paging + SIGKILL Crash Recovery
            </code>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-black/10 pb-2">
        {[
          { id: 'all', label: 'All Feature Criteria' },
          { id: 'frameworks', label: 'Framework Interoperability' },
          { id: 'paging', label: 'Algorithmic Memory Paging' },
          { id: 'recovery', label: 'Crash Recovery & Storage' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedCategory === tab.id
                ? 'bg-[#0066FF] text-white shadow-2xs'
                : 'text-black/60 hover:text-black hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-xl border border-black/10 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-black/10 text-black/70 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4 w-1/3">Capability / Feature Specification</th>
                <th className="p-4 w-1/5 bg-[#0066FF]/5 text-[#0066FF] font-black border-x border-[#0066FF]/20 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
                  CheckpointOS
                </th>
                <th className="p-4 w-1/6">LangGraph Checkpointer</th>
                <th className="p-4 w-1/6">AutoGen State</th>
                <th className="p-4 w-1/6">CrewAI Store</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F8F9FA] transition">
                  <td className="p-4">
                    <div className="font-bold text-black text-xs">{row.feature}</div>
                    <div className="text-[11px] text-black/50 mt-0.5">{row.desc}</div>
                  </td>

                  <td className="p-4 bg-[#0066FF]/5 border-x border-[#0066FF]/20 font-bold">
                    {renderStatus(row.checkpointos)}
                  </td>

                  <td className="p-4">
                    {renderStatus(row.langgraph)}
                  </td>

                  <td className="p-4">
                    {renderStatus(row.autogen)}
                  </td>

                  <td className="p-4">
                    {renderStatus(row.crewai)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Positioning Summary Callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-black/10 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[#0066FF] font-bold text-xs uppercase tracking-wider">
            <Cpu className="w-4 h-4" />
            1. Framework Agnostic
          </div>
          <p className="text-xs text-black/60 leading-relaxed">
            Don't lock your agents into a single framework. CheckpointOS provides a unified memory layer across LangGraph, CrewAI, AutoGen, Mastra, and custom LLM scripts.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-black/10 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            2. Mathematical Paging
          </div>
          <p className="text-xs text-black/60 leading-relaxed">
            Avoid prompt context overflows. The RFC-002 Priority Score formula mathematically manages memory eviction between Hot RAM, Warm Cache, and Cold Storage.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-black/10 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
            <Database className="w-4 h-4" />
            3. Zero-Loss Recovery
          </div>
          <p className="text-xs text-black/60 leading-relaxed">
            Survive unexpected container kills (<code className="font-mono bg-black/5 px-1 py-0.5 rounded text-[10px]">kill -9</code>) with cold-boot recovery from local files, SQLite, PostgreSQL, or RocksDB.
          </p>
        </div>
      </div>
    </div>
  );
};
