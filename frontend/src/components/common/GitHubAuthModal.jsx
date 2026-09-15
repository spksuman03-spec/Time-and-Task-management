import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Mail, Globe, User, ArrowRight } from 'lucide-react';

export const GitHubAuthModal = ({ isOpen, onClose, onGitHubSignIn, loading }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  const quickDevAccounts = [
    { name: 'Linus Torvalds', username: 'torvalds', email: 'torvalds@linux-foundation.org', avatar: 'https://github.com/torvalds.png' },
    { name: 'Dan Abramov', username: 'gaearon', email: 'dan.abramov@github.com', avatar: 'https://github.com/gaearon.png' },
    { name: 'Sophie Alpert', username: 'sophiebits', email: 'sophie.alpert@github.com', avatar: 'https://github.com/sophiebits.png' }
  ];

  const handleSelectAccount = (acc) => {
    onGitHubSignIn({
      email: acc.email,
      name: acc.name,
      githubUsername: acc.username,
      avatar: acc.avatar
    });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    const devHandle = username.trim() || email.split('@')[0];
    const defaultName = name.trim() || devHandle;
    onGitHubSignIn({
      email: email.trim(),
      githubUsername: devHandle,
      name: defaultName,
      avatar: `https://github.com/${devHandle}.png`
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="GitHub Developer OAuth SSO" maxWidth="max-w-md">
      <div className="space-y-5">
        <div className="flex items-center gap-3 p-3 bg-slate-950 dark:bg-slate-950 border border-slate-800 rounded-2xl">
          <Globe className="w-6 h-6 text-slate-100 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-100">Sign in with GitHub</h4>
            <p className="text-[11px] text-slate-400">Authorize TaskSphere to access your developer account</p>
          </div>
        </div>

        {/* Quick Account Selector */}
        <div className="space-y-2">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Choose an existing GitHub Account:
          </label>
          <div className="space-y-2">
            {quickDevAccounts.map((acc) => (
              <button
                key={acc.email}
                type="button"
                disabled={loading}
                onClick={() => handleSelectAccount(acc)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-500 rounded-xl transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <img src={acc.avatar} alt={acc.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">{acc.name}</h5>
                      <span className="text-[10px] text-purple-400 font-mono">@{acc.username}</span>
                    </div>
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
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">or sign in with another GitHub account</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Custom GitHub Email Entry */}
        <form onSubmit={handleCustomSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              GitHub Work Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dev@github.com"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              GitHub Username (Optional)
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. gaearon"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} className="bg-purple-600 hover:bg-purple-500 text-white">
              Sign In with GitHub
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
