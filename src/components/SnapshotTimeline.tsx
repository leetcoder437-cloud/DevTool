import React, { useState } from 'react';
import { 
  GitBranch, 
  Camera, 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  GitCommit,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { CheckpointSnapshot, AgentBranchNode, CheckpointTrigger } from '../types';

interface SnapshotTimelineProps {
  snapshots: CheckpointSnapshot[];
  branches: AgentBranchNode[];
  activeBranch: string;
  onRestoreSnapshot: (snapshot: CheckpointSnapshot) => void;
  onCreateBranch: (branchName: string, snapshot: CheckpointSnapshot) => void;
  onSelectBranch: (branchName: string) => void;
}

export const SnapshotTimeline: React.FC<SnapshotTimelineProps> = ({
  snapshots,
  branches,
  activeBranch,
  onRestoreSnapshot,
  onCreateBranch,
  onSelectBranch,
}) => {
  const [selectedSnapshot, setSelectedSnapshot] = useState<CheckpointSnapshot | null>(null);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');

  const getTriggerBadge = (trigger: CheckpointTrigger) => {
    switch (trigger) {
      case 'auto_interval':
        return <span className="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-gray-700 border border-black/10 font-mono font-semibold">AUTO INTERVAL</span>;
      case 'context_overflow':
        return <span className="px-2 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-mono font-semibold">OVERFLOW SAFETY</span>;
      case 'pre_crash':
        return <span className="px-2 py-0.5 rounded text-[10px] bg-red-50 text-red-800 border border-red-200 font-mono font-semibold">PRE-CRASH DISASTER</span>;
      case 'branch_fork':
        return <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-800 border border-blue-200 font-mono font-semibold">BRANCH FORK</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-semibold">MANUAL SNAPSHOT</span>;
    }
  };

  const handleBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim() || !selectedSnapshot) return;
    onCreateBranch(newBranchName, selectedSnapshot);
    setNewBranchName('');
    setShowBranchModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Branch Selector Header */}
      <div className="bg-white border border-black/10 rounded-lg p-6 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-light text-black flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-[#0066FF]" />
              Active Execution Branches & Forks
            </h2>
            <p className="text-xs text-black/50 mt-0.5">
              Agent memory trees allow forking hypothetical paths and rolling back time without context corruption.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {branches.map((b) => (
              <button
                key={b.id}
                onClick={() => onSelectBranch(b.name)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition flex items-center gap-1.5 border ${
                  activeBranch === b.name
                    ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-2xs'
                    : 'bg-white text-black/70 border-black/10 hover:bg-gray-50'
                }`}
              >
                <GitCommit className="w-3.5 h-3.5" />
                {b.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Snapshot Cards List */}
      <div className="bg-white border border-black/10 rounded-lg p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-black flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#0066FF]" />
            Checkpoint State Timeline ({snapshots.length} Snapshots)
          </h3>
          <span className="text-xs text-black/40 font-mono uppercase tracking-wider">
            Time Travel Engine Ready
          </span>
        </div>

        <div className="space-y-3">
          {snapshots.map((snap) => (
            <div
              key={snap.id}
              className={`p-4 rounded-md border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                selectedSnapshot?.id === snap.id
                  ? 'bg-blue-50/50 border-[#0066FF]'
                  : 'bg-[#F8F9FA] border-black/10 hover:border-black/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-white border border-black/10 text-[#0066FF] shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-black">{snap.label}</span>
                    <span className="font-mono text-xs text-black/40">[{snap.id}]</span>
                    {getTriggerBadge(snap.triggerReason)}
                    <span className="text-[10px] px-1.5 py-0.5 bg-white text-black/70 border border-black/10 rounded font-mono font-semibold">
                      Branch: {snap.branchName}
                    </span>
                  </div>

                  <p className="text-xs text-black/60">
                    Goal Context: <span className="text-black font-medium">{snap.goalState}</span>
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-black/50 font-mono pt-1">
                    <span>Tokens: <strong className="text-[#0066FF]">{snap.workingContextTokens.toLocaleString()}</strong></span>
                    <span>Checksum: <strong className="text-emerald-700">0x{snap.checksum.substring(0, 8)}</strong></span>
                    <span>Size: <strong className="text-purple-700">{snap.compressedSizeKb} KB</strong></span>
                    <span>Saved: <strong>{new Date(snap.timestamp).toLocaleTimeString()}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => {
                    setSelectedSnapshot(snap);
                    setShowBranchModal(true);
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 text-black text-xs font-semibold rounded border border-black/10 flex items-center gap-1.5 transition shadow-2xs"
                >
                  <GitBranch className="w-3.5 h-3.5 text-[#0066FF]" />
                  Fork Branch
                </button>

                <button
                  onClick={() => onRestoreSnapshot(snap)}
                  className="px-3 py-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold uppercase tracking-wider rounded border border-[#0066FF] flex items-center gap-1.5 transition active:scale-95 shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Time Travel Restore
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Modal for Forking Branch */}
      {showBranchModal && selectedSnapshot && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black/10 rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <h3 className="text-base font-semibold text-black flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-[#0066FF]" />
                Fork Execution Branch
              </h3>
              <button
                onClick={() => setShowBranchModal(false)}
                className="text-black/40 hover:text-black text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-black/60">
              Forking from snapshot <span className="font-mono text-[#0066FF] font-bold">[{selectedSnapshot.id}]</span> ("{selectedSnapshot.label}").
            </p>

            <form onSubmit={handleBranchSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-black mb-1 uppercase tracking-wider">
                  New Branch Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. sla-counter-offer-v2"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-black/10 rounded px-3 py-2 text-xs text-black focus:outline-none focus:border-[#0066FF] font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => setShowBranchModal(false)}
                  className="px-4 py-2 bg-gray-100 text-black text-xs font-semibold rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0066FF] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#0052CC] shadow-2xs"
                >
                  Create Branch Fork
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
