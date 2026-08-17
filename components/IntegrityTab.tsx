'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Award, FileText, CheckCircle } from 'lucide-react';

export function IntegrityTab() {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="integrity-workspace">
      {/* Decorative Top Accent Bar */}
      <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600" />
      
      <div className="p-8 md:p-10 space-y-8">
        {/* Header */}
        <div className="space-y-2 border-b border-slate-200 pb-6 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider">
            Scientific Ethics Manifest
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Research & Data Integrity Standards
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            A binding declaration of laboratory honesty, objective measurement, and reproducible data practices.
          </p>
        </div>

        {/* Central Manifest Statement */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" /> Binding Laboratory Commitments
          </h2>
          
          <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block">1. 100% Real Model Execution</strong>
                Every single agent response is queried live and dynamically generated from real Gemini foundational API endpoints. The application is completely free of hardcoded mock dialogs or fake agent simulation files.
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block">2. Honest API Failure Recording</strong>
                If a Gemini call fails (due to a rate limit, system overload, invalid credentials, or safety filter triggers), the platform records the event as an explicit **FAILURE** and logs the raw system error text. We never silently substitute failed queries with pre-fabricated dummy successful responses.
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block">3. Zero Synthetic Experimental Injection</strong>
                The platform contains no automatic synthetic results database. The historical experiment list remains entirely empty upon deployment; the very first data metrics must be initiated and gathered via real-time user-driven API runs.
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block">4. Separation of Consensus from Correctness</strong>
                We maintain an absolute conceptual boundary: **Agreement does not equal correctness**. The platform explicitly avoids calling a highly aligned trial &quot;correct&quot; or &quot;more accurate&quot; unless an external absolute oracle evaluation exists. We use careful semantic framing—such as &quot;agreement score&quot; rather than &quot;accuracy&quot;—to safeguard empirical integrity.
              </div>
            </div>
          </div>
        </div>

        {/* Scientific Disclosures and Safety Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="border border-slate-200 p-5 rounded-lg bg-emerald-50/20 space-y-2">
            <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" /> Objective Measurement
            </h4>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              Our lexical Jaccard distance diversity index is computed live using mathematical set intersections. Calculations are open-source, deterministic, and can be easily verified using standard text analysis libraries.
            </p>
          </div>

          <div className="border border-slate-200 p-5 rounded-lg bg-blue-50/20 space-y-2">
            <h4 className="font-bold text-blue-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" /> Peer Transparency
            </h4>
            <p className="text-xs text-blue-900/80 leading-relaxed">
              The export engine exports the complete raw experimental data package (including timestamps, response lengths, precise latencies, and prompt configurations) for external academic audits.
            </p>
          </div>
        </div>

        {/* Safety Warning */}
        <div className="p-4 bg-amber-50 border border-amber-100 text-amber-900 rounded-lg flex gap-3 text-xs" id="integrity-warning-box">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Important Operational Disclosure</p>
            <p className="opacity-90">
              When reviewing multi-agent results, remember that high agent agreement on logic traps (such as the Bat & Ball Puzzle) is empirical evidence of **common foundational training data distributions and shared model assumptions**, not of logical truth or factual accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
