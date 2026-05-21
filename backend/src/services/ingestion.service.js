import fs from "fs";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import mongoose from "mongoose";
import { getEmbeddings } from "../config/gemini.js";
import Document from "../models/Document.js";


export const ingestDocument = async (documentId, filePath) => {
    try {
        // Mark as processing
        await Document.findByIdAndUpdate(documentId, { status: 'processing' })

        // Load PDF
        const loader = new PDFLoader(filePath)
        const rawDocs = await loader.load()

        if (!rawDocs.length) throw new Error('Could not extract text from PDF')

        // Split it into chunks 
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        })
        const chunks = await splitter.splitDocuments(rawDocs)

        // Add metadata to each chunk
        const enrichedChunks = chunks.map((chunk, index) => ({
            ...chunk,
            metadata: {
                ...chunk.metadata,
                documentId: documentId.toString(),
                chunkIndex: index,
                pageNumber: chunk.metadata?.loc?.pageNumber || chunk.metadata?.page || 1,
            },
        }));

        // Store embeddings in MongoDB Atlas Vector Search
        const embeddings = getEmbeddings('retrieval_document')
        const collection = mongoose.connection.db.collection('chunks')

        await MongoDBAtlasVectorSearch.fromDocuments(
            enrichedChunks,
            embeddings,
            {
                collection,
                indexName: 'vector_index',
                textKey: 'pageContent',
                embeddingKey: 'embedding'
            }
        )

        // MArk as ready
        await Document.findByIdAndUpdate(documentId, {
            status: 'ready',
            chunkCount: chunks.length,
        })

        // Clean up uploaded file
        fs.unlinkSync(filePath)
        console.log(`Document ${documentId} ingested: ${chunks.length} chunks`)

    } catch (error) {
        console.error('Ingestion error:', error.message)
        await Document.findByIdAndUpdate(documentId, {
            status: 'failed',
            errorMessage: error.message,
        })
        throw error
    }
}