import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let requestedModel = "gemini-3.5-flash";
  let agentIndex = 0;
  let condition = "SINGLE_AGENT";

  try {
    const body = await req.json();
    const {
      question,
      systemPrompt,
      model = "gemini-3.5-flash",
      temperature = 0.7,
      sharedContext = []
    } = body;

    agentIndex = body.agentIndex ?? 0;
    condition = body.condition ?? "SINGLE_AGENT";
    requestedModel = model;

    if (!question || typeof question !== "string") {
      return NextResponse.json({
        success: false,
        error: "Question is required and must be a string."
      }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "Gemini API key is not configured in the system environment."
      }, { status: 401 });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Assemble contents according to condition protocol
    let promptText = question;

    // For SHARED_CONTEXT_5, append previous agents' responses
    if (condition === "SHARED_CONTEXT_5" && sharedContext && sharedContext.length > 0) {
      promptText = `You are performing a peer-consensus research study.
Here is the original research question:
"${question}"

Below are the exact transcripts of answers provided by other agents in your group, in sequential order:

${sharedContext.map((c: any, index: number) => {
  return `--- AGENT ${index + 1} RESPONSED: ---
Normalized Choice: ${c.normalizedAnswer}
Detailed Reasoning:
${c.rawResponse}
-----------------------------`;
}).join("\n\n")}

Evaluate the question. You can choose to agree with the existing consensus or disagree based on your own internal reasoning. Ensure you perform rigorous independent analysis while maintaining awareness of the group context.`;
    }

    // Default system prompt
    let defaultSysPrompt = "You are a serious, unbiased scientific reasoning agent participating in an LLM reliability experiment. Focus purely on accuracy, logical rigor, and factual correctness.";
    if (systemPrompt && typeof systemPrompt === "string" && systemPrompt.trim()) {
      defaultSysPrompt = systemPrompt;
    }

    let response;
    const maxRetries = 5;
    let attempt = 0;
    let currentModel = model;

    while (attempt < maxRetries) {
      try {
        response = await ai.models.generateContent({
          model: currentModel,
          contents: promptText,
          config: {
            systemInstruction: defaultSysPrompt,
            temperature: temperature,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                rawResponse: {
                  type: Type.STRING,
                  description: "Your full, detailed, step-by-step reasoning and explanation answering the question. Be rigorous and objective."
                },
                normalizedAnswer: {
                  type: Type.STRING,
                  description: "A highly concise, normalized single choice, number, or short-phrase answer to allow direct text matching (e.g. 'A', 'B', 'Yes', 'No', or a specific short factual term. This MUST be clean and matching the option style if options are provided)."
                },
                confidence: {
                  type: Type.NUMBER,
                  description: "A self-assessed confidence score from 0.0 to 1.0 representing how confident you are in this answer."
                }
              },
              required: ["rawResponse", "normalizedAnswer", "confidence"]
            }
          }
        });
        break; // Success! Break out of the loop
      } catch (err: any) {
        attempt++;
        const errStr = String(err.message || err);
        const isRetryable = errStr.includes("503") || errStr.includes("UNAVAILABLE") || errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("high demand") || errStr.includes("temporary");
        
        // Dynamic self-healing fallback: switch between gemini-3.5-flash and gemini-3.7-flash to bypass local pool bottlenecks
        if (isRetryable && attempt >= 2) {
          if (currentModel === "gemini-3.5-flash") {
            currentModel = "gemini-3.7-flash";
          } else if (currentModel === "gemini-3.7-flash") {
            currentModel = "gemini-3.5-flash";
          }
        }

        if (attempt >= maxRetries || !isRetryable) {
          throw err; // Re-throw if max attempts reached or non-retryable
        }
        
        const delay = Math.pow(1.5, attempt) * 1000 + Math.random() * 500;
        console.warn(`[Gemini API Run] Retryable error encountered (attempt ${attempt}/${maxRetries}): ${errStr}. Retrying in ${Math.round(delay)}ms with model ${currentModel}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    const latency = Date.now() - startTime;
    const responseText = response ? (response.text || "") : "";
    let parsedData = { rawResponse: "", normalizedAnswer: "", confidence: 0.5 };

    try {
      parsedData = JSON.parse(responseText);
    } catch (parseErr) {
      console.warn("Failed to parse JSON response from Gemini, attempting fallback:", responseText);
      // Fallback parser in case model didn't perfectly adhere to JSON schema or returned plain text
      parsedData = {
        rawResponse: responseText,
        normalizedAnswer: responseText.slice(0, 50).trim(),
        confidence: 0.5
      };
    }

    return NextResponse.json({
      success: true,
      agentId: `Agent_${condition}_#${agentIndex + 1}_${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      condition,
      question,
      prompt: promptText,
      model,
      timestamp: new Date().toISOString(),
      rawResponse: parsedData.rawResponse,
      normalizedAnswer: parsedData.normalizedAnswer,
      confidence: parsedData.confidence,
      latency,
      contextReceived: condition === "SHARED_CONTEXT_5" 
        ? (sharedContext && sharedContext.length > 0 
           ? `Contains raw transcripts from ${sharedContext.length} preceding agent(s) in sequential chain.` 
           : "None (Agent 1 in sequential chain)") 
        : "None (Independent Isolation)"
    });

  } catch (error: any) {
    const latency = Date.now() - startTime;
    console.error("Agent execution failed:", error);

    let errorCode = "UNKNOWN_ERROR";
    let message = error.message || "An unexpected error occurred.";
    let status = 500;

    const errorStr = String(error.message || error);

    if (errorStr.includes("API_KEY_INVALID") || errorStr.includes("key is invalid") || errorStr.includes("unauthorized") || errorStr.includes("401")) {
      errorCode = "UNAUTHORIZED";
      message = "Gemini API authentication failed.";
      status = 401;
    } else if (errorStr.includes("403") || errorStr.includes("PERMISSION_DENIED")) {
      errorCode = "FORBIDDEN";
      message = "Gemini API access denied.";
      status = 403;
    } else if (errorStr.includes("404") || errorStr.includes("model not found") || errorStr.includes("not found")) {
      errorCode = "MODEL_NOT_FOUND";
      message = "Configured model is unavailable.";
      status = 404;
    } else if (errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED") || errorStr.includes("rate limit")) {
      errorCode = "RATE_LIMIT";
      message = "Gemini API rate limit reached.";
      status = 429;
    } else if (errorStr.includes("503") || errorStr.includes("UNAVAILABLE") || errorStr.includes("service unavailable")) {
      errorCode = "UNAVAILABLE";
      message = "Gemini service temporarily unavailable.";
      status = 503;
    }

    return NextResponse.json({
      success: false,
      agentId: `Agent_${condition}_#${agentIndex + 1}_ERR`,
      errorCode,
      errorDetails: message,
      latency,
      timestamp: new Date().toISOString(),
    }, { status });
  }
}
