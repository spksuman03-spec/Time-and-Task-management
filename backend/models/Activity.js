import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
    index: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null,
    index: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Activity', activitySchema);
