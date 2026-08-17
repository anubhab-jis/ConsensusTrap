'use client';

import React, { useState } from 'react';
import { Experiment, AgentResponse } from '@/lib/metrics';
import { 
  AlertTriangle, 
  Users, 
  GitMerge, 
  FileQuestion, 
  HelpCircle, 
  ShieldAlert,
  Scale,
  Download,
  ArrowLeftRight,
  FileJson,
  FileText,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Cpu,
  BrainCircuit
} from 'lucide-react';

interface AgentAnalysisTabProps {
  experiments: Experiment[];
}

export function AgentAnalysisTab({ experiments }: AgentAnalysisTabProps) {
  // Navigation between Single Segment Analysis and Dual-Experiment Comparison Tab
  const [activeTab, setActiveTab] = useState<'segmentation' | 'comparison'>('segmentation');

  // Single Analysis Selector
  const [selectedId, setSelectedId] = useState<string>(
    experiments.length > 0 ? experiments[experiments.length - 1].id : ""
  );

  // Side-by-Side Comparison Selectors
  const [compareIdA, setCompareIdA] = useState<string>(
    experiments.length > 0 ? experiments[experiments.length - 1].id : ""
  );
  const [compareIdB, setCompareIdB] = useState<string>(
    experiments.length > 1 ? experiments[experiments.length - 2].id : (experiments.length > 0 ? experiments[0].id : "")
  );

  const activeId = selectedId || (experiments.length > 0 ? experiments[experiments.length - 1].id : "");
  const selectedExp = experiments.find(e => e.id === activeId);

  // Side-by-side targets
  const expA = experiments.find(e => e.id === compareIdA);
  const expB = experiments.find(e => e.id === compareIdB);

  if (experiments.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center space-y-4" id="analysis-empty">
        <Users className="w-16 h-16 text-slate-300 mx-auto animate-pulse" />
        <h3 className="text-xl font-bold text-slate-900">No Comparative Data</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          The comparative workspace is currently empty. Run multi-agent setups like <strong>INDEPENDENT_3</strong> or load presets in the lab first to unlock this screen.
        </p>
      </div>
    );
  }

  // Exports Logic for Dual Comparison
  const handleExportJSON = () => {
    if (!expA || !expB) return;
    const exportData = {
      comparisonTimestamp: new Date().toISOString(),
      reportTitle: "Dual-Agent Cognitive Reliability Trial Comparison",
      experimentA: {
        id: expA.id,
        timestamp: expA.timestamp,
        condition: expA.condition,
        model: expA.model,
        question: expA.question,
        temperature: expA.temperature,
        repetitions: expA.repetitions,
        metrics: expA.metrics,
        agents: expA.agents
      },
      experimentB: {
        id: expB.id,
        timestamp: expB.timestamp,
        condition: expB.condition,
        model: expB.model,
        question: expB.question,
        temperature: expB.temperature,
        repetitions: expB.repetitions,
        metrics: expB.metrics,
        agents: expB.agents
      },
      deltaMetrics: {
        consensusRateDelta: (expA.metrics.agreementScore * 100) - (expB.metrics.agreementScore * 100),
        avgConfidenceDelta: expA.metrics.avgConfidence - expB.metrics.avgConfidence,
        lexicalDiversityDelta: expA.metrics.diversityScore - expB.metrics.diversityScore,
        agreementScoreDelta: expA.metrics.agreementScore - expB.metrics.agreementScore,
        avgLatencyDelta: expA.metrics.avgLatency - expB.metrics.avgLatency
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `joint_comparison_${expA.id}_vs_${expB.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportMarkdown = () => {
    if (!expA || !expB) return;
    const markdownReport = `# Cognitive Reliability Lab — Comparative Report
Generated: ${new Date().toLocaleString()}

## 📊 Dual-Experiment Summary

| Parameter / Metric | Experiment A [${expA.id}] | Experiment B [${expB.id}] | Delta (A - B) |
| :--- | :---: | :---: | :---: |
| **Model ID** | \`${expA.model}\` | \`${expB.model}\` | - |
| **Condition Structure** | \`${expA.condition}\` | \`${expB.condition}\` | - |
| **Temperature** | ${expA.temperature} | ${expB.temperature} | ${(expA.temperature - expB.temperature).toFixed(2)} |
| **Consensus Agreement Rate** | **${(expA.metrics.agreementScore * 100).toFixed(1)}%** | **${(expB.metrics.agreementScore * 100).toFixed(1)}%** | **${((expA.metrics.agreementScore - expB.metrics.agreementScore) * 100).toFixed(1)}%** |
| **Cohesion / Agreement Score** | ${expA.metrics.agreementScore.toFixed(3)} | ${expB.metrics.agreementScore.toFixed(3)} | ${(expA.metrics.agreementScore - expB.metrics.agreementScore).toFixed(3)} |
| **Average Self-Confidence** | ${(expA.metrics.avgConfidence * 100).toFixed(1)}% | ${(expB.metrics.avgConfidence * 100).toFixed(1)}% | ${((expA.metrics.avgConfidence - expB.metrics.avgConfidence) * 100).toFixed(1)}% |
| **Lexical Diversity (Jaccard)** | ${expA.metrics.diversityScore.toFixed(4)} | ${expB.metrics.diversityScore.toFixed(4)} | ${(expA.metrics.diversityScore - expB.metrics.diversityScore).toFixed(4)} |
| **Average Answer Latency** | ${expA.metrics.avgLatency.toFixed(0)}ms | ${expB.metrics.avgLatency.toFixed(0)}ms | ${(expA.metrics.avgLatency - expB.metrics.avgLatency).toFixed(0)}ms |
| **Consensus Modal Choice** | **"${expA.metrics.modalAnswer}"** | **"${expB.metrics.modalAnswer}"** | - |

---

## 🔍 Experiment A Breakdown (${expA.id})
* **Question**: ${expA.question}
* **System Prompt**: 
> ${expA.systemPrompt || "Standard baseline prompt"}

### Individual Agent Runs
${expA.agents.map((agent, i) => `
#### Run #${i + 1} — ${agent.agentId}
* **Success Status**: ${agent.success ? "✓ Active" : "✗ Error"}
* **Normalized Option/Answer Chosen**: **"${agent.normalizedAnswer || "None"}"**
* **Self Confidence Score**: ${agent.confidence !== undefined ? (agent.confidence * 100).toFixed(0) + "%" : "N/A"}
* **Latency**: ${agent.latency || 0}ms
* **Detailed Reasoning Snapshot**:
\`\`\`
${agent.rawResponse || "No reasoning captured"}
\`\`\`
`).join('\n')}

---

## 🔍 Experiment B Breakdown (${expB.id})
* **Question**: ${expB.question}
* **System Prompt**: 
> ${expB.systemPrompt || "Standard baseline prompt"}

### Individual Agent Runs
${expB.agents.map((agent, i) => `
#### Run #${i + 1} — ${agent.agentId}
* **Success Status**: ${agent.success ? "✓ Active" : "✗ Error"}
* **Normalized Option/Answer Chosen**: **"${agent.normalizedAnswer || "None"}"**
* **Self Confidence Score**: ${agent.confidence !== undefined ? (agent.confidence * 100).toFixed(0) + "%" : "N/A"}
* **Latency**: ${agent.latency || 0}ms
* **Detailed Reasoning Snapshot**:
\`\`\`
${agent.rawResponse || "No reasoning captured"}
\`\`\`
`).join('\n')}
`;

    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(markdownReport);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `joint_comparison_report_${expA.id}_vs_${expB.id}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Calculate comparative blocks for Single View
  const successfulAgents = selectedExp ? selectedExp.agents.filter(a => a.success) : [];
  const failedAgents = selectedExp ? selectedExp.agents.filter(a => !a.success) : [];
  const modalAnswer = selectedExp ? selectedExp.metrics.modalAnswer.trim().toUpperCase() : "";

  // Mainstream (agrees with modal answer) vs Outliers (disagrees with modal answer)
  const mainstreamAgents: AgentResponse[] = [];
  const outlierAgents: AgentResponse[] = [];

  successfulAgents.forEach(a => {
    const norm = (a.normalizedAnswer || "").trim().toUpperCase();
    if (norm === modalAnswer) {
      mainstreamAgents.push(a);
    } else {
      outlierAgents.push(a);
    }
  });

  const distinctAnswersCount = selectedExp 
    ? new Set(successfulAgents.map(a => (a.normalizedAnswer || "").trim().toUpperCase())).size 
    : 0;

  return (
    <div className="space-y-8" id="agent-analysis-workspace">
      {/* Dynamic Tab Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('segmentation')}
          className={`px-5 py-3 text-sm font-semibold transition border-b-2 -mb-[2px] cursor-pointer ${
            activeTab === 'segmentation'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <GitMerge className="w-4 h-4" /> Single Cohort Segmentation
          </span>
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-5 py-3 text-sm font-semibold transition border-b-2 -mb-[2px] cursor-pointer ${
            activeTab === 'comparison'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="flex items-center gap-2">
            <Scale className="w-4 h-4" /> Dual-Experiment Workstation
          </span>
        </button>
      </div>

      {activeTab === 'segmentation' ? (
        <>
          {/* Experiment Selector Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Target Trial to Analyze</label>
              <span className="text-sm font-bold text-slate-800">
                {selectedExp ? `${selectedExp.id} — "${selectedExp.question.slice(0, 50)}..."` : "Select an experiment"}
              </span>
            </div>
            <select
              value={activeId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            >
              {experiments.map(e => (
                <option key={e.id} value={e.id}>{e.id} ({e.condition})</option>
              ))}
            </select>
          </div>

          {selectedExp && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Comparative Workspace: Conforming Mainstream vs Outliers */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <GitMerge className="w-5 h-5 text-blue-600" /> Consensus Categorization Workspace
                  </h3>
                  <p className="text-sm text-slate-500">
                    Study the segmentation of agent replies. The platform divides agents into the primary consensus block (mainstream) and dissenting viewpoints (outliers).
                  </p>
                </div>

                {/* Block 1: Mainstream Block */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded inline-block">
                    Consensus Cohort (Voted &quot;{selectedExp.metrics.modalAnswer}&quot;)
                  </h4>
                  {mainstreamAgents.length === 0 ? (
                    <div className="p-4 bg-slate-50 text-slate-400 text-xs rounded-lg border border-dashed border-slate-200">
                      No conforming consensus block formed.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {mainstreamAgents.map(agent => (
                        <div key={agent.agentId} className="bg-white border border-blue-200 p-4 rounded-xl shadow-xs space-y-3 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full flex items-center justify-center font-mono text-[9px] font-bold text-blue-600 pr-2 pb-2 pointer-events-none">
                            Main
                          </div>
                          <div className="space-y-1">
                            <span className="font-mono text-xs font-bold text-slate-800">{agent.agentId}</span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                              <span>Latency: {agent.latency}ms</span>
                              <span>|</span>
                              <span>Confidence: {(agent.confidence || 0).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="space-y-1 text-xs">
                            <span className="font-bold text-slate-500 uppercase block text-[9px]">Reasoning Snapshot:</span>
                            <p className="text-slate-600 line-clamp-4 leading-relaxed font-sans">
                              {agent.rawResponse}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Block 2: Dissenting Outliers Block */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded inline-block">
                    Dissenting Outliers / Alternate Viewpoints
                  </h4>
                  {outlierAgents.length === 0 ? (
                    <div className="p-4 bg-slate-50 text-slate-400 text-xs rounded-lg border border-dashed border-slate-200">
                      No dissenting outliers detected. Absolute (100%) consensus attained.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {outlierAgents.map(agent => (
                        <div key={agent.agentId} className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full flex items-center justify-center font-mono text-[9px] font-bold text-slate-500 pr-2 pb-2 pointer-events-none">
                            Outlier
                          </div>
                          <div className="space-y-1">
                            <span className="font-mono text-xs font-bold text-slate-800">{agent.agentId}</span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                              <span>Latency: {agent.latency}ms</span>
                              <span>|</span>
                              <span>Confidence: {(agent.confidence || 0).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="space-y-1 text-xs">
                            <span className="font-bold text-slate-500 uppercase block text-[9px]">Dissenting Logic:</span>
                            <p className="text-slate-600 line-clamp-4 leading-relaxed font-sans">
                              {agent.rawResponse}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Block 3: Failed / Non-Responsive Agents */}
                {failedAgents.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded inline-block">
                      Failed or Non-Responsive Agents
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {failedAgents.map(agent => (
                        <div key={agent.agentId} className="bg-rose-50/40 border border-rose-100 p-4 rounded-xl shadow-xs space-y-1.5">
                          <span className="font-mono text-xs font-bold text-rose-800">{agent.agentId}</span>
                          <p className="text-xs text-rose-700 font-mono">
                            Status: FAILED | Error: {agent.errorDetails || "Unknown API Error"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Educational Sidebar: Why Consensus != Correctness */}
              <div className="space-y-6" id="educational-panel">
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 rounded-xl border border-slate-800 shadow-md space-y-4">
                  <div className="flex items-center gap-2 text-blue-400">
                    <ShieldAlert className="w-5 h-5" />
                    <h4 className="font-bold text-xs uppercase tracking-wider">The Consensus Trap Axiom</h4>
                  </div>

                  <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                    <div>
                      <p className="font-bold text-white mb-1">1. Overlap of Pre-training Weights</p>
                      <p>
                        LLMs trained on massive scrapes of identical public web data share the same mathematical corpus biases. When presented with classic reasoning puzzles, they retrieve the same pre-existing incorrect internet discussions, producing identical false consensus.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-white mb-1">2. Alignment & Formatting Sycophancy</p>
                      <p>
                        Reinforcement Learning with Human Feedback (RLHF) forces models to exhibit high sycophancy, conformity, and safe hedging behaviors. This creates an uncoordinated convergence on conservative, identical layouts or common incorrect explanations.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-white mb-1">3. Cascading Echo Chambers</p>
                      <p>
                        Under SHARED_CONTEXT structures, once early agents formulate an opinion, subsequent agents exhibit severe anchoring bias, adjusting their metrics to avoid disagreeing with the preceding &quot;peers&quot;. This mirrors human conformity cascades.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-200 rounded-lg">
                    <span className="font-semibold block mb-0.5">Note to Fellowship Reviewers:</span>
                    This laboratory measures <strong>agreement</strong>, not objective truth. A 100% agreement score under multi-agent voting does not represent 100% correctness — it frequently signals a highly consolidated error trap!
                  </div>
                </div>

                {/* Polarization Index Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider block">Consensus Polarization Map</h4>
                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-2 flex justify-between">
                      <span className="text-slate-500">Distinct Answers:</span>
                      <span className="font-mono font-bold text-slate-800">{distinctAnswersCount}</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="text-slate-500">Conforming Cohort Size:</span>
                      <span className="font-mono font-bold text-blue-600">
                        {mainstreamAgents.length} / {successfulAgents.length}
                      </span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="text-slate-500">Dissenting Minority:</span>
                      <span className="font-mono font-bold text-slate-500">
                        {outlierAgents.length} / {successfulAgents.length}
                      </span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="text-slate-500">Polarization Rating:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {distinctAnswersCount > 1 ? "MULTIVALUED DISSENT" : "UNIFIED MONOLITH"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Dual-Experiment Side-by-Side Workstation */
        <div className="space-y-6" id="dual-comparison-view">
          {/* Config Controls and Joint Export Bar */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-600 animate-pulse" /> Dual-Experiment Workstation
                </h3>
                <p className="text-xs text-slate-500">
                  Select two completed reliability trials from your database to generate dynamic delta graphs and comparative indicators.
                </p>
              </div>

              {/* Joint Export Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition flex items-center gap-1.5 cursor-pointer"
                  title="Export complete details of both selected trials as a detailed joint JSON dataset"
                >
                  <FileJson className="w-4 h-4" /> Export Joint JSON
                </button>
                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  className="px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition flex items-center gap-1.5 cursor-pointer"
                  title="Generate a fully customized, downloadable Markdown comparative report"
                >
                  <FileText className="w-4 h-4" /> Joint Markdown Report
                </button>
              </div>
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Experiment A (Left Panel)</label>
                <select
                  value={compareIdA}
                  onChange={(e) => setCompareIdA(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                >
                  {experiments.map(e => (
                    <option key={e.id} value={e.id}>
                      [{e.id}] {e.condition} | {e.question.slice(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Experiment B (Right Panel)</label>
                <select
                  value={compareIdB}
                  onChange={(e) => setCompareIdB(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                >
                  {experiments.map(e => (
                    <option key={e.id} value={e.id}>
                      [{e.id}] {e.condition} | {e.question.slice(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Visual Delta Metrics Dashboard */}
          {expA && expB && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Side by Side Cards */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card for Experiment A */}
                  <div className="bg-white border-2 border-blue-500 rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden">
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-blue-500 text-white font-mono text-[9px] rounded font-bold uppercase">
                      Experiment A
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-mono text-sm font-bold text-blue-600">{expA.id}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">Condition: {expA.condition}</p>
                    </div>

                    <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg text-xs">
                      <span className="font-bold text-slate-500 text-[10px] block uppercase">Posed Question:</span>
                      <p className="text-slate-700 line-clamp-3 leading-relaxed">{expA.question}</p>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Consensus Rate:</span>
                        <span className="font-mono font-bold text-slate-900">{(expA.metrics.agreementScore * 100).toFixed(1)}%</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Agreement Score:</span>
                        <span className="font-mono font-bold text-slate-900">{expA.metrics.agreementScore.toFixed(3)}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Avg Confidence:</span>
                        <span className="font-mono font-bold text-slate-900">{(expA.metrics.avgConfidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Lexical Diversity (Jaccard):</span>
                        <span className="font-mono font-bold text-slate-900">{expA.metrics.diversityScore.toFixed(4)}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Modal Output Answer:</span>
                        <span className="font-mono font-bold text-blue-600">&quot;{expA.metrics.modalAnswer}&quot;</span>
                      </div>
                    </div>
                  </div>

                  {/* Card for Experiment B */}
                  <div className="bg-white border-2 border-indigo-500 rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden">
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-indigo-500 text-white font-mono text-[9px] rounded font-bold uppercase">
                      Experiment B
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-mono text-sm font-bold text-indigo-600">{expB.id}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">Condition: {expB.condition}</p>
                    </div>

                    <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg text-xs">
                      <span className="font-bold text-slate-500 text-[10px] block uppercase">Posed Question:</span>
                      <p className="text-slate-700 line-clamp-3 leading-relaxed">{expB.question}</p>
                    </div>

                    <div className="divide-y divide-slate-100 text-xs">
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Consensus Rate:</span>
                        <span className="font-mono font-bold text-slate-900">{(expB.metrics.agreementScore * 100).toFixed(1)}%</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Agreement Score:</span>
                        <span className="font-mono font-bold text-slate-900">{expB.metrics.agreementScore.toFixed(3)}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Avg Confidence:</span>
                        <span className="font-mono font-bold text-slate-900">{(expB.metrics.avgConfidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Lexical Diversity (Jaccard):</span>
                        <span className="font-mono font-bold text-slate-900">{expB.metrics.diversityScore.toFixed(4)}</span>
                      </div>
                      <div className="py-2 flex justify-between">
                        <span className="text-slate-500">Modal Output Answer:</span>
                        <span className="font-mono font-bold text-indigo-600">&quot;{expB.metrics.modalAnswer}&quot;</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Parameters & System Prompt Diff Summary */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm">System Prompt Comparer</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                    <div className="space-y-1 p-3 bg-blue-50/30 border border-blue-100 rounded-lg">
                      <span className="font-bold text-blue-800 text-[10px] block uppercase">Prompt A</span>
                      <p className="text-slate-600 max-h-[140px] overflow-y-auto font-mono text-[11px]">
                        {expA.systemPrompt || "Standard baseline agent configuration."}
                      </p>
                    </div>
                    <div className="space-y-1 p-3 bg-indigo-50/30 border border-indigo-100 rounded-lg">
                      <span className="font-bold text-indigo-800 text-[10px] block uppercase">Prompt B</span>
                      <p className="text-slate-600 max-h-[140px] overflow-y-auto font-mono text-[11px]">
                        {expB.systemPrompt || "Standard baseline agent configuration."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Comparative Analytical Deltas */}
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-600" /> Statistical Variance & Deltas
                  </h4>

                  <div className="space-y-4">
                    {/* Consensus Rate Delta */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end text-xs">
                        <span className="font-semibold text-slate-700">Consensus Agreement Rate Delta:</span>
                        <span className={`font-mono font-bold ${
                          ((expA.metrics.agreementScore * 100) - (expB.metrics.agreementScore * 100)) > 0 
                            ? "text-emerald-600" 
                            : ((expA.metrics.agreementScore * 100) - (expB.metrics.agreementScore * 100)) < 0 
                              ? "text-rose-600" 
                              : "text-slate-500"
                        }`}>
                          {((expA.metrics.agreementScore * 100) - (expB.metrics.agreementScore * 100)) > 0 ? "+" : ""}
                          {((expA.metrics.agreementScore * 100) - (expB.metrics.agreementScore * 100)).toFixed(1)}%
                        </span>
                      </div>
                      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="absolute h-full bg-blue-500" 
                          style={{ width: `${(expA.metrics.agreementScore * 100)}%` }}
                        />
                        <div 
                          className="absolute h-full bg-indigo-500/70 border-l border-white" 
                          style={{ left: `${(expA.metrics.agreementScore * 100)}%`, width: `${Math.abs((expA.metrics.agreementScore * 100) - (expB.metrics.agreementScore * 100))}%` }}
                        />
                      </div>
                    </div>

                    {/* Average Self-Confidence Delta */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end text-xs">
                        <span className="font-semibold text-slate-700">Self-Assessed Confidence Delta:</span>
                        <span className={`font-mono font-bold ${
                          (expA.metrics.avgConfidence - expB.metrics.avgConfidence) > 0 
                            ? "text-emerald-600" 
                            : (expA.metrics.avgConfidence - expB.metrics.avgConfidence) < 0 
                              ? "text-rose-600" 
                              : "text-slate-500"
                        }`}>
                          {(expA.metrics.avgConfidence - expB.metrics.avgConfidence) > 0 ? "+" : ""}
                          {((expA.metrics.avgConfidence - expB.metrics.avgConfidence) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="absolute h-full bg-blue-500" 
                          style={{ width: `${expA.metrics.avgConfidence * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Lexical Diversity Delta */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end text-xs">
                        <span className="font-semibold text-slate-700">Lexical Diversity Delta (Overlap Score):</span>
                        <span className={`font-mono font-bold ${
                          (expA.metrics.diversityScore - expB.metrics.diversityScore) > 0 
                            ? "text-emerald-600" 
                            : (expA.metrics.diversityScore - expB.metrics.diversityScore) < 0 
                              ? "text-rose-600" 
                              : "text-slate-500"
                        }`}>
                          {(expA.metrics.diversityScore - expB.metrics.diversityScore) > 0 ? "+" : ""}
                          {(expA.metrics.diversityScore - expB.metrics.diversityScore).toFixed(4)}
                        </span>
                      </div>
                      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="absolute h-full bg-blue-500" 
                          style={{ width: `${expA.metrics.diversityScore * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-600 space-y-2">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wide block">How to read this workspace:</span>
                    <ul className="list-disc pl-4 space-y-1.5 text-slate-500">
                      <li>
                        A high **Consensus Rate** accompanied by low **Lexical Diversity** signals absolute formatting mimicry or extreme consensus trap consolidations.
                      </li>
                      <li>
                        Comparing two different structural conditions (e.g. **INDEPENDENT_3** vs **SHARED_CONTEXT_5**) highlights how inter-agent communication forces alignment and suppresses cognitive divergence.
                      </li>
                      <li>
                        If the **Average Self-Confidence** remains high (&gt;0.90) despite a polarized outcome, the models are reinforcing biased reasoning with absolute self-sycophancy.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
