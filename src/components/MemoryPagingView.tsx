import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  HardDrive, 
  Cpu, 
  FileBox, 
  Archive, 
  ArrowRightLeft, 
  Plus, 
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { MemoryPage, MemoryTier } from '../types';

interface MemoryPagingViewProps {
  pages: MemoryPage[];
  onHydratePage: (pageId: string) => void;
  onAddPage: (summary: string, payload: string, tokens: number) => void;
  onForceRunPaging: () => void;
}

export const MemoryPagingView: React.FC<MemoryPagingViewProps> = ({
  pages,
  onHydratePage,
  onAddPage,
  onForceRunPaging
}) => {
  const [selectedTier, setSelectedTier] = useState<MemoryTier | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSummary, setNewSummary] = useState('');
  const [newPayload, setNewPayload] = useState('');
  const [newTokens, setNewTokens] = useState(15000);

  const filteredPages = pages.filter((page) => {
    const matchesTier = selectedTier === 'all' || page.tier === selectedTier;
    const matchesSearch = 
      page.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const getTierBadge = (tier: MemoryTier) => {
    switch (tier) {
      case 'hot':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase tracking-wider">HOT RAM</span>;
      case 'warm':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 font-bold uppercase tracking-wider">WARM VECTOR</span>;
      case 'cold':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold uppercase tracking-wider">COLD DISK</span>;
      case 'archive':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-700 border border-purple-200 font-bold uppercase tracking-wider">S3 ARCHIVE</span>;
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSummary.trim()) return;
    onAddPage(newSummary, newPayload || 'Sample memory page content string for CheckpointOS state testing.', newTokens);
    setNewSummary('');
    setNewPayload('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-black/10 p-6 rounded-lg shadow-2xs">
        <div>
          <h2 className="text-xl font-light text-black flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0066FF]" />
            Memory Pager Inspector
          </h2>
          <p className="text-xs text-black/50 mt-0.5">
            Real-time inspection of paged memory blocks. Pager unmaps cold contexts to preserve token budget.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-white hover:bg-gray-50 text-black text-xs font-semibold rounded-md border border-black/10 flex items-center gap-1.5 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#0066FF]" />
            Simulate Memory Alloc
          </button>

          <button
            onClick={onForceRunPaging}
            className="px-3 py-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-white text-xs font-semibold uppercase tracking-wider rounded-md border border-[#0066FF] flex items-center gap-1.5 transition shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5" />
            Eviction Cycle
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Tier selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-black/10 text-xs">
          {[
            { id: 'all', label: 'All Pages' },
            { id: 'hot', label: 'Hot RAM' },
            { id: 'warm', label: 'Warm Vector' },
            { id: 'cold', label: 'Cold Disk' },
            { id: 'archive', label: 'S3 Archive' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTier(tab.id as any)}
              className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider transition ${
                selectedTier === tab.id
                  ? 'bg-[#0066FF] text-white'
                  : 'text-black/60 hover:text-black hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-black/40 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search memory pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-black/10 rounded-md pl-9 pr-3 py-1.5 text-xs text-black placeholder:text-black/40 focus:outline-none focus:border-[#0066FF] transition"
          />
        </div>

      </div>

      {/* Memory Page List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPages.map((page) => (
          <div
            key={page.id}
            className="bg-white border border-black/10 rounded-lg p-5 space-y-3 hover:border-black/30 transition shadow-2xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-black/40 font-bold">#{page.id}</span>
                  {getTierBadge(page.tier)}
                </div>
                <h3 className="text-sm font-semibold text-black leading-snug">
                  {page.summary}
                </h3>
              </div>

              {page.tier !== 'hot' && (
                <button
                  onClick={() => onHydratePage(page.id)}
                  title="Re-hydrate back to Hot Working Memory"
                  className="px-2.5 py-1 bg-white hover:bg-gray-50 text-[#0066FF] text-xs font-semibold rounded border border-black/10 flex items-center gap-1 transition shrink-0 shadow-2xs"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-[#0066FF]" />
                  Re-hydrate
                </button>
              )}
            </div>

            <p className="text-xs text-black/70 bg-[#F8F9FA] p-3 rounded-md border border-black/5 font-mono text-[11px] leading-relaxed line-clamp-3">
              {page.payload}
            </p>

            <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] text-black/50 font-mono">
              <div>
                Tokens: <span className="text-[#0066FF] font-bold">{page.tokenCount.toLocaleString()}</span>
              </div>
              <div>
                Size: <span className="text-black">{page.sizeKb} KB</span>
              </div>
              <div>
                Access Count: <span className="text-emerald-700 font-bold">{page.accessCount}x</span>
              </div>
              <div>
                Comp Ratio: <span className="text-purple-700 font-bold">{Math.round(page.compressionRatio * 100)}%</span>
              </div>
            </div>
          </div>
        ))}

        {filteredPages.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white border border-black/10 rounded-lg">
            <Info className="w-8 h-8 text-black/30 mx-auto mb-2" />
            <p className="text-sm text-black/60 font-medium">No memory pages found in this tier filter.</p>
          </div>
        )}
      </div>

      {/* Modal for adding simulated page */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Allocate Memory Context
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Context Summary / Topic
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Legal Redline Amendments Clause #4"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Raw Payload / Transcript
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed text payload to store in memory..."
                  value={newPayload}
                  onChange={(e) => setNewPayload(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Estimated Token Count ({newTokens.toLocaleString()} tokens)
                </label>
                <input
                  type="range"
                  min="2000"
                  max="45000"
                  step="1000"
                  value={newTokens}
                  onChange={(e) => setNewTokens(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                >
                  Allocate to Hot Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
