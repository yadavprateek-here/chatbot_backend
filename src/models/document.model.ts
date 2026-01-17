import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true },
    title: String,
    content: String,
    type: String,
    tokens: Number,
    createdAt: { type: Date, default: Date.now }
  },
  { collection: 'documents' } // EXACT match from Compass
);

export const DocumentModel = mongoose.model('documents', DocumentSchema);

