'use client';

import React from 'react';
import { Experiment } from '@/lib/metrics';
import { 
  FlaskConical, 
  Layers, 
  BookOpen, 
  TrendingUp, 
  AlertCircle, 
  ShieldCheck, 
  Activity, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface OverviewTabProps {
  experiments: Experiment[];
  onNavigateToTab: (tab: string) => void;
}

export function OverviewTab({ experiments, onNavigateToTab }: OverviewTabProps) {
  const totalCount = experiments.length;

  // Calculate genuine real stats
  let totalSuccessfulAgents = 0;
  let totalFailedAgents = 0;
  let totalAgreementSum = 0;
  let totalDiversitySum = 0;
  let experimentsWithAgreement = 0;

  experiments.forEach(e => {
    // Total up successful/failed agent runs
    const succ = e.agents.filter(a => a.success).length;
    const fail = e.agents.filter(a => !a.success).length;
    totalSuccessfulAgents += succ;
    totalFailedAgents += fail;

    if (succ > 0) {
      totalAgreementSum += (e.metrics.agreement_score ?? e.metrics.agreementScore ?? 0);
      totalDiversitySum += (e.metrics.diversity_score ?? e.metrics.diversityScore ?? 0);
      experimentsWithAgreement++;
    }
  });

  const avgAgreement = experimentsWithAgreement > 0 ? (totalAgreementSum / experimentsWithAgreement) : 0;
  const avgDiversity = experimentsWithAgreement > 0 ? (totalDiversitySum / experimentsWithAgreement) : 0;
  const overallCalls = totalSuccessfulAgents + totalFailedAgents;
  const overallSuccessRate = overallCalls > 0 ? (totalSuccessfulAgents / overallCalls) * 100 : 0;

  return (
    <div className="space-y-10 animate-fade-in" id="overview-dashboard">
      {/* HOMEPAGE HERO SECTION */}
      <div className="bg-zinc-950 text-white rounded-xl p-8 md:p-10 border border-zinc-900 shadow-xl relative overflow-hidden" id="hero-banner">
        <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-900/40 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="max-w-3xl relative z-10 space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-[10px] font-bold bg-zinc-900 text-zinc-300 border border-zinc-800 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
              Empirical AI Safety Lab
            </span>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl font-mono">
              CONSENSUSTRAP
            </h1>
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest font-mono">
              Multi-Agent LLM Reliability Lab
            </p>
          </div>

          <p className="text-xl italic text-zinc-200 leading-relaxed max-w-2xl font-serif">
            &quot;Does agreement make AI more reliable?&quot;
          </p>

          {/* Three Concise Research Statements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-900" id="hero-statements">
            <div className="space-y-1">
              <span className="text-zinc-400 font-mono text-[10px] font-bold uppercase tracking-widest block">Statement 1</span>
              <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                Multiple agents can agree and reach consensus.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-400 font-mono text-[10px] font-bold uppercase tracking-widest block">Statement 2</span>
              <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                Agreement does not necessarily mean correctness.
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-400 font-mono text-[10px] font-bold uppercase tracking-widest block">Statement 3</span>
              <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                This lab experimentally measures the relationship.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigateToTab('lab')}
              className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black font-extrabold rounded-lg text-xs tracking-wider uppercase transition flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-950 shadow-sm"
              id="hero-btn-run"
            >
              <FlaskConical className="w-3.5 h-3.5 text-black" /> Run Experiment
            </button>
            <button
              onClick={() => onNavigateToTab('methodology')}
              className="px-6 py-2.5 bg-transparent hover:bg-zinc-900 text-zinc-300 border border-zinc-800 font-bold rounded-lg text-xs tracking-wider uppercase transition flex items-center gap-2 cursor-pointer"
              id="hero-btn-methodology"
            >
              <Layers className="w-3.5 h-3.5 text-zinc-400" /> View Methodology
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD: PROFESSIONAL RESEARCH METRIC CARDS */}
      <div className="space-y-4" id="dashboard-metrics-section">
        <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2 font-mono">
          <Activity className="w-4 h-4 text-black" /> Laboratory Performance Dashboard
        </h2>

        {totalCount === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-10 text-center space-y-4 shadow-sm" id="dashboard-empty">
            <AlertCircle className="w-10 h-10 text-zinc-300 mx-auto" />
            <p className="text-zinc-800 font-bold text-sm uppercase tracking-wide">No experimental data yet.</p>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto">
              Ready to test multi-agent correlations? Navigate to the Experiment Lab to execute your first scientific trials.
            </p>
            <button
              onClick={() => onNavigateToTab('lab')}
              className="px-4 py-2 bg-black hover:bg-zinc-800 text-white text-[10px] uppercase tracking-wider font-extrabold rounded transition cursor-pointer"
            >
              Initiate Experiment Lab
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4" id="dashboard-cards-grid">
            <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs space-y-1.5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">Experiments</span>
              <span className="text-3xl font-black text-zinc-950 block font-mono">{totalCount}</span>
              <span className="text-[10px] text-zinc-500 block">Total individual trials logged</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs space-y-1.5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">Agent Responses</span>
              <span className="text-3xl font-black text-zinc-950 block font-mono">{overallCalls}</span>
              <span className="text-[10px] text-zinc-500 block">{totalSuccessfulAgents} successful runs</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs space-y-1.5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">Success Rate</span>
              <span className="text-3xl font-black text-zinc-950 block font-mono">{overallSuccessRate.toFixed(1)}%</span>
              <span className="text-[10px] text-zinc-500 block">{totalFailedAgents} queries failed</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs space-y-1.5">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">Average Agreement</span>
              <span className="text-3xl font-black text-zinc-950 block font-mono">{(avgAgreement * 100).toFixed(1)}%</span>
              <span className="text-[10px] text-zinc-500 block">Consensus alignment average</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-zinc-200/80 shadow-xs space-y-1.5 col-span-2 lg:col-span-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">Average Diversity</span>
              <span className="text-3xl font-black text-zinc-950 block font-mono">{(avgDiversity * 100).toFixed(1)}%</span>
              <span className="text-[10px] text-zinc-500 block font-mono">Lexical Jaccard score</span>
            </div>
          </div>
        )}
      </div>

      {/* RESEARCH INTERPRETATION: WHAT THE DATA SHOWS VS WHAT IT DOES NOT */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-6" id="research-interpretation">
        <div>
          <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-widest flex items-center gap-2 font-mono">
            <BookOpen className="w-4 h-4 text-black" /> Research Interpretation Guidance
          </h3>
          <p className="text-xs text-zinc-500">
            Critical analytical guardrails for fellowship reviewers and AI reliability researchers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="interpretation-grid">
          {/* What the data shows */}
          <div className="bg-zinc-50 p-5 rounded-lg border border-zinc-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-950" />
              <h4 className="font-bold text-zinc-900 text-xs uppercase font-mono tracking-wider">What the data shows</h4>
            </div>
            <ul className="space-y-3.5 text-xs text-zinc-600 leading-relaxed list-disc list-inside">
              <li>
                <strong>Consensus Rate:</strong> Multi-agent arrangements often produce a visible increase in unified answer alignment, demonstrating high group self-consistency.
              </li>
              <li>
                <strong>Syntactic Conformance:</strong> Under sequential sharing layouts, later agents echo previous chains, significantly diminishing lexical diversity.
              </li>
              <li>
                <strong>Error Synchronization:</strong> Homogeneous model instances queried in isolation regularly converge on identical, flawed rationales due to shared pre-training parameters.
              </li>
            </ul>
          </div>

          {/* What the data does NOT show */}
          <div className="bg-zinc-50 p-5 rounded-lg border border-zinc-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-400" />
              <h4 className="font-bold text-zinc-900 text-xs uppercase font-mono tracking-wider">What the data does NOT show</h4>
            </div>
            <ul className="space-y-3.5 text-xs text-zinc-600 leading-relaxed list-disc list-inside">
              <li>
                <strong>Factual Correctness:</strong> Increased agreement does <strong>NOT</strong> automatically mean accuracy increased. The agents can confidently agree on a false result.
              </li>
              <li>
                <strong>Cognitive Autonomy:</strong> Overlapping terminology across isolated parallel agents is a sign of common foundational training distributions, not independent deduction.
              </li>
              <li>
                <strong>Mathematical Correction:</strong> Majority voting is not a silver bullet; it cannot mathematically self-correct if the baseline error rate is correlated across agents.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* RESEARCH INTEGRITY */}
      <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 shadow-sm space-y-6" id="research-integrity">
        <div className="border-b border-zinc-200 pb-4">
          <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-widest flex items-center gap-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-black" /> Research Integrity Standards
          </h3>
          <p className="text-[11px] text-zinc-500">
            Absolute adherence to empirical transparency, scientific honesty, and mathematical accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4" id="integrity-standards-row">
          <div className="bg-white p-4 rounded-lg border border-zinc-150 text-center space-y-1">
            <span className="text-[9px] font-bold text-zinc-900 uppercase tracking-widest block font-mono">Real Responses</span>
            <p className="text-[10px] text-zinc-600 leading-normal">
              100% live queries, never using synthetic mock responses.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-zinc-150 text-center space-y-1">
            <span className="text-[9px] font-bold text-zinc-900 uppercase tracking-widest block font-mono">No Fabrication</span>
            <p className="text-[10px] text-zinc-600 leading-normal">
              All results are generated from observed, live API outputs.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-zinc-150 text-center space-y-1">
            <span className="text-[9px] font-bold text-zinc-900 uppercase tracking-widest block font-mono">Failures Recorded</span>
            <p className="text-[10px] text-zinc-600 leading-normal">
              API or connection failures are logged explicitly as failures.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-zinc-150 text-center space-y-1">
            <span className="text-[9px] font-bold text-zinc-900 uppercase tracking-widest block font-mono">Observed Metrics</span>
            <p className="text-[10px] text-zinc-600 leading-normal">
              Scores are calculated directly from stored experimental data.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-zinc-150 text-center space-y-1">
            <span className="text-[9px] font-bold text-zinc-900 uppercase tracking-widest block font-mono">Agreement ≠ Correctness</span>
            <p className="text-[10px] text-zinc-600 leading-normal">
              Consensus and accuracy are treated as separate concepts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
