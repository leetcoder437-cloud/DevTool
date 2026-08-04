import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Camera, 
  ZapOff, 
  RotateCcw, 
  ChevronDown
} from 'lucide-react';
import { AgentState } from '../types';

interface NavbarProps {
  agents: AgentState[];
  selectedAgent: AgentState;
  onSelectAgent: (agent: AgentState) => void;
  onManualSnapshot: () => void;
  onTriggerCrash: () => void;
  onEmergencyRestore: () => void;
  isRecovering: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  agents,
  selectedAgent,
  onSelectAgent,
  onManualSnapshot,
  onTriggerCrash,
  onEmergencyRestore,
  isRecovering,
  activeTab,
  setActiveTab
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const getStatusColor = (status: AgentState['status']) => {
    switch (status) {
      case 'running': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'crashed': return 'bg-red-50 text-red-700 border-red-200 animate-pulse';
      case 'recovering': return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const tabs = [
    { id: 'frameworks', label: '🔗 Framework Adapters' },
    { id: 'comparison', label: '⚖️ Why CheckpointOS?' },
    { id: 'state_dag', label: '🕸️ State DAG & Branching' },
    { id: 'memory_algo', label: '🧠 Memory Formula & Storage' },
    { id: 'benchmarks', label: '📊 Industrial Benchmarks' },
    { id: 'rfc_specs', label: '📜 RFC Specs' },
    { id: 'runtime_test', label: '⚡ Crash & Recovery' },
    { id: 'sdk', label: '💻 Python / TS SDK' },
    { id: 'db_dump', label: '💾 DB Dumps' },
    { id: 'cluster', label: '🌐 Cluster' },
    { id: 'console', label: '🖥️ Console' },
  ];

  return (
    <header className="bg-white border-b border-black/10 sticky top-0 z-50 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Runtime Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#0066FF] text-white shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-black tracking-tight">Checkpoint<span className="text-[#0066FF]">OS</span></span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold rounded">
                    v1.0.0-prod
                  </span>
                </div>
                <span className="text-[9px] font-bold text-black/40 uppercase tracking-wider">Memory Operating System</span>
              </div>
            </div>

            {/* Agent Selector Dropdown */}
            <div className="relative border-l border-black/10 pl-4 hidden md:block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1 bg-[#F8F9FA] hover:bg-gray-100 text-black text-xs font-medium rounded-md border border-black/10 transition"
              >
                <Cpu className="w-3.5 h-3.5 text-[#0066FF]" />
                <span className="font-semibold max-w-[140px] truncate">{selectedAgent.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-black/40" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-4 mt-2 w-72 bg-white border border-black/10 rounded-lg shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-black/40 uppercase tracking-[0.15em] border-b border-black/5">
                    Monitored Agent Runtimes
                  </div>
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => {
                        onSelectAgent(agent);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between transition ${
                        agent.id === selectedAgent.id ? 'bg-[#0066FF]/5 text-[#0066FF] font-semibold' : 'text-black/80'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-black">{agent.name}</div>
                        <div className="text-[11px] text-black/40">{agent.role}</div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border capitalize ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onManualSnapshot}
              title="Save Manual Checkpoint Snapshot"
              className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-black text-xs font-semibold rounded-md border border-black/10 flex items-center gap-1 transition active:scale-95 shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-[#0066FF]" />
              <span className="hidden sm:inline">Snapshot</span>
            </button>

            <button
              onClick={onTriggerCrash}
              disabled={isRecovering || selectedAgent.status === 'crashed'}
              title="Simulate Container SIGKILL Process Crash"
              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-md border border-red-200 flex items-center gap-1 transition active:scale-95 disabled:opacity-50"
            >
              <ZapOff className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden sm:inline font-mono">kill -9</span>
            </button>

            <button
              onClick={onEmergencyRestore}
              disabled={isRecovering}
              title="Trigger Instant Recovery Engine"
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-md border border-emerald-200 flex items-center gap-1 transition active:scale-95 disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-emerald-600 ${isRecovering ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Restore</span>
            </button>
          </div>

        </div>

        {/* Sub-Header Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 pt-1 no-scrollbar border-t border-black/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-[#0066FF] text-white shadow-2xs'
                  : 'text-black/70 hover:text-black hover:bg-[#F8F9FA]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
