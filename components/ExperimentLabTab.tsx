'use client';

import React, { useState, useRef } from 'react';
import { Experiment, AgentResponse, computeExperimentMetrics } from '@/lib/metrics';
import { Play, CheckCircle, XCircle, AlertCircle, RefreshCw, HelpCircle, Sparkles, StopCircle, User, Users, Network, Code } from 'lucide-react';

interface ExperimentLabTabProps {
  onExperimentComplete: (experiment: Experiment) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const COGNITIVE_PRESETS = [
  {
    title: "Bat & Ball Classic (Refined)",
    description: "Classic cognitive reflection test where models frequently align on the intuitive but mathematically incorrect answer.",
    question: "A smartphone and a leather case cost $110 in total. The smartphone costs $100 more than the leather case. How much does the case cost? Provide a single clear numerical dollar amount first, then explain your math step-by-step.",
    systemPrompt: "You are a precise mathematical logical agent. Your goal is to bypass fast intuitive traps and compute mathematically rigorous answers."
  },
  {
    title: "Syllogistic Fallacy Trap",
    description: "Complex deductive logic riddle testing if models can resist agreeing on invalid assumptions.",
    question: "Consider these three statements:\n1. All Wubgles are Spegals.\n2. No Spegals are Gribbles.\n3. Some Gribbles are Flips.\n\nBased strictly on these rules, is it possible for some Wubgles to be Gribbles? Answer with a single word ('Yes' or 'No') first, then provide a formal mathematical set-theory explanation of your reasoning.",
    systemPrompt: "You are a formal symbolic logic analyzer. Map statements to Euler circles or formal logic sets, validating your conclusion with extreme rigor."
  },
  {
    title: "The Monty Hall Dilemma",
    description: "Famous probability paradox that tests mathematical model consensus and cognitive anchors.",
    question: "You are on a game show with 3 doors (A, B, C). Behind one door is a sports car; behind the other two are goats. You choose Door A. The host, who knows exactly what is behind every door, opens Door B, revealing a goat. The host then asks: 'Do you want to switch to Door C or stick with Door A?'\n\nWhich choice (Switch or Stay) yields the higher mathematical probability of winning the car, and what is the exact probability of winning for each option? State 'Switch' or 'Stay' first, then explain the probability distribution.",
    systemPrompt: "You are an advanced Bayesian probability theory engine. Think step-by-step using conditional probability matrices."
  }
];

function generateExperimentId(): string {
  return `EXP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export function ExperimentLabTab({ onExperimentComplete, selectedModel, setSelectedModel }: ExperimentLabTabProps) {
  // Connection Test States
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean;
    message: string;
    model: string;
    status?: number;
  } | null>(null);

  // Form Parameters
  const [question, setQuestion] = useState("");
  const [condition, setCondition] = useState("SINGLE_AGENT");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [repetitions, setRepetitions] = useState(1);

  // Execution States
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); 
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentAgentStatus, setCurrentAgentStatus] = useState<string>("");
  const [activeResponses, setActiveResponses] = useState<AgentResponse[]>([]);
  const cancelRequested = useRef(false);

  // Connection Test
  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    try {
      const response = await fetch("/api/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: selectedModel })
      });
      const data = await response.json();
      setConnectionResult({
        success: data.success,
        message: data.message,
        model: data.model,
        status: response.status
      });
    } catch (err: any) {
      setConnectionResult({
        success: false,
        message: err.message || "Network request failed",
        model: selectedModel,
        status: 500
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const getAgentCount = (cond: string): number => {
    switch (cond) {
      case "SINGLE_AGENT": return 1;
      case "INDEPENDENT_3": return 3;
      case "INDEPENDENT_5": return 5;
      case "SHARED_CONTEXT_5": return 5;
      default: return 1;
    }
  };

  const applyPreset = (preset: typeof COGNITIVE_PRESETS[0]) => {
    if (isRunning) return;
    setQuestion(preset.question);
    setSystemPrompt(preset.systemPrompt);
  };

  // Execution Pipeline
  const executeExperimentSequence = async (
    targetQuestion: string,
    targetSystemPrompt: string,
    targetCondition: string,
    targetTemp: number,
    targetReps: number
  ) => {
    setIsRunning(true);
    cancelRequested.current = false;
    setActiveResponses([]);
    
    const count = getAgentCount(targetCondition);
    const totalRuns = count * targetReps;
    setTotalSteps(totalRuns);
    setCurrentStep(0);

    // Initial phase step
    setCurrentAgentStatus("Preparing experiment...");
    const accumulatedResponses: AgentResponse[] = [];

    // Loop through Repetitions and Agents
    for (let r = 0; r < targetReps; r++) {
      if (cancelRequested.current) break;
      const sharedContextAccumulator: any[] = [];

      for (let a = 0; a < count; a++) {
        if (cancelRequested.current) break;

        const globalStepIndex = r * count + a;
        setCurrentStep(globalStepIndex + 1);
        setCurrentAgentStatus(`Agent ${a + 1}/${count} (Repetition ${r + 1}/${targetReps})`);

        try {
          const payloadSharedContext = targetCondition === "SHARED_CONTEXT_5" ? sharedContextAccumulator : [];

          // Wait 300ms spacing to prevent ratelimit spikes
          await new Promise(resolve => setTimeout(resolve, 300));

          const res = await fetch("/api/agent/run", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "X-Condition": targetCondition
            },
            body: JSON.stringify({
              question: targetQuestion,
              systemPrompt: targetSystemPrompt,
              model: selectedModel,
              temperature: targetTemp,
              agentIndex: a,
              condition: targetCondition,
              sharedContext: payloadSharedContext
            })
          });

          const data = await res.json();

          if (res.ok && data.success) {
            const agentRes: AgentResponse = {
              agentId: data.agentId,
              condition: data.condition,
              question: data.question,
              prompt: data.prompt,
              model: data.model,
              timestamp: data.timestamp,
              rawResponse: data.rawResponse,
              normalizedAnswer: data.normalizedAnswer,
              confidence: data.confidence,
              success: true,
              latency: data.latency,
              contextReceived: data.contextReceived
            };
            
            accumulatedResponses.push(agentRes);
            setActiveResponses([...accumulatedResponses]);

            if (targetCondition === "SHARED_CONTEXT_5") {
              sharedContextAccumulator.push({
                normalizedAnswer: data.normalizedAnswer,
                rawResponse: data.rawResponse
              });
            }
          } else {
            const failedRes: AgentResponse = {
              agentId: `Agent_${targetCondition}_#${a + 1}_ERR`,
              condition: targetCondition,
              question: targetQuestion,
              prompt: targetQuestion,
              model: selectedModel,
              timestamp: new Date().toISOString(),
              success: false,
              errorDetails: data.errorDetails || data.error || "Gemini execution error",
              latency: data.latency || 0,
              contextReceived: targetCondition === "SHARED_CONTEXT_5" 
                ? `Sequential context chain broken at index ${a}` 
                : "None (Independent Isolation)"
            };
            accumulatedResponses.push(failedRes);
            setActiveResponses([...accumulatedResponses]);

