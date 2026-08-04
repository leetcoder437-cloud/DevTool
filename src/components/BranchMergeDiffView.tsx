import React, { useState } from 'react';
import { 
  GitMerge, 
  GitBranch, 
  AlertTriangle, 
  Check, 
  ArrowRight, 
  Sparkles, 
  FileCode, 
  Layers, 
  CheckCircle2, 
  GitCommit,
  RotateCcw
} from 'lucide-react';
import { AgentState, AgentBranchNode, MergeConflictItem, BranchMergeDiff } from '../types';

interface BranchMergeDiffViewProps {
  agent: AgentState;
  branches: AgentBranchNode[];
  onExecuteMerge: (diff: BranchMergeDiff) => void;
}

export const BranchMergeDiffView: React.FC<BranchMergeDiffViewProps> = ({
  agent,
  branches,
  onExecuteMerge,
}) => {
  const [sourceBranch, setSourceBranch] = useState<string>(branches[1]?.name || 'feature/sla-negotiator-v2');
  const [targetBranch, setTargetBranch] = useState<string>(branches[0]?.name || 'main-prod');

  const [conflicts, setConflicts] = useState<MergeConflictItem[]>([
    {
      id: 'CONF-01',
      type: 'goal_state',
      title: 'Active Goal Discrepancy',
      sourceValue: 'Negotiate SLA penalty clauses with enterprise client',
      targetValue: 'Review vendor agreement draft and propose 12% discount',
      baseValue: 'Draft SLA initial framework',
      resolutionStrategy: 'smart_ai_merge',
      resolvedValue: 'Review agreement draft, propose 12% discount & negotiate SLA penalty clauses',
      isResolved: true,
    },
    {
      id: 'CONF-02',
      type: 'memory_page',
      title: 'Memory Page Block #P-892 Payload Divergence',
      sourceValue: 'Clause 18.2 updated: Maximum liability capped at $2,000,000 USD',
      targetValue: 'Clause 18.2 updated: Maximum liability capped at $1,500,000 USD',
      baseValue: 'Clause 18.2 pending review',
      resolutionStrategy: undefined,
      isResolved: false,
    },
    {
      id: 'CONF-03',
      type: 'context_tokens',
      title: 'Context Allocation Budget Overflow',
      sourceValue: 'Working Context: 84,200 tokens (Hot RAM)',
      targetValue: 'Working Context: 62,100 tokens (Hot RAM)',
      baseValue: 'Working Context: 45,000 tokens',
      resolutionStrategy: 'ours',
      resolvedValue: 'Working Context: 84,200 tokens (Auto-paging cold overflow)',
      isResolved: true,
    },
  ]);

  const [isMerging, setIsMerging] = useState(false);
  const [mergeSuccessMsg, setMergeSuccessMsg] = useState<string | null>(null);

  const resolveConflict = (id: string, strategy: 'ours' | 'theirs' | 'smart_ai_merge') => {
    setConflicts((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        let val = c.sourceValue;
        if (strategy === 'theirs') val = c.targetValue;
        if (strategy === 'smart_ai_merge') val = `[AI Merged] ${c.sourceValue} + ${c.targetValue}`;
        return {
          ...c,
          resolutionStrategy: strategy,
          resolvedValue: val,
          isResolved: true,
        };
      })
    );
  };

  const handleMergeSubmit = () => {
    setIsMerging(true);
    setTimeout(() => {
      const diff: BranchMergeDiff = {
        sourceBranch,
        targetBranch,
        commonAncestorSnapshotId: 'chk-anc-7721',
        aheadCommits: 3,
        behindCommits: 1,
        hasConflicts: conflicts.some((c) => !c.isResolved),
        conflicts,
        pagesAdded: 2,
        pagesModified: 3,
        pagesRemoved: 0,
        contextDeltaTokens: 12400,
      };

      setIsMerging(false);
      setMergeSuccessMsg(`✅ Branch "${sourceBranch}" successfully merged into "${targetBranch}" with 0 conflicts remaining!`);
      onExecuteMerge(diff);
    }, 1000);
  };

  const allResolved = conflicts.every((c) => c.isResolved);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-black/10 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20">
              <GitMerge className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#0066FF] uppercase">
              ШАГ 3: Автоматический слиятельный diff при дельта-конфликтах
            </span>
          </div>
          <h2 className="text-2xl font-light text-black tracking-tight">
            Branch Auto-Merge & Memory Delta Diff Inspector
          </h2>
          <p className="text-xs text-black/50">
            Performs 3-way memory delta comparison between agent execution branches and auto-resolves state conflicts.
          </p>
        </div>

        <button
          onClick={handleMergeSubmit}
          disabled={!allResolved || isMerging}
          className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold uppercase tracking-wider rounded-md border border-[#0066FF] flex items-center gap-2 transition active:scale-95 disabled:opacity-50 shadow-2xs"
        >
          <GitMerge className={`w-4 h-4 ${isMerging ? 'animate-spin' : ''}`} />
          {isMerging ? 'Merging Branches...' : 'Execute Branch Merge'}
        </button>
      </div>

      {mergeSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-900 text-xs font-mono flex items-center justify-between shadow-2xs animate-fadeIn">
          <span>{mergeSuccessMsg}</span>
          <button onClick={() => setMergeSuccessMsg(null)} className="text-black/40 hover:text-black">✕</button>
        </div>
      )}

      {/* Branch Selector Row */}
      <div className="bg-white border border-black/10 rounded-lg p-6 space-y-4 shadow-2xs">
        <h3 className="text-xs font-bold text-black uppercase tracking-wider">
          Select Source & Target Branches for 3-Way Diff
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Source Branch */}
          <div className="md:col-span-5 bg-[#F8F9FA] border border-black/10 p-4 rounded-md space-y-2">
            <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-[#0066FF]" /> Source Branch (Merge From)
            </div>
            <select
              value={sourceBranch}
              onChange={(e) => setSourceBranch(e.target.value)}
              className="w-full bg-white border border-black/10 rounded px-3 py-2 text-xs font-mono text-black font-semibold focus:outline-none focus:border-[#0066FF]"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.name}>{b.name} (ID: {b.id})</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1 text-center flex justify-center">
            <div className="p-2 rounded-full bg-gray-100 border border-black/10">
              <ArrowRight className="w-4 h-4 text-black/40" />
            </div>
          </div>

          {/* Target Branch */}
          <div className="md:col-span-5 bg-[#F8F9FA] border border-black/10 p-4 rounded-md space-y-2">
            <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-emerald-600" /> Target Branch (Merge Into)
            </div>
            <select
              value={targetBranch}
              onChange={(e) => setTargetBranch(e.target.value)}
              className="w-full bg-white border border-black/10 rounded px-3 py-2 text-xs font-mono text-black font-semibold focus:outline-none focus:border-[#0066FF]"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.name}>{b.name} (ID: {b.id})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Diff Overview Stats */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-[#F8F9FA] rounded border border-black/5">
            <span className="text-black/40 text-[10px] block uppercase">Ahead Commits</span>
            <strong className="text-black text-sm">3 commits ahead</strong>
          </div>
          <div className="p-3 bg-[#F8F9FA] rounded border border-black/5">
            <span className="text-black/40 text-[10px] block uppercase">Pages Delta</span>
            <strong className="text-[#0066FF] text-sm">+2 added, 3 modified</strong>
          </div>
          <div className="p-3 bg-[#F8F9FA] rounded border border-black/5">
            <span className="text-black/40 text-[10px] block uppercase">Context Delta</span>
            <strong className="text-purple-700 text-sm">+12,400 tokens</strong>
          </div>
          <div className="p-3 bg-[#F8F9FA] rounded border border-black/5">
            <span className="text-black/40 text-[10px] block uppercase">Conflict Status</span>
            <strong className={allResolved ? "text-emerald-700 text-sm" : "text-amber-700 text-sm"}>
              {allResolved ? "Ready to Merge" : `${conflicts.filter(c => !c.isResolved).length} Conflicts`}
            </strong>
          </div>
        </div>
      </div>

      {/* Delta Conflicts List */}
      <div className="bg-white border border-black/10 rounded-lg p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <h3 className="text-base font-semibold text-black flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Detected Delta Conflicts ({conflicts.length})
          </h3>
          <span className="text-xs font-mono text-black/40">
            Automated 3-Way Context Reconciliation
          </span>
        </div>

        <div className="space-y-4">
          {conflicts.map((conf) => (
            <div
              key={conf.id}
              className={`p-5 rounded-md border space-y-3 transition ${
                conf.isResolved
                  ? 'bg-emerald-50/30 border-emerald-200'
                  : 'bg-amber-50/40 border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-black">[{conf.id}]</span>
                  <span className="font-semibold text-sm text-black">{conf.title}</span>
                </div>
                {conf.isResolved ? (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-mono font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Resolved via {conf.resolutionStrategy}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-mono font-bold uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-600" /> Resolution Needed
                  </span>
                )}
              </div>

              {/* 3-Way Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                {/* Source Branch Value */}
                <div className="p-3 bg-white border border-black/10 rounded space-y-1">
                  <div className="text-[10px] font-bold text-[#0066FF] uppercase tracking-wider flex items-center justify-between">
                    <span>Source Branch ({sourceBranch})</span>
                    <button
                      onClick={() => resolveConflict(conf.id, 'ours')}
                      className="px-2 py-0.5 bg-blue-50 text-[#0066FF] hover:bg-blue-100 rounded text-[10px]"
                    >
                      Use Source
                    </button>
                  </div>
                  <p className="text-black/80 text-[11px] leading-relaxed">
                    {conf.sourceValue}
                  </p>
                </div>

                {/* Target Branch Value */}
                <div className="p-3 bg-white border border-black/10 rounded space-y-1">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Target Branch ({targetBranch})</span>
                    <button
                      onClick={() => resolveConflict(conf.id, 'theirs')}
                      className="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px]"
                    >
                      Use Target
                    </button>
                  </div>
                  <p className="text-black/80 text-[11px] leading-relaxed">
                    {conf.targetValue}
                  </p>
                </div>
              </div>

              {/* Smart AI Auto-Merge Strategy Button */}
              <div className="pt-2 flex items-center justify-between border-t border-black/5">
                <div className="text-[11px] text-black/50 font-mono">
                  Base Context: <span className="text-black/70">{conf.baseValue || 'Initial Snapshot'}</span>
                </div>

                <button
                  onClick={() => resolveConflict(conf.id, 'smart_ai_merge')}
                  className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                  Auto-Merge with Smart Context Synth
                </button>
              </div>

              {conf.isResolved && conf.resolvedValue && (
                <div className="p-3 bg-emerald-100/50 border border-emerald-300 rounded text-xs font-mono space-y-1">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Resolved Merged Value:
                  </div>
                  <p className="text-black font-semibold text-[11px]">
                    {conf.resolvedValue}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
