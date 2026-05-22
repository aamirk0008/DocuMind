import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

export const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash',
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.1,
  maxOutputTokens: 2048,
});

export const getEmbeddings = (taskType = 'RETRIEVAL_DOCUMENT') =>
  new GoogleGenerativeAIEmbeddings({
    model: 'gemini-embedding-001',
    apiKey: process.env.GEMINI_API_KEY,
    taskType,
  });