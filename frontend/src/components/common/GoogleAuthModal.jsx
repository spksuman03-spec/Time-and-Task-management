import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Mail, CheckCircle2, User, Globe, ArrowRight } from 'lucide-react';

export const GoogleAuthModal = ({ isOpen, onClose, onGoogleSignIn, loading }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const quickAccounts = [
    { name: 'Sarah Connor', email: 'sarah.connor@gmail.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { name: 'Arun Kumar', email: 'arun.kumar@gmail.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { name: 'Alex Morgan', email: 'alex.morgan@gmail.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }
  ];

  const handleSelectAccount = (acc) => {
    onGoogleSignIn({
      email: acc.email,
      name: acc.name,
      avatar: acc.avatar
    });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    const defaultName = name.trim() || email.split('@')[0];
    onGoogleSignIn({
      email: email.trim(),
      name: defaultName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Google Identity Single Sign-On" maxWidth="max-w-md">
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl">
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" />
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
            <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9z" />
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
          </svg>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Sign in with Google</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Choose an account to continue to TaskSphere</p>
          </div>
        </div>

        {/* Quick Account Selector */}
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Choose an existing Google Account:
          </label>
          <div className="space-y-2">
            {quickAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                disabled={loading}
                onClick={() => handleSelectAccount(acc)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 rounded-xl transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <img src={acc.avatar} alt={acc.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">{acc.name}</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{acc.email}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">or sign in with another Google email</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Custom Google Email Entry */}
        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Google Account Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full pl-9 pr-3 py-2 text-xs text-black dark:text-white placeholder:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name (Optional)
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full pl-9 pr-3 py-2 text-xs text-black dark:text-white placeholder:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Sign In with Google
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
