import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { projectService } from '../services/projectService';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectModal } from '../components/projects/ProjectModal';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../components/common/Toast';
import { FolderKanban, Plus, Search, Filter } from 'lucide-react';

export const ProjectsPage = () => {
  const { activeWorkspace, workspaceRole } = useWorkspace();
  const { addToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const canManage = workspaceRole === 'Admin' || workspaceRole === 'Manager';

  const loadProjects = async () => {
    if (!activeWorkspace) return;
    try {
      setLoading(true);
      const res = await projectService.getProjects({
        search,
        status: statusFilter
      });
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [activeWorkspace, search, statusFilter]);

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    try {
      setDeleteLoading(true);
      await projectService.deleteProject(deletingProject._id);
      addToast('Project deleted successfully', 'info');
      setDeletingProject(null);
      loadProjects();
    } catch (err) {
      addToast(err.message || 'Failed to delete project', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <FolderKanban className="w-8 h-8 text-blue-500" />
            Projects ({projects.length})
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage projects, track completion progress, and assign team members.
          </p>
        </div>

        {canManage && (
          <Button
            onClick={() => {
              setEditingProject(null);
              setModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" /> Create Project
          </Button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name, key, or description..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Planning">Planning</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-48" count={6} />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <FolderKanban className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Projects Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Get started by creating your first project to organize tasks and track team deliverables.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard
              key={p._id}
              project={p}
              canManage={canManage}
              onEdit={(proj) => {
                setEditingProject(proj);
                setModalOpen(true);
              }}
              onDelete={(proj) => setDeletingProject(proj)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        projectToEdit={editingProject}
        onProjectSaved={loadProjects}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingProject)}
        onClose={() => setDeletingProject(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete project "${deletingProject?.name}" [${deletingProject?.key}]? All tasks under this project will also be deleted.`}
        confirmText="Delete Project"
        loading={deleteLoading}
      />
    </div>
  );
};
