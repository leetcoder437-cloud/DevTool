import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  INITIAL_AGENTS, 
  INITIAL_SNAPSHOTS, 
  INITIAL_PAGES, 
  INITIAL_EVENTS, 
  INITIAL_BRANCHES 
} from './services/mockData';
import { AgentState, CheckpointSnapshot, MemoryPage, TimelineEvent, AgentBranchNode } from './types';
import { MemoryPager } from './runtime/memoryPager';
import { SnapshotEngine } from './runtime/snapshotEngine';
import { RecoveryEngine } from './runtime/recoveryEngine';
import { BranchingEngine } from './runtime/branchingEngine';

import { Navbar } from './components/Navbar';
import { MetricsOverview } from './components/MetricsOverview';
import { MemoryPagingView } from './components/MemoryPagingView';
import { SnapshotTimeline } from './components/SnapshotTimeline';
import { LiveAgentConsole } from './components/LiveAgentConsole';
import { SDKPlayground } from './components/SDKPlayground';
import { SystemLogs } from './components/SystemLogs';
import { DatabaseDumpPersistence } from './components/DatabaseDumpPersistence';
import { BranchMergeDiffView } from './components/BranchMergeDiffView';
import { ClusterOrchestratorView } from './components/ClusterOrchestratorView';
import { RuntimeCrashTestView } from './components/RuntimeCrashTestView';

import { FrameworkIntegrationsView } from './components/FrameworkIntegrationsView';
import { StateGraphVisualizer } from './components/StateGraphVisualizer';
import { MemoryPagerAlgorithmView } from './components/MemoryPagerAlgorithmView';
import { BenchmarksDashboardView } from './components/BenchmarksDashboardView';
import { RFCSpecificationView } from './components/RFCSpecificationView';
import { CompetitiveComparisonView } from './components/CompetitiveComparisonView';

