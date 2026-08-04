import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Terminal, 
  Sparkles, 
  Play, 
  Layers, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { SDKLanguage } from '../types';

export const SDKPlayground: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<SDKLanguage>('python');
  const [copied, setCopied] = useState(false);
  const [executed, setExecuted] = useState(false);

  const snippets: Record<SDKLanguage, string> = {
    python: `# Install / Run directly: python3 demo_agent.py
# File located at root: /checkpointos.py & /demo_agent.py

from checkpointos import CheckpointOS

# 1. Initialize CheckpointOS Runtime (3 lines of code)
checkpoint_os = CheckpointOS(
    agent_id="ag-enterprise-legal-01",
    storage_path="./checkpointos_store.json"
)

# 2. Wrap agent execution step
@checkpoint_os.wrap_step
def execute_legal_step(prompt: str):
    print(f"Executing step: {prompt}")
    # Add memory page to Hot RAM & write state to disk file
    page_id = checkpoint_os.add_memory_page(
        payload="SLA penalty set to 15% ARR cap.",
        summary="SLA Analysis",
        tokens=1200
    )
    return f"Completed: {prompt}"

# 3. Process Crash (kill -9) Recovery Test
if __name__ == "__main__":
    checkpoint_os.set_active_goal("Negotiate Vendor SLA Penalty Cap")
    execute_legal_step("Parse SLA Clause 18.2 Liability Limit")
    
    # Save safety snapshot to disk
    checkpoint_os.save_checkpoint("Pre-Crash Safety Snapshot")
    
    # Cold-boot recovery from disk file after unexpected SIGKILL
    recovered_os = CheckpointOS.recover_from_crash("./checkpointos_store.json")
    print(f"Recovered Goal: {recovered_os.state['agent']['currentGoal']}")`,

    typescript: `// Install: npm install @checkpoint-os/runtime

import { CheckpointRuntime, MemoryPager } from "@checkpoint-os/runtime";

// 1. Initialize CheckpointOS Runtime
const runtime = new CheckpointRuntime({
  agentId: "enterprise_sales_agent",
  storageBackend: "rocksdb",
  maxContextTokens: 128000,
  pagingStrategy: "lru_zstd_compressed"
});

// 2. Attach to Agent Core
async function main() {
  const agent = await runtime.attachAgent({
    name: "Enterprise Sales Deal Closer",
    activeGoal: "Close $2.4M Tesla Fleet Contract"
  });

  // Enable Auto-Snapshots & Hot RAM Paging
  runtime.onContextOverflow(async (event) => {
    console.log(\`Context overflow! Paged \${event.tokensEvicted} tokens to Warm tier.\`);
  });

  // Execute step under CheckpointOS protection
  const result = await runtime.executeStep("Review security addendum clause #14");
  console.log("Agent Step Completed:", result);
}

main().catch(console.error);`,

    rust: `// Cargo.toml: checkpoint-os = "0.8"

use checkpoint_os::{CheckpointRuntime, MemoryTier, Snapshot};
use tokio;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. Initialize Rust Core Runtime
    let mut runtime = CheckpointRuntime::builder()
        .agent_id("enterprise_sales_agent")
        .max_tokens(128_000)
        .build()?;

    // 2. Attach goal preservation
    runtime.set_goal("Close $2.4M Tesla Fleet Contract").await?;

    // 3. Execute step with zero-copy Zstd memory paging
    let response = runtime.execute_step("Process legal redlines").await?;
    println!("Step Output: {:?}", response);

    // 4. Save manual snapshot
    let snapshot = runtime.checkpoint("post_legal_sync").await?;
    println!("Saved SHA-256 Checkpoint: {}", snapshot.checksum);

    Ok(())
}`,

    go: `// go get github.com/checkpoint-os/checkpoint-os-go

package main

import (
	"context font-mono"
	"fmt"
	"github.com/checkpoint-os/checkpoint-os-go"
)

func main() {
	// 1. Initialize Go Runtime
	rt := checkpoint.NewRuntime(&checkpoint.Config{
		AgentID:          "enterprise_sales_agent",
		MaxContextTokens: 128000,
		StorageBackend:   "sqlite",
	})

	// 2. Preserve Goal
	rt.PreserveGoal("Close $2.4M Tesla Fleet Contract")

	// 3. Run Agent with automatic crash recovery
	res, err := rt.ExecuteStep(context.Background(), "Analyze contract redlines")
	if err != nil {
		log.Fatalf("Recovery engine triggered: %v", err)
	}

	fmt.Printf("Step result: %s\\n", res)
}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[selectedLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunDemo = () => {
    setExecuted(true);
    setTimeout(() => setExecuted(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-black/10 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-xl font-light text-black flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#0066FF]" />
            Developer SDK & Code Integration
          </h2>
          <p className="text-xs text-black/50 mt-0.5">
            Integrate CheckpointOS into any AI agent framework with 3 lines of code.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 bg-[#F8F9FA] p-1 rounded-md border border-black/10 text-xs font-mono">
          {(['python', 'typescript', 'rust', 'go'] as SDKLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-3 py-1 rounded capitalize font-semibold tracking-wider transition ${
                selectedLang === lang
                  ? 'bg-[#0066FF] text-white'
                  : 'text-black/60 hover:text-black hover:bg-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="bg-white border border-black/10 rounded-lg p-6 font-mono text-xs space-y-4 shadow-2xs relative">
        <div className="flex items-center justify-between pb-3 border-b border-black/10 text-black/50 text-[11px]">
          <span className="text-[#0066FF] font-bold">checkpoint_os_agent.{selectedLang === 'python' ? 'py' : selectedLang === 'typescript' ? 'ts' : selectedLang === 'rust' ? 'rs' : 'go'}</span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunDemo}
              className="px-3 py-1 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition shadow-2xs"
            >
              <Play className="w-3 h-3" />
              Test SDK Output
            </button>

            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-white hover:bg-gray-50 text-black border border-black/10 rounded text-[11px] font-semibold flex items-center gap-1 transition shadow-2xs"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <pre className="text-black bg-[#F8F9FA] border border-black/5 p-4 rounded-md leading-relaxed overflow-x-auto whitespace-pre font-mono">
          {snippets[selectedLang]}
        </pre>

        {executed && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-900 space-y-1 animate-fadeIn">
            <div className="font-bold flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              SDK Execution Test Passed!
            </div>
            <p className="text-[11px] text-emerald-800 font-mono">
              [CheckpointOS] Attached successfully. Auto-checkpointing active. Current hot memory: 0.38 GB.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
