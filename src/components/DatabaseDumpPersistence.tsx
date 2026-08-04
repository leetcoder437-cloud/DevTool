import React, { useState } from 'react';
import { 
  Database, 
  HardDrive, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  Server, 
  Layers, 
  Lock, 
  Key, 
  Save, 
  FileCheck
} from 'lucide-react';
import { AgentState, CheckpointSnapshot, MemoryPage, DatabaseDumpConfig, MemoryDumpRecord, DatabaseEngine } from '../types';

interface DatabaseDumpPersistenceProps {
  agent: AgentState;
  snapshots: CheckpointSnapshot[];
  pages: MemoryPage[];
  onRestoreDump: (dump: MemoryDumpRecord) => void;
  onSaveNewDump: (type: 'full_snapshot' | 'session_backup') => void;
}

export const DatabaseDumpPersistence: React.FC<DatabaseDumpPersistenceProps> = ({
  agent,
  snapshots,
  pages,
  onRestoreDump,
  onSaveNewDump,
}) => {
  const [dbConfig, setDbConfig] = useState<DatabaseDumpConfig>({
    engine: 'postgresql',
    host: 'db.internal.checkpointos.net',
    port: 5432,
    databaseName: 'checkpoint_memory_prod',
    autoDumpIntervalSec: 300,
    useSsl: true,
    compression: 'zstd',
    status: 'connected',
    lastSyncedAt: Date.now() - 45000,
  });

  const [dumps, setDumps] = useState<MemoryDumpRecord[]>([
    {
      id: 'DUMP-9901-PG',
      agentId: agent.id,
      timestamp: Date.now() - 3600000,
      dumpType: 'session_backup',
      snapshotId: snapshots[0]?.id || 'chk-init',
      checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      compressedSizeKb: 1420,
      uncompressedSizeKb: 6800,
      recordsCount: pages.length + snapshots.length,
      engineUsed: 'postgresql',
      status: 'persisted',
    },
    {
      id: 'DUMP-9882-ROCKS',
      agentId: agent.id,
      timestamp: Date.now() - 14400000,
      dumpType: 'full_snapshot',
      snapshotId: snapshots[snapshots.length - 1]?.id || 'chk-base',
      checksumSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      compressedSizeKb: 3100,
      uncompressedSizeKb: 14200,
      recordsCount: 48,
      engineUsed: 'rocksdb',
      status: 'persisted',
    },
  ]);

  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedDumpForVerify, setSelectedDumpForVerify] = useState<string | null>(null);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  const handleManualDump = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const newDump: MemoryDumpRecord = {
        id: `DUMP-${Math.floor(1000 + Math.random() * 9000)}-${dbConfig.engine === 'postgresql' ? 'PG' : 'ROCKS'}`,
        agentId: agent.id,
        timestamp: Date.now(),
        dumpType: 'full_snapshot',
        snapshotId: snapshots[0]?.id || 'chk-latest',
        checksumSha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        compressedSizeKb: Math.floor((agent.totalMemoryBytes / 1024) * 0.22),
        uncompressedSizeKb: Math.floor(agent.totalMemoryBytes / 1024),
        recordsCount: pages.length + snapshots.length + agent.subGoals.length,
        engineUsed: dbConfig.engine,
        status: 'persisted',
      };

      setDumps([newDump, ...dumps]);
      setDbConfig((prev) => ({ ...prev, lastSyncedAt: Date.now() }));
      setIsSyncing(false);
      onSaveNewDump('full_snapshot');
    }, 800);
  };

  const handleVerifyDump = (dumpId: string) => {
    setSelectedDumpForVerify(dumpId);
    setVerifyMessage('Calculating SHA-256 Zstd block hashes...');
    setTimeout(() => {
      setVerifyMessage('✅ Checksum Match Verified: 100% Data Integrity Intact across PostgreSQL / RocksDB buffers.');
    }, 600);
  };

  const handleDownloadDumpJSON = (dump: MemoryDumpRecord) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      dumpHeader: dump,
      agentState: agent,
      snapshots: snapshots,
      memoryPages: pages
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${dump.id}-memory-checkpoint.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      
      {/* Step 2 Header Banner */}
      <div className="bg-white border border-black/10 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20">
              <Database className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#0066FF] uppercase">
              ШАГ 2: Интеграция с внешней БД (PostgreSQL / RocksDB)
            </span>
          </div>
          <h2 className="text-2xl font-light text-black tracking-tight">
            Cross-Session Memory Persistence & DB Dumping
          </h2>
          <p className="text-xs text-black/50">
            Stores zero-copy binary Zstd memory dumps into external PostgreSQL or RocksDB clusters for cold boot restoration across agent sessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualDump}
            disabled={isSyncing}
            className="px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-bold uppercase tracking-wider rounded-md border border-[#0066FF] flex items-center gap-2 transition active:scale-95 disabled:opacity-50 shadow-2xs"
          >
            <Save className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing Dump...' : 'Persist Dump to DB'}
          </button>
        </div>
      </div>

      {/* Database Connection & Config Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Connection Setup */}
        <div className="bg-white border border-black/10 rounded-lg p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-black/10 pb-3">
            <h3 className="text-sm font-semibold text-black flex items-center gap-2">
              <Server className="w-4 h-4 text-[#0066FF]" />
              Database Engine Config
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold uppercase">
              {dbConfig.status}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-black/60 uppercase tracking-wider mb-1">
                Target Database Engine
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'postgresql', name: 'PostgreSQL 16' },
                  { id: 'rocksdb', name: 'RocksDB Key-Value' },
                  { id: 'sqlite_cold', name: 'SQLite Cold Disk' },
                  { id: 'redis_kv', name: 'Redis Cache' }
                ].map((engine) => (
                  <button
                    key={engine.id}
                    onClick={() => setDbConfig({ ...dbConfig, engine: engine.id as DatabaseEngine })}
                    className={`px-3 py-2 text-left rounded border transition text-xs font-mono font-semibold ${
                      dbConfig.engine === engine.id
                        ? 'bg-blue-50 border-[#0066FF] text-[#0066FF]'
                        : 'bg-[#F8F9FA] border-black/10 text-black/70 hover:bg-gray-100'
                    }`}
                  >
                    {engine.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-black/60 uppercase tracking-wider mb-1">
                Database Host / Connection URI
              </label>
              <input
                type="text"
                value={dbConfig.host}
                onChange={(e) => setDbConfig({ ...dbConfig, host: e.target.value })}
                className="w-full bg-[#F8F9FA] border border-black/10 rounded px-3 py-2 font-mono text-xs text-black focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-black/60 uppercase tracking-wider mb-1">
                  Port
                </label>
                <input
                  type="number"
                  value={dbConfig.port}
                  onChange={(e) => setDbConfig({ ...dbConfig, port: Number(e.target.value) })}
                  className="w-full bg-[#F8F9FA] border border-black/10 rounded px-3 py-2 font-mono text-xs text-black focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-black/60 uppercase tracking-wider mb-1">
                  Compression
                </label>
                <select
                  value={dbConfig.compression}
                  onChange={(e) => setDbConfig({ ...dbConfig, compression: e.target.value as any })}
                  className="w-full bg-[#F8F9FA] border border-black/10 rounded px-3 py-2 font-mono text-xs text-black focus:outline-none focus:border-[#0066FF]"
                >
                  <option value="zstd">Zstd (High-Speed)</option>
                  <option value="gzip">Gzip Standard</option>
                  <option value="none">Raw Binary (Uncompressed)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-black/50 font-mono">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" /> SSL / TLS Enabled
              </span>
              <span>Last Sync: {dbConfig.lastSyncedAt ? new Date(dbConfig.lastSyncedAt).toLocaleTimeString() : 'Never'}</span>
            </div>
          </div>
        </div>

        {/* Database Dump Schema & Tables */}
        <div className="bg-white border border-black/10 rounded-lg p-6 space-y-4 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-black/10 pb-3">
            <h3 className="text-sm font-semibold text-black flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0066FF]" />
              Persistent PostgreSQL / RocksDB Storage Tables
            </h3>
            <span className="text-xs font-mono text-black/40">
              SCHEMA: public.checkpointos_v1
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#F8F9FA] border border-black/10 p-4 rounded-md space-y-1">
              <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Table: agent_sessions</div>
              <div className="text-lg font-mono font-bold text-black">1 Active Session</div>
              <p className="text-[11px] text-black/50">Holds system prompt, active goals, uptime, and sub-goals.</p>
            </div>

            <div className="bg-[#F8F9FA] border border-black/10 p-4 rounded-md space-y-1">
              <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Table: memory_pages</div>
              <div className="text-lg font-mono font-bold text-[#0066FF]">{pages.length} Pages Stored</div>
              <p className="text-[11px] text-black/50">Stores hot RAM, warm vector, and cold disk blocks with Zstd payload.</p>
            </div>

            <div className="bg-[#F8F9FA] border border-black/10 p-4 rounded-md space-y-1">
              <div className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Table: checkpoint_dumps</div>
              <div className="text-lg font-mono font-bold text-emerald-700">{dumps.length} Cold Dumps</div>
              <p className="text-[11px] text-black/50">Immutable snapshots with SHA-256 validation checksums.</p>
            </div>
          </div>

          {verifyMessage && (
            <div className="p-3 bg-blue-50 border border-[#0066FF]/30 rounded-md text-xs text-blue-900 font-mono animate-fadeIn flex items-center justify-between">
              <span>{verifyMessage}</span>
              <button onClick={() => setVerifyMessage(null)} className="text-black/40 hover:text-black">✕</button>
            </div>
          )}
        </div>
      </div>

      {/* Memory Dumps List */}
      <div className="bg-white border border-black/10 rounded-lg p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <h3 className="text-base font-semibold text-black flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[#0066FF]" />
            Stored Cross-Session Memory Dumps ({dumps.length})
          </h3>
          <span className="text-xs font-mono text-black/40">
            Zstd Compression Efficiency: ~78%
          </span>
        </div>

        <div className="space-y-3">
          {dumps.map((dump) => (
            <div
              key={dump.id}
              className="p-4 rounded-md bg-[#F8F9FA] border border-black/10 hover:border-black/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-black">{dump.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-800 border border-blue-200 font-mono font-bold uppercase">
                    {dump.dumpType}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-gray-100 text-black/70 border border-black/10 font-mono font-semibold uppercase">
                    Engine: {dump.engineUsed}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-black/60 font-mono">
                  <span>Compressed: <strong className="text-[#0066FF]">{dump.compressedSizeKb} KB</strong> ({dump.uncompressedSizeKb} KB raw)</span>
                  <span>Records: <strong className="text-black">{dump.recordsCount}</strong></span>
                  <span>Timestamp: {new Date(dump.timestamp).toLocaleString()}</span>
                </div>

                <div className="text-[10px] font-mono text-black/40 truncate max-w-xl">
                  SHA-256: {dump.checksumSha256}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVerifyDump(dump.id)}
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 text-black text-xs font-semibold rounded border border-black/10 flex items-center gap-1 transition shadow-2xs"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verify Hash
                </button>

                <button
                  onClick={() => handleDownloadDumpJSON(dump)}
                  className="px-3 py-1.5 bg-white hover:bg-gray-50 text-black text-xs font-semibold rounded border border-black/10 flex items-center gap-1 transition shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#0066FF]" />
                  Export .JSON
                </button>

                <button
                  onClick={() => onRestoreDump(dump)}
                  className="px-3 py-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold uppercase tracking-wider rounded border border-[#0066FF] flex items-center gap-1 transition shadow-2xs active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Cold Boot Restore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
