'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { OverviewTab } from '@/components/OverviewTab';
import { ExperimentLabTab } from '@/components/ExperimentLabTab';
import { ResultsTab } from '@/components/ResultsTab';
import { AgentAnalysisTab } from '@/components/AgentAnalysisTab';
import { MethodologyTab } from '@/components/MethodologyTab';
import { IntegrityTab } from '@/components/IntegrityTab';
import { AboutTab } from '@/components/AboutTab';
import { Experiment } from '@/lib/metrics';
import { FlaskConical } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview');
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [selectedModel, setSelectedModel] = useState("gemini-3.5-flash");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage safely inside useEffect to avoid hydration issues
  useEffect(() => {
    const saved = localStorage.getItem("CONSENSUSTRAP_EXPERIMENTS");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setExperiments(parsed);
          setIsLoaded(true);
        }, 0);
        return;
      } catch (err) {
        console.error("Failed to load local experiments history:", err);
      }
    }
    setTimeout(() => {
      setIsLoaded(true);
    }, 0);
  }, []);

  const handleExperimentComplete = (newExp: Experiment) => {
    const updated = [...experiments, newExp];
    setExperiments(updated);
    localStorage.setItem("CONSENSUSTRAP_EXPERIMENTS", JSON.stringify(updated));
    // Smooth auto-navigation to results panel
    setActiveTab("results");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center space-y-4 font-mono text-xs text-zinc-500">
        <FlaskConical className="w-10 h-10 text-black animate-spin" />
        <p>Loading ConsensusTrap Research Environment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-800 font-sans" id="applet-viewport">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        experimentsCount={experiments.length} 
      />

      {/* Main Content Workspace Grid Offset */}
      <main className="lg:pl-64 min-h-screen flex flex-col" id="main-content">
        {/* Top Minimal Lab Diagnostics Header */}
        <header className="h-16 bg-white border-b border-zinc-200 px-8 flex items-center justify-between shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Research</span>
            <span className="text-zinc-300">/</span>
            <span className="font-semibold text-zinc-900 capitalize">{activeTab.replace('_', ' ')} Overview</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-bold text-zinc-900">Live Research Protocol</div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-tighter font-mono">Model: {selectedModel}</div>
            </div>
            <div className="h-8 w-8 bg-zinc-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
          </div>
        </header>

        {/* Tab Panel Renderers */}
        <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8" id="tab-viewport">
          {activeTab === 'overview' && (
            <OverviewTab 
              experiments={experiments} 
              onNavigateToTab={(tab) => setActiveTab(tab)} 
            />
          )}

          {activeTab === 'lab' && (
            <ExperimentLabTab 
              onExperimentComplete={handleExperimentComplete}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          )}

          {activeTab === 'results' && (
            <ResultsTab 
              experiments={experiments} 
            />
          )}

          {activeTab === 'analysis' && (
            <AgentAnalysisTab 
              experiments={experiments} 
            />
          )}

          {activeTab === 'methodology' && (
            <MethodologyTab />
          )}

          {activeTab === 'integrity' && (
            <IntegrityTab />
          )}

          {activeTab === 'about' && (
            <AboutTab />
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-zinc-250/50 py-6 px-8 text-center text-xs text-zinc-400 bg-white mt-auto">
          <p>© {new Date().getFullYear()} CONSENSUSTRAP Multi-Agent LLM Reliability Lab. All Rights Reserved. Crafted for AI Safety Research.</p>
        </footer>
      </main>
    </div>
  );
}
