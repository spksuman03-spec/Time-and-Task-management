import mongoose from 'mongoose';

const checklistItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { _id: true, timestamps: true });

const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
    index: true
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium',
    index: true
  },
  status: {
    type: String,
    enum: ['Backlog', 'Todo', 'In Progress', 'Review', 'Completed'],
    default: 'Todo',
    index: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    index: true
  },
  estimatedHours: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  checklist: [checklistItemSchema],
  orderPosition: {
    type: Number,
    default: 0
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

taskSchema.index({ project: 1, status: 1, orderPosition: 1 });

export default mongoose.model('Task', taskSchema);
