import mongoose from 'mongoose';

const workspaceMemberSchema = new mongoose.Schema({
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Manager', 'Member'],
    default: 'Member',
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound unique index so a user belongs to a workspace only once
workspaceMemberSchema.index({ workspace: 1, user: 1 }, { unique: true });

export default mongoose.model('WorkspaceMember', workspaceMemberSchema);
