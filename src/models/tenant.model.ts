import mongoose from 'mongoose';


const TenantSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // IMPORTANT: custom string id
    },
    name: {
      type: String,
      required: true
    },
    primaryColor: {
      type: String,
      default: '#6366f1'
    },
    logoUrl: {
      type: String,
      default: ''
    },
    greeting: {
      type: String,
      default: 'Hello! How can I help you today?'
    },
    systemInstruction: {
      type: String,
      default: 'You are a helpful business assistant.'
    },
    status: {
      type: String,
      default: 'active'
    }
  },
  { timestamps: true }
);

export const TenantModel = mongoose.model('Tenant', TenantSchema, 'Tenant');

