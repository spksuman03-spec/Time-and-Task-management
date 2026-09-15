import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useToast } from '../components/common/Toast';
import { Button } from '../components/common/Button';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      addToast('Password must be at least 6 characters long', 'error');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.resetPassword(token, { password });
      setSuccess(true);

      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        if (res.data.defaultWorkspace) {
          localStorage.setItem('activeWorkspaceId', res.data.defaultWorkspace);
        }
      }

      addToast('Password reset successful! Logging you in...', 'success');
      setTimeout(() => {
        if (res.data && res.data.token) {
          window.location.href = '/dashboard';
        } else {
          navigate('/login');
        }
      }, 1500);
    } catch (err) {
      addToast(err.message || 'Invalid or expired reset token', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black font-display text-xl shadow-lg shadow-blue-500/30">
              TS
            </div>
            <span className="font-extrabold text-2xl font-display tracking-tight">TaskSphere</span>
          </Link>
          <h2 className="text-xl font-bold text-white font-display">Create New Password</h2>
          <p className="text-xs text-slate-400">Type in your new secure password below</p>
        </div>

        {success ? (
          <div className="p-5 bg-emerald-950/80 border border-emerald-800 rounded-2xl text-center space-y-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="font-bold text-sm text-white">Password Updated Successfully!</p>
            <p className="text-slate-300">Redirecting you to the Login page...</p>
            <Link to="/login" className="inline-block px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 text-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30"
            >
              <span>Reset Password</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
