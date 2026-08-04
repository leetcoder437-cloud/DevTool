import React, { useState } from 'react';
import { 
  Network, 
  Cpu, 
  Server, 
  Plus, 
  Activity, 
  RefreshCw, 
  Zap, 
  ArrowRightLeft, 
  CheckCircle2, 
  Radio, 
  Globe, 
  Layers
} from 'lucide-react';
import { AgentState, MemoryPage, MicroserviceNode, ClusterMessageBus } from '../types';

interface ClusterOrchestratorViewProps {
  agent: AgentState;
  pages: MemoryPage[];
}

export const ClusterOrchestratorView: React.FC<ClusterOrchestratorViewProps> = ({
  agent,
  pages,
}) => {
  const [nodes, setNodes] = useState<MicroserviceNode[]>([
    {
      id: 'NODE-01-ORCH',
      nodeName: 'orchestrator-leader-01',
      region: 'us-east-1a (N. Virginia)',
      role: 'orchestrator',
      status: 'online',
      cpuUsagePct: 24,
      memoryUsageMb: 1024,
      maxMemoryMb: 4096,
      activeAgentsCount: 1,
      assignedPageIds: pages.slice(0, 2).map((p) => p.id),
      grpcLatencyMs: 1.8,
      ipAddress: '10.240.0.12',
    },
    {
      id: 'NODE-02-WORKER',
      nodeName: 'agent-worker-02',
      region: 'us-east-1b (N. Virginia)',
      role: 'worker',
      status: 'online',
      cpuUsagePct: 68,
      memoryUsageMb: 2840,
      maxMemoryMb: 4096,
      activeAgentsCount: 2,
      assignedPageIds: pages.slice(2, 5).map((p) => p.id),
      grpcLatencyMs: 3.2,
      ipAddress: '10.240.0.18',
    },
    {
      id: 'NODE-03-WORKER',
      nodeName: 'agent-worker-03',
      region: 'eu-west-1a (Ireland)',
      role: 'worker',
      status: 'online',
      cpuUsagePct: 42,
      memoryUsageMb: 1890,
      maxMemoryMb: 4096,
      activeAgentsCount: 1,
      assignedPageIds: pages.slice(5).map((p) => p.id),
      grpcLatencyMs: 28.5,
      ipAddress: '10.240.4.88',
    },
    {
      id: 'NODE-04-PAGER',
      nodeName: 'memory-pager-sidecar',
      region: 'us-east-1a (N. Virginia)',
      role: 'pager_sidecar',
      status: 'online',
      cpuUsagePct: 15,
      memoryUsageMb: 850,
      maxMemoryMb: 8192,
      activeAgentsCount: 0,
      assignedPageIds: [],
      grpcLatencyMs: 0.9,
      ipAddress: '10.240.0.99',
    },
  ]);

  const [messageBus, setMessageBus] = useState<ClusterMessageBus[]>([
    {
      id: 'BUS-901',
      timestamp: Date.now() - 12000,
      fromNodeId: 'NODE-01-ORCH',
      toNodeId: 'NODE-02-WORKER',
      action: 'task_delegation',
      payloadSummary: 'Delegated sub-goal task: Review SLA contract parameters',
      latencyMs: 2.1,
    },
    {
      id: 'BUS-902',
      timestamp: Date.now() - 42000,
      fromNodeId: 'NODE-02-WORKER',
      toNodeId: 'NODE-04-PAGER',
      action: 'page_migration',
      payloadSummary: 'Migrated cold memory page #P-892 to RocksDB Sidecar buffer',
      latencyMs: 1.4,
    },
    {
      id: 'BUS-903',
      timestamp: Date.now() - 85000,
      fromNodeId: 'NODE-03-WORKER',
      toNodeId: 'NODE-01-ORCH',
      action: 'checkpoint_broadcast',
      payloadSummary: 'Broadcasted checkpoint snapshot #chk-8831 to orchestrator',
      latencyMs: 29.1,
    },
  ]);

  const [isAddingNode, setIsAddingNode] = useState(false);
  const [migrationStatusMsg, setMigrationStatusMsg] = useState<string | null>(null);

  const handleAddWorkerNode = () => {
    setIsAddingNode(true);
    setTimeout(() => {
      const newNode: MicroserviceNode = {
        id: `NODE-0${nodes.length + 1}-WORKER`,
        nodeName: `agent-worker-0${nodes.length + 1}`,
        region: 'ap-south-1a (Mumbai)',
        role: 'worker',
        status: 'online',
        cpuUsagePct: 8,
        memoryUsageMb: 512,
        maxMemoryMb: 4096,
        activeAgentsCount: 0,
        assignedPageIds: [],
        grpcLatencyMs: 64.2,
        ipAddress: `10.240.8.${Math.floor(10 + Math.random() * 80)}`,
      };

      setNodes([...nodes, newNode]);
      setIsAddingNode(false);
      setMessageBus([
        {
          id: `BUS-${Math.floor(100 + Math.random() * 900)}`,
          timestamp: Date.now(),
          fromNodeId: 'NODE-01-ORCH',
          toNodeId: newNode.id,
          action: 'state_heartbeat',
          payloadSummary: `Spawned new microservice worker instance [${newNode.nodeName}]`,
          latencyMs: 3.5,
        },
        ...messageBus,
      ]);
    }, 800);
  };

  const handleMigratePage = (pageId: string, fromNodeId: string, toNodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === fromNodeId) {
          return { ...n, assignedPageIds: n.assignedPageIds.filter((id) => id !== pageId) };
        }
        if (n.id === toNodeId) {
          return { ...n, assignedPageIds: [...n.assignedPageIds, pageId] };
        }
        return n;
      })
    );

    const fromNode = nodes.find((n) => n.id === fromNodeId)?.nodeName || fromNodeId;
    const toNode = nodes.find((n) => n.id === toNodeId)?.nodeName || toNodeId;

    setMigrationStatusMsg(`✅ Memory Page #${pageId} zero-copy migrated from ${fromNode} to ${toNode} via gRPC in 2.4ms.`);
    
    setMessageBus([
      {
        id: `BUS-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: Date.now(),
        fromNodeId,
        toNodeId,
        action: 'page_migration',
        payloadSummary: `Live zero-copy migration of Page #${pageId}`,
        latencyMs: 2.4,
      },
      ...messageBus,
    ]);
  };

  return (
    <div className="space-y-6">
      
      {/* Step 4 Header Banner */}
      <div className="bg-white border border-black/10 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20">
              <Network className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#0066FF] uppercase">
              ШАГ 4: Оптимизация распределенного запуска нескольких агентов в микросервисах
            </span>
          </div>
          <h2 className="text-2xl font-light text-black tracking-tight">
            Distributed Microservices Cluster Orchestrator
          </h2>
          <p className="text-xs text-black/50">
            Multi-agent load balancing, zero-copy gRPC page migrations, and real-time cluster memory replication.
          </p>
        </div>

        <button
          onClick={handleAddWorkerNode}
          disabled={isAddingNode}
          className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold uppercase tracking-wider rounded-md border border-[#0066FF] flex items-center gap-2 transition active:scale-95 disabled:opacity-50 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          {isAddingNode ? 'Provisioning Node...' : 'Spawn Worker Node'}
        </button>
      </div>

      {migrationStatusMsg && (
        <div className="p-4 bg-blue-50 border border-[#0066FF]/30 rounded-md text-xs font-mono text-blue-900 flex items-center justify-between shadow-2xs animate-fadeIn">
          <span>{migrationStatusMsg}</span>
          <button onClick={() => setMigrationStatusMsg(null)} className="text-black/40 hover:text-black">✕</button>
        </div>
      )}

      {/* Cluster Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-black/10 rounded-lg p-5 space-y-1 shadow-2xs">
          <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Cluster Instances</div>
          <div className="text-2xl font-mono font-bold text-black">{nodes.length} Microservices</div>
          <p className="text-[11px] text-emerald-700 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> All Nodes Healthy
          </p>
        </div>

        <div className="bg-white border border-black/10 rounded-lg p-5 space-y-1 shadow-2xs">
          <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider">gRPC Cluster Latency</div>
          <div className="text-2xl font-mono font-bold text-[#0066FF]">~2.1 ms</div>
          <p className="text-[11px] text-black/50 font-mono">Zero-copy state replication</p>
        </div>

        <div className="bg-white border border-black/10 rounded-lg p-5 space-y-1 shadow-2xs">
          <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Memory Pages Distributed</div>
          <div className="text-2xl font-mono font-bold text-purple-700">{pages.length} Pages</div>
          <p className="text-[11px] text-black/50 font-mono">Load factor balanced across nodes</p>
        </div>

        <div className="bg-white border border-black/10 rounded-lg p-5 space-y-1 shadow-2xs">
          <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Cluster CPU Load</div>
          <div className="text-2xl font-mono font-bold text-black">
            {Math.round(nodes.reduce((acc, n) => acc + n.cpuUsagePct, 0) / nodes.length)}% Avg
          </div>
          <p className="text-[11px] text-black/50 font-mono">Autoscaling threshold: 85%</p>
        </div>
      </div>

      {/* Cluster Nodes List */}
      <div className="bg-white border border-black/10 rounded-lg p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <h3 className="text-base font-semibold text-black flex items-center gap-2">
            <Server className="w-5 h-5 text-[#0066FF]" />
            Active Cluster Microservice Nodes ({nodes.length})
          </h3>
          <span className="text-xs font-mono text-black/40 uppercase tracking-wider">
            gRPC Service Mesh Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="p-5 rounded-md bg-[#F8F9FA] border border-black/10 space-y-3 shadow-2xs hover:border-black/30 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-black">{node.nodeName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-800 border border-blue-200 font-mono font-bold uppercase">
                      {node.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-black/50 font-mono flex items-center gap-1 mt-0.5">
                    <Globe className="w-3 h-3 text-black/40" /> {node.region} ({node.ipAddress})
                  </div>
                </div>

                <div className="text-right font-mono text-[11px]">
                  <span className="text-emerald-700 font-bold block">Latency: {node.grpcLatencyMs}ms</span>
                  <span className="text-black/40">Status: {node.status}</span>
                </div>
              </div>

              {/* Resource Bars */}
              <div className="space-y-2 pt-1 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-[10px] text-black/60 mb-1">
                    <span>CPU Core Load ({node.cpuUsagePct}%)</span>
                    <span>{node.cpuUsagePct > 70 ? 'High Load' : 'Normal'}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${node.cpuUsagePct > 70 ? 'bg-amber-600' : 'bg-[#0066FF]'}`}
                      style={{ width: `${node.cpuUsagePct}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-black/60 mb-1">
                    <span>RAM Utilization ({node.memoryUsageMb} MB / {node.maxMemoryMb} MB)</span>
                    <span>{Math.round((node.memoryUsageMb / node.maxMemoryMb) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${(node.memoryUsageMb / node.maxMemoryMb) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Assigned Memory Pages & Migration Action */}
              <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-black/50 text-[11px]">Pages Assigned: </span>
                  <strong className="text-black">{node.assignedPageIds.length > 0 ? node.assignedPageIds.join(', ') : 'None (Standby)'}</strong>
                </div>

                {node.assignedPageIds.length > 0 && nodes.length > 1 && (
                  <button
                    onClick={() => {
                      const targetNode = nodes.find((n) => n.id !== node.id);
                      if (targetNode && node.assignedPageIds[0]) {
                        handleMigratePage(node.assignedPageIds[0], node.id, targetNode.id);
                      }
                    }}
                    className="px-2.5 py-1 bg-white hover:bg-gray-50 text-black border border-black/10 rounded text-[10px] font-semibold flex items-center gap-1 transition shadow-2xs"
                  >
                    <ArrowRightLeft className="w-3 h-3 text-[#0066FF]" />
                    Migrate Page
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cluster gRPC Inter-Node Message Bus */}
      <div className="bg-white border border-black/10 rounded-lg p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <h3 className="text-base font-semibold text-black flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-600" />
            Inter-Node gRPC Message Bus & Heartbeats
          </h3>
          <span className="text-xs font-mono text-black/40">
            Protobuf / gRPC Over TLS
          </span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {messageBus.map((msg) => (
            <div
              key={msg.id}
              className="p-3 bg-[#F8F9FA] border border-black/10 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-black/40">[{new Date(msg.timestamp).toLocaleTimeString()}]</span>
                <span className="font-bold text-black">{msg.fromNodeId}</span>
                <span className="text-black/40">➔</span>
                <span className="font-bold text-[#0066FF]">{msg.toNodeId}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-800 border border-blue-200 font-bold uppercase">
                  {msg.action}
                </span>
                <span className="text-black/80 font-sans text-xs">{msg.payloadSummary}</span>
              </div>

              <span className="text-[10px] text-emerald-700 font-bold shrink-0">
                {msg.latencyMs}ms
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
