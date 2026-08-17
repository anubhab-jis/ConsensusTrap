# ConsensusTrap --- Multi-Agent LLM Reliability Lab

> **A research-oriented web application for studying agreement,
> diversity, and reliability in LLM-generated answers.**

ConsensusTrap is an experimental AI reliability lab designed to
investigate whether multiple LLM responses converge on the same answer
and how that convergence can be measured.

## Why ConsensusTrap?

Large Language Models can produce different answers to the same
question. Agreement between outputs can be useful, but high agreement
does **not automatically mean correctness**.

The central research question is:

> **When multiple LLM agents answer the same question, how consistently
> do they agree, and what can we learn from disagreement?**

The application makes the experiment observable instead of hiding the
intermediate outputs.

## Core Features

### Experiment Configuration

-   Research-question input
-   Optional system-prompt override
-   Temperature control
-   Repetition/run configuration
-   Experimental-condition selection

### Gemini-Powered Experimentation

-   Gemini model inference
-   Controlled experiment execution
-   Experiment history and status tracking
-   Visible handling of unsuccessful runs

### Reliability Metrics

The results interface surfaces: - **Agreement Score** - **Diversity
Rating** - **Mean Latency** - Experiment status - Agent success/failure
state

### Agent Output Inspector

Individual agent outputs can be inspected for: - Normalized
categorization - Confidence rating - Preceding/shared context - Detailed
rationale/output

### Experiment History

Results can be reviewed with: - Experiment IDs - Conditions -
Timestamps - Research questions - Agreement/diversity measurements -
Individual-agent inspection

### Data Export

The interface provides JSON/CSV export actions for experiment results
where enabled by the application.

## Example Experiment

A question such as:

``` text
What are the three laws of gravity?
```

can be submitted and evaluated. The results view can display the
generated answer, agreement, diversity, latency, and agent-level
details.

The project is designed to make model behavior inspectable rather than
presenting only a final answer.

## Research Integrity

> **Failures should be recorded as failures, not hidden or replaced with
> fabricated success.**

This principle is important for reliability research. API failures,
malformed responses, latency issues, and model variability can
themselves be meaningful experimental observations.

## Methodology

A typical experiment follows:

``` text
Research Question
       â†“
Experimental Condition
       â†“
Prompt / Temperature Configuration
       â†“
LLM Inference
       â†“
Agent-Level Outputs
       â†“
Normalization / Categorization
       â†“
Agreement + Diversity Analysis
       â†“
Reliability Results
       â†“
Individual Agent Inspection
```

## Technology

The repository is a TypeScript web application using Gemini for LLM
inference.

-   TypeScript
-   React / modern web UI
-   Gemini API
-   Vite
-   Tailwind CSS
-   PostCSS
-   ESLint
-   Vitest

> Check `package.json` for the exact versions used by the current
> implementation.

## Getting Started

``` bash
git clone https://github.com/anubhab-jis/consensustrap.git
cd consensustrap
npm install
npm run dev
```

Configure the required Gemini environment variable using the
repository's `.env.example`.

**Never commit a real API key to GitHub.**

## Interpreting the Metrics

### Agreement Score

Measures how closely participating outputs converge according to the
application's normalization/aggregation logic.

**High agreement is not proof of factual correctness.**

### Diversity Rating

Indicates variation among analyzed outputs. Low diversity can indicate
strong convergence, but convergence can also result from shared model
behavior or prompt effects.

### Mean Latency

Represents the average response latency recorded for the experiment.

## Limitations

ConsensusTrap is an experimental research tool, not a factuality oracle.

-   Agreement does not guarantee correctness.
-   Confidence values should not be treated as calibrated probabilities
    unless independently validated.
-   Results depend on model, prompt, temperature, repetitions, question
    selection, and API behavior.
-   LLM outputs can change across runs.
-   API failures and rate limits can affect experiments.
-   Lexical diversity measures, if used, do not directly measure
    semantic or reasoning diversity.

## Future Research

Potential extensions include: - Ground-truth benchmark datasets -
Cross-model experiments - Repeated trials across question categories -
Semantic diversity metrics - Factuality evaluation - Statistical
significance testing - Confidence calibration - Investigation of
correlated model errors

## Responsible Use

Do not treat experiment metrics as definitive evidence of model safety,
factuality, or real-world reliability. For high-stakes decisions, use
human review and independent verification.

## Project Status

**Active experimental / research project.**

## Author

**Anubhab Guha Roy**

GitHub: https://github.com/anubhab-jis

## License

MIT License




