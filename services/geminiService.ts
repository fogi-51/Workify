import { GoogleGenAI, GenerateContentResponse, GenerateVideosOperation, Modality, Chat } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const createChatSession = (systemInstruction: string): Chat => {
  const ai = getAIClient();
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
    },
  });
};


export const generateText = async (prompt: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating text:", error);
    return "An error occurred while generating the text. Please check your API key and try again.";
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const ai = getAIClient();
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return "Failed to generate image. No image data received.";

    } catch (error) {
        console.error("Error generating image:", error);
        return "An error occurred while generating the image. The model may have safety restrictions. Please try a different prompt.";
    }
};

export const editImage = async (base64ImageData: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const ai = getAIClient();
        const imagePart = {
            inlineData: {
                data: base64ImageData,
                mimeType: mimeType,
            },
        };
        const textPart = { text: prompt };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                }
            }
        }
        
        return "Failed to edit image. No image data received.";
    } catch (error) {
        console.error("Error editing image:", error);
        return "An error occurred while editing the image. The model may have safety restrictions. Please try a different image or prompt.";
    }
};


export const generateVideo = async (
    prompt: string,
    config: {
        aspectRatio: '16:9' | '9:16';
        resolution: '720p' | '1080p';
    }
): Promise<string> => {
    // A new client is created for each call to ensure the latest API key is used,
    // which is crucial for the Veo model's key selection flow.
    const ai = getAIClient();
    try {
        let operation: GenerateVideosOperation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                ...config
            }
        });

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (downloadLink) {
            return downloadLink;
        } else {
            throw new Error("Video generation completed, but no download link was found.");
        }
    } catch (error: any) {
        console.error("Error generating video:", error);
        // Pass a more specific error for API key issues
        if (error.message && error.message.includes("Requested entity was not found")) {
            throw new Error("API key not found or invalid. Please select a valid project.");
        }
        throw new Error("An error occurred while generating the video. Please try again.");
    }
};