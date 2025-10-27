
import { GoogleGenAI, Type } from "@google/genai";
import { Habit } from '../types';

// Per guidelines, initialize with API_KEY from environment variables.
// Assume `process.env.API_KEY` is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHabitSuggestions = async (goal: string): Promise<Omit<Habit, 'id' | 'user_id' | 'status' | 'created_at'>[]> => {
  // Per guidelines, we can assume the API key is configured, but throwing a user-friendly
  // error is better than letting the SDK throw a generic one if it's missing at runtime.
  if (!process.env.API_KEY) {
    throw new Error("Vitamancer AI is not configured. Missing API Key.");
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the goal "${goal}", generate 3-5 specific, actionable habits. Categorize them as 'easy', 'medium', or 'hard'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: {
                type: Type.STRING,
                description: 'The full text of the habit.',
              },
              difficulty: {
                type: Type.STRING,
                description: 'The difficulty of the habit: easy, medium, or hard.',
              },
            },
            required: ["text", "difficulty"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const suggestions = JSON.parse(jsonText) as {text: string, difficulty: 'easy' | 'medium' | 'hard'}[];

    return suggestions;
  } catch (error) {
    console.error("Error generating habit suggestions:", error);
    throw new Error("Failed to get suggestions from Vitamancer AI. Please try again.");
  }
};
