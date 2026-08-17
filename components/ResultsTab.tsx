'use client';

import React, { useState } from 'react';
import { Experiment, AgentResponse } from '@/lib/metrics';
import { Download, Calendar, Cpu, Clock, Award, Eye, FileText, BarChart2, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ResultsTabProps {
  experiments: Experiment[];
}

export function ResultsTab({ experiments }: ResultsTabProps) {
  const [selectedExpId, setSelectedExpId] = useState<string>(
    experiments.length > 0 ? experiments[experiments.length - 1].id : ""
  );

  const activeExpId = selectedExpId || (experiments.length > 0 ? experiments[experiments.length - 1].id : "");
  const selectedExp = experiments.find(e => e.id === activeExpId);

  // States to inspect a specific agent's raw response in a modal/detail drawer
  const [inspectedAgent, setInspectedAgent] = useState<AgentResponse | null>(null);

  const handleExportJSON = (exp: Experiment) => {
    const payload = JSON.stringify(exp, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CONSENSUSTRAP_${exp.id}_DATA.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = (exp: Experiment) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Experiment ID,Condition,Model,Temperature,Timestamp,Agent ID,Agent Success,Latency (ms),Confidence,Normalized Answer,Raw Response,Context Received\n";

    exp.agents.forEach(a => {
      const row = [
        exp.id,
        exp.condition,
        exp.model,
        exp.temperature,
        exp.timestamp,
        a.agentId,
        a.success ? "SUCCESS" : "FAILED",
        a.latency,
        a.success ? a.confidence : "N/A",
        a.success ? `"${(a.normalizedAnswer || "").replace(/"/g, '""')}"` : "N/A",
        `"${(a.rawResponse || "").replace(/"/g, '""').slice(0, 1000)}..."`,
        `"${(a.contextReceived || "").replace(/"/g, '""')}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CONSENSUSTRAP_${exp.id}_DATA.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (experiments.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center space-y-4" id="results-empty">
        <BarChart2 className="w-16 h-16 text-slate-300 mx-auto animate-pulse" />
        <h3 className="text-xl font-bold text-slate-900">No Experimental Records</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          The analytical engine is idle. Run tests or trials inside the <strong>Experiment Lab</strong> to populate this visualization workspace.
        </p>
      </div>
    );
  }

  // Calculate global stats for comparison
  const targetConditions = ['SINGLE_AGENT', 'INDEPENDENT_3', 'INDEPENDENT_5', 'SHARED_CONTEXT_5'];
  const conditionStats = targetConditions.map(cond => {
    const matching = experiments.filter(e => e.condition === cond);
    if (matching.length === 0) {
      return {
        condition: cond,
        hasData: false,
        trialCount: 0,
        successRate: 0,
        failureRate: 0,
        agreement: 0,
        diversity: 0,
        latency: 0
      };
    }

    const totalSuccessful = matching.reduce((sum, e) => sum + e.metrics.successfulAgents, 0);
    const totalFailed = matching.reduce((sum, e) => sum + e.metrics.failedAgents, 0);
    const totalRuns = totalSuccessful + totalFailed;

    const avgSuccessRate = totalRuns > 0 ? (totalSuccessful / totalRuns) * 100 : 0;
    const avgFailureRate = totalRuns > 0 ? (totalFailed / totalRuns) * 100 : 0;

    const avgAgreement = (matching.reduce((sum, e) => sum + (e.metrics.agreement_score ?? e.metrics.agreementScore ?? 0), 0) / matching.length) * 100;
    const avgDiversity = (matching.reduce((sum, e) => sum + (e.metrics.diversity_score ?? e.metrics.diversityScore ?? 0), 0) / matching.length) * 100;
    const avgLatency = (matching.reduce((sum, e) => sum + (e.metrics.average_latency ?? e.metrics.avgLatency ?? 0), 0) / matching.length) / 1000; // in seconds

    return {
      condition: cond,
      hasData: true,
      trialCount: matching.length,
      successRate: avgSuccessRate,
      failureRate: avgFailureRate,
      agreement: avgAgreement,
      diversity: avgDiversity,
      latency: avgLatency
    };
  });

  return (
    <div className="space-y-10" id="results-tab-container">
      
      {/* 4 SCIENTIFIC COMPARISON CHARTS SECTION */}
      <div className="space-y-4 animate-fade-in" id="results-charts-container">
        <div className="border-b border-zinc-200 pb-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-950 font-mono">Condition Metric Comparison Dashboard</h2>
          <p className="text-xs text-zinc-500">Averages compiled directly from live experimental databases. Never using mock data.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CHART 1: AGREEMENT COMPARISON */}
          <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm space-y-4 flex flex-col justify-between h-72">
            <div>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">Chart 1</span>
              <h4 className="font-extrabold text-zinc-900 text-xs uppercase tracking-wide">Agreement Comparison</h4>
              <p className="text-[10px] text-zinc-500 leading-normal">Average level of consensus choices among successful agents.</p>
            </div>
            
            <div className="flex-1 flex items-end justify-around pb-2 border-b border-zinc-100 relative">
              {conditionStats.map(stat => (
                <div key={stat.condition} className="flex flex-col items-center w-8 group relative">
                  {stat.hasData ? (
                    <>
                      <span className="absolute -top-5 text-[9px] font-mono font-bold text-black">
                        {stat.agreement.toFixed(0)}%
                      </span>
                      <div 
                        className="w-5 bg-black rounded-t transition-all duration-500" 
                        style={{ height: `${Math.max(stat.agreement, 5)}%` }} 
                      />
                    </>
                  ) : (
                    <span className="text-[8px] text-zinc-300 font-bold mb-1">No Data</span>
                  )}
                  <span className="text-[8px] text-zinc-400 mt-1 font-mono uppercase tracking-tighter truncate w-full text-center">
                    {stat.condition.split('_')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CHART 2: DIVERSITY COMPARISON */}
          <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm space-y-4 flex flex-col justify-between h-72">
            <div>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">Chart 2</span>
              <h4 className="font-extrabold text-zinc-900 text-xs uppercase tracking-wide">Diversity Comparison</h4>
              <p className="text-[10px] text-zinc-500 leading-normal">Lexical Jaccard Divergence among agent reasoning scripts.</p>
            </div>
            
            <div className="flex-1 flex items-end justify-around pb-2 border-b border-zinc-100 relative">
              {conditionStats.map(stat => (
                <div key={stat.condition} className="flex flex-col items-center w-8 group relative">
                  {stat.hasData ? (
                    <>
                      <span className="absolute -top-5 text-[9px] font-mono font-bold text-zinc-600">
                        {stat.diversity.toFixed(0)}%
                      </span>
                      <div 
                        className="w-5 bg-zinc-500 rounded-t transition-all duration-500" 
                        style={{ height: `${Math.max(stat.diversity, 5)}%` }} 
                      />
                    </>
                  ) : (
                    <span className="text-[8px] text-zinc-300 font-bold mb-1">No Data</span>
                  )}
                  <span className="text-[8px] text-zinc-400 mt-1 font-mono uppercase tracking-tighter truncate w-full text-center">
                    {stat.condition.split('_')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CHART 3: SUCCESS/FAILURE CHART */}
          <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm space-y-4 flex flex-col justify-between h-72">
            <div>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">Chart 3</span>
              <h4 className="font-extrabold text-zinc-900 text-xs uppercase tracking-wide">Success / Failure Rate</h4>
              <p className="text-[10px] text-zinc-500 leading-normal">Execution failure vs completion comparison across setups.</p>
            </div>
            
            <div className="flex-1 flex items-end justify-around pb-2 border-b border-zinc-100 relative">
              {conditionStats.map(stat => (
                <div key={stat.condition} className="flex flex-col items-center w-8 group relative">
                  {stat.hasData ? (
                    <>
                      <span className="absolute -top-5 text-[9px] font-mono font-bold text-zinc-800">
                        {stat.successRate.toFixed(0)}%
                      </span>
                      <div className="w-5 flex flex-col justify-end h-full">
                        {/* Failure portion */}
                        {stat.failureRate > 0 && (
                          <div 
                            className="bg-zinc-300 w-full" 
                            style={{ height: `${stat.failureRate}%` }} 
                            title={`Failure Rate: ${stat.failureRate.toFixed(0)}%`}
                          />
                        )}
                        {/* Success portion */}
                        <div 
                          className="bg-zinc-800 w-full rounded-t" 
                          style={{ height: `${stat.successRate}%` }} 
                          title={`Success Rate: ${stat.successRate.toFixed(0)}%`}
                        />
                      </div>
                    </>
                  ) : (
                    <span className="text-[8px] text-zinc-300 font-bold mb-1">No Data</span>
                  )}
                  <span className="text-[8px] text-zinc-400 mt-1 font-mono uppercase tracking-tighter truncate w-full text-center">
                    {stat.condition.split('_')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CHART 4: LATENCY CHART */}
          <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm space-y-4 flex flex-col justify-between h-72">
            <div>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">Chart 4</span>
              <h4 className="font-extrabold text-zinc-900 text-xs uppercase tracking-wide">Latency Chart</h4>
              <p className="text-[10px] text-zinc-500 leading-normal">Mean roundtrip execution duration (seconds) per call.</p>
            </div>
            
            <div className="flex-1 flex items-end justify-around pb-2 border-b border-zinc-100 relative">
              {conditionStats.map(stat => (
                <div key={stat.condition} className="flex flex-col items-center w-8 group relative">
                  {stat.hasData ? (
                    <>
                      <span className="absolute -top-5 text-[9px] font-mono font-bold text-zinc-650">
                        {stat.latency.toFixed(1)}s
                      </span>
                      <div 
                        className="w-5 bg-zinc-400 rounded-t transition-all duration-500" 
                        style={{ height: `${Math.min((stat.latency / 10) * 100, 100)}%` }} // normalized with 10s max
                      />
                    </>
                  ) : (
                    <span className="text-[8px] text-zinc-300 font-bold mb-1">No Data</span>
                  )}
                  <span className="text-[8px] text-slate-400 mt-1 font-mono uppercase tracking-tighter truncate w-full text-center">
                    {stat.condition.split('_')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED EXPERIMENT TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden" id="experiment-table-panel">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Experimental Trials Ledger</h3>
          <p className="text-xs text-slate-500">Comprehensive database record containing each multi-agent invocation.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200">
                <th className="p-4 font-mono">Trial ID</th>
                <th className="p-4">Condition</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Research Question</th>
                <th className="p-4 text-center">Agreement</th>
                <th className="p-4 text-center">Success Rate</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {experiments.map(exp => {
                const totalAgentsCount = exp.agents.length;
                const successfulCount = exp.agents.filter(a => a.success).length;
                const currentSuccessPercent = totalAgentsCount > 0 ? (successfulCount / totalAgentsCount) * 100 : 0;
                const isCurrentSelected = exp.id === activeExpId;

                return (
                  <tr 
                    key={exp.id} 
                    className={`hover:bg-slate-50 transition ${isCurrentSelected ? 'bg-blue-50/25 font-semibold' : ''}`}
                  >
                    <td className="p-4 font-mono font-bold text-slate-900">{exp.id}</td>
                    <td className="p-4">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-bold font-mono ${
                        exp.condition === 'SINGLE_AGENT' ? 'bg-blue-50 text-blue-700' :
                        exp.condition === 'INDEPENDENT_3' ? 'bg-purple-50 text-purple-700' :
                        exp.condition === 'INDEPENDENT_5' ? 'bg-pink-50 text-pink-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {exp.condition}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-[10px]">
                      {new Date(exp.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs truncate" title={exp.question}>
                      {exp.question}
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-slate-700">
                      {((exp.metrics.agreement_score ?? exp.metrics.agreementScore ?? 0) * 100).toFixed(0)}%
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-slate-700">
                      {currentSuccessPercent.toFixed(0)}%
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedExpId(exp.id)}
                        className={`px-3 py-1 text-[11px] font-bold rounded transition cursor-pointer ${
                          isCurrentSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* INDIVIDUAL AGENT RESPONSES INSPECTOR */}
      {selectedExp && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6" id="agent-responses-inspector">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                  Active Inspector ID: {selectedExp.id}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(selectedExp.timestamp).toLocaleString()}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base leading-snug">
                Q: &quot;{selectedExp.question}&quot;
              </h3>
              <div className="text-[11px] text-slate-400">
                Model: <strong className="text-slate-600">{selectedExp.model}</strong> | Temp: <strong className="text-slate-600">{selectedExp.temperature}</strong> | Repetitions: <strong className="text-slate-600">{selectedExp.repetitions}</strong>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleExportJSON(selectedExp)}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Export JSON
              </button>
              <button
                onClick={() => handleExportCSV(selectedExp)}
                className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Export CSV
              </button>
            </div>
          </div>

          {/* Core metrics summary row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Consensus modal answer</span>
              <span className="text-sm font-extrabold text-slate-900 truncate block">
                &quot;{selectedExp.metrics.modalAnswer || "N/A"}&quot;
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Agreement Score</span>
              <span className="text-sm font-extrabold text-blue-600 block">
                {((selectedExp.metrics.agreement_score ?? selectedExp.metrics.agreementScore ?? 0) * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Diversity Rating</span>
              <span className="text-sm font-extrabold text-violet-600 block">
                {((selectedExp.metrics.diversity_score ?? selectedExp.metrics.diversityScore ?? 0) * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Mean Latency</span>
              <span className="text-sm font-extrabold text-slate-700 block">
                {((selectedExp.metrics.average_latency ?? selectedExp.metrics.avgLatency ?? 0) / 1000).toFixed(2)}s
              </span>
            </div>
          </div>

          {/* Interactive Agent List Accordion */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">Individual Agent Outputs</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedExp.agents.map((agent, aIdx) => (
                <div 
                  key={agent.agentId} 
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs flex flex-col justify-between"
                >
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-slate-400 text-xs font-bold">#{aIdx + 1}</span>
                      <span className="font-extrabold text-slate-900 text-xs truncate max-w-[120px]">{agent.agentId}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      agent.success ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {agent.success ? 'SUCCESS' : 'FAILED'}
                    </span>
                  </div>

                  <div className="p-4 space-y-3 flex-1">
                    {agent.success ? (
                      <>
                        <div className="flex justify-between text-[11px] border-b border-slate-100 pb-1.5">
                          <span className="text-slate-400">Normalized Value:</span>
                          <span className="font-extrabold font-mono text-slate-800">&quot;{agent.normalizedAnswer}&quot;</span>
                        </div>
                        <div className="flex justify-between text-[11px] border-b border-slate-100 pb-1.5">
                          <span className="text-slate-400">Confidence:</span>
                          <span className="font-bold text-slate-800">{agent.confidence?.toFixed(2) || "1.00"}</span>
                        </div>
                        <div className="flex justify-between text-[11px] border-b border-slate-100 pb-1.5">
                          <span className="text-slate-400">Query Latency:</span>
                          <span className="text-slate-800">{agent.latency} ms</span>
                        </div>
                        {agent.contextReceived && (
                          <div className="text-[10px] bg-indigo-50 text-indigo-700 p-2 rounded border border-indigo-100/50">
                            <span className="font-bold block uppercase mb-0.5">Sequential Preceding Context:</span>
                            {agent.contextReceived}
                          </div>
                        )}
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Raw Reasoning Rationale:</span>
                          <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed whitespace-pre-wrap bg-slate-50 p-2 rounded border border-slate-100">
                            {agent.rawResponse}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-xs text-rose-700 space-y-1.5 bg-rose-50/50 p-3 rounded-lg border border-rose-100/50">
                        <p className="font-bold">Error logs:</p>
                        <p className="font-mono">{agent.errorDetails || "Unknown API Execution Interruption"}</p>
                      </div>
                    )}
                  </div>

                  {agent.success && (
                    <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => setInspectedAgent(agent)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Inspect Full Rationale
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FULL AGENT TRANSCRIPT DETAILED MODAL DRAWER */}
      {inspectedAgent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="agent-transcript-modal">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-xl">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Agent Output Inspector</span>
                <h3 className="font-extrabold text-slate-900 text-sm font-mono">{inspectedAgent.agentId}</h3>
              </div>
              <button
                onClick={() => setInspectedAgent(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer px-2"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-slate-400 block font-semibold mb-0.5">Normalized Categorization:</span>
                  <strong className="text-slate-900 font-mono text-sm bg-slate-100 px-2 py-0.5 rounded">&quot;{inspectedAgent.normalizedAnswer}&quot;</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold mb-0.5">Confidence Rating:</span>
                  <strong className="text-slate-900 font-mono text-sm">{inspectedAgent.confidence?.toFixed(2) || "1.00"}</strong>
                </div>
              </div>

              {inspectedAgent.contextReceived && (
                <div className="bg-indigo-50 border border-indigo-100 text-indigo-900 p-4 rounded-lg space-y-1">
                  <span className="font-bold block uppercase text-[10px] tracking-wider text-indigo-700">Preceding Context (Shared Condition):</span>
                  <p className="font-mono text-[11px] leading-relaxed">{inspectedAgent.contextReceived}</p>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase block text-[10px] tracking-wider">Detailed Agent Rationale script:</span>
                <p className="text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 whitespace-pre-wrap font-sans text-sm">
                  {inspectedAgent.rawResponse}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-xl flex justify-end">
              <button
                onClick={() => setInspectedAgent(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
