import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Info,
  Clock,
  ShieldCheck,
  Zap,
  RotateCcw
} from 'lucide-react';
import { TimelineEvent, EventSeverity } from '../types';

interface SystemLogsProps {
  events: TimelineEvent[];
}

export const SystemLogs: React.FC<SystemLogsProps> = ({ events }) => {
  const [filterSeverity, setFilterSeverity] = useState<EventSeverity | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredEvents = events.filter((evt) => {
    const matchesSev = filterSeverity === 'all' || evt.severity === filterSeverity;
    const matchesSearch = 
      evt.title.toLowerCase().includes(search.toLowerCase()) ||
      evt.details.toLowerCase().includes(search.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const getSeverityBadge = (sev: EventSeverity) => {
    switch (sev) {
      case 'success':
        return <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold">SUCCESS</span>;
      case 'info':
        return <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-800 border border-blue-200 font-mono font-bold">INFO</span>;
      case 'warning':
        return <span className="px-2 py-0.5 rounded text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold">WARNING</span>;
      case 'error':
        return <span className="px-2 py-0.5 rounded text-[10px] bg-red-50 text-red-800 border border-red-200 font-mono font-bold">CRITICAL</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white border border-black/10 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-xl font-light text-black flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#0066FF]" />
            CheckpointOS Kernel Event Log
          </h2>
          <p className="text-xs text-black/50 mt-0.5">
            Audit log of snapshot creations, memory pager evictions, and crash recovery cycles.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-black/40 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search kernel events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#F8F9FA] border border-black/10 rounded-md pl-8 pr-3 py-1.5 text-xs text-black placeholder:text-black/40 focus:outline-none focus:border-[#0066FF] transition font-sans"
            />
          </div>

          {/* Severity filter */}
          <div className="flex items-center gap-1 bg-[#F8F9FA] p-1 rounded-md border border-black/10 text-xs font-mono">
            {(['all', 'info', 'success', 'warning', 'error'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded capitalize font-semibold tracking-wider transition ${
                  filterSeverity === sev
                    ? 'bg-[#0066FF] text-white'
                    : 'text-black/60 hover:text-black hover:bg-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white border border-black/10 rounded-lg p-6 font-mono text-xs space-y-3 shadow-2xs">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="p-4 rounded-md bg-[#F8F9FA] border border-black/10 hover:border-black/30 transition space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-black/40 font-mono">[{new Date(evt.timestamp).toLocaleTimeString()}]</span>
                <span className="font-semibold text-black text-xs font-sans">{evt.title}</span>
                {getSeverityBadge(evt.severity)}
              </div>
              <span className="text-[10px] text-black/40 font-mono">ID: {evt.id}</span>
            </div>

            <p className="text-black/70 text-[11px] leading-relaxed font-sans">
              {evt.details}
            </p>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="py-12 text-center text-black/40 font-sans text-xs">
            No system log events match your filter criteria.
          </div>
        )}
      </div>

    </div>
  );
};
