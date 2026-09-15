import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Avatar } from '../components/common/Avatar';
import { Skeleton } from '../components/common/Skeleton';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useToast } from '../components/common/Toast';
import { Shield, Users, Search, ToggleLeft, ToggleRight, UserCheck, UserX } from 'lucide-react';

export const AdminPage = () => {
  const { addToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [userToToggle, setUserToToggle] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers({ search, role: roleFilter });
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter]);

  const handleRoleChange = async (userId, role) => {
    try {
      await userService.updateUserRole(userId, role);
      addToast(`User role updated to ${role}`, 'success');
      loadUsers();
    } catch (err) {
      addToast(err.message || 'Failed to update user role', 'error');
    }
  };

  const handleToggleConfirm = async () => {
    if (!userToToggle) return;
    try {
      setToggleLoading(true);
      await userService.toggleUserStatus(userToToggle._id);
      addToast(`User account status updated`, 'info');
      setUserToToggle(null);
      loadUsers();
    } catch (err) {
      addToast(err.message || 'Failed to change user status', 'error');
    } finally {
      setToggleLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-100 flex items-center gap-3">
          <Shield className="w-8 h-8 text-purple-500" />
          System Administration Panel
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage system registered accounts, assign global platform roles, and enable/disable users.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Member">Member</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Card className="p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">User</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">System Role</th>
                  <th className="pb-3">Account Status</th>
                  <th className="pb-3">Joined Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Avatar name={u.name} src={u.avatar} size="sm" />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 text-slate-500">{u.email}</td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold"
                      >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Member">Member</option>
                      </select>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${u.isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                        ● {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setUserToToggle(u)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto ${
                          u.isActive
                            ? 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 hover:bg-emerald-100'
                        }`}
                      >
                        {u.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        {u.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(userToToggle)}
        onClose={() => setUserToToggle(null)}
        onConfirm={handleToggleConfirm}
        title={`${userToToggle?.isActive ? 'Deactivate' : 'Activate'} Account`}
        message={`Are you sure you want to ${userToToggle?.isActive ? 'deactivate' : 'activate'} user "${userToToggle?.name}" (${userToToggle?.email})?`}
        confirmText={userToToggle?.isActive ? 'Deactivate' : 'Activate'}
        loading={toggleLoading}
      />
    </div>
  );
};
