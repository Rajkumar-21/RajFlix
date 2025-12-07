
import { GoogleGenAI, Type } from "@google/genai";

// IMPORTANT: The Gemini API key is expected to be in the environment variable `process.env.API_KEY`
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("Gemini API key is missing. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getMovieSuggestions = async (prompt: string): Promise<string[]> => {
  if (!API_KEY) {
    alert("Gemini API Key not configured. Please set the API_KEY environment variable.");
    return [];
  }
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Based on the following description, suggest up to 10 movies & series. Description: "${prompt}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    suggestions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING,
                            description: "The title of a movie suggestion."
                        }
                    }
                }
            }
        }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && Array.isArray(result.suggestions)) {
        return result.suggestions;
    }

    return [];
  } catch (error) {
    console.error("Error getting suggestions from Gemini:", error);
    return [];
  }
};
