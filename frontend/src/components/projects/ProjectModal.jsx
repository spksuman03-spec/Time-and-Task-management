import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { projectService } from '../../services/projectService';
import { workspaceService } from '../../services/workspaceService';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useToast } from '../common/Toast';

export const ProjectModal = ({ isOpen, onClose, projectToEdit = null, onProjectSaved }) => {
  const { activeWorkspace } = useWorkspace();
  const { addToast } = useToast();

  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    priority: 'Medium',
    status: 'Active',
    dueDate: '',
    color: '#3b82f6',
    selectedMembers: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !activeWorkspace) return;

    const fetchMembers = async () => {
      try {
        const res = await workspaceService.getWorkspaceById(activeWorkspace._id);
        const team = (res.data.members || []).map(m => m.user);
        setMembers(team);

        if (projectToEdit) {
          setFormData({
            name: projectToEdit.name || '',
            key: projectToEdit.key || '',
            description: projectToEdit.description || '',
            priority: projectToEdit.priority || 'Medium',
            status: projectToEdit.status || 'Active',
            dueDate: projectToEdit.dueDate ? new Date(projectToEdit.dueDate).toISOString().split('T')[0] : '',
            color: projectToEdit.color || '#3b82f6',
            selectedMembers: (projectToEdit.members || []).map(m => m._id || m)
          });
        } else {
          setFormData({
            name: '',
            key: '',
            description: '',
            priority: 'Medium',
            status: 'Active',
            dueDate: '',
            color: '#3b82f6',
            selectedMembers: team.map(m => m._id)
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMembers();
  }, [isOpen, activeWorkspace, projectToEdit]);

  const handleNameChange = (val) => {
    const autoKey = val.trim().substring(0, 4).toUpperCase();
    setFormData(prev => ({
      ...prev,
      name: val,
      key: projectToEdit ? prev.key : autoKey
    }));
  };

  const handleMemberToggle = (memberId) => {
    setFormData(prev => {
      const exists = prev.selectedMembers.includes(memberId);
      return {
        ...prev,
        selectedMembers: exists
          ? prev.selectedMembers.filter(id => id !== memberId)
          : [...prev.selectedMembers, memberId]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.key) {
      addToast('Project Name and Key are required', 'error');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        key: formData.key.toUpperCase().trim(),
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate || null,
        color: formData.color,
        members: formData.selectedMembers,
        workspace: activeWorkspace._id
      };

      if (projectToEdit) {
        await projectService.updateProject(projectToEdit._id, payload);
        addToast('Project updated successfully!', 'success');
      } else {
        await projectService.createProject(payload);
        addToast('Project created successfully!', 'success');
      }

      if (onProjectSaved) onProjectSaved();
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to save project', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Edit Project' : 'Create New Project'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name & Key */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Core Platform v2.0"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Project Key *
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              placeholder="e.g. CORE"
              className="w-full px-3 py-2 text-sm uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 font-mono font-bold"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            rows="2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Goals, deliverables, and scope..."
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* Priority, Status, Color, Due Date */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
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
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Theme Color
            </label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full h-9 p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer"
            />
          </div>
        </div>

        {/* Member selection checkboxes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Project Members
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            {members.map(m => (
              <label key={m._id} className="flex items-center gap-2 text-xs cursor-pointer p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                <input
                  type="checkbox"
                  checked={formData.selectedMembers.includes(m._id)}
                  onChange={() => handleMemberToggle(m._id)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="font-medium">{m.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {projectToEdit ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
