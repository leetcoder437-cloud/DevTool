import React, { useState } from 'react';
import { 
  Boxes, 
  Code2, 
  Check, 
  Copy, 
  Play, 
  Layers, 
  Workflow, 
  Cpu, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface FrameworkIntegrationsViewProps {
  onExecuteStep?: (prompt: string) => void;
}

export const FrameworkIntegrationsView: React.FC<FrameworkIntegrationsViewProps> = ({ onExecuteStep }) => {
  const [activeFramework, setActiveFramework] = useState<'langgraph' | 'openai' | 'crewai' | 'autogen' | 'mastra'>('langgraph');
  const [copied, setCopied] = useState(false);
  const [testLog, setTestLog] = useState<string[]>([]);
  const [isRunningSim, setIsRunningSim] = useState(false);

  const snippets = {
    langgraph: `# Install: pip install checkpointos langgraph
from checkpointos import CheckpointOS, LangGraphAdapter
from langgraph.graph import StateGraph

# 1. Initialize CheckpointOS Memory Operating System
runtime = CheckpointOS(
    agent_id="ag-langgraph-prod",
    storage_path="./checkpointos_store.json"
)

# 2. Wrap LangGraph Workflow State
adapter = LangGraphAdapter(runtime)
builder = StateGraph(dict)

# Add nodes...
builder.add_node("planner", lambda state: {"goal": "Analyze SLA"})
builder.add_node("executor", lambda state: {"status": "done"})

# 3. Attach CheckpointOS persistence to compiled graph
graph = adapter.attach(builder.compile())

# Run graph with zero-loss crash recovery!
graph.invoke({"input": "Review Clause 18.2"})`,

    openai: `# Install: pip install checkpointos openai-agents
from checkpointos import CheckpointOS, OpenAIAgentsAdapter
from openai_agents import Agent, Runner

# 1. Initialize CheckpointOS Runtime
runtime = CheckpointOS(agent_id="ag-openai-swarm")
adapter = OpenAIAgentsAdapter(runtime)

# 2. Define OpenAI Agent
agent = Agent(
    name="ContractNegotiator",
    instructions="Analyze SLA penalties and recommend counter-offers."
)

# 3. Wrap agent with CheckpointOS state persistence
checkpointed_agent = adapter.wrap_agent(agent)

# Execute steps under CheckpointOS memory paging control
result = Runner.run_sync(checkpointed_agent, "Check Liability Cap")`,

    crewai: `# Install: pip install checkpointos crewai
from checkpointos import CheckpointOS, CrewAIAdapter
from crewai import Agent, Crew, Task

# 1. Initialize CheckpointOS State Engine
runtime = CheckpointOS(agent_id="ag-crew-legal")
adapter = CrewAIAdapter(runtime)

# 2. Build Crew
researcher = Agent(role="Legal Researcher", goal="Extract SLA terms")
analyst = Agent(role="SLA Analyst", goal="Calculate penalty caps")

crew = Crew(agents=[researcher, analyst], tasks=[...])

# 3. Hook Crew into CheckpointOS Memory Engine
adapter.attach_crew(crew)

# Kickoff crew with full state snapshotting & event sourcing
crew.kickoff()`,

    autogen: `# Install: pip install checkpointos pyautogen
from checkpointos import CheckpointOS, AutoGenAdapter
import autogen

# 1. Initialize CheckpointOS Runtime Core
runtime = CheckpointOS(agent_id="ag-autogen-chat")
adapter = AutoGenAdapter(runtime)

# 2. Create AutoGen Conversational Agents
user_proxy = autogen.UserProxyAgent(name="UserProxy")
assistant = autogen.AssistantAgent(name="SLA_Negotiator")

# 3. Attach state persistence to group chat
adapter.attach(assistant)

# GroupChat state automatically backed up to local storage!
user_proxy.initiate_chat(assistant, message="Review Clause 18.2 Limit")`,

    mastra: `# Install: npm install @checkpointos/runtime @mastra/core
import { CheckpointOS, MastraAdapter } from '@checkpointos/runtime';
import { Workflow } from '@mastra/core';

// 1. Initialize CheckpointOS Runtime
const runtime = new CheckpointOS({
  agentId: 'ag-mastra-workflow',
  storagePath: './checkpointos_store.json'
});

const adapter = new MastraAdapter(runtime);

// 2. Define Mastra Workflow
const workflow = new Workflow({ name: 'sla-contract-pipeline' });

// 3. Wrap workflow with CheckpointOS persistence
const persistentWorkflow = adapter.wrapWorkflow(workflow);

await persistentWorkflow.execute({ input: 'Analyze Contract Terms' });`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeFramework]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulatedTest = () => {
    setIsRunningSim(true);
    const frameworkName = activeFramework.toUpperCase();
    
    setTestLog((prev) => [
      `[${new Date().toLocaleTimeString()}] Hooking CheckpointOS into ${frameworkName} Agent Execution Graph...`,
      ...prev
    ]);

    setTimeout(() => {
      setTestLog((prev) => [
        `[${new Date().toLocaleTimeString()}] [${frameworkName}] Intercepted step: 'Review SLA Clause 18.2 Liability Limit'`,
        ...prev
      ]);
    }, 400);

    setTimeout(() => {
      setTestLog((prev) => [
        `[${new Date().toLocaleTimeString()}] [MEMORY PAGER] Computed Priority Score: 0.885. Created HOT RAM page.`,
        `[${new Date().toLocaleTimeString()}] [CHECKPOINT] State written to store file. SHA-256 hash verified.`,
        ...prev
      ]);
      setIsRunningSim(false);
      if (onExecuteStep) onExecuteStep(`Run ${frameworkName} Agent Workflow Step`);
    }, 900);
  };

  const frameworkCards = [
    { id: 'langgraph', name: 'LangGraph', desc: 'StateGraph & LangChain ecosystem integration', icon: Workflow, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'openai', name: 'OpenAI Agents SDK', desc: 'Swarm & OpenAI Agent workflows', icon: Sparkles, color: 'text-[#0066FF] bg-blue-50 border-blue-200' },
    { id: 'crewai', name: 'CrewAI', desc: 'Multi-agent role playing crews', icon: Layers, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'autogen', name: 'Microsoft AutoGen', desc: 'Conversational agent group chats', icon: Boxes, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { id: 'mastra', name: 'Mastra TypeScript', desc: 'Full-stack JS/TS AI workflow engine', icon: Code2, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-black/10 p-5 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                Native Framework Adapters
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero App Rewriting Needed
              </span>
            </div>
            <h2 className="text-xl font-bold text-black mt-2">
              Plug CheckpointOS into Any AI Agent Framework in 3 Lines of Code
            </h2>
            <p className="text-sm text-black/60 mt-1 max-w-3xl">
              CheckpointOS is framework-agnostic. Attach it directly to existing <strong>LangGraph, OpenAI Agents, CrewAI, AutoGen, or Mastra</strong> workflows without rewriting your prompt pipelines or business logic.
            </p>
          </div>

          <div className="bg-[#F8F9FA] p-3 rounded-lg border border-black/10 text-xs font-mono text-center">
            <div className="text-black/40 text-[10px] uppercase font-sans">Install Unified SDK</div>
            <code className="font-bold text-black bg-white px-2 py-1 rounded border border-black/10 mt-1 block">
              pip install checkpointos
            </code>
          </div>
        </div>
      </div>

      {/* Framework Selector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {frameworkCards.map((fw) => {
          const Icon = fw.icon;
          const isSelected = activeFramework === fw.id;
          return (
            <button
              key={fw.id}
              onClick={() => setActiveFramework(fw.id as any)}
              className={`p-3.5 rounded-xl border text-left transition relative ${
                isSelected 
                  ? 'bg-white border-[#0066FF] shadow-sm ring-2 ring-[#0066FF]/20' 
                  : 'bg-white border-black/10 hover:border-black/20 hover:bg-[#F8F9FA]'
              }`}
            >
              <div className={`p-2 rounded-lg w-fit ${fw.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-black mt-2.5">{fw.name}</div>
              <div className="text-[10px] text-black/50 line-clamp-1 mt-0.5">{fw.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Code Viewer & Interactive Simulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Snippet Column */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-black/10 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-black text-sm uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#0066FF]" />
              {activeFramework.toUpperCase()} Integration Adapter Code
            </h3>

            <button
              onClick={handleCopy}
              className="text-xs text-black/60 hover:text-black flex items-center gap-1 font-mono bg-[#F8F9FA] px-2.5 py-1 rounded border border-black/10 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Integration Code'}
            </button>
          </div>

          <pre className="bg-[#1E1E1E] text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-black/10 max-h-[380px]">
            {snippets[activeFramework]}
          </pre>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-black/60">
              Attach CheckpointOS runtime with <code className="bg-black/5 px-1.5 py-0.5 rounded font-mono text-black font-bold">adapter.attach(agent)</code>
            </span>
            <button
              onClick={handleRunSimulatedTest}
              disabled={isRunningSim}
              className="py-2 px-4 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition shadow-2xs disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Test {activeFramework.toUpperCase()} Execution
            </button>
          </div>
        </div>

        {/* Execution Output Column */}
        <div className="lg:col-span-5 bg-[#1A1A1A] text-white rounded-xl border border-black/10 p-5 shadow-2xs space-y-3 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Framework Adapter Live Hook Output
            </span>
            <button
              onClick={() => setTestLog([])}
              className="text-[10px] text-white/40 hover:text-white"
            >
              Clear
            </button>
          </div>

          <div className="h-[320px] overflow-y-auto space-y-2 text-xs text-white/80 pr-1">
            {testLog.length === 0 ? (
              <div className="text-white/40 italic py-12 text-center text-xs font-sans">
                Click "Test {activeFramework.toUpperCase()} Execution" to verify how CheckpointOS intercepts step state, computes memory priority scores, and writes zero-copy snapshots.
              </div>
            ) : (
              testLog.map((log, i) => (
                <div key={i} className="leading-relaxed text-emerald-300/90 border-b border-white/5 pb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
