'use client';

import React from 'react';
import { BookOpen, HelpCircle, Activity, Scale, Sliders } from 'lucide-react';

export function MethodologyTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 md:p-10 rounded-xl border border-zinc-200 shadow-sm animate-fade-in" id="methodology-workspace">
      {/* Title */}
      <div className="space-y-2 border-b border-zinc-200 pb-6 text-center md:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 text-zinc-850 rounded-full text-[10px] font-bold uppercase tracking-widest font-mono">
          Scientific Protocol Whitepaper
        </div>
        <h1 className="text-3xl font-black text-zinc-950 tracking-tight sm:text-4xl font-mono">
          CONSENSUSTRAP METHODOLOGY
        </h1>
        <p className="text-xs text-zinc-500 max-w-2xl uppercase tracking-wider font-mono">
          Theoretical frameworks, mathematical definitions, and programmatic execution protocols.
        </p>
      </div>

      {/* Section 1: Abstract & Core Question */}
      <div className="space-y-3 animate-fade-in" id="methodology-abstract">
        <h2 className="text-xs font-bold text-zinc-950 flex items-center gap-2 uppercase tracking-widest font-mono">
          <BookOpen className="w-4 h-4 text-black" /> Abstract & Research Objective
        </h2>
        <p className="text-xs text-zinc-600 leading-relaxed font-sans">
          The scaling of LLMs has motivated architectural designs that rely on multi-agent ensembles, self-consistency, and majority voting protocols (e.g., Voting Engines, Mixture of Agents) to improve correctness. These designs rest on an implicit assumption borrowed from human classical voting theory: <strong>that individual voter errors are statistically independent</strong> (Condorcet&apos;s Jury Theorem).
        </p>
        <p className="text-xs text-zinc-600 leading-relaxed font-sans">
          The ConsensusTrap project is a controlled research environment designed to explore whether this assumption holds, or if LLM agents instead exhibit <strong>systemic error alignment</strong>. If agents possess correlated pre-training distributions or alignment constraints, increasing agent volume will not yield superior accuracy; instead, it will simply lock in a highly confident, unified <strong>false consensus</strong>.
        </p>
      </div>

      {/* Section 2: Hypotheses */}
      <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200/80 space-y-4" id="methodology-hypotheses">
        <h3 className="font-bold text-zinc-900 text-xs uppercase tracking-widest font-mono">Experimental Hypotheses</h3>
        <div className="space-y-3 text-xs leading-relaxed">
          <p className="text-zinc-700">
            <strong className="text-zinc-950 font-bold font-mono text-[10px] uppercase tracking-wider block mb-1">Hypothesis 1 (Cognitive Homogeneity):</strong> Independent parallel agents sharing the same foundational pre-training model weights will exhibit high agreement rates (low entropy) on logic traps, even when the resulting answer is mathematically incorrect. Their errors are structurally correlated.
          </p>
          <p className="text-zinc-700">
            <strong className="text-zinc-950 font-bold font-mono text-[10px] uppercase tracking-wider block mb-1 font-sans">Hypothesis 2 (Cascade Polarization):</strong> Agents operating under sequential shared-context protocols (SHARED_CONTEXT_5) will demonstrate a progressive contraction of lexical diversity as subsequent agents conform to the early semantic anchors formulated by initial responders.
          </p>
        </div>
      </div>

      {/* Section 3: Experimental Conditions */}
      <div className="space-y-4" id="methodology-conditions">
        <h2 className="text-xs font-bold text-zinc-950 flex items-center gap-2 uppercase tracking-widest font-mono">
          <Sliders className="w-4 h-4 text-black" /> Tested Experimental Conditions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-zinc-200 p-4 rounded-lg space-y-1.5 bg-white">
            <span className="font-mono text-[10px] font-bold text-zinc-950 block uppercase tracking-wider">Condition A: SINGLE_AGENT</span>
            <p className="text-xs text-zinc-600 leading-relaxed">
              <strong>Control.</strong> A single foundational model instance answers the question exactly once. Represents baseline single-execution latency, reasoning diversity, and answer format.
            </p>
          </div>
          <div className="border border-zinc-200 p-4 rounded-lg space-y-1.5 bg-white">
            <span className="font-mono text-[10px] font-bold text-zinc-950 block uppercase tracking-wider">Condition B: INDEPENDENT_3</span>
            <p className="text-xs text-zinc-600 leading-relaxed">
              <strong>Ensemble Triad.</strong> Three identical agent instances query the model concurrently. Responses are formulated independently, with zero cross-agent context leakage.
            </p>
          </div>
          <div className="border border-zinc-200 p-4 rounded-lg space-y-1.5 bg-white">
            <span className="font-mono text-[10px] font-bold text-zinc-950 block uppercase tracking-wider">Condition C: INDEPENDENT_5</span>
            <p className="text-xs text-zinc-600 leading-relaxed">
              <strong>Ensemble Pentad.</strong> Five identical agents query the model concurrently, allowing higher granularity consensus tracking. Models are blind to one another&apos;s reasoning.
            </p>
          </div>
          <div className="border border-zinc-200 p-4 rounded-lg space-y-1.5 bg-white">
            <span className="font-mono text-[10px] font-bold text-zinc-950 block uppercase tracking-wider">Condition D: SHARED_CONTEXT_5</span>
            <p className="text-xs text-zinc-600 leading-relaxed">
              <strong>Conformity Sequence.</strong> Five agents run in sequence. Agent 1 answers blindly. Agent 2 receives the original question + Agent 1&apos;s detailed reply. Subsequent agents receive all preceding answers, forming a sequential cascade.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Mathematical Metrics Formulation */}
      <div className="space-y-6 border-t border-zinc-200 pt-6" id="methodology-mathematics">
        <h2 className="text-xs font-bold text-zinc-950 flex items-center gap-2 uppercase tracking-widest font-mono">
          <Scale className="w-4 h-4 text-black" /> Statistical Metrics Formulation
        </h2>

        {/* Agreement Metric */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-zinc-900 font-mono uppercase tracking-wider">1. Consensus / Agreement Index</h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Consensus measures the alignment rate of participating agents on a single dominant choice. Let <span className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-[10px]">S</span> be the set of successfully completed agent requests, and <span className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-[10px]">a_i</span> be the normalized answer of agent <span className="font-mono">i</span>. Let <span className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-[10px]">M</span> be the modal answer value in <span className="font-mono">S</span>.
          </p>
          <div className="bg-zinc-50 p-4 rounded-lg text-center font-mono text-xs text-zinc-800 font-bold border border-zinc-200 shadow-inner">
            Agreement = |{"{"} i ∈ S : a_i = M {"}"}| / |S|
          </div>
          <p className="text-[10px] text-zinc-500 italic font-mono leading-relaxed">
            Failed agents do not participate in the denominator of the agreement score to prevent false deflation or inflation. If |S| = 0, Agreement is defined as 0.0. If |S| = 1, Agreement is 1.0.
          </p>
        </div>

        {/* Diversity Metric */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-zinc-900 font-mono uppercase tracking-wider">2. Lexical Jaccard Divergence (Diversity Metric)</h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            While voting matches short normalized choices, raw text diversity measures the variation in reasoning style, step structures, and semantic formulation. This laboratory computes the average pairwise Jaccard Distance of word-sets.
          </p>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Let text responses be tokenized, lowercase, and filtered for standard punctuation to yield word-sets <span className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-[10px]">W_1, W_2, ... W_n</span>. The Jaccard Similarity between two sets is:
          </p>
          <div className="bg-zinc-50 p-4 rounded-lg text-center font-mono text-xs text-zinc-800 font-bold border border-zinc-200 shadow-inner">
            Jaccard_Sim(W_i, W_j) = |W_i ∩ W_j| / |W_i ∪ W_j|
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            The Jaccard Lexical Distance (Divergence) is defined as:
          </p>
          <div className="bg-zinc-50 p-4 rounded-lg text-center font-mono text-xs text-zinc-800 font-bold border border-zinc-200 shadow-inner">
            Distance(W_i, W_j) = 1.0 - Jaccard_Sim(W_i, W_j)
          </div>
          <p className="text-xs text-zinc-600 leading-relaxed">
            The final Diversity Score is the mean distance across all unique pairs of successful agents:
          </p>
          <div className="bg-zinc-50 p-4 rounded-lg text-center font-mono text-xs text-zinc-800 font-bold border border-zinc-200 shadow-inner">
            Diversity Score = Σ Distance(W_i, W_j) / (N * (N - 1) / 2)
          </div>
        </div>
      </div>

      {/* Section 5: Robust Failure Handling & Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-zinc-200 pt-6" id="methodology-limits">
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 uppercase font-mono tracking-wider">
            <Activity className="w-4 h-4 text-black" /> Rate-Limit & Failure Handling
          </h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Our sequential execution pipeline incorporates small 300ms network spacing between agent runs. This protects against burst rate limits and transient server errors. 
          </p>
          <p className="text-xs text-zinc-600 leading-relaxed">
            API errors (e.g., 401 Unauthorized, 429 Quota Exhausted, 404 Model Not Found) are not suppressed, fabricated, or replaced with dummy successful text. They are logged honestly and recorded as FAILURES.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 uppercase font-mono tracking-wider">
            <HelpCircle className="w-4 h-4 text-black" /> Academic Disclosures & Limits
          </h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            1. **Lexical Proxy:** Lexical divergence (Jaccard Distance) serves as a proxy for semantic diversity. Future iterations could incorporate embedding-based cosine similarity to capture deep semantic variations.
          </p>
          <p className="text-xs text-zinc-600 leading-relaxed">
            2. **Factual Correctness Signal:** The system explicitly measures agreement and formatting patterns. Because of the open-ended nature of custom user prompts, accuracy is evaluated visually and textually by the researcher rather than automated by heuristics.
          </p>
        </div>
      </div>
    </div>
  );
}
