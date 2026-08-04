#!/usr/bin/env python3
"""
CheckpointOS LangGraph Integration Working Example
Run via terminal: python3 run_langgraph_example.py

Demonstrates how to attach CheckpointOS to a LangGraph / LangChain execution flow
in 3 lines of code without altering graph node definitions.
"""

from checkpointos import CheckpointOS, LangGraphAdapter

class MockLangGraphApp:
    """Simulated Compiled LangGraph Application."""
    def __init__(self):
        self.nodes = ["parse_clause", "calculate_penalty", "generate_counteroffer"]
        self.state = {"goal": "Negotiate SLA", "status": "initialized"}

    def invoke(self, inputs: dict) -> dict:
        print(f"[LangGraph] Invoking graph execution with input: {inputs}")
        self.state["status"] = "executing"
        self.state["input"] = inputs
        return {"output": f"Processed '{inputs.get('input')}' via LangGraph Nodes", "status": "completed"}

def main():
    print("=================================================================")
    print("      CheckpointOS LangGraph Native Integration Test             ")
    print("=================================================================")

    # 1. Initialize CheckpointOS Runtime (Line 1)
    checkpoint_os = CheckpointOS(
        agent_id="ag-langgraph-prod-01",
        storage_path="./langgraph_checkpointos_store.json"
    )

    # 2. Instantiate LangGraph Adapter (Line 2)
    adapter = LangGraphAdapter(checkpoint_os)

    # 3. Attach CheckpointOS state persistence to compiled graph (Line 3)
    graph_app = MockLangGraphApp()
    checkpointed_graph = adapter.attach(graph_app)

    # Run graph execution under CheckpointOS memory paging & crash recovery control
    print("\nExecuting LangGraph workflow...")
    result = checkpointed_graph.invoke({"input": "Review Clause 18.2 Liability Cap"})
    
    # Save safety snapshot
    snap_id = checkpoint_os.save_checkpoint("Post-LangGraph Execution Snapshot")

    print("\n-----------------------------------------------------------------")
    print(f"Result Output : {result}")
    print(f"Checkpoint ID : [{snap_id}]")
    print(f"Active Goal   : {checkpoint_os.state['goalGraph']['activeGoal']}")
    print("=================================================================\n")

if __name__ == "__main__":
    main()
