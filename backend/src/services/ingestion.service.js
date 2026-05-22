import fs from 'fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Document } from '@langchain/core/documents';
import mongoose from 'mongoose';
import { getEmbeddings } from '../config/gemini.js';
import DocumentModel from '../models/Document.js';

const extractTextFromPDF = async (filePath) => {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf = await getDocument({ data }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map(item => item.str).join(' ');
        fullText += `\n${pageText}`;
    }

    return { text: fullText, numPages: pdf.numPages };
};

export const ingestDocument = async (documentId, filePath) => {
    try {
        await DocumentModel.findByIdAndUpdate(documentId, { status: 'processing' });

        const { text, numPages } = await extractTextFromPDF(filePath);
        if (!text?.trim()) throw new Error('Could not extract text from PDF');
        console.log(`Extracted ${numPages} pages from PDF`);

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const rawChunks = await splitter.splitText(text);

        const chunks = rawChunks.map((chunkText, index) => new Document({
            pageContent: chunkText,
            metadata: {
                documentId: documentId.toString(),
                chunkIndex: index,
                totalChunks: rawChunks.length,
                originalPages: numPages,
            },
        }));

        console.log(`Split into ${chunks.length} chunks, generating embeddings...`);

        // Generate embeddings and insert directly into MongoDB
        const embeddings = getEmbeddings('RETRIEVAL_DOCUMENT');
        const collection = mongoose.connection.db.collection('chunks');

        const texts = chunks.map(c => c.pageContent);
        const vectors = await embeddings.embedDocuments(texts);
        console.log(`Generated ${vectors.length} embedding vectors`);

        const docsToInsert = chunks.map((chunk, i) => ({
            pageContent: chunk.pageContent,
            embedding: vectors[i],
            metadata: chunk.metadata,
        }));

        const result = await collection.insertMany(docsToInsert);
        console.log(`Inserted ${result.insertedCount} chunks into Atlas`);

        await DocumentModel.findByIdAndUpdate(documentId, {
            status: 'ready',
            chunkCount: chunks.length,
        });

        fs.unlinkSync(filePath);
        console.log(`Document ${documentId} ingested: ${chunks.length} chunks`);

    } catch (err) {
        console.error('Ingestion error:', err.message);
        console.error('Stack:', err.stack);
        await DocumentModel.findByIdAndUpdate(documentId, {
            status: 'failed',
            errorMessage: err.message,
        });
        throw err;
    }
};