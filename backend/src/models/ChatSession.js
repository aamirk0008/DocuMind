import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  sources: [{
    documentId: mongoose.Schema.Types.ObjectId,
    pageContent: String,
    pageNumber: Number,
    score: Number,
  }],
  createdAt: { type: Date, default: Date.now },
});

const chatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  messages: [messageSchema],
}, { timestamps: true });

export default mongoose.model('ChatSession', chatSessionSchema);