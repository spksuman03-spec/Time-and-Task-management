import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  key: {
    type: String,
    required: [true, 'Project key is required (e.g. PRJ)'],
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
    index: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['Planning', 'Active', 'On Hold', 'Completed', 'Archived'],
    default: 'Active',
    index: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  color: {
    type: String,
    default: '#3b82f6' // Hex color code
  }
}, {
  timestamps: true
});

projectSchema.index({ workspace: 1, key: 1 }, { unique: true });

export default mongoose.model('Project', projectSchema);
