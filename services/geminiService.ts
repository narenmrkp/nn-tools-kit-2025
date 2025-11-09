import { GoogleGenAI, Modality } from "@google/genai";
import type { ConversionResult, GroundingSource, ConversionData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getConversion = async (amount: number, fromCurrency: string, toCurrency: string): Promise<ConversionData> => {
    try {
        const prompt = `Using real-time data, convert ${amount} ${fromCurrency} to ${toCurrency}. Respond ONLY with a JSON object containing two keys: "convertedAmount" (the numeric value of ${amount} ${fromCurrency} in ${toCurrency}) and "rate" (the numeric value of 1 ${fromCurrency} in ${toCurrency}). Do not add any other text, explanations, or markdown formatting.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        let jsonString = response.text.trim();
        
        const match = jsonString.match(/```json\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
            jsonString = match[1];
        }

        const parsedResult: ConversionResult = JSON.parse(jsonString);

        if (typeof parsedResult.convertedAmount !== 'number' || typeof parsedResult.rate !== 'number') {
            throw new Error("Invalid data structure received from Gemini API.");
        }
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        const sources: GroundingSource[] = groundingChunks
            .map((chunk: any) => chunk.web)
            .filter((web: any) => web && web.uri && web.title)
            .map((web: any) => ({ uri: web.uri, title: web.title }))
            .filter((source, index, self) => index === self.findIndex((s) => s.uri === source.uri));


        return { result: parsedResult, sources };

    } catch (error) {
        console.error("Error fetching conversion from Gemini API:", error);
        throw new Error("Failed to get currency conversion.");
    }
};

export const restoreImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: 'Restore this damaged image. Fix scratches, tears, discoloration, and improve overall quality to make it look as close to the original as possible.',
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts ?? []) {
            if (part.inlineData?.data) {
                return part.inlineData.data;
            }
        }

        throw new Error("No image data found in the API response.");

    } catch (error) {
        console.error("Error restoring image with Gemini API:", error);
        throw new Error("Failed to restore the image.");
    }
};

export const convertTo3D = async (base64ImageData: string, mimeType: string, userPrompt: string): Promise<string> => {
    try {
        const basePrompt = 'Convert this 2D image into a vibrant, stylized 3D image. Add depth, shadows, and highlights to give it a three-dimensional feel, as if it were a model or a still from an animated movie.';
        const fullPrompt = userPrompt ? `${userPrompt}. ${basePrompt}` : basePrompt;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64ImageData,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: fullPrompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts ?? []) {
            if (part.inlineData?.data) {
                return part.inlineData.data;
            }
        }

        throw new Error("No image data found in the API response.");

    } catch (error) {
        console.error("Error converting image to 3D with Gemini API:", error);
        throw new Error("Failed to convert the image to 3D.");
    }
};