import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalName: { type: String, required: true },
  storedName: { type: String, required: true },
  mimeType: { type: String },
  size: { type: Number },
  status: {
    type: String,
    enum: ['pending', 'processing', 'ready', 'failed'],
    default: 'pending',
  },
  chunkCount: { type: Number, default: 0 },
  errorMessage: { type: String },
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);