import React from 'react';
import { 
  Database, 
  Cpu, 
  Zap, 
  Clock, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  HardDrive,
  FileBox,
  Archive,
  Target
} from 'lucide-react';
import { AgentState, MemoryPage } from '../types';

interface MetricsOverviewProps {
  agent: AgentState;
  pages: MemoryPage[];
  snapshotCount: number;
  onTriggerPaging: () => void;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  agent,
  pages,
  snapshotCount,
  onTriggerPaging,
}) => {
  // Format byte size
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const tokenPercentage = Math.min(
    100,
    Math.round((agent.currentContextTokens / agent.maxContextTokens) * 100)
  );

  const totalBytes = agent.totalMemoryBytes;
  const hotPct = Math.round((agent.hotMemoryBytes / totalBytes) * 100) || 5;
  const warmPct = Math.round((agent.warmMemoryBytes / totalBytes) * 100) || 20;
  const coldPct = Math.round((agent.coldMemoryBytes / totalBytes) * 100) || 60;
  const archivePct = Math.round((agent.archiveMemoryBytes / totalBytes) * 100) || 15;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Active Long-Running Goal */}
      <div className="bg-white border border-black/10 rounded-lg p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20">
                <Target className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#0066FF] uppercase">
                Goal Preservation Engine
              </span>
            </div>
            <h2 className="text-2xl font-light tracking-tight text-black">
              {agent.activeGoal}
            </h2>
            <p className="text-xs text-black/50">
              Uptime: <span className="font-mono text-black font-semibold">{(agent.uptimeSeconds / 3600).toFixed(1)} hrs</span> | Execution Branch: <span className="font-mono text-[#0066FF] font-semibold">{agent.activeBranch}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onTriggerPaging}
              className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold uppercase tracking-wider rounded-md border border-[#0066FF] flex items-center gap-2 transition active:scale-95 shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              Memory Pager Optimization
            </button>
          </div>
        </div>

        {/* Sub-goals checklist */}
        <div className="mt-6 pt-6 border-t border-black/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {agent.subGoals.map((sg) => (
            <div 
              key={sg.id}
              className={`p-3.5 rounded-md border text-xs flex items-start gap-2.5 transition ${
                sg.status === 'completed' 
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                  : sg.status === 'in_progress'
                  ? 'bg-blue-50/50 border-[#0066FF]/30 text-blue-900'
                  : 'bg-gray-50 border-black/10 text-black/50'
              }`}
            >
              {sg.status === 'completed' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#0066FF] shrink-0 mt-0.5 animate-pulse"></div>
              )}
              <div>
                <div className="font-medium text-black">{sg.description}</div>
                <div className="text-[10px] uppercase font-mono tracking-wider opacity-60 mt-0.5">Priority: {sg.priority}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI SLA Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Token Context Window Metric */}
        <div className="bg-white border border-black/10 rounded-lg p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-black/50">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
              <Cpu className="w-3.5 h-3.5 text-[#0066FF]" />
              LLM Context
            </span>
            <span className="font-mono text-[#0066FF] font-bold">{tokenPercentage}%</span>
          </div>
          <div>
            <div className="text-2xl font-light text-black font-mono">
              {agent.currentContextTokens.toLocaleString()}
              <span className="text-xs text-black/40 font-normal ml-1">/ {agent.maxContextTokens.toLocaleString()}</span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden border border-black/5">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                tokenPercentage > 85 ? 'bg-amber-500' : 'bg-[#0066FF]'
              }`}
              style={{ width: `${tokenPercentage}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-black/50">
            {tokenPercentage > 85 ? '⚠️ Approaching threshold limit.' : 'Safe memory threshold operating.'}
          </p>
        </div>

        {/* Total Managed Memory */}
        <div className="bg-white border border-black/10 rounded-lg p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-black/50">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              Managed Memory
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold">
              PAGED
            </span>
          </div>
          <div>
            <div className="text-2xl font-light text-black font-mono">
              {formatBytes(agent.totalMemoryBytes)}
            </div>
          </div>
          <div className="text-[11px] text-black/50 flex items-center gap-2 font-mono">
            <span>Hot: {formatBytes(agent.hotMemoryBytes)}</span>
            <span>•</span>
            <span>Cold: {formatBytes(agent.coldMemoryBytes)}</span>
          </div>
        </div>

        {/* Snapshots & Recovery Benchmark */}
        <div className="bg-white border border-black/10 rounded-lg p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-black/50">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Recovery Latency
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono font-semibold">
              SLA &lt;1.2s
            </span>
          </div>
          <div>
            <div className="text-2xl font-light text-black font-mono">
              {agent.recoveryTimeMs} ms
            </div>
          </div>
          <div className="text-[11px] text-black/50">
            Total Checkpoints: <span className="text-black font-semibold">{snapshotCount}</span>
          </div>
        </div>

        {/* Zstd Compression Efficiency */}
        <div className="bg-white border border-black/10 rounded-lg p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-black/50">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
              <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
              Zstd Compression
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-mono font-semibold">
              ZSTD
            </span>
          </div>
          <div>
            <div className="text-2xl font-light text-black font-mono">
              {Math.round(agent.compressionRatio * 100)}%
            </div>
          </div>
          <div className="text-[11px] text-black/50">
            Execution Steps: <span className="text-black font-semibold">{agent.executionSteps}</span>
          </div>
        </div>

      </div>

      {/* Memory Pager Architecture Tier Visualizer */}
      <div className="bg-white border border-black/10 rounded-lg p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-black flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0066FF]" />
              Memory Tier Hierarchy (Linux OS Pager Model)
            </h3>
            <p className="text-xs text-black/50 mt-0.5">
              Hot RAM context moves to Warm, Cold, and Archive tiers automatically as execution progresses.
            </p>
          </div>
        </div>

        {/* Visual Stack Bar */}
        <div className="h-5 w-full bg-gray-100 rounded-md overflow-hidden flex p-0.5 gap-0.5 border border-black/10">
          <div style={{ width: `${hotPct}%` }} className="bg-emerald-500 rounded-xs h-full transition-all" title={`Hot RAM (${hotPct}%)`}></div>
          <div style={{ width: `${warmPct}%` }} className="bg-[#0066FF] rounded-xs h-full transition-all" title={`Warm Vector (${warmPct}%)`}></div>
          <div style={{ width: `${coldPct}%` }} className="bg-blue-600 rounded-xs h-full transition-all" title={`Cold Disk (${coldPct}%)`}></div>
          <div style={{ width: `${archivePct}%` }} className="bg-purple-600 rounded-xs h-full transition-all" title={`S3 Archive (${archivePct}%)`}></div>
        </div>

        {/* Tier Cards Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#F8F9FA] border border-black/10 rounded-md p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                Hot RAM
              </span>
              <span className="text-[10px] font-mono text-black/60 font-bold">{hotPct}%</span>
            </div>
            <div className="text-base font-mono font-semibold text-black">
              {formatBytes(agent.hotMemoryBytes)}
            </div>
            <p className="text-[11px] text-black/50">
              Active LLM prompt window (&lt;128k limit). Zero latency.
            </p>
          </div>

          <div className="bg-[#F8F9FA] border border-black/10 rounded-md p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0066FF] flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                Warm KV Store
              </span>
              <span className="text-[10px] font-mono text-black/60 font-bold">{warmPct}%</span>
            </div>
            <div className="text-base font-mono font-semibold text-black">
              {formatBytes(agent.warmMemoryBytes)}
            </div>
            <p className="text-[11px] text-black/50">
              Fast vector store (~42% compressed). ~15ms fetch latency.
            </p>
          </div>

          <div className="bg-[#F8F9FA] border border-black/10 rounded-md p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                <FileBox className="w-3 h-3" />
                Cold Disk
              </span>
              <span className="text-[10px] font-mono text-black/60 font-bold">{coldPct}%</span>
            </div>
            <div className="text-base font-mono font-semibold text-black">
              {formatBytes(agent.coldMemoryBytes)}
            </div>
            <p className="text-[11px] text-black/50">
              SQLite / RocksDB compressed storage (~22% ratio).
            </p>
          </div>

          <div className="bg-[#F8F9FA] border border-black/10 rounded-md p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1">
                <Archive className="w-3 h-3" />
                S3 Archive
              </span>
              <span className="text-[10px] font-mono text-black/60 font-bold">{archivePct}%</span>
            </div>
            <div className="text-base font-mono font-semibold text-black">
              {formatBytes(agent.archiveMemoryBytes)}
            </div>
            <p className="text-[11px] text-black/50">
              S3 bucket / Zstd compressed archives. Unlimited capacity.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
