import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  type: {
    type: String,
    enum: [
      'TASK_ASSIGNED',
      'TASK_REASSIGNED',
      'TASK_STATUS_CHANGED',
      'TASK_DEADLINE_APPROACHING',
      'TASK_OVERDUE',
      'COMMENT_ADDED',
      'USER_MENTIONED',
      'PROJECT_ADDED',
      'PROJECT_STATUS_CHANGED',
      'WORKSPACE_INVITE'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: ''
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema);
