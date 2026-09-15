import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { workspaceService } from '../services/workspaceService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../components/common/Toast';
import {
  Briefcase,
  Plus,
  Users,
  UserPlus,
  Trash2,
  CheckCircle,
  Shield,
  Settings
} from 'lucide-react';

export const WorkspacesPage = () => {
  const { workspaces, activeWorkspace, switchWorkspace, refetchWorkspaces, workspaceRole } = useWorkspace();
  const { addToast } = useToast();

  const [workspaceDetails, setWorkspaceDetails] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);

  // Form states
  const [newWsName, setNewWsName] = useState('');
  const [newWsDesc, setNewWsDesc] = useState('');

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');

  const [loading, setLoading] = useState(false);

  const loadActiveWorkspaceDetails = async () => {
    if (!activeWorkspace) return;
    try {
      const res = await workspaceService.getWorkspaceById(activeWorkspace._id);
      setWorkspaceDetails(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadActiveWorkspaceDetails();
  }, [activeWorkspace]);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWsName.trim()) return;

    try {
      setLoading(true);
      await workspaceService.createWorkspace({
        name: newWsName.trim(),
        description: newWsDesc.trim()
      });
      addToast('Workspace created successfully!', 'success');
      setNewWsName('');
      setNewWsDesc('');
      setCreateModalOpen(false);
      await refetchWorkspaces();
    } catch (err) {
      addToast(err.message || 'Failed to create workspace', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      setLoading(true);
      await workspaceService.inviteMember(activeWorkspace._id, {
        email: inviteEmail.trim(),
        role: inviteRole
      });
      addToast('Member added to workspace!', 'success');
      setInviteEmail('');
      setInviteModalOpen(false);
      loadActiveWorkspaceDetails();
    } catch (err) {
      addToast(err.message || 'Failed to add member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (memberId, role) => {
    try {
      await workspaceService.updateMemberRole(activeWorkspace._id, memberId, { role });
      addToast('Member role updated!', 'success');
      loadActiveWorkspaceDetails();
    } catch (err) {
      addToast(err.message || 'Failed to update member role', 'error');
    }
  };

  const handleRemoveMemberConfirm = async () => {
    if (!memberToRemove) return;
    try {
      setLoading(true);
      await workspaceService.removeMember(activeWorkspace._id, memberToRemove._id);
      addToast('Member removed from workspace', 'info');
      setMemberToRemove(null);
      loadActiveWorkspaceDetails();
    } catch (err) {
      addToast(err.message || 'Failed to remove member', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-100">
            Workspaces & Team Management
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage workspace organizations, switch teams, and control access permissions.
          </p>
        </div>

        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="w-4 h-4" /> Create Workspace
        </Button>
      </div>

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {workspaces.map((w) => {
          const isActive = activeWorkspace && activeWorkspace._id === w._id;
          return (
            <Card
              key={w._id}
              onClick={() => switchWorkspace(w._id)}
              className={`p-5 flex flex-col justify-between space-y-4 border-2 transition-all ${
                isActive
                  ? 'border-blue-600 bg-blue-50/20 dark:bg-blue-950/20 shadow-md'
                  : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold font-display text-lg shadow-sm">
                    {w.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display">
                      {w.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-mono">/{w.slug}</span>
                  </div>
                </div>

                {isActive && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                )}
              </div>

              {w.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {w.description}
                </p>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>My Workspace Role:</span>
                <Badge type="role" value={w.role} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active Workspace Member Management Section */}
      {workspaceDetails && (
        <Card className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Members in "{workspaceDetails.name}" ({workspaceDetails.members?.length || 0})
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Workspace Owner: {workspaceDetails.owner?.name} ({workspaceDetails.owner?.email})
              </p>
            </div>

            {(workspaceRole === 'Admin' || workspaceRole === 'Manager') && (
              <Button size="sm" onClick={() => setInviteModalOpen(true)}>
                <UserPlus className="w-4 h-4" /> Invite Member
              </Button>
            )}
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Member</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Workspace Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(workspaceDetails.members || []).map((m) => {
                  const isOwner = workspaceDetails.owner?._id === m.user?._id;
                  const canEditMemberRole = workspaceRole === 'Admin' && !isOwner;

                  return (
                    <tr key={m._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Avatar name={m.user?.name} src={m.user?.avatar} size="sm" />
                        <div>
                          <span>{m.user?.name}</span>
                          {isOwner && (
                            <span className="block text-[10px] text-amber-500 font-bold">Workspace Owner</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-slate-500">{m.user?.email}</td>
                      <td className="py-3">
                        {canEditMemberRole ? (
                          <select
                            value={m.role}
                            onChange={(e) => handleUpdateRole(m._id, e.target.value)}
                            className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Member">Member</option>
                          </select>
                        ) : (
                          <Badge type="role" value={m.role} />
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${m.user?.isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                          ● {m.user?.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {canEditMemberRole && (
                          <button
                            onClick={() => setMemberToRemove(m)}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Remove member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Workspace Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Workspace"
      >
        <form onSubmit={handleCreateWorkspace} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Workspace Name *
            </label>
            <input
              type="text"
              required
              value={newWsName}
              onChange={(e) => setNewWsName(e.target.value)}
              placeholder="e.g. Acme Mobile Engineering"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              value={newWsDesc}
              onChange={(e) => setNewWsDesc(e.target.value)}
              placeholder="Workspace focus, team goals, and department scope..."
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal>

      {/* Invite Member Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Team Member"
      >
        <form onSubmit={handleInviteMember} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              User Email Address *
            </label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="member@tasksphere.com"
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Workspace Role
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              <option value="Member">Member</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="outline" onClick={() => setInviteModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Invite Member
            </Button>
          </div>
        </form>
      </Modal>

      {/* Remove Member Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(memberToRemove)}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleRemoveMemberConfirm}
        title="Remove Member from Workspace"
        message={`Are you sure you want to remove ${memberToRemove?.user?.name} (${memberToRemove?.user?.email}) from this workspace?`}
        confirmText="Remove"
        loading={loading}
      />
    </div>
  );
};
