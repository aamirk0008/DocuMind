import mongoose from 'mongoose';
import { getEmbeddings, llm } from '../config/gemini.js';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

export const queryDocument = async (question, documentId) => {
  const embeddings = getEmbeddings('RETRIEVAL_QUERY');
  const questionVector = await embeddings.embedQuery(question);

  const collection = mongoose.connection.db.collection('chunks');
  const results = await collection.aggregate([
    {
      $vectorSearch: {
        index: 'vector_index',
        path: 'embedding',
        queryVector: questionVector,
        numCandidates: 50,
        limit: 20,
      },
    },
    {
      $match: { 'metadata.documentId': documentId.toString() },
    },
    { $limit: 5 },
    {
      $project: {
        pageContent: 1,
        metadata: 1,
        score: { $meta: 'vectorSearchScore' },
      },
    },
  ]).toArray();

  if (!results.length) {
    return {
      answer: "I couldn't find any relevant information in this document to answer your question.",
      sources: [],
    };
  }

  const context = results
    .map((r, i) => `[Source ${i + 1}]: ${r.pageContent}`)
    .join('\n\n');

  const systemPrompt = `You are DocuMind, an intelligent document assistant. Answer questions based strictly on the provided document context.

Formatting rules:
- Use **bold** for key terms and important points
- Use bullet points for lists
- Use numbered lists for steps or sequences
- Add a "## Summary" heading for complex answers
- Keep answers concise but complete
- Always end with a "**Sources used:** Source X, Source Y" line

Accuracy rules:
- Only use information from the provided context
- If the answer is not in the context, say "I couldn't find this information in the uploaded document"
- Never make up information`;

  const userPrompt = `Context from document:\n${context}\n\nQuestion: ${question}`;

  const response = await llm.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(userPrompt),
  ]);

  const sources = results.map((r) => ({
    pageContent: r.pageContent.substring(0, 200) + '...',
    chunkIndex: r.metadata?.chunkIndex,
    score: Math.round(r.score * 100) / 100,
  }));

  return { answer: response.content, sources };
};