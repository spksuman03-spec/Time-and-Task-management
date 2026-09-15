import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { projectService } from '../../services/projectService';
import { workspaceService } from '../../services/workspaceService';
import { taskService } from '../../services/taskService';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { Plus, Trash2, FolderPlus, Clock, Tag, ShieldAlert } from 'lucide-react';

export const TaskModal = ({ isOpen, onClose, taskToEdit = null, onTaskSaved }) => {
  const { activeWorkspace, workspaceRole } = useWorkspace();
  const { user } = useAuth();
  const { addToast } = useToast();

  const canCreateTask = user?.role === 'Admin' || user?.role === 'Manager' || workspaceRole === 'Admin' || workspaceRole === 'Manager';

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignee: '',
    priority: 'Medium',
    status: 'Todo',
    dueDate: '',
    estimatedHours: 0,
    tagsStr: '',
    checklist: []
  });

  const [newChecklistText, setNewChecklistText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickProjectInput, setShowQuickProjectInput] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);

  const loadDropdowns = async () => {
    if (!activeWorkspace) return;
    try {
      const [prjRes, wsRes] = await Promise.all([
        projectService.getProjects(),
        workspaceService.getWorkspaceById(activeWorkspace._id)
      ]);

      const prjList = prjRes.data || [];
      setProjects(prjList);

      const team = (wsRes.data.members || []).map(m => m.user);
      setMembers(team);

      if (taskToEdit) {
        setFormData({
          title: taskToEdit.title || '',
          description: taskToEdit.description || '',
          project: taskToEdit.project?._id || taskToEdit.project || '',
          assignee: taskToEdit.assignee?._id || taskToEdit.assignee || '',
          priority: taskToEdit.priority || 'Medium',
          status: taskToEdit.status || 'Todo',
          dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '',
          estimatedHours: taskToEdit.estimatedHours || 0,
          tagsStr: (taskToEdit.tags || []).join(', '),
          checklist: taskToEdit.checklist || []
        });
      } else {
        setFormData(prev => ({
          ...prev,
          title: '',
          description: '',
          project: prjList.length > 0 ? prjList[0]._id : '',
          assignee: '',
          priority: 'Medium',
          status: 'Todo',
          dueDate: '',
          estimatedHours: 0,
          tagsStr: '',
          checklist: []
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen && activeWorkspace) {
      loadDropdowns();
    }
  }, [isOpen, activeWorkspace, taskToEdit]);

  const handleToggleQuickTag = (tag) => {
    const currentTags = formData.tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (currentTags.includes(tag)) {
      const nextTags = currentTags.filter(t => t !== tag);
      setFormData(prev => ({ ...prev, tagsStr: nextTags.join(', ') }));
    } else {
      const nextTags = [...currentTags, tag];
      setFormData(prev => ({ ...prev, tagsStr: nextTags.join(', ') }));
    }
  };

  const handleQuickCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      setCreatingProject(true);
      const autoKey = newProjectName.trim().substring(0, 4).toUpperCase();
      const res = await projectService.createProject({
        name: newProjectName.trim(),
        key: autoKey,
        workspace: activeWorkspace._id
      });

      addToast(`Project "${res.data.name}" created!`, 'success');
      setNewProjectName('');
      setShowQuickProjectInput(false);
      
      // Reload dropdowns and auto-select the newly created project
      const updatedPrjRes = await projectService.getProjects();
      const updatedList = updatedPrjRes.data || [];
      setProjects(updatedList);
      setFormData(prev => ({ ...prev, project: res.data._id }));
    } catch (err) {
      addToast(err.message || 'Failed to create project', 'error');
    } finally {
      setCreatingProject(false);
    }
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setFormData(prev => ({
      ...prev,
      checklist: [...prev.checklist, { text: newChecklistText.trim(), completed: false }]
    }));
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (index) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskToEdit && !canCreateTask) {
      addToast('Task creation is restricted to Admin & Manager roles', 'error');
      return;
    }

    if (!formData.title || !formData.project) {
      addToast('Task title and project selection are required', 'error');
      return;
    }

    try {
      setLoading(true);
      const tags = formData.tagsStr
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        description: formData.description,
        project: formData.project,
        assignee: formData.assignee || null,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate || null,
        estimatedHours: Number(formData.estimatedHours) || 0,
        tags,
        checklist: formData.checklist,
        workspace: activeWorkspace._id
      };

      if (taskToEdit) {
        await taskService.updateTask(taskToEdit._id, payload);
        addToast('Task updated successfully!', 'success');
      } else {
        await taskService.createTask(payload);
        addToast('Task created successfully!', 'success');
      }

      if (onTaskSaved) onTaskSaved();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to save task', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Task' : 'Create New Task'}
      maxWidth="max-w-2xl"
    >
      {!taskToEdit && !canCreateTask && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Notice: Only Workspace Admins and Managers are permitted to create tasks.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Implement Socket.IO real-time notification engine"
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Project & Assignee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Project *
              </label>
              <button
                type="button"
                onClick={() => setShowQuickProjectInput(!showQuickProjectInput)}
                className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                <FolderPlus className="w-3.5 h-3.5" /> + New Project
              </button>
            </div>

            {showQuickProjectInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Project name..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
                <Button size="sm" type="button" onClick={handleQuickCreateProject} loading={creatingProject}>
                  Save
                </Button>
              </div>
            ) : (
              <select
                required
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
              >
                {projects.length === 0 ? (
                  <option value="">No projects found (Click "+ New Project" above)</option>
                ) : (
                  projects.map(p => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.key})
                    </option>
                  ))
                )}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assignee
            </label>
            <select
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="">Unassigned</option>
              {members.map(m => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.role || 'Member'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority, Status, Due Date, Estimated Hours */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="Backlog">Backlog</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500" /> Est. Hours
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
              placeholder="e.g. 8"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            rows="3"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed specifications, acceptance criteria, or context..."
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Tags with Quick Tag Chips */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Tags (comma separated)
            </label>
            <span className="text-[10px] text-slate-400">Click chips to quick-select</span>
          </div>
          <input
            type="text"
            value={formData.tagsStr}
            onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
            placeholder="e.g. Frontend, API, Security, High Priority"
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 mb-2"
          />
          <div className="flex flex-wrap gap-1.5">
            {['Frontend', 'Backend', 'UI/UX', 'Bug', 'Security', 'API', 'Urgent', 'Database'].map((tagChip) => {
              const active = formData.tagsStr.toLowerCase().includes(tagChip.toLowerCase());
              return (
                <button
                  key={tagChip}
                  type="button"
                  onClick={() => handleToggleQuickTag(tagChip)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all border ${
                    active
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                  }`}
                >
                  #{tagChip}
                </button>
              );
            })}
          </div>
        </div>

        {/* Checklist */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Checklist Items
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              placeholder="Add item..."
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
            <Button size="sm" type="button" onClick={handleAddChecklistItem}>
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {formData.checklist.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800/60 rounded-lg text-xs">
                <span>{item.text}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveChecklistItem(idx)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading} disabled={(!taskToEdit && !canCreateTask) || (projects.length === 0 && !formData.project)}>
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