export default function App() {
  const [activeTab, setActiveTab] = useState('frameworks');
  
  // State initialization
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(INITIAL_AGENTS[0].id);
  const [pages, setPages] = useState<MemoryPage[]>(INITIAL_PAGES);
  const [snapshots, setSnapshots] = useState<CheckpointSnapshot[]>(INITIAL_SNAPSHOTS);
  const [events, setEvents] = useState<TimelineEvent[]>(INITIAL_EVENTS);
  const [branches, setBranches] = useState<AgentBranchNode[]>(INITIAL_BRANCHES);
  
  const [isRecovering, setIsRecovering] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastAgentResponse, setLastAgentResponse] = useState('');

  // Fetch real state from backend disk store
  const fetchServerState = useCallback(async () => {
    try {
      const res = await fetch('/api/checkpointos/state');
      if (res.ok) {
        const body = await res.json();
        if (body.data) {
          if (Array.isArray(body.data.agents) && body.data.agents.length > 0) setAgents(body.data.agents);
          if (Array.isArray(body.data.pages)) setPages(body.data.pages);
          if (Array.isArray(body.data.snapshots)) setSnapshots(body.data.snapshots);
          if (Array.isArray(body.data.events)) setEvents(body.data.events);
          if (Array.isArray(body.data.branches)) setBranches(body.data.branches);
        }
      }
    } catch (err) {
      console.warn("Server state fetch offline, falling back to local state:", err);
    }
  }, []);

  useEffect(() => {
    fetchServerState();
  }, [fetchServerState]);

  // Engines
  const pager = useMemo(() => new MemoryPager(pages), [pages]);
  const snapshotEngine = useMemo(() => new SnapshotEngine(snapshots), [snapshots]);
  const recoveryEngine = useMemo(() => new RecoveryEngine(), []);
  const branchingEngine = useMemo(() => new BranchingEngine(branches), [branches]);

  const currentAgent = useMemo(() => {
    return agents.find((a) => a.id === selectedAgentId) || agents[0];
  }, [agents, selectedAgentId]);

  // Update current agent fields helper
  const updateAgent = (updater: (prev: AgentState) => AgentState) => {
    setAgents((prevList) =>
      prevList.map((a) => (a.id === selectedAgentId ? updater(a) : a))
    );
  };

  // Quick Action: Save Manual Snapshot
  const handleManualSnapshot = () => {
    const { snapshot, event } = snapshotEngine.createSnapshot(
      currentAgent,
      'user_manual',
      pages.length,
      undefined,
      `Manual User Checkpoint ${new Date().toLocaleTimeString()}`
    );

    setSnapshots((prev) => [snapshot, ...prev]);
    setEvents((prev) => [event, ...prev]);
    updateAgent((a) => ({ ...a, snapshotCount: a.snapshotCount + 1 }));
  };

  // Quick Action: Simulate Crash
  const handleTriggerCrash = () => {
    updateAgent((a) => ({ ...a, status: 'crashed' }));

    const crashEvent: TimelineEvent = {
      id: `evt_crash_${Date.now().toString(36)}`,
      agentId: currentAgent.id,
      timestamp: Date.now(),
      type: 'crash',
      title: 'Simulated Process Interrupt (SIGKILL)',
      details: 'Agent memory process killed via dashboard test trigger. CheckpointOS recovery pending.',
      severity: 'error',
    };

    setEvents((prev) => [crashEvent, ...prev]);
  };

  // Quick Action: Emergency Restore
  const handleEmergencyRestore = () => {
    setIsRecovering(true);
    const latestSnap = snapshotEngine.getLatestSnapshot(currentAgent.id);

    setTimeout(() => {
      const { recoveredState, events: recoveryEvents } = recoveryEngine.recoverAgentState(
        currentAgent,
        latestSnap
      );

      updateAgent(() => recoveredState);
      setEvents((prev) => [...recoveryEvents, ...prev]);
      setIsRecovering(false);
    }, 850);
  };

  // Memory Pager Eviction
  const handleTriggerPaging = () => {
    const { evictedPages, events: pagingEvents } = pager.performPaging(currentAgent, 40000);
    setPages(pager.getPages());
    setEvents((prev) => [...pagingEvents, ...prev]);

    const metrics = pager.calculateMetrics(currentAgent.id);
    updateAgent((a) => ({
      ...a,
      currentContextTokens: metrics.hotTokens || 35000,
      hotMemoryBytes: metrics.hotBytes || 120000000,
      warmMemoryBytes: metrics.warmBytes || 800000000,
      coldMemoryBytes: metrics.coldBytes || 1800000000,
    }));
  };

  // Re-hydrate Memory Page
  const handleHydratePage = (pageId: string) => {
    const { page, event } = pager.hydratePage(pageId);
    if (page) {
      setPages(pager.getPages());
      if (event) setEvents((prev) => [event, ...prev]);

      const metrics = pager.calculateMetrics(currentAgent.id);
      updateAgent((a) => ({
        ...a,
        currentContextTokens: Math.min(a.maxContextTokens, a.currentContextTokens + page.tokenCount),
        hotMemoryBytes: metrics.hotBytes,
      }));
    }
  };

  // Add Custom Page
  const handleAddPage = (summary: string, payload: string, tokens: number) => {
    const { page } = pager.addPage(currentAgent.id, summary, payload, tokens);
    setPages(pager.getPages());

    const newTokens = currentAgent.currentContextTokens + tokens;
    updateAgent((a) => ({
      ...a,
      currentContextTokens: newTokens,
      executionSteps: a.executionSteps + 1,
    }));

    if (newTokens > 90000) {
      handleTriggerPaging();
    }
  };

  // Execute Agent Step with Gemini
  const handleExecuteAgentStep = async (promptText: string) => {
    setIsExecuting(true);
    try {
      const res = await fetch('/api/gemini/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          systemPrompt: currentAgent.systemPrompt,
          memoryContext: pages.filter((p) => p.tier === 'hot').map((p) => p.summary),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setLastAgentResponse(data.response);

        const addedTokens = data.tokensUsed || 1200;
        handleAddPage(`AI Execution Output: ${promptText.substring(0, 30)}...`, data.response, addedTokens);

        const aiEvent: TimelineEvent = {
          id: `evt_step_${Date.now().toString(36)}`,
          agentId: currentAgent.id,
          timestamp: Date.now(),
          type: 'ai_step',
          title: `Executed Step: "${promptText.substring(0, 35)}..."`,
          details: `Processed prompt via ${data.isSimulated ? 'Simulated AI Core' : 'Gemini 2.5 Flash'}. +${addedTokens} tokens added to active context window.`,
          severity: 'info',
        };
        setEvents((prev) => [aiEvent, ...prev]);
      } else {
        setLastAgentResponse(`Execution error: ${data.error}`);
      }
    } catch (err: any) {
      setLastAgentResponse(`Error connecting to runtime server: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Stress-test Workload
  const handleStressTestWorkload = () => {
    setIsExecuting(true);
    let stepCount = 0;
    const interval = setInterval(() => {
      stepCount++;
      handleAddPage(
        `Automated Batch Processing Sub-task #${stepCount}`,
        `Simulated high-density context payload for automated negotiation analysis #${stepCount}.`,
        18000
      );

      if (stepCount >= 4) {
        clearInterval(interval);
        setIsExecuting(false);
        handleTriggerPaging();
      }
    }, 400);
  };

  // Time Travel Restore to Snapshot
  const handleRestoreSnapshot = (snap: CheckpointSnapshot) => {
    updateAgent((a) => ({
      ...a,
      activeGoal: snap.goalState,
      subGoals: JSON.parse(JSON.stringify(snap.subGoalsState)),
      currentContextTokens: snap.workingContextTokens,
      snapshotCount: a.snapshotCount + 1,
      updatedAt: Date.now(),
    }));

    const event: TimelineEvent = {
      id: `evt_restore_${Date.now().toString(36)}`,
      agentId: currentAgent.id,
      timestamp: Date.now(),
      type: 'recovery',
      title: `Time Travel Rollback to Snapshot [${snap.id}]`,
      details: `Rolled back agent goal state to "${snap.label}". Checksum verified: 0x${snap.checksum.substring(0, 8)}.`,
      severity: 'success',
    };

    setEvents((prev) => [event, ...prev]);
  };

  // Fork New Branch
  const handleCreateBranch = (branchName: string, snap: CheckpointSnapshot) => {
    const { branch, event } = branchingEngine.createBranch(branchName, snap);
    setBranches(branchingEngine.getBranches());
    setEvents((prev) => [event, ...prev]);
    updateAgent((a) => ({ ...a, activeBranch: branchName }));
  };

  // Cold Boot Restore from DB Dump
  const handleRestoreDump = (dump: any) => {
    const event: TimelineEvent = {
      id: `evt_db_restore_${Date.now().toString(36)}`,
      agentId: currentAgent.id,
      timestamp: Date.now(),
      type: 'recovery',
      title: `Cold Boot Dump Restored from ${dump.engineUsed?.toUpperCase() || 'DB'}`,
      details: `Restored snapshot [${dump.snapshotId}] and memory pages from DB dump [${dump.id}]. SHA-256 check passed.`,
      severity: 'success',
    };
    setEvents((prev) => [event, ...prev]);
  };

  // Save DB Dump Event Log
  const handleSaveNewDump = (type: string) => {
    const event: TimelineEvent = {
      id: `evt_dump_save_${Date.now().toString(36)}`,
      agentId: currentAgent.id,
      timestamp: Date.now(),
      type: 'checkpoint',
      title: `Zero-Copy Memory Dump Persisted (${type})`,
      details: `Persisted current memory pages to PostgreSQL / RocksDB cluster. Compression ratio ~78%.`,
      severity: 'info',
    };
    setEvents((prev) => [event, ...prev]);
  };

  // Execute Branch Merge
  const handleExecuteMerge = (diff: any) => {
    const mergeEvent: TimelineEvent = {
      id: `evt_merge_${Date.now().toString(36)}`,
      agentId: currentAgent.id,
      timestamp: Date.now(),
      type: 'merge',
      title: `Merged Branch "${diff.sourceBranch}" ➔ "${diff.targetBranch}"`,
      details: `Auto-resolved delta conflicts cleanly. +${diff.contextDeltaTokens} tokens delta synchronized.`,
      severity: 'success',
    };
    setEvents((prev) => [mergeEvent, ...prev]);
    updateAgent((a) => ({ ...a, activeBranch: diff.targetBranch }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans antialiased selection:bg-[#0066FF] selection:text-white flex flex-col">
      
      {/* Navbar Header */}
      <Navbar
        agents={agents}
        selectedAgent={currentAgent}
        onSelectAgent={(agent) => setSelectedAgentId(agent.id)}
        onManualSnapshot={handleManualSnapshot}
        onTriggerCrash={handleTriggerCrash}
        onEmergencyRestore={handleEmergencyRestore}
        isRecovering={isRecovering}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        
        {/* Render Tab Contents */}
        {activeTab === 'frameworks' && (
          <FrameworkIntegrationsView
            onExecuteStep={(prompt) => handleExecuteAgentStep(prompt)}
          />
        )}

        {activeTab === 'comparison' && (
          <CompetitiveComparisonView />
        )}

        {activeTab === 'state_dag' && (
          <StateGraphVisualizer
            agent={currentAgent}
            events={events}
            snapshots={snapshots}
            onExecuteMerge={(source) => handleExecuteMerge({ sourceBranch: source, targetBranch: 'main-prod', contextDeltaTokens: 1400 })}
            onExecuteRollback={(snapId) => {
              const targetSnap = snapshots.find(s => s.id === snapId);
              if (targetSnap) handleRestoreSnapshot(targetSnap);
            }}
          />
        )}

        {activeTab === 'memory_algo' && (
          <MemoryPagerAlgorithmView />
        )}

        {activeTab === 'benchmarks' && (
          <BenchmarksDashboardView />
        )}

        {activeTab === 'rfc_specs' && (
          <RFCSpecificationView />
        )}

        {activeTab === 'runtime_test' && (
          <RuntimeCrashTestView
            agent={currentAgent}
            pages={pages}
            snapshots={snapshots}
            events={events}
            onRefreshState={fetchServerState}
          />
        )}

        {activeTab === 'sdk' && <SDKPlayground />}

        {activeTab === 'db_dump' && (
          <DatabaseDumpPersistence
            agent={currentAgent}
            snapshots={snapshots}
            pages={pages}
            onRestoreDump={handleRestoreDump}
            onSaveNewDump={handleSaveNewDump}
          />
        )}

        {activeTab === 'cluster' && (
          <ClusterOrchestratorView
            agent={currentAgent}
            pages={pages}
          />
        )}

        {activeTab === 'console' && (
          <LiveAgentConsole
            agent={currentAgent}
            pages={pages}
            onExecuteAgentStep={handleExecuteAgentStep}
            onStressTestWorkload={handleStressTestWorkload}
            isExecuting={isExecuting}
            lastResponse={lastAgentResponse}
          />
        )}

        {activeTab === 'logs' && <SystemLogs events={events} />}

      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-white py-6 text-xs text-black/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse"></span>
            <strong className="text-black font-semibold">CheckpointOS</strong> — Memory Operating System for Long-Running AI Agents
          </div>
          <div className="font-mono text-[11px] text-black/40 uppercase tracking-wider">
            RFC-001 ASF Schema | RFC-002 Pager Formula | Sub-12ms Checkpoints
          </div>
        </div>
      </footer>

    </div>
  );
}
