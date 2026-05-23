import mongoose from 'mongoose';
import ChatSession from '../models/ChatSession.js';
import Document from '../models/Document.js';
import { queryDocument } from '../services/query.service.js';

export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const { documentId } = req.params;

    const doc = await Document.findOne({
      _id: new mongoose.Types.ObjectId(documentId),
      userId: new mongoose.Types.ObjectId(req.userId),
    });

    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (doc.status !== 'ready')
      return res.status(400).json({ message: `Document is ${doc.status}, not ready for queries` });

    let session = await ChatSession.findOne({ userId: req.userId, documentId });
    if (!session) {
      session = await ChatSession.create({
        userId: req.userId,
        documentId,
        messages: [],
      });
    }

    session.messages.push({ role: 'user', content: question });

    const { answer, sources } = await queryDocument(question, documentId);

    session.messages.push({ role: 'assistant', content: answer, sources });
    await session.save();

    res.json({ answer, sources, sessionId: session._id });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { documentId } = req.params;
    const doc = await Document.findOne({ _id: documentId, userId: req.userId });
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const session = await ChatSession.findOne({ userId: req.userId, documentId });
    res.json({
      messages: session?.messages || [],
      documentName: doc.originalName,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};