import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';

export const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-2.0-flash',
  apiKey: process.env.GEMINI_API_KEY,
  temperature: 0.1,
  maxOutputTokens: 2048,
});

// task_type differs at ingest vs query time — export a factory
export const getEmbeddings = (taskType = 'retrieval_document') =>
  new GoogleGenerativeAIEmbeddings({
    model: 'text-embedding-004',
    apiKey: process.env.GEMINI_API_KEY,
    taskType,
  });