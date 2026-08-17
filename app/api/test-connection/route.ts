import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let model = "gemini-3.5-flash";
  try {
    const body = await req.json().catch(() => ({}));
    if (body && body.model) {
      model = body.model;
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        status: 401,
        message: "Gemini API key is not configured in the system environment.",
        model
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

    let response;
    const maxRetries = 5;
    let attempt = 0;
    let currentModel = model;

    while (attempt < maxRetries) {
      try {
        response = await ai.models.generateContent({
          model: currentModel,
          contents: "Reply with exactly 'GEMINI_TEST_OK' and nothing else. No punctuation, no spaces, no explanation.",
          config: {
            temperature: 0.1,
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
        console.warn(`[Gemini API Test] Retryable error encountered (attempt ${attempt}/${maxRetries}): ${errStr}. Retrying in ${Math.round(delay)}ms with model ${currentModel}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    const text = response ? (response.text?.trim() || "") : "";

    if (text.includes("GEMINI_TEST_OK")) {
      return NextResponse.json({
        success: true,
        message: "Gemini connection successful",
        model,
        response: text
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 200,
        message: `Connection completed but returned unexpected output: "${text}"`,
        model
      });
    }

  } catch (error: any) {
    console.error("Gemini connection test failed:", error);
    
    let status = 500;
    let message = "An unexpected error occurred during Gemini connection.";
    
    const errorStr = String(error.message || error);
    
    if (errorStr.includes("API_KEY_INVALID") || errorStr.includes("key is invalid") || errorStr.includes("unauthorized") || errorStr.includes("401")) {
      status = 401;
      message = "Gemini API authentication failed. Please verify your API key in Settings > Secrets.";
    } else if (errorStr.includes("403") || errorStr.includes("PERMISSION_DENIED")) {
      status = 403;
      message = "Gemini API access was denied. Your key may lack permission for this model.";
    } else if (errorStr.includes("404") || errorStr.includes("model not found") || errorStr.includes("not found")) {
      status = 404;
      message = "Configured Gemini model was not found or is unavailable.";
    } else if (errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED") || errorStr.includes("rate limit")) {
      status = 429;
      message = "Gemini rate limit or quota reached. Please wait a moment before trying again.";
    } else if (errorStr.includes("503") || errorStr.includes("UNAVAILABLE") || errorStr.includes("service unavailable")) {
      status = 503;
      message = "Gemini service is temporarily unavailable or overloaded.";
    } else {
      message = `Gemini connection failed: ${error.message || "Unknown error occurred"}`;
    }

    return NextResponse.json({
      success: false,
      status,
      message,
      model
    }, { status });
  }
}
