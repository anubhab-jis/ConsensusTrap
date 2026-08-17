# CONSENSUSTRAP: Multi-Agent LLM Reliability Lab

An empirical AI safety and cognitive alignment platform built to pressure-test self-consistency paradigms, mixture-of-agents, and voting heuristics on LLM model families.

---

## 1. Core Research Question
The platform is designed to investigate the following core thesis:
> **"Does multi-agent agreement improve the reliability of LLM answers, or can independent agents confidently converge on identical incorrect answers (correlated error traps)?"**

As multi-agent voting networks become a standard component of scaling LLM logical performance, the platform studies whether agent errors are statistically independent (validating Condorcet's Jury Theorem) or highly aligned due to shared pre-training data corpuses and reinforcement learning heuristics.

---

## 2. Tested Experimental Conditions
The lab implements four highly controlled, sequential and concurrent inference conditions:
* **`SINGLE_AGENT`**: The control group. One model evaluates the research question exactly once to record base accuracy and formatting.
* **`INDEPENDENT_3`**: An ensemble triad. Three identical model agents evaluate the query concurrently. No agent sees the reasoning of others, measuring uncoordinated error alignment.
* **`INDEPENDENT_5`**: An ensemble pentad. Five identical model agents evaluate the query concurrently. This increases scope to study spontaneous consensus in larger groups.
* **`SHARED_CONTEXT_5`**: A sequential conformity cascade. Five agents run in sequence. Agent 1 answers blindly. Agent 2 receives the original question + Agent 1's detailed response. Subsequent agents receive all prior responses, testing conversational anchoring bias.

---

## 3. Statistical Metrics
ConsensusTrap implements two transparent, deterministic, and fully documented scientific metrics:
### A. Agreement Index (Consensus Score)
Calculates the alignment of successful agents with the primary choice:
```text
Agreement = | { i ∈ Successful : normalized_answer_i = Modal_Answer } | / | Successful |
```
Failed agents are omitted from both the numerator and denominator to safeguard calculations against distortion.

### B. Lexical Jaccard Divergence (Diversity Score)
Measures variation in agent reasoning, explanation style, and vocabulary:
1. Tokenizes and filters punctuation of raw texts to generate lowercase word-sets $W_1, W_2, ..., W_n$.
2. Pairwise Jaccard similarity between two sets is computed as:
   $$\text{Jaccard\_Sim}(W_i, W_j) = \frac{|W_i \cap W_j|}{|W_i \cup W_j|}$$
3. Lexical divergence is defined as:
   $$\text{Distance}(W_i, W_j) = 1.0 - \text{Jaccard\_Sim}(W_i, W_j)$$
4. The final **Diversity Score** is the average Jaccard Distance across all unique pairs of successful agents.

---

## 4. Technical Architecture & Tech Stack
Built with modern production-grade full-stack patterns:
* **Frontend UI**: React (SPA-style tab navigation), TypeScript, and Tailwind CSS. Responsive sidebar layout, clinical light theme design, and custom interactive SVG charts (no external heavyweight charts libraries to ensure React 19 compatibility).
* **Backend API**: Next.js 15 App Router API routes (`/app/api/*`).
* **Inference Pipeline**: Google `@google/genai` TypeScript SDK (v2.4+). All calls are conducted securely on the server-side, completely shielding the `GEMINI_API_KEY` from client-side bundles.
* **Persistence**: Hydration-safe browser-local history store (`localStorage`) with integrated JSON and CSV exports.

---

## 5. Environment Variables
To operate the workspace, configure the following variables inside your `.env` or system environment secrets:

```env
# Required: Google Gemini API Authentication Key
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Optional: The self-referential URL where this applet is hosted
APP_URL="http://localhost:3000"
```

---

## 6. Research Data & Integrity Standards
The platform enforces absolute empirical honesty:
* **No Synthetic Responses**: All data is fetched live from Gemini.
* **Honest Failures**: Failed API queries are recorded as explicit failures and logged. We never silently substitute failed calls with fabricated dummy text.
* **Consensus vs. Truth**: High agreement is never equated with correctness. It represents cognitive convergence and correlated error alignment, demonstrating the "trap."
