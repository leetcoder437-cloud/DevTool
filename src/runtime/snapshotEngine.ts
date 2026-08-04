import { CheckpointSnapshot, CheckpointTrigger, AgentState, SubGoal, TimelineEvent } from "../types";

export class SnapshotEngine {
  private snapshots: Map<string, CheckpointSnapshot> = new Map();

  constructor(initialSnapshots: CheckpointSnapshot[] = []) {
    initialSnapshots.forEach((s) => this.snapshots.set(s.id, s));
  }

  public getSnapshots(agentId?: string): CheckpointSnapshot[] {
    const list = Array.from(this.snapshots.values());
    if (!agentId) return list;
    return list.filter((s) => s.agentId === agentId);
  }

  public createSnapshot(
    agentState: AgentState,
    triggerReason: CheckpointTrigger,
    memoryPagesCount: number,
    parentSnapshotId?: string,
    labelOverride?: string
  ): { snapshot: CheckpointSnapshot; event: TimelineEvent } {
    const now = Date.now();
    const id = `chk_${now.toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    
    // Simulate SHA-256 hash
    const checksum = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const label = labelOverride || this.getLabelForTrigger(triggerReason, agentState);

    const rawPayload = JSON.stringify({
      agentState,
      timestamp: now,
      checksum,
    });

    const compressedSizeKb = Math.ceil(rawPayload.length / 1024 / 2.8) + 12; // simulated compressed size

    const snapshot: CheckpointSnapshot = {
      id,
      agentId: agentState.id,
      label,
      timestamp: now,
      triggerReason,
      workingContextTokens: agentState.currentContextTokens,
      goalState: agentState.activeGoal,
      subGoalsState: JSON.parse(JSON.stringify(agentState.subGoals)),
      memoryPagesCount,
      compressedSizeKb,
      checksum,
      parentSnapshotId,
      branchName: agentState.activeBranch || 'main',
      rawStateSnapshot: rawPayload,
    };

    this.snapshots.set(id, snapshot);

    const event: TimelineEvent = {
      id: `evt_chk_${Math.random().toString(36).substring(2, 9)}`,
      agentId: agentState.id,
      timestamp: now,
      type: 'checkpoint',
      title: `Created Snapshot "${label}"`,
      details: `Checksum: 0x${checksum.substring(0, 8)}... | ${snapshot.workingContextTokens} tokens | ${compressedSizeKb} KB compressed payload.`,
      severity: 'success',
      metadata: { snapshotId: id, triggerReason },
    };

    return { snapshot, event };
  }

  private getLabelForTrigger(trigger: CheckpointTrigger, agent: AgentState): string {
    switch (trigger) {
      case 'auto_interval':
        return `Auto Snapshot #${agent.snapshotCount + 1}`;
      case 'context_overflow':
        return `Context Overflow Safety Checkpoint`;
      case 'pre_crash':
        return `Pre-Crash Disaster Snapshot`;
      case 'branch_fork':
        return `Branch Point: ${agent.activeBranch}`;
      case 'goal_achieved':
        return `Goal Milestoned: ${agent.activeGoal.substring(0, 20)}`;
      default:
        return `Manual Checkpoint ${new Date().toLocaleTimeString()}`;
    }
  }

  public getLatestSnapshot(agentId: string): CheckpointSnapshot | null {
    const agentSnaps = this.getSnapshots(agentId).sort((a, b) => b.timestamp - a.timestamp);
    return agentSnaps[0] || null;
  }
}
