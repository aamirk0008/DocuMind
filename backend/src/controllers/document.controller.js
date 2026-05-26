import Document from "../models/Document.js";
import { addIngestionJob } from '../queues/ingestion.queue.js'
import mongoose from "mongoose";

export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" })

        const doc = await Document.create({
            userId: req.userId,
            originalName: req.file.originalname,
            storedName: req.file.filename,
            mimeType: req.file.mimetype,
            size: req.file.size,
            status: 'pending',
        })

        await addIngestionJob(doc._id, req.file.path, req.userId)
        res.status(201).json({
            message: "Document uploaded, processing started",
            document: {
                id: doc._id,
                originalName: doc.originalName,
                status: doc.status,
                size: doc.size,
                createdAt: doc.createdAt,
            }
        })
    } catch (error) {
        console.error("Error uploading document:", error)
        res.status(500).json({ message: "Failed to upload document" })
    }
}

export const getDocuments = async (req, res) => {
    try {
        const docs = await Document.find({
            userId: req.userId
        }).select('-__v').sort({ createdAt: -1 })

        res.json({ documents: docs })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getDocumentStatus = async (req, res) => {
    try {
        const doc = await Document.findOne({
            _id: req.params.id,
            userId: req.userId,
        })

        if (!doc) return res.status(404).json({ message: 'Document not Found' })
        res.json({ status: doc.status, chunkCount: doc.chunkCount, errorMessage: doc.errorMessage })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const getSuggestedQuestions = async (req, res) => {
    try {
        const doc = await Document.findOne({
            _id: new mongoose.Types.ObjectId(req.params.id),
            userId: new mongoose.Types.ObjectId(req.userId),
        })

        if (!doc) return res.status(404).json({ message: 'Document not Found' })
        if (doc.status !== 'ready') return res.status(400).json({ message: 'Document not ready yet.' })

        // Get a few chunks to understand the document
        const collection = mongoose.connection.db.collection('chunks')
        const chunks = await collection.find({ 'metadata.documentId': req.params.id }).limit(3).toArray()

        const context = chunks.map(c => c.pageContent).join('\n\n')

        const { llm } = await import('../config/gemini.js')
        const { HumanMessage } = await import('@langchain/core/messages')

        const response = await llm.invoke([
            new HumanMessage(`Based on this document content, generate exactly 5 short, specific questions a user might want to ask. Return ONLY a JSON array of strings, no explanation, no markdown, no backticks.

Example format: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]

Document content:
${context.substring(0, 3000)}`),
        ])

        let questions = []
        try {
            const text = response.content.trim()
            questions = JSON.parse(text)
        } catch {
            // fallback parse — extract anything in quotes
            const matches = response.content.match(/"([^"]+\?)"/g);
            questions = matches
                ? matches.map(m => m.replace(/"/g, '')).slice(0, 5)
                : ['What is this document about?', 'What are the key points?', 'Summarize the main topics'];
        }

        res.json({ questions })
    } catch (error) {
        console.error('Suggested questions error:', error.message);
        res.status(500).json({ message: error.message });
    }
}

export const deleteDocument = async (req, res) => {
    try {
        const doc = await Document.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        })

        if (!doc) return res.status(404).json({ message: 'Document not found.' })

        // Delete associated chunks from vector store
        const collection = mongoose.connection.db.collection('chunks')
        await collection.deleteMany({ 'metadata.documentId': req.params.id })

        res.json({ message: 'Document Deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
