import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Send, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles,
  Loader2,
  AlertCircle,
  Database
} from 'lucide-react';
import { AgentState, MemoryPage } from '../types';

interface LiveAgentConsoleProps {
  agent: AgentState;
  pages: MemoryPage[];
  onExecuteAgentStep: (prompt: string) => Promise<void>;
  onStressTestWorkload: () => void;
  isExecuting: boolean;
  lastResponse: string;
}

export const LiveAgentConsole: React.FC<LiveAgentConsoleProps> = ({
  agent,
  pages,
  onExecuteAgentStep,
  onStressTestWorkload,
  isExecuting,
  lastResponse,
}) => {
  const [prompt, setPrompt] = useState('');
  const [consoleHistory, setConsoleHistory] = useState<{ type: 'user' | 'agent' | 'system'; text: string; timestamp: string }[]>([
    {
      type: 'system',
      text: `[CheckpointOS Runtime Kernel v0.8.2] Attached to agent "${agent.name}" (${agent.id}). Target Memory Budget: 128,000 tokens.`,
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      type: 'agent',
      text: `Active Core Goal: "${agent.activeGoal}". Ready for next task instructions under CheckpointOS paging control.`,
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isExecuting) return;

    const userText = prompt;
    setPrompt('');

    setConsoleHistory((prev) => [
      ...prev,
      { type: 'user', text: userText, timestamp: new Date().toLocaleTimeString() }
    ]);

    await onExecuteAgentStep(userText);
  };

  React.useEffect(() => {
    if (lastResponse) {
      setConsoleHistory((prev) => [
        ...prev,
        { type: 'agent', text: lastResponse, timestamp: new Date().toLocaleTimeString() }
      ]);
    }
  }, [lastResponse]);

  return (
    <div className="space-y-6">
      
      {/* Console Top Header */}
      <div className="bg-white border border-black/10 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-xl font-light text-black flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#0066FF]" />
            Live Agent Terminal & Execution Control
          </h2>
          <p className="text-xs text-black/50 mt-0.5">
            Send commands to Gemini model. CheckpointOS wraps execution, monitors context tokens, and saves checkpoints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onStressTestWorkload}
            disabled={isExecuting}
            className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-semibold uppercase tracking-wider rounded-md border border-purple-200 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 text-purple-700" />
            Stress Test Workload
          </button>
        </div>
      </div>

      {/* Terminal Display */}
      <div className="bg-white border border-black/10 rounded-lg p-6 font-mono text-xs space-y-4 shadow-2xs relative overflow-hidden">
        
        <div className="flex items-center justify-between pb-3 border-b border-black/10 text-black/50 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
            <span className="ml-2 font-bold text-black uppercase tracking-wider">checkpoint-os-tty1</span>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <span>Context: <strong className="text-[#0066FF]">{agent.currentContextTokens.toLocaleString()} / 128,000</strong></span>
            <span>Hot RAM: <strong className="text-emerald-700">{pages.filter(p => p.tier === 'hot').length} pages</strong></span>
          </div>
        </div>

        {/* Scrollable Terminal Output */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
          {consoleHistory.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] text-black/40 font-mono">
                <span>[{item.timestamp}]</span>
                <span className="uppercase font-bold text-black/60">{item.type}</span>
              </div>
              <div 
                className={`p-3.5 rounded-md border leading-relaxed whitespace-pre-wrap ${
                  item.type === 'user'
                    ? 'bg-blue-50/60 border-[#0066FF]/20 text-blue-950 font-sans'
                    : item.type === 'agent'
                    ? 'bg-[#F8F9FA] border-black/10 text-black font-sans'
                    : 'bg-emerald-50/50 border-emerald-200 text-emerald-900 font-mono font-semibold'
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}

          {isExecuting && (
            <div className="p-3 bg-blue-50 border border-[#0066FF]/30 rounded-md text-[#0066FF] flex items-center gap-2 text-xs font-mono">
              <Loader2 className="w-4 h-4 animate-spin text-[#0066FF]" />
              <span>CheckpointOS executing agent step & calculating context delta...</span>
            </div>
          )}
        </div>

        {/* Command Input Form */}
        <form onSubmit={handleSubmit} className="pt-3 border-t border-black/10 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type task prompt for agent (e.g. 'Review legal clause #18 and update sub-goal status')..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isExecuting}
            className="flex-1 bg-[#F8F9FA] border border-black/10 rounded-md px-4 py-2 text-xs text-black placeholder:text-black/40 focus:outline-none focus:border-[#0066FF] transition font-sans"
          />
          <button
            type="submit"
            disabled={isExecuting || !prompt.trim()}
            className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold uppercase tracking-wider rounded-md border border-[#0066FF] flex items-center gap-1.5 transition disabled:opacity-50 shadow-2xs"
          >
            <Send className="w-3.5 h-3.5" />
            Execute
          </button>
        </form>

      </div>

    </div>
  );
};
