'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  FlaskConical, 
  FileSpreadsheet, 
  SlidersHorizontal, 
  Layers, 
  ShieldCheck, 
  Info,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  experimentsCount: number;
}

export function Sidebar({ activeTab, setActiveTab, experimentsCount }: SidebarProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'lab', label: 'Experiment Lab', icon: FlaskConical },
    { id: 'results', label: 'Results', icon: FileSpreadsheet, badge: experimentsCount > 0 ? experimentsCount : undefined },
    { id: 'analysis', label: 'Agent Analysis', icon: SlidersHorizontal },
    { id: 'methodology', label: 'Methodology', icon: Layers },
    { id: 'integrity', label: 'Research Integrity', icon: ShieldCheck },
    { id: 'about', label: 'About', icon: Info }
  ];

  return (
    <div className="w-full lg:w-64 bg-zinc-950 text-zinc-300 flex flex-col h-auto lg:h-screen lg:fixed lg:top-0 lg:left-0 border-r border-zinc-900 z-30" id="sidebar-panel">
      {/* Brand Title */}
      <div className="p-6 border-b border-zinc-900 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-extrabold tracking-tight leading-none uppercase font-mono">CONSENSUSTRAP</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Reliability Lab</span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto" id="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer group focus:outline-none focus:ring-1 focus:ring-zinc-500 ${
                isActive 
                  ? 'bg-white text-black font-extrabold shadow-sm' 
                  : 'hover:bg-zinc-900 hover:text-white text-zinc-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-zinc-500 group-hover:text-white'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-zinc-200 text-black' : 'bg-zinc-900 text-zinc-500'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Diagnostic status block */}
      <div className="p-4 border-t border-zinc-900 space-y-2 font-mono">
        <div className="bg-zinc-900/40 rounded-lg p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Gemini Status</span>
            <span className="flex h-2 w-2 rounded-full bg-zinc-100" />
          </div>
          <p className="text-[9px] text-zinc-400 leading-relaxed">
            OAuth Configured. Server-side inferences secure.
          </p>
        </div>
      </div>
    </div>
  );
}
