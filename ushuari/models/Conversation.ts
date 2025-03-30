import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  agentType: {
    type: String,
    enum: ['legal', 'scheduler', 'document'],
    required: true,
  },
  language: {
    type: String,
    enum: ['en', 'sw', 'rw'],
    required: true,
  },
  messages: [{
    type: {
      type: String,
      enum: ['user', 'legal_response', 'scheduler_response', 'document_response'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    audioUrl: {
      type: String,
    },
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active',
  },
  metadata: {
    clientId: String,
    caseId: String,
    duration: Number,
    tags: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
conversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema); 