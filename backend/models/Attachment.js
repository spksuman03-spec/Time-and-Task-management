import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
    index: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 0
  },
  mimeType: {
    type: String,
    default: 'application/octet-stream'
  }
}, {
  timestamps: true
});

export default mongoose.model('Attachment', attachmentSchema);
