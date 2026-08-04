import React, { useState } from 'react';
import { 
  Sliders, 
  Database, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  HardDrive, 
  Sparkles, 
  Check, 
  Calculator, 
  Server,
  ArrowRight
} from 'lucide-react';

export const MemoryPagerAlgorithmView: React.FC = () => {
  // Priority Scoring Formula Sliders
  const [goalRelevance, setGoalRelevance] = useState(0.85);
  const [accessFreq, setAccessFreq] = useState(0.70);
  const [recency, setRecency] = useState(0.90);
  const [dependencyWeight, setDependencyWeight] = useState(0.60);

  // Pluggable Storage Adapter Selection
  const [selectedAdapter, setSelectedAdapter] = useState<'json' | 'sqlite' | 'postgres' | 'rocksdb' | 's3' | 'redis'>('rocksdb');

  // Compute RFC-002 Formula Score
  // Formula: Score = 0.35 * GoalRelevance + 0.30 * AccessFreq + 0.20 * Recency + 0.15 * DependencyWeight
  const calculatedScore = Number(
    (0.35 * goalRelevance + 0.30 * accessFreq + 0.20 * recency + 0.15 * dependencyWeight).toFixed(4)
  );

  let calculatedTier: 'hot' | 'warm' | 'cold' = 'cold';
  let tierBadgeColor = 'bg-slate-100 text-slate-700 border-slate-300';
  let tierDestination = 'S3 Compressed Blob Store / Cold Disk';

  if (calculatedScore >= 0.70) {
    calculatedTier = 'hot';
    tierBadgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
    tierDestination = 'LLM Hot RAM Context Window (Active Prompt)';
  } else if (calculatedScore >= 0.35) {
    calculatedTier = 'warm';
    tierBadgeColor = 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
    tierDestination = 'Local Key-Value Cache / RocksDB KV Storage';
  }

  const storageAdapters = [
    { id: 'json', name: 'JSONFileAdapter', type: 'File System', speed: '<1.2ms', desc: 'Zero-dep local file storage for quick prototypes & single agents.' },
    { id: 'rocksdb', name: 'RocksDBAdapter', type: 'Embedded KV', speed: '<0.4ms', desc: 'High-throughput flash storage engine for million-token memory pages.' },
    { id: 'sqlite', name: 'SQLiteAdapter', type: 'Relational DB', speed: '<0.8ms', desc: 'Transactional SQL storage with full relational query capability.' },
    { id: 'postgres', name: 'PostgreSQLAdapter', type: 'Enterprise SQL', speed: '<2.1ms', desc: 'ACID-compliant relational database engine for distributed agent clusters.' },
    { id: 'redis', name: 'RedisAdapter', type: 'In-Memory KV', speed: '<0.2ms', desc: 'Ultra-low latency memory cache for multi-instance agent synchronization.' },
    { id: 's3', name: 'S3BlobAdapter', type: 'Object Cloud Store', speed: '<14ms', desc: 'Immutable long-term cold archive for historical snapshot dumps.' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-black/10 p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5" />
                RFC-002 Memory Pager Formula
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-medium">
                Separation of Memory Logic & Storage
              </span>
            </div>
            <h2 className="text-xl font-bold text-black mt-2">
              Algorithmic Memory Pager & Pluggable Storage Adapters
            </h2>
            <p className="text-sm text-black/60 mt-1 max-w-3xl">
              Memory paging is not arbitrary. CheckpointOS computes a deterministic <strong>Priority Score</strong> for every memory page to decide whether to retain it in Hot RAM, move it to Warm Cache, or compress it to Cold Storage.
            </p>
          </div>

          <div className="bg-[#F8F9FA] p-3 rounded-lg border border-black/10 text-xs font-mono">
            <div className="text-black/40 text-[10px] uppercase font-sans">Priority Score Formula</div>
            <code className="text-black font-bold text-[11px] block mt-1">
              0.35·Relevance + 0.30·Access + 0.20·Recency + 0.15·Dependency
            </code>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Pager Calculator + Storage Adapters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Formula Calculator */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-black/10 p-5 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-black/10">
            <h3 className="font-bold text-black text-sm uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#0066FF]" />
              RFC-002 Priority Score Calculator
            </h3>
            <span className="text-xs text-black/50 font-mono">Weight Sum = 1.00</span>
          </div>

          {/* Sliders */}
          <div className="space-y-4 text-xs">
            {/* Goal Relevance */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-black">
                <span>Goal Relevance (Weight: 35%):</span>
                <span className="font-mono text-[#0066FF] font-bold">{(goalRelevance * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={goalRelevance}
                onChange={(e) => setGoalRelevance(parseFloat(e.target.value))}
                className="w-full accent-[#0066FF] cursor-pointer"
              />
            </div>

            {/* Access Frequency */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-black">
                <span>Access Frequency (Weight: 30%):</span>
                <span className="font-mono text-[#0066FF] font-bold">{(accessFreq * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={accessFreq}
                onChange={(e) => setAccessFreq(parseFloat(e.target.value))}
                className="w-full accent-[#0066FF] cursor-pointer"
              />
            </div>

            {/* Recency */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-black">
                <span>Recency Decay (Weight: 20%):</span>
                <span className="font-mono text-[#0066FF] font-bold">{(recency * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={recency}
                onChange={(e) => setRecency(parseFloat(e.target.value))}
                className="w-full accent-[#0066FF] cursor-pointer"
              />
            </div>

            {/* Dependency Weight */}
            <div className="space-y-1">
              <div className="flex justify-between font-semibold text-black">
                <span>Dependency Weight (Weight: 15%):</span>
                <span className="font-mono text-[#0066FF] font-bold">{(dependencyWeight * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={dependencyWeight}
                onChange={(e) => setDependencyWeight(parseFloat(e.target.value))}
                className="w-full accent-[#0066FF] cursor-pointer"
              />
            </div>
          </div>

          {/* Output Computed Priority Score Box */}
          <div className="p-4 bg-[#F8F9FA] rounded-xl border border-black/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-black/60 uppercase">Computed Priority Score:</span>
              <span className="text-2xl font-black font-mono text-black">{calculatedScore}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-black/10">
              <span className="text-xs text-black/60">Classified Memory Tier:</span>
              <span className={`px-2.5 py-1 rounded text-xs uppercase ${tierBadgeColor}`}>
                {calculatedTier.toUpperCase()} TIER
              </span>
            </div>

            <div className="text-[11px] text-black/60 pt-1 font-mono">
              Action Destination: <strong className="text-black">{tierDestination}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Pluggable Storage Adapters Architecture Matrix */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-black/10 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-black/10">
            <h3 className="font-bold text-black text-sm uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-600" />
              Pluggable Storage Adapters Matrix
            </h3>
            <span className="text-xs text-black/50 font-mono">Storage Interface</span>
          </div>

          <p className="text-xs text-black/60">
            Memory logic is decoupled from storage hardware. Swap storage engines dynamically in production without touching agent code.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {storageAdapters.map((adapter) => {
              const isSelected = selectedAdapter === adapter.id;
              return (
                <button
                  key={adapter.id}
                  onClick={() => setSelectedAdapter(adapter.id as any)}
                  className={`p-3 rounded-lg border text-left transition ${
                    isSelected 
                      ? 'bg-emerald-50 border-emerald-500 shadow-xs' 
                      : 'bg-[#F8F9FA] border-black/10 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-black">{adapter.name}</span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {adapter.speed}
                    </span>
                  </div>
                  <div className="text-[10px] text-black/50 font-medium mt-0.5">{adapter.type}</div>
                  <div className="text-[11px] text-black/60 line-clamp-2 mt-1.5">{adapter.desc}</div>
                </button>
              );
            })}
          </div>

          <div className="bg-[#1E1E1E] text-emerald-400 p-3 rounded-lg text-xs font-mono">
            <code>
              {`from checkpointos import CheckpointOS, ${storageAdapters.find(a => a.id === selectedAdapter)?.name}

runtime = CheckpointOS(
    agent_id="ag-prod-01",
    storage_adapter=${storageAdapters.find(a => a.id === selectedAdapter)?.name}()
)`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
