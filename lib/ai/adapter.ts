import { getProvider } from './providers';

export async function processPrompt(userPrompt: string, modelType: string = 'gemini') {
  const systemInstructions = "YOUR_PROPRIETARY_SYSTEM_INSTRUCTIONS_HERE";
  
  const provider = getProvider(modelType);
  
  // The logic here remains model-agnostic
  const response = await provider.sendMessage(systemInstructions, userPrompt);
  
  return response;
}