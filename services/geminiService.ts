import { GoogleGenAI, Type } from "@google/genai";
import { Habit } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

// Initialize with the key or an empty string to prevent the constructor from crashing.
// The library will handle an invalid key, and we'll throw a user-friendly error below.
const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

export const generateHabitSuggestions = async (goal: string): Promise<Omit<Habit, 'id' | 'user_id' | 'completed' | 'created_at'>[]> => {
  if (!API_KEY) {
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