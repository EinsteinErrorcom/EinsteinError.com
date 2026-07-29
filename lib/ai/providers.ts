import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export function getProvider(type: string) {
  switch (type) {
    case 'gemini':
      return {
        sendMessage: async (sys: string, prompt: string) => {
          const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: sys 
          });
          const result = await model.generateContent(prompt);
          return result.response.text();
        }
      };
    default:
      throw new Error("Provider not supported");
  }
}