export interface AgentResponse {
  agentId: string;
  condition: string;
  question: string;
  prompt: string;
  model: string;
  timestamp: string;
  rawResponse?: string;
  normalizedAnswer?: string;
  confidence?: number;
  success: boolean;
  errorDetails?: string;
  latency: number;
  contextReceived?: string; // Explicitly records the exact context protocol received by this agent
}

export interface Experiment {
  id: string;
  timestamp: string;
  condition: string;
  question: string;
  model: string;
  systemPrompt?: string;
  temperature: number;
  repetitions: number;
  agents: AgentResponse[];
  metrics: {
    successfulAgents: number;
    failedAgents: number;
    modalAnswer: string;
    agreementScore: number; // 0 to 1, identical to agreement_score for backward-compatibility
    diversityScore: number; // 0 to 1, identical to diversity_score
    avgLatency: number; // identical to average_latency
    avgConfidence: number;
    
    // Improved, explicitly requested scientific metrics
    successful_response_rate: number; // Rate of successfully completed agents over total planned runs [0 to 1]
    failure_rate: number;             // Rate of failed agents over total planned runs [0 to 1]
    agreement_score: number;          // Measures group consensus rate based on normalized answer matching [0 to 1]
    diversity_score: number;          // Average pairwise lexical divergence (1 - Jaccard index) representing semantic variance [0 to 1]
    average_latency: number;          // Mean API response duration across all agents in milliseconds
    
    // camelCase aliases for stability in downstream components
    successfulResponseRate?: number;
    failureRate?: number;
    averageLatency?: number;
  };
}

/**
 * Tokenizes text and returns a set of lowercase unique words.
 * Handles basic punctuation filtering and filtering of extremely short words or noise.
 */
function getWordSet(text: string): Set<string> {
  const cleanText = text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  
  const words = cleanText.split(" ").filter(w => w.length > 2);
  return new Set(words);
}

/**
 * Computes Jaccard Similarity between two sets.
 * Jaccard = |A ∩ B| / |A ∪ B|
 */
function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 1.0;
  if (setA.size === 0 || setB.size === 0) return 0.0;
  
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  
  return intersection.size / union.size;
}

/**
 * Calculates average pairwise lexical diversity (1 - Jaccard Similarity) across a list of texts.
 */
export function calculateLexicalDiversity(texts: string[]): number {
  const successfulTexts = texts.filter(t => t && t.trim().length > 0);
  if (successfulTexts.length <= 1) return 0.0;

  const sets = successfulTexts.map(getWordSet);
  let totalDistance = 0;
  let pairsCount = 0;

  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      const similarity = jaccardSimilarity(sets[i], sets[j]);
      const distance = 1.0 - similarity; // Diversity is 1 - similarity
      totalDistance += distance;
      pairsCount++;
    }
  }

  return pairsCount > 0 ? totalDistance / pairsCount : 0.0;
}

/**
 * Computes full statistical metrics for an experiment run
 */
export function computeExperimentMetrics(agents: AgentResponse[]): Experiment["metrics"] {
  const successful = agents.filter(a => a.success);
  const failed = agents.filter(a => !a.success);

  const totalCount = agents.length || 1;
  const successfulCount = successful.length;
  const failedCount = failed.length;

  const successfulResponseRate = successfulCount / totalCount;
  const failureRate = failedCount / totalCount;

  // Averages
  const totalLatency = agents.reduce((sum, a) => sum + a.latency, 0);
  const avgLatency = totalCount > 0 ? totalLatency / totalCount : 0;

  if (successfulCount === 0) {
    return {
      successfulAgents: 0,
      failedAgents: failedCount,
      modalAnswer: "N/A",
      agreementScore: 0,
      diversityScore: 0,
      avgLatency,
      avgConfidence: 0,
      successful_response_rate: successfulResponseRate,
      failure_rate: failureRate,
      agreement_score: 0,
      diversity_score: 0,
      average_latency: avgLatency,
      successfulResponseRate,
      failureRate,
      averageLatency: avgLatency
    };
  }

  // Calculate modal answer (the most common normalized answer)
  const frequencyMap: Record<string, number> = {};
  successful.forEach(a => {
    const val = (a.normalizedAnswer || "").trim().toUpperCase();
    frequencyMap[val] = (frequencyMap[val] || 0) + 1;
  });

  let modalAnswer = "";
  let maxCount = 0;
  Object.entries(frequencyMap).forEach(([ans, count]) => {
    if (count > maxCount) {
      maxCount = count;
      modalAnswer = ans;
    }
  });

  // If there's only one successful agent, agreement is 100% (1.0).
  // Otherwise, Agreement = count of modal answer / total successful agents
  const agreementScore = successfulCount > 1 ? maxCount / successfulCount : 1.0;

  // Calculate text diversity using pairwise lexical distance on rawResponse
  const rawResponses = successful.map(a => a.rawResponse || "");
  const diversityScore = calculateLexicalDiversity(rawResponses);

  const totalConfidence = successful.reduce((sum, a) => sum + (a.confidence || 0.5), 0);
  const avgConfidence = totalConfidence / successfulCount;

  return {
    successfulAgents: successfulCount,
    failedAgents: failedCount,
    modalAnswer,
    agreementScore,
    diversityScore,
    avgLatency,
    avgConfidence,
    successful_response_rate: successfulResponseRate,
    failure_rate: failureRate,
    agreement_score: agreementScore,
    diversity_score: diversityScore,
    average_latency: avgLatency,
    successfulResponseRate,
    failureRate,
    averageLatency: avgLatency
  };
}
