import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workspace name is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  icon: {
    type: String,
    default: 'briefcase'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Workspace', workspaceSchema);
