import { MemoryPage, MemoryTier, AgentState, TimelineEvent } from "../types";

export class MemoryPager {
  private pages: Map<string, MemoryPage> = new Map();

  constructor(initialPages: MemoryPage[] = []) {
    initialPages.forEach((page) => this.pages.set(page.id, page));
  }

  public getPages(): MemoryPage[] {
    return Array.from(this.pages.values());
  }

  public addPage(
    agentId: string,
    summary: string,
    payload: string,
    estimatedTokens: number
  ): { page: MemoryPage; event?: TimelineEvent } {
    const id = `mem_pg_${Math.random().toString(36).substring(2, 9)}`;
    const sizeKb = Math.ceil(payload.length / 1024) + 1;
    const now = Date.now();

    const newPage: MemoryPage = {
      id,
      agentId,
      tier: 'hot',
      tokenCount: estimatedTokens,
      sizeKb,
      summary,
      payload,
      timestamp: now,
      lastAccessedAt: now,
      accessCount: 1,
      status: 'active',
      compressionRatio: 1.0,
    };

    this.pages.set(id, newPage);

    return { page: newPage };
  }

  /**
   * Run memory paging algorithm to keep Hot Memory under token limits
   */
  public performPaging(
    agentState: AgentState,
    maxHotTokensThreshold = 95000
  ): { evictedPages: MemoryPage[]; events: TimelineEvent[] } {
    const agentPages = Array.from(this.pages.values()).filter(
      (p) => p.agentId === agentState.id
    );

    const hotPages = agentPages.filter((p) => p.tier === 'hot');
    const currentHotTokens = hotPages.reduce((acc, p) => acc + p.tokenCount, 0);

    const evictedPages: MemoryPage[] = [];
    const events: TimelineEvent[] = [];

    if (currentHotTokens > maxHotTokensThreshold) {
      // Sort hot pages by LRU (least recently accessed) and lowest access count
      const sortedHot = [...hotPages].sort(
        (a, b) => a.lastAccessedAt - b.lastAccessedAt || a.accessCount - b.accessCount
      );

      let tokensToEvict = currentHotTokens - (maxHotTokensThreshold * 0.7); // evict down to 70%
      
      for (const page of sortedHot) {
        if (tokensToEvict <= 0) break;

        // Evict Hot -> Warm or Warm -> Cold
        page.tier = 'warm';
        page.status = 'paged';
        page.compressionRatio = 0.42; // Simulated 58% Zstd compression
        page.sizeKb = Math.ceil(page.sizeKb * page.compressionRatio);
        
        tokensToEvict -= page.tokenCount;
        evictedPages.push(page);

        events.push({
          id: `evt_evict_${Math.random().toString(36).substring(2, 9)}`,
          agentId: agentState.id,
          timestamp: Date.now(),
          type: 'eviction',
          title: `Paged Page #${page.id.substring(7)} to Warm Tier`,
          details: `Evicted ${page.tokenCount} tokens (${page.summary.substring(0, 45)}...) from Hot RAM to Compressed Warm Cache.`,
          severity: 'info',
        });
      }
    }

    // Secondary Paging: Move old Warm pages to Cold or Archive
    const warmPages = agentPages.filter((p) => p.tier === 'warm');
    const now = Date.now();
    for (const page of warmPages) {
      if (now - page.lastAccessedAt > 60000) { // older than 60s without access
        page.tier = 'cold';
        page.compressionRatio = 0.22;
        events.push({
          id: `evt_cold_${Math.random().toString(36).substring(2, 9)}`,
          agentId: agentState.id,
          timestamp: now,
          type: 'eviction',
          title: `Migrated Page #${page.id.substring(7)} to Cold Disk`,
          details: `Cold tier migration complete. Compression ratio: 78%.`,
          severity: 'info',
        });
      }
    }

    return { evictedPages, events };
  }

  /**
   * Re-hydrate a paged memory item back into Hot Memory
   */
  public hydratePage(pageId: string): { page: MemoryPage | null; event?: TimelineEvent } {
    const page = this.pages.get(pageId);
    if (!page) return { page: null };

    page.tier = 'hot';
    page.status = 'active';
    page.lastAccessedAt = Date.now();
    page.accessCount += 1;

    const event: TimelineEvent = {
      id: `evt_hyd_${Math.random().toString(36).substring(2, 9)}`,
      agentId: page.agentId,
      timestamp: Date.now(),
      type: 'hydration',
      title: `Re-hydrated Memory Page #${pageId.substring(7)}`,
      details: `Restored ${page.tokenCount} tokens back into Hot Working Memory for active LLM context.`,
      severity: 'success',
    };

    return { page, event };
  }

  public calculateMetrics(agentId: string) {
    const agentPages = Array.from(this.pages.values()).filter((p) => p.agentId === agentId);
    
    let hotBytes = 0;
    let warmBytes = 0;
    let coldBytes = 0;
    let archiveBytes = 0;
    let hotTokens = 0;

    agentPages.forEach((p) => {
      const bytes = p.sizeKb * 1024;
      if (p.tier === 'hot') {
        hotBytes += bytes;
        hotTokens += p.tokenCount;
      } else if (p.tier === 'warm') {
        warmBytes += bytes;
      } else if (p.tier === 'cold') {
        coldBytes += bytes;
      } else {
        archiveBytes += bytes;
      }
    });

    const totalBytes = hotBytes + warmBytes + coldBytes + archiveBytes;

    return {
      totalBytes,
      hotBytes,
      warmBytes,
      coldBytes,
      archiveBytes,
      hotTokens,
      pageCount: agentPages.length,
    };
  }
}
