
import { GoogleGenAI, Type } from "@google/genai";
import { CATEGORIES, IssueCategory, Priority } from "../types";

export const analyzeIssueWithAI = async (
    geminiAI: GoogleGenAI,
    description: string
): Promise<{ category: IssueCategory; priority: Priority; enhancedDescription: string } | null> => {
    if (!description.trim()) return null;

    try {
        const model = 'gemini-2.5-flash';
        
        const prompt = `Analyze the following civic issue report from a citizen.
        1. Categorize it into one of the following official categories: ${CATEGORIES.join(', ')}.
        2. Assess its priority as 'Low', 'Medium', or 'High'.
        3. Enhance the description to be more formal, clear, and detailed for official records, without losing the original intent.
        
        Citizen's Report: "${description}"
        
        Provide the output in a JSON format.`;

        const response = await geminiAI.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        category: { 
                            type: Type.STRING,
                            description: "The most relevant category for the issue.",
                            enum: CATEGORIES
                        },
                        priority: { 
                            type: Type.STRING,
                            description: "The assessed priority of the issue.",
                            enum: ['Low', 'Medium', 'High']
                        },
                        enhancedDescription: { 
                            type: Type.STRING,
                            description: "The professionally rewritten description of the issue."
                        }
                    },
                    required: ["category", "priority", "enhancedDescription"]
                }
            }
        });

        const resultText = response.text.trim();
        const result = JSON.parse(resultText);

        const category = CATEGORIES.includes(result.category) ? result.category : "Other";

        return {
            category: category as IssueCategory,
            priority: result.priority as Priority,
            enhancedDescription: result.enhancedDescription
        };

    } catch (error) {
        console.error("Error analyzing issue with AI:", error);
        return {
            category: "Other",
            priority: "Medium",
            enhancedDescription: description + " (AI enhancement failed)"
        };
    }
};
