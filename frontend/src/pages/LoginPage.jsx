import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { Button } from '../components/common/Button';
import { GoogleAuthModal } from '../components/common/GoogleAuthModal';
import { GitHubAuthModal } from '../components/common/GitHubAuthModal';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Globe } from 'lucide-react';

export const LoginPage = () => {
  const { login, loginWithGoogle, loginWithGithub } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('saved_login_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'error');
      return;
    }

    try {
      setLoading(true);
      if (rememberMe) {
        localStorage.setItem('saved_login_email', email);
      } else {
        localStorage.removeItem('saved_login_email');
      }

      await login(email, password);
      addToast('Welcome back to TaskSphere!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message || 'Invalid email or password', 'error');
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
          <h2 className="text-xl font-bold text-white font-display">Sign In to Your Workspace</h2>
          <p className="text-xs text-slate-400">Enter your corporate credentials to access your workspace</p>
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
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">or sign in with email</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-xs text-blue-400 hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/50"
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30"
            loading={loading}
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 font-semibold hover:underline">
            Create a free workspace
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
