
import { GoogleGenAI, Type } from "@google/genai";
import { ForensicAnalysis, FrameData } from "./types";

// Always use named parameter for apiKey and assume it is available in environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeFrames(frames: FrameData[]): Promise<ForensicAnalysis> {
  // Using gemini-3-pro-preview for high-stakes digital forensics reasoning
  const model = "gemini-3-pro-preview";

  const parts = [
    { 
      text: `You are a Tier-1 Digital Forensic Investigator specializing in Synthetic Media Attribution.
      I am providing 4 keyframes from a video. Conduct an exhaustive forensic scan for:
      1. BIOLOGICAL MARKERS: Unnatural eye blinking rhythm, absence of micro-expressions, lack of eye-moisture highlights.
      2. GENERATIVE ARTIFACTS: Double-edge ghosting around jawlines, texture warping in hair/ear zones, and 'zombie' eyes.
      3. COMPRESSION & NOISE: Mismatched JPEG noise between the subject and background, indicating a face-swap.
      4. TEMPORAL COHERENCE: Sudden shifts in face orientation that look 'jittery' across frames.
      
      BE CRITICAL. If there is a 1% doubt, flag it as 'suspicious'. 
      Return a JSON forensic report using the provided schema.` 
    },
    ...frames.map(f => ({
      inlineData: {
        mimeType: "image/jpeg",
        data: f.dataUrl.split(',')[1]
      }
    }))
  ];

  const response = await ai.models.generateContent({
    model,
    contents: { parts },
    config: {
      temperature: 0.1, // Low temperature for deterministic forensic analysis
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallScore: { type: Type.NUMBER, description: "Scale 0-100 where 100 is definite deepfake" },
          confidence: { type: Type.NUMBER, description: "0.0 to 1.0" },
          detections: {
            type: Type.OBJECT,
            properties: {
              eyes: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER },
                  status: { type: Type.STRING },
                  observation: { type: Type.STRING }
                },
                required: ["score", "status", "observation"]
              },
              mouth: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER },
                  status: { type: Type.STRING },
                  observation: { type: Type.STRING }
                },
                required: ["score", "status", "observation"]
              },
              skin: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER },
                  status: { type: Type.STRING },
                  observation: { type: Type.STRING }
                },
                required: ["score", "status", "observation"]
              },
              lighting: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER },
                  status: { type: Type.STRING },
                  observation: { type: Type.STRING }
                },
                required: ["score", "status", "observation"]
              }
            },
            required: ["eyes", "mouth", "skin", "lighting"]
          },
          anomalies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.NUMBER },
                description: { type: Type.STRING },
                severity: { type: Type.STRING },
                coordinates: {
                  type: Type.OBJECT,
                  properties: {
                    x: { type: Type.NUMBER },
                    y: { type: Type.NUMBER },
                    radius: { type: Type.NUMBER }
                  },
                  required: ["x", "y", "radius"]
                }
              },
              required: ["timestamp", "description", "severity", "coordinates"]
            }
          },
          summary: { type: Type.STRING },
          recommendation: { type: Type.STRING }
        },
        required: ["overallScore", "confidence", "detections", "anomalies", "summary", "recommendation"]
      }
    }
  });

  const resultText = response.text || "";
  try {
    return JSON.parse(resultText) as ForensicAnalysis;
  } catch (e) {
    console.error("Failed to parse forensic report:", resultText);
    throw new Error("Invalid forensic data returned from engine.");
  }
}
