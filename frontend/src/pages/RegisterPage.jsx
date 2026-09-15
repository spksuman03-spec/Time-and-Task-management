import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { Button } from '../components/common/Button';
import { GoogleAuthModal } from '../components/common/GoogleAuthModal';
import { GitHubAuthModal } from '../components/common/GitHubAuthModal';
import { User, Mail, Lock, Shield, ArrowRight, Eye, EyeOff, Globe } from 'lucide-react';

export const RegisterPage = () => {
  const { register, loginWithGoogle, loginWithGithub } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Member');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast('Please fill in all required fields', 'error');
      return;
    }

    if (!acceptedTerms) {
      addToast('Please accept the Terms of Service to continue', 'error');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password, role);
      addToast('Account & workspace created successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (googlePayload) => {
    try {
      setLoading(true);
      await loginWithGoogle(googlePayload);
      addToast(`Signed in with Google as ${googlePayload.email}!`, 'success');
      setIsGoogleModalOpen(false);
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message || 'Google Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async (githubPayload) => {
    try {
      setLoading(true);
      await loginWithGithub(githubPayload);
      addToast(`Signed in with GitHub as ${githubPayload.email}!`, 'success');
      setIsGitHubModalOpen(false);
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message || 'GitHub Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = (provider) => {
    if (provider === 'Google') {
      setIsGoogleModalOpen(true);
    } else if (provider === 'GitHub') {
      setIsGitHubModalOpen(true);
    } else {
      addToast(`${provider} Authentication: Redirecting to Enterprise Identity Provider...`, 'info');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black font-display text-xl shadow-lg shadow-blue-500/30">
              TS
            </div>
            <span className="font-extrabold text-2xl font-display tracking-tight">TaskSphere</span>
          </Link>
          <h2 className="text-xl font-bold text-white font-display">Create Your Account</h2>
          <p className="text-xs text-slate-400">Join thousands of high-performance teams today</p>
        </div>

        {/* Enterprise Social SSO */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialAuth('Google')}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-all shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialAuth('GitHub')}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-all shadow-xs"
          >
            <Globe className="w-4 h-4 text-slate-400" />
            GitHub
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">or sign up with email</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                required
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 text-white placeholder-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Role Preference</label>
            <div className="relative">
              <Shield className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 text-white"
              >
                <option value="Member">Team Member</option>
                <option value="Manager">Project Manager</option>
                <option value="Admin">Workspace Owner / Admin</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/50"
            />
            <label htmlFor="terms" className="cursor-pointer">
              I agree to the <span className="text-blue-400 hover:underline">Terms of Service</span> and <span className="text-blue-400 hover:underline">Privacy Policy</span>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30"
            loading={loading}
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onGoogleSignIn={handleGoogleSignIn}
        loading={loading}
      />

      <GitHubAuthModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        onGitHubSignIn={handleGitHubSignIn}
        loading={loading}
      />
    </div>
  );
};
