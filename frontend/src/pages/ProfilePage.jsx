import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { AvatarPicker } from '../components/common/AvatarPicker';
import { useToast } from '../components/common/Toast';
import { User, Mail, Shield, Lock, Save, KeyRound, Sparkles } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      const res = await authService.updateProfile({ name, bio, avatar });
      updateUser(res.data);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      addToast('Both current and new passwords are required', 'error');
      return;
    }
    try {
      setPasswordLoading(true);
      await authService.changePassword({ currentPassword, newPassword });
      addToast('Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      addToast(err.message || 'Failed to change password', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-display text-slate-900 dark:text-slate-100 flex items-center gap-3">
          <User className="w-8 h-8 text-blue-500" />
          My User Profile & Security
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account information, bio, avatar gallery, and security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <Card className="p-6 text-center space-y-4 md:col-span-1 flex flex-col items-center justify-center">
          <Avatar name={user?.name} src={avatar || user?.avatar} size="xl" className="ring-4 ring-blue-500/20" />
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 font-display">{user?.name}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 text-xs font-bold">
              System Role: {user?.role}
            </span>
          </div>

          {user?.bio && (
            <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800 p-3 rounded-xl w-full">
              "{user.bio}"
            </p>
          )}
        </Card>

        {/* Profile Edit Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* General Info Form */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              General Details
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>Profile Avatar Gallery</span>
                  <span className="text-[11px] text-blue-500 font-normal flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Select your favorite avatar
                  </span>
                </label>
                <AvatarPicker value={avatar} onChange={setAvatar} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Professional Bio
                </label>
                <textarea
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief headline or role summary..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" loading={profileLoading}>
                  <Save className="w-4 h-4" /> Save Profile
                </Button>
              </div>
            </form>
          </Card>

          {/* Change Password Form */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-500" />
              Security & Password
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="secondary" loading={passwordLoading}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
