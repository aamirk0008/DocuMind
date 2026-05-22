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
