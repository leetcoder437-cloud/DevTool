import React, { useState } from 'react';
import { 
  GitBranch, 
  GitMerge, 
  RotateCcw, 
  Activity, 
  Database, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  FileJson, 
  Workflow, 
  Target, 
  Cpu, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { AgentState, TimelineEvent, CheckpointSnapshot } from '../types';

interface StateGraphVisualizerProps {
  agent: AgentState;
  events: TimelineEvent[];
  snapshots: CheckpointSnapshot[];
  onExecuteMerge?: (sourceBranch: string) => void;
  onExecuteRollback?: (snapshotId: string) => void;
}

export const StateGraphVisualizer: React.FC<StateGraphVisualizerProps> = ({
  agent,
  events,
  snapshots,
  onExecuteMerge,
  onExecuteRollback
}) => {
  const [selectedBranch, setSelectedBranch] = useState('main-prod');
  const [newBranchName, setNewBranchName] = useState('feature/speculative-sla-v2');
  const [branches, setBranches] = useState<string[]>(['main-prod', 'feature/speculative-sla-v2']);
  const [selectedNode, setSelectedNode] = useState<'goal' | 'working' | 'longterm' | 'tools' | 'events' | 'branch'>('goal');
  const [actionLog, setActionLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setActionLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  const handleCreateBranch = () => {
    if (!newBranchName.trim() || branches.includes(newBranchName)) return;
    setBranches((prev) => [...prev, newBranchName]);
    setSelectedBranch(newBranchName);
    addLog(`Git Branch created: '${newBranchName}' from HEAD state.`);
    setNewBranchName('');
  };

  const handleMergeBranch = () => {
    if (selectedBranch === 'main-prod') return;
    addLog(`3-Way Delta Merge Executed: '${selectedBranch}' ➔ 'main-prod'. Conflicts auto-resolved.`);
    if (onExecuteMerge) onExecuteMerge(selectedBranch);
    setSelectedBranch('main-prod');
  };

  const handleRollback = (snapId: string) => {
    addLog(`State Rollback / Time Travel executed to Snapshot [${snapId}]. State restored.`);
    if (onExecuteRollback) onExecuteRollback(snapId);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-black/10 p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Workflow className="w-3.5 h-3.5" />
                State DAG & Event Sourcing
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-medium">
                RFC-001 Standard Agent State
              </span>
            </div>
            <h2 className="text-xl font-bold text-black mt-2">
              Agent State Engine, Lifecycle & Speculative Branching
            </h2>
            <p className="text-sm text-black/60 mt-1 max-w-3xl">
              Inspect the formal Agent State DAG graph, perform speculative Git-like branching (<code className="bg-black/5 px-1 py-0.5 rounded text-xs font-mono">runtime.branch()</code>), execution rollbacks, and event sourcing audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#F8F9FA] p-2.5 rounded-lg border border-black/10 text-xs font-mono">
            <span className="text-black/40 uppercase font-sans">Active Branch:</span>
            <span className="font-bold text-[#0066FF] bg-white px-2 py-1 rounded border border-black/10 flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5" />
              {selectedBranch}
            </span>
          </div>
        </div>
      </div>

      {/* State Graph Visual Nodes */}
      <div className="bg-white rounded-xl border border-black/10 p-5 shadow-2xs space-y-4">
        <h3 className="font-bold text-black text-xs uppercase tracking-wider text-black/60">
          Agent State DAG Graph Node Inspector
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { id: 'goal', label: '1. Goal Graph', sub: 'Sub-goals & SLA', icon: Target, activeColor: 'bg-emerald-50 border-emerald-500 text-emerald-700' },
            { id: 'working', label: '2. Working Memory', sub: 'HOT RAM Pages', icon: Cpu, activeColor: 'bg-blue-50 border-[#0066FF] text-[#0066FF]' },
            { id: 'longterm', label: '3. Long-Term Memory', sub: 'Warm / Cold Archive', icon: Database, activeColor: 'bg-amber-50 border-amber-500 text-amber-700' },
            { id: 'tools', label: '4. Tool State', sub: 'Calculators & APIs', icon: Layers, activeColor: 'bg-purple-50 border-purple-500 text-purple-700' },
            { id: 'events', label: '5. Event Sourcing Log', sub: 'Append-Only Trail', icon: Activity, activeColor: 'bg-rose-50 border-rose-500 text-rose-700' },
            { id: 'branch', label: '6. Git Branching', sub: 'Speculative Trees', icon: GitBranch, activeColor: 'bg-indigo-50 border-indigo-500 text-indigo-700' },
          ].map((node) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node.id as any)}
                className={`p-3 rounded-xl border text-left transition ${
                  isSelected 
                    ? `${node.activeColor} shadow-xs font-bold border-2` 
                    : 'bg-[#F8F9FA] border-black/10 hover:bg-white text-black/70'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-bold">{node.label}</span>
                </div>
                <div className="text-[10px] text-black/50 mt-1 pl-6">{node.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid: Inspector Panel + Git Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Node Content Inspector */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-black/10 p-5 shadow-2xs space-y-4">
          {selectedNode === 'goal' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-black flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  Goal Graph & Sub-Goals Structure (RFC-001)
                </h4>
                <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  Active Root Goal
                </span>
              </div>
              <div className="bg-[#F8F9FA] p-3.5 rounded-lg border border-black/10 space-y-2 text-xs">
                <div className="font-bold text-black text-sm">{agent.activeGoal}</div>
                <div className="text-black/60">Goal ID: <code className="font-mono text-black">goal_root_892</code></div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-black/60 uppercase">Sub-Goal Graph Nodes:</div>
                {agent.subGoals.map((sg) => (
                  <div key={sg.id} className="flex items-center justify-between p-2.5 bg-[#F8F9FA] rounded-lg border border-black/10 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 ${sg.status === 'completed' ? 'text-emerald-600' : 'text-black/30'}`} />
                      <span className="font-semibold text-black">{sg.title}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sg.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sg.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedNode === 'working' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-black flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#0066FF]" />
                Working Memory & Context Window (HOT RAM)
              </h4>
              <p className="text-xs text-black/60">
                Current Context Window: <strong>{agent.currentContextTokens.toLocaleString()} / 128,000 tokens</strong>.
              </p>
              <div className="bg-[#1E1E1E] text-emerald-400 p-3.5 rounded-lg text-xs font-mono max-h-[220px] overflow-y-auto">
                {JSON.stringify({
                  activeTokens: agent.currentContextTokens,
                  maxTokens: 128000,
                  hotPagesCount: 3,
                  evictionThresholdScore: 0.70
                }, null, 2)}
              </div>
            </div>
          )}

          {selectedNode === 'branch' && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-black flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-600" />
                Git-like State Branching & Merging
              </h4>
              <p className="text-xs text-black/60">
                Sprout a new execution branch to let the agent try speculative prompt paths or experimental tools without corrupting the main production state.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="Branch name (e.g. feature/speculative-sla)..."
                  className="flex-1 text-xs font-mono p-2.5 bg-[#F8F9FA] border border-black/10 rounded-lg focus:outline-none focus:border-[#0066FF]"
                />
                <button
                  onClick={handleCreateBranch}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition shadow-2xs"
                >
                  Create Branch
                </button>
              </div>

              <div className="pt-2 space-y-2">
                <div className="text-xs font-bold text-black/60 uppercase">Available Execution Branches:</div>
                {branches.map((b) => (
                  <div key={b} className="flex items-center justify-between p-3 bg-[#F8F9FA] rounded-lg border border-black/10 text-xs">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-indigo-600" />
                      <span className="font-mono font-bold text-black">{b}</span>
                    </div>
                    {b !== 'main-prod' && (
                      <button
                        onClick={handleMergeBranch}
                        className="px-2.5 py-1 bg-emerald-600 text-white font-semibold rounded text-[11px] hover:bg-emerald-700 transition flex items-center gap-1"
                      >
                        <GitMerge className="w-3 h-3" />
                        Merge ➔ main-prod
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(selectedNode === 'longterm' || selectedNode === 'tools' || selectedNode === 'events') && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-black uppercase tracking-wider">
                {selectedNode.toUpperCase()} Node State Structure
              </h4>
              <pre className="bg-[#F8F9FA] border border-black/10 p-3 rounded-lg text-xs font-mono text-black/80 max-h-[220px] overflow-y-auto">
                {JSON.stringify({ node: selectedNode, agentId: agent.id, timestamp: Date.now() }, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right Column: Time Travel Snapshots & Rollback */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-black/10 p-5 shadow-2xs space-y-4">
          <h3 className="font-bold text-black text-sm uppercase tracking-wider flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-600" />
            Time Travel Rollback & Snapshots
          </h3>

          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {snapshots.map((snap) => (
              <div key={snap.id} className="p-3 bg-[#F8F9FA] rounded-lg border border-black/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#0066FF]">{snap.id}</span>
                  <span className="text-[10px] text-black/40">{new Date(snap.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="font-semibold text-black">{snap.label}</div>
                <div className="flex items-center justify-between text-[11px] text-black/60 pt-1 border-t border-black/5">
                  <span>Tokens: {snap.workingContextTokens.toLocaleString()}</span>
                  <button
                    onClick={() => handleRollback(snap.id)}
                    className="text-[#0066FF] font-bold hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Rollback
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
