'use client';

import React from 'react';
import { Award, Mail, Cpu, Globe, GraduationCap } from 'lucide-react';

export function AboutTab() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in" id="about-workspace">
      {/* Bio / Proposal Card */}
      <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-zinc-200 text-center md:text-left">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center text-black flex-shrink-0">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-100 text-zinc-850 rounded-full text-[9px] font-bold uppercase tracking-widest font-mono">
              Fellowship Proposal Workspace
            </div>
            <h2 className="text-2xl font-black text-zinc-950 tracking-tight font-mono uppercase">
              CONSENSUSTRAP PORTFOLIO
            </h2>
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-mono">
              Submitted for competitive AI Research Fellowships and Technical Review Boards.
            </p>
          </div>
        </div>

        {/* Project Vision */}
        <div className="space-y-3">
          <h3 className="font-bold text-zinc-900 text-xs uppercase tracking-widest font-mono">Mission & Platform Vision</h3>
          <p className="text-xs text-zinc-600 leading-relaxed font-sans">
            ConsensusTrap was founded with a singular technical vision: **to expose and measure the empirical limits of voting-based LLM architectures.**
          </p>
          <p className="text-xs text-zinc-600 leading-relaxed font-sans">
            As multi-agent mixtures and self-consistency loops become standard industry components for complex agentic workflows, understanding when these systems produce cascading error traps is of paramount importance for safe and robust AI deployments. This lab empowers researchers to design bespoke cognitive pressure-tests, capture multi-agent answers, and audit semantic alignment dynamics.
          </p>
        </div>

        {/* Tech Stack */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-zinc-900 text-xs uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-black" /> Laboratory Technical Stack
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-[10px] font-mono">
            <div className="bg-zinc-50/50 p-3 rounded-lg border border-zinc-200">
              <span className="text-zinc-400 block mb-0.5">Runtime Architecture</span>
              <strong className="text-zinc-850">Next.js 15+ App Router</strong>
            </div>
            <div className="bg-zinc-50/50 p-3 rounded-lg border border-zinc-200">
              <span className="text-zinc-400 block mb-0.5">Inference SDK</span>
              <strong className="text-zinc-850">@google/genai SDK v2.4+</strong>
            </div>
            <div className="bg-zinc-50/50 p-3 rounded-lg border border-zinc-200">
              <span className="text-zinc-400 block mb-0.5">Language Standard</span>
              <strong className="text-zinc-850">TypeScript / Strict Mode</strong>
            </div>
            <div className="bg-zinc-50/50 p-3 rounded-lg border border-zinc-200">
              <span className="text-zinc-400 block mb-0.5">Style Framework</span>
              <strong className="text-zinc-850">Tailwind CSS v4</strong>
            </div>
            <div className="bg-zinc-50/50 p-3 rounded-lg border border-zinc-200">
              <span className="text-zinc-400 block mb-0.5">Data Calculations</span>
              <strong className="text-zinc-850">Word Set Jaccard Index</strong>
            </div>
            <div className="bg-zinc-50/50 p-3 rounded-lg border border-zinc-200">
              <span className="text-zinc-400 block mb-0.5">Model Support</span>
              <strong className="text-zinc-850">Gemini 3 Flash & Pro</strong>
            </div>
          </div>
        </div>

        {/* Future Work */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-zinc-900 text-xs uppercase tracking-widest font-mono">Future Development Roadmap</h3>
          <ul className="list-disc pl-5 text-xs text-zinc-600 space-y-2 font-sans">
            <li>
              <strong>Semantic Embedding Distance:</strong> Transitioning from Jaccard Lexical Distance to high-dimensional embedding vectors for deeper semantic divergence tracking.
            </li>
            <li>
              <strong>Cross-Model Heterogeneous Ensembles:</strong> Testing consensus between completely distinct model families (e.g. mixture of Gemini and custom fine-tuned logic engines) to isolate brand biases.
            </li>
            <li>
              <strong>Active Self-Correction Loops:</strong> Introducing real-time peer critique protocols to evaluate if debate rounds reduce or exacerbate false consensus.
            </li>
          </ul>
        </div>
      </div>

      {/* Fellowship Submission Metadata Sidebar */}
      <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200 space-y-4">
        <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-widest flex items-center gap-1.5 font-mono">
          <Award className="w-4 h-4 text-black" /> Fellowship Contact & Submission Info
        </h4>
        <p className="text-xs text-zinc-500 leading-relaxed font-sans">
          This system was built with production-grade engineering principles to serve as a serious showcase of empirical LLM safety auditing tools. If you have inquiries or wish to collaborate on agentic safety research, please establish contact:
        </p>
        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-600">Email: guharoyanubhab@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-600">Development: Cloud Run Standalone</span>
          </div>
        </div>
      </div>
    </div>
  );
}