            if (targetCondition === "SHARED_CONTEXT_5") {
              setCurrentAgentStatus(`Sequential context chain aborted due to Agent ${a + 1} failure.`);
              break;
            }
          }

        } catch (err: any) {
          const failedRes: AgentResponse = {
            agentId: `Agent_${targetCondition}_#${a + 1}_NET_ERR`,
            condition: targetCondition,
            question: targetQuestion,
            prompt: targetQuestion,
            model: selectedModel,
            timestamp: new Date().toISOString(),
            success: false,
            errorDetails: err.message || "Network / timeout error connecting to app server",
            latency: 0,
            contextReceived: targetCondition === "SHARED_CONTEXT_5" 
              ? `Sequential context chain broken at index ${a} due to network timeout` 
              : "None (Independent Isolation)"
          };
          accumulatedResponses.push(failedRes);
          setActiveResponses([...accumulatedResponses]);

          if (targetCondition === "SHARED_CONTEXT_5") {
            setCurrentAgentStatus(`Sequential context chain aborted due to Agent ${a + 1} network failure.`);
            break;
          }
        }
      }
    }

    if (accumulatedResponses.length > 0 && !cancelRequested.current) {
      setCurrentAgentStatus("Calculating metrics...");
      await new Promise(resolve => setTimeout(resolve, 600));

      const calculatedMetrics = computeExperimentMetrics(accumulatedResponses);
      
      const newExperiment: Experiment = {
        id: generateExperimentId(),
        timestamp: new Date().toISOString(),
        condition: targetCondition,
        question: targetQuestion,
        model: selectedModel,
        systemPrompt: targetSystemPrompt || undefined,
        temperature: targetTemp,
        repetitions: targetReps,
        agents: accumulatedResponses,
        metrics: calculatedMetrics
      };

      setCurrentAgentStatus("Complete");
      await new Promise(resolve => setTimeout(resolve, 300));
      onExperimentComplete(newExperiment);
      
      setQuestion("");
      setSystemPrompt("");
    }
    
    setIsRunning(false);
  };

  const handleRunExperiment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    await executeExperimentSequence(question, systemPrompt, condition, temperature, repetitions);
  };

  const handleCancel = () => {
    cancelRequested.current = true;
    setIsRunning(false);
    setCurrentAgentStatus("Experiment cancelled by user.");
  };

  const cardDefinitions = [
    {
      id: "SINGLE_AGENT",
      title: "Single Agent",
      icon: User,
      agents: "1 Agent",
      sharing: "Strict Isolation",
      purpose: "Baseline control profile to measure single-model response reasoning.",
      color: "border-zinc-200 bg-white hover:border-black",
      activeColor: "border-black bg-zinc-50/50 text-zinc-900 ring-1 ring-black"
    },
    {
      id: "INDEPENDENT_3",
      title: "Independent 3",
      icon: Users,
      agents: "3 Agents",
      sharing: "Strict Parallel Isolation",
      purpose: "Measures consensus weights across a parallel, isolated group triad.",
      color: "border-zinc-200 bg-white hover:border-black",
      activeColor: "border-black bg-zinc-50/50 text-zinc-900 ring-1 ring-black"
    },
    {
      id: "INDEPENDENT_5",
      title: "Independent 5",
      icon: Network,
      agents: "5 Agents",
      sharing: "Strict Parallel Isolation",
      purpose: "Broader parallel validation size to stress-test uncoordinated correlation errors.",
      color: "border-zinc-200 bg-white hover:border-black",
      activeColor: "border-black bg-zinc-50/50 text-zinc-900 ring-1 ring-black"
    },
    {
      id: "SHARED_CONTEXT_5",
      title: "Shared Context 5",
      icon: Code,
      agents: "5 Agents",
      sharing: "Sequential Accumulation",
      purpose: "Investigates social conformity decay and cognitive cascade polarization.",
      color: "border-zinc-200 bg-white hover:border-black",
      activeColor: "border-black bg-zinc-50/50 text-zinc-900 ring-1 ring-black"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in" id="experiment-lab">
      {/* Connection Test */}
      <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4" id="connection-test">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-zinc-900 text-lg">Gemini Connection Gateway</h3>
            <p className="text-xs text-zinc-500">
              Confirm model endpoint mapping and server-side secret clearance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={testingConnection || isRunning}
              className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-950 font-mono"
            >
              <option value="gemini-3.5-flash">gemini-3.5-flash</option>
              <option value="gemini-3.7-flash">gemini-3.7-flash</option>
            </select>
            <button
              onClick={handleTestConnection}
              disabled={testingConnection || isRunning}
              className="px-4 py-1.5 bg-black hover:bg-zinc-800 disabled:bg-zinc-200 text-white disabled:text-zinc-400 font-extrabold uppercase text-[10px] tracking-wider rounded-lg transition flex items-center gap-2 cursor-pointer"
            >
              {testingConnection ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Test Connection"}
            </button>
          </div>
        </div>

        {connectionResult && (
          <div className={`p-4 rounded-lg flex items-start gap-3 border ${
            connectionResult.success 
              ? 'bg-zinc-50 border-zinc-200 text-zinc-900' 
              : 'bg-zinc-100 border-zinc-250 text-zinc-800'
          }`}>
            {connectionResult.success ? (
              <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-zinc-500 mt-0.5 flex-shrink-0" />
            )}
            <div className="text-xs space-y-1">
              <p className="font-bold font-mono">
                {connectionResult.success ? "✓ Gemini connection successful" : "✗ Gemini connection failed"}
              </p>
              <p className="opacity-90">{connectionResult.message}</p>
              <p className="text-[10px] opacity-75 font-mono">
                Model: {connectionResult.model}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preset Library */}
      <div className="space-y-3" id="presets-section">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
          <h4 className="font-bold text-zinc-800 text-xs tracking-widest uppercase font-mono">Select Cognitive Trap Presets</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COGNITIVE_PRESETS.map((preset, idx) => (
            <div
              key={idx}
              className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-1.5">
                <span className="font-bold text-zinc-900 text-xs uppercase tracking-wide font-mono block">{preset.title}</span>
                <p className="text-xs text-zinc-500 leading-relaxed">{preset.description}</p>
              </div>
              <button
                type="button"
                onClick={() => applyPreset(preset)}
                disabled={isRunning}
                className="w-full text-center px-2.5 py-1.5 text-[10px] uppercase tracking-wider font-extrabold text-zinc-700 hover:text-black bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition cursor-pointer disabled:opacity-50"
              >
                Load Parameters
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Experiment Cards Selection Grid */}
      <div className="space-y-3" id="condition-cards-selection">
        <h4 className="font-bold text-zinc-800 text-xs tracking-widest uppercase font-mono">1. Choose Experimental Condition</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {cardDefinitions.map((cCard) => {
            const Icon = cCard.icon;
            const isSelected = condition === cCard.id;
            return (
              <button
                key={cCard.id}
                type="button"
                onClick={() => !isRunning && setCondition(cCard.id)}
                disabled={isRunning}
                className={`p-5 rounded-xl border text-left flex flex-col justify-between h-56 transition-all ${
                  isSelected ? cCard.activeColor : cCard.color
                } cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-bold font-mono uppercase bg-slate-200/50 px-2 py-0.5 rounded text-slate-700">
                      {cCard.agents}
                    </span>
                  </div>
                  <h5 className="font-extrabold text-slate-900 text-sm">{cCard.title}</h5>
                  <p className="text-[11px] text-slate-500 leading-normal">{cCard.purpose}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/50 flex justify-between text-[9px] font-mono text-slate-400">
                  <span>SHARING:</span>
                  <span className="font-bold uppercase text-slate-700">{cCard.sharing}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lab Form parameters */}
      <form onSubmit={handleRunExperiment} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-6" id="experiment-lab-form">
        <h4 className="font-bold text-zinc-800 text-xs tracking-widest uppercase font-mono">2. Configure Input Prompts & Temperature</h4>

        <div className="space-y-4">
          {/* Question Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
              Research Question <span title="The prompt evaluated by all agents."><HelpCircle className="w-3.5 h-3.5 text-zinc-400" /></span>
            </label>
            <textarea
              required
              rows={4}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your cognitive riddle here or click one of our curated presets above..."
              disabled={isRunning}
              className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 transition resize-none placeholder:text-zinc-400 font-sans"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* System Prompt Override */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
                System Prompt Override (Optional)
              </label>
              <input
                type="text"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Defaults to standard logic solver instructions..."
                disabled={isRunning}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950"
              />
            </div>

            {/* Slide Temp and Repetitions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
                  Temperature ({temperature})
                </label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  disabled={isRunning}
                  className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider block">
                  Repetitions (Runs)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={repetitions}
                  onChange={(e) => setRepetitions(Math.max(1, parseInt(e.target.value) || 1))}
                  disabled={isRunning}
                  className="w-full px-3 py-1.5 bg-zinc-50 border border-zinc-200 text-zinc-800 text-xs rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Trigger */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isRunning || !question.trim()}
            className="px-6 py-2.5 bg-black hover:bg-zinc-800 disabled:bg-zinc-100 text-white disabled:text-zinc-400 font-extrabold uppercase text-xs tracking-wider rounded-lg transition flex items-center gap-2 shadow-sm cursor-pointer animate-fade-in"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Run Selected Condition Trial
          </button>
        </div>
      </form>

      {/* PIPELINE PROGRESS STATE VISUALIZATION */}
      {isRunning && (
        <div className="bg-zinc-950 text-white p-6 rounded-xl border border-zinc-900 shadow-xl space-y-6 animate-fade-in" id="progress-pipeline">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-mono text-xs font-bold uppercase text-zinc-300 tracking-widest">Experiment Pipeline Execution Logs</h4>
              <p className="text-xs text-zinc-500">Actively requesting the model ensemble...</p>
            </div>
            <button
              onClick={handleCancel}
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 text-[10px] uppercase tracking-wider font-extrabold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <StopCircle className="w-3.5 h-3.5" /> Abort Running Trial
            </button>
          </div>

          {/* Sequential Phases Progress Block */}
          <div className="border border-zinc-900 bg-black p-4 rounded-lg space-y-4">
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-white">✓</span>
                <span className="text-zinc-400">Preparing experiment</span>
              </div>

              {/* Dynamic steps for agent calls */}
              {Array.from({ length: getAgentCount(condition) }).map((_, idx) => {
                const stepVal = idx + 1;
                const isFinished = activeResponses.length >= stepVal;
                const isCurrent = activeResponses.length === idx;
                return (
                  <div key={idx} className="flex items-center gap-2 pl-4">
                    {isFinished ? (
                      <span className="text-white">✓</span>
                    ) : isCurrent ? (
                      <span className="text-white animate-spin">◪</span>
                    ) : (
                      <span className="text-zinc-700">○</span>
                    )}
                    <span className={isCurrent ? 'text-white font-bold' : isFinished ? 'text-zinc-400' : 'text-zinc-600'}>
                      Agent {stepVal}/{getAgentCount(condition)} {isCurrent && "— Querying model live..."}
                    </span>
                  </div>
                );
              })}

              <div className="flex items-center gap-2">
                {currentAgentStatus === "Complete" || currentAgentStatus === "Calculating metrics..." ? (
                  <span className="text-white">✓</span>
                ) : (
                  <span className="text-zinc-700">○</span>
                )}
                <span className={currentAgentStatus === "Calculating metrics..." ? 'text-zinc-300 font-bold' : 'text-zinc-600'}>
                  Calculating metrics
                </span>
              </div>

              <div className="flex items-center gap-2">
                {currentAgentStatus === "Complete" ? (
                  <span className="text-white">✓</span>
                ) : (
                  <span className="text-zinc-700">○</span>
                )}
                <span className={currentAgentStatus === "Complete" ? 'text-white font-bold' : 'text-zinc-600'}>
                  Complete
                </span>
              </div>
            </div>

            {/* Simple progress bar */}
            <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Render nodes */}
          <div className="space-y-2 max-h-48 overflow-y-auto" id="pipeline-active-nodes">
            {activeResponses.map((res, index) => (
              <div key={index} className="flex items-center justify-between p-2.5 rounded bg-zinc-900/50 border border-zinc-900 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${res.success ? 'bg-white' : 'bg-zinc-600'}`} />
                  <span className="font-bold text-zinc-300">{res.agentId}</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-400">
                  {res.success ? (
                    <>
                      <span className="text-white font-bold">&quot;{res.normalizedAnswer}&quot;</span>
                      <span>{(res.latency / 1000).toFixed(1)}s</span>
                    </>
                  ) : (
                    <span className="text-zinc-500 font-bold">{res.errorDetails || "Failed"}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
