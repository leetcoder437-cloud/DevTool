import { AgentBranchNode, CheckpointSnapshot, TimelineEvent } from "../types";

export class BranchingEngine {
  private branches: Map<string, AgentBranchNode> = new Map();

  constructor(initialBranches: AgentBranchNode[] = []) {
    initialBranches.forEach((b) => this.branches.set(b.id, b));
  }

  public getBranches(): AgentBranchNode[] {
    return Array.from(this.branches.values());
  }

  public createBranch(
    branchName: string,
    snapshot: CheckpointSnapshot,
    parentBranchId?: string
  ): { branch: AgentBranchNode; event: TimelineEvent } {
    const id = `branch_${Math.random().toString(36).substring(2, 9)}`;
    const commitHash = Math.random().toString(36).substring(2, 10);
    const now = Date.now();

    const branch: AgentBranchNode = {
      id,
      name: branchName,
      parentBranchId,
      createdAt: now,
      status: 'active',
      snapshotId: snapshot.id,
      commitHash,
    };

    this.branches.set(id, branch);

    const event: TimelineEvent = {
      id: `evt_branch_${now.toString(36)}`,
      agentId: snapshot.agentId,
      timestamp: now,
      type: 'branch',
      title: `Forked Execution Branch "${branchName}"`,
      details: `Created new timeline branch from Checkpoint #${snapshot.id}. Commit: ${commitHash}.`,
      severity: 'info',
      metadata: { branchId: id, snapshotId: snapshot.id },
    };

    return { branch, event };
  }

  public mergeBranch(
    sourceBranchId: string,
    targetBranchId: string,
    agentId: string
  ): { event: TimelineEvent } {
    const source = this.branches.get(sourceBranchId);
    const target = this.branches.get(targetBranchId);

    if (source) {
      source.status = 'merged';
    }

    const now = Date.now();
    const event: TimelineEvent = {
      id: `evt_merge_${now.toString(36)}`,
      agentId,
      timestamp: now,
      type: 'merge',
      title: `Merged Branch "${source?.name || sourceBranchId}" -> "${target?.name || targetBranchId}"`,
      details: `State stateful memory diff merged into target branch. Conflict detection: 0 conflicts.`,
      severity: 'success',
    };

    return { event };
  }
}
