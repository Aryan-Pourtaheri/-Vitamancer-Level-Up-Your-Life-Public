
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
    
    // Add the `type` property to each suggestion, defaulting to 'daily'
    return suggestions.map(s => ({ ...s, type: 'daily' }));

  } catch (error) {
    console.error("Error generating habit suggestions:", error);
    throw new Error("Failed to get suggestions from Vitamancer AI. Please try again.");
  }
};


export const generateMonsterFromHabit = async (habitText: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<{name: string, description: string, hp: number}> => {
  if (!process.env.API_KEY) {
    throw new Error("Vitamancer AI is not configured. Missing API Key.");
  }
  
  const hpMap = { easy: 50, medium: 100, hard: 200 };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `A user failed to complete this habit: "${habitText}". Create a fantasy RPG monster that represents this failure. Give it a creative, short name and a one-sentence description.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: 'The creative name of the monster, like "Procrastination Gremlin" or "Slothful Slime".',
            },
            description: {
              type: Type.STRING,
              description: 'A brief, one-sentence description of the monster.',
            },
          },
          required: ["name", "description"],
        },
      },
    });

    const jsonText = response.text.trim();
    const monsterData = JSON.parse(jsonText) as {name: string, description: string};
    
    return { ...monsterData, hp: hpMap[difficulty] };

  } catch (error) {
    console.error("Error generating monster:", error);
    // Return a generic fallback monster on API error
    return {
        name: 'Generic Gremlin',
        description: 'A pesky creature born from a forgotten task.',
        hp: hpMap[difficulty],
    };
  }
};