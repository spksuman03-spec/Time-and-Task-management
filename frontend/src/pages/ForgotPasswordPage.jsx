import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useToast } from '../components/common/Toast';
import { Button } from '../components/common/Button';
import { Mail, ArrowLeft, Send, ExternalLink, CheckCircle, Sparkles } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      const res = await authService.forgotPassword({ email: email.trim() });
      setResetUrl(res.resetUrl || '');
      setSubmitted(true);
      addToast('Reset link generated!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to request reset', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-white font-display">Reset Password</h2>
          <p className="text-xs text-slate-400">Enter your email to generate your password reset link</p>
        </div>

        {/* Demo Quick Fill Buttons */}
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-400" /> Demo Accounts Quick Select:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setEmail('admin@tasksphere.com')}
              className="px-2 py-1.5 bg-purple-950/60 hover:bg-purple-900 border border-purple-800/80 text-purple-300 rounded-xl text-xs font-semibold transition-all text-center"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setEmail('manager@tasksphere.com')}
              className="px-2 py-1.5 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800/80 text-indigo-300 rounded-xl text-xs font-semibold transition-all text-center"
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => setEmail('member@tasksphere.com')}
              className="px-2 py-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-300 rounded-xl text-xs font-semibold transition-all text-center"
            >
              Member
            </button>
          </div>
        </div>

        {submitted ? (
          <div className="p-5 bg-slate-950 border border-indigo-500/40 rounded-2xl text-center space-y-4 text-xs">
            <div className="w-10 h-10 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div>
              <p className="font-bold text-sm text-white">Reset Link Ready!</p>
              <p className="text-slate-400 mt-1">A password reset token was generated for <span className="text-indigo-300 font-semibold">{email}</span>.</p>
            </div>

            {resetUrl && (
              <div className="pt-2">
                <a
                  href={resetUrl}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <span>Click Here to Reset Password Now</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-slate-400 hover:text-white underline mr-4"
              >
                Reset Another Account
              </button>
              <Link to="/login" className="text-xs text-slate-400 hover:text-white">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tasksphere.com"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/50 text-white"
                />
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30">
              <Send className="w-4 h-4" /> Generate Reset Link
            </Button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link to="/login" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
