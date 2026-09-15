import React from 'react';
import { Link } from 'react-router-dom';
import {
  KanbanSquare,
  Zap,
  ShieldCheck,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Layers,
  Clock,
  Lock,
  Globe,
  Check
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white overflow-hidden">
      {/* Top Header Navigation */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-indigo-900/30 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-blue-600 to-purple-600 text-white flex items-center justify-center font-black font-display text-xl shadow-lg shadow-indigo-500/30">
            TS
          </div>
          <span className="font-extrabold text-xl font-display tracking-tight text-white">
            Task<span className="text-indigo-400">Sphere</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
          <a href="#collaboration" className="hover:text-indigo-400 transition-colors">Collaboration</a>
          <a href="#analytics" className="hover:text-indigo-400 transition-colors">Analytics</a>
          <a href="#security" className="hover:text-indigo-400 transition-colors">Security</a>
          <a href="#pricing" className="hover:text-indigo-400 transition-colors">Pricing</a>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 max-w-7xl mx-auto px-6 text-center">
        {/* Glowing Background Radial Effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-indigo-600/30 via-purple-600/20 to-pink-600/20 blur-[130px] rounded-full pointer-events-none" />

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          The modern platform for high-velocity <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">engineering teams</span>.
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Streamline tasks, projects, drag-and-drop Kanban boards, calendar deadlines, and real-time Socket.IO collaboration in one cohesive SaaS environment.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-indigo-600/40 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <span>Start Workspace Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-base transition-all shadow-md"
          >
            Demo Credentials & Sign In
          </Link>
        </div>

        {/* Product Mockup Preview Container */}
        <div className="relative mx-auto max-w-5xl rounded-3xl p-3 bg-gradient-to-b from-indigo-500/20 via-slate-800 to-purple-900/20 border border-indigo-500/30 shadow-2xl shadow-indigo-500/10 overflow-hidden">
          <div className="bg-slate-950 rounded-2xl overflow-hidden p-6 border border-slate-800/80 text-left">
            {/* Fake Window Controls */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs text-slate-500 font-mono">app.tasksphere.com/kanban</span>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">● Socket Live</span>
              </div>
            </div>

            {/* Fake Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> To Do</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">3</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between font-mono text-[10px] text-slate-500">
                    <span>TS-104</span>
                    <span className="text-amber-400 font-bold">Medium</span>
                  </div>
                  <p className="font-semibold text-slate-200">Setup Socket.IO Real-Time Engine</p>
                </div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> In Progress</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">2</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-indigo-500/50 text-xs space-y-2 ring-1 ring-indigo-500/50 shadow-md">
                  <div className="flex justify-between font-mono text-[10px] text-slate-500">
                    <span>TS-102</span>
                    <span className="text-red-400 font-bold">Urgent</span>
                  </div>
                  <p className="font-semibold text-slate-200">Build Drag-and-Drop Kanban Board</p>
                </div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completed</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">5</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-2 opacity-80">
                  <div className="flex justify-between font-mono text-[10px] text-slate-500">
                    <span>TS-101</span>
                    <span className="text-indigo-400 font-bold">High</span>
                  </div>
                  <p className="font-semibold text-slate-200 line-through">Design Dark Mode Tokens</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950 border-t border-indigo-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white mb-4">
              Everything your team needs to deliver on time.
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Built ground-up with MongoDB, Express, React, and Node.js for scalability, security, and instantaneous real-time sync.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-900/90 border border-indigo-500/20 rounded-3xl hover:border-indigo-500/60 transition-all shadow-lg hover:shadow-indigo-500/10 group">
              <div className="p-3 w-12 h-12 rounded-2xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 mb-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <KanbanSquare className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Drag & Drop Kanban</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Move tasks across Backlog, Todo, In Progress, Review, and Completed columns with live position updates saved to MongoDB.
              </p>
            </div>

            <div className="p-8 bg-slate-900/90 border border-purple-500/20 rounded-3xl hover:border-purple-500/60 transition-all shadow-lg hover:shadow-purple-500/10 group">
              <div className="p-3 w-12 h-12 rounded-2xl bg-purple-950/80 text-purple-400 border border-purple-800/60 mb-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Real-Time Socket.IO Engine</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Instant broadcast of task creation, status changes, @mention comments, and team notifications without page reloads.
              </p>
            </div>

            <div className="p-8 bg-slate-900/90 border border-emerald-500/20 rounded-3xl hover:border-emerald-500/60 transition-all shadow-lg hover:shadow-emerald-500/10 group">
              <div className="p-3 w-12 h-12 rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 mb-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display">Recharts Analytics</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Interactive charts visualizing task completion velocity, project progress, status distribution, and team productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section id="collaboration" className="py-24 max-w-7xl mx-auto px-6 border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-3.5 py-1 rounded-full bg-indigo-950 text-indigo-400 text-xs font-semibold border border-indigo-800 inline-block shadow-sm">
              Real-Time Team Collaboration
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white leading-tight">
              Work together seamlessly with instant updates & @mentions.
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Connect your team with live WebSocket events. Comment on tasks, tag team members with `@user`, attach file metadata, and receive real-time notifications standard across all active workspace rooms.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-indigo-500/40 transition-all">
                <Users className="w-6 h-6 text-indigo-400 mb-2" />
                <h4 className="font-bold text-white text-sm mb-1">Multi-User Workspaces</h4>
                <p className="text-xs text-slate-400">Invite members with granular Admin, Manager, and Member permissions.</p>
              </div>

              <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl hover:border-purple-500/40 transition-all">
                <MessageSquare className="w-6 h-6 text-purple-400 mb-2" />
                <h4 className="font-bold text-white text-sm mb-1">@Mention Comments</h4>
                <p className="text-xs text-slate-400">Directly notify colleagues in task activity threads.</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">Live Team Feed</span>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-bold">Socket Connected</span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 text-white font-bold flex items-center justify-center shrink-0 shadow-sm">
                  A
                </div>
                <div>
                  <span className="font-bold text-white">Arun Manager</span>
                  <span className="text-slate-400"> moved task </span>
                  <span className="font-mono text-indigo-400 font-semibold">TS-102</span>
                  <span className="text-slate-400"> to </span>
                  <span className="text-amber-400 font-semibold">In Progress</span>
                  <span className="block text-[10px] text-slate-500 mt-1">Just now</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-600 text-white font-bold flex items-center justify-center shrink-0 shadow-sm">
                  P
                </div>
                <div>
                  <span className="font-bold text-white">Priya Sharma</span>
                  <span className="text-slate-400"> commented: "@Arun Manager fixed socket reconnect handler"</span>
                  <span className="block text-[10px] text-slate-500 mt-1">2 mins ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="py-24 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full bg-purple-950 text-purple-400 text-xs font-semibold border border-purple-800 mb-4 inline-block shadow-sm">
              Interactive Analytics
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white mb-4">
              Data-driven insights for sprint velocity & team productivity.
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Visualize task completion trends, status breakdowns, and priority distributions with interactive Recharts graphs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl hover:border-indigo-500/50 transition-all">
              <BarChart3 className="w-8 h-8 text-indigo-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2 font-display">Sprint Velocity Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor task completion rates across 7-day rolling windows to ensure your engineering milestones stay on schedule.
              </p>
            </div>

            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl hover:border-emerald-500/50 transition-all">
              <Layers className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2 font-display">Status & Priority Breakdown</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Identify project bottlenecks early with real-time status pie charts and urgent priority indicators.
              </p>
            </div>

            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl hover:border-purple-500/50 transition-all">
              <Users className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2 font-display">Team Member Output</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluate individual team contributor workloads by comparing assigned vs completed task metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Multi-Tenancy */}
      <section id="security" className="py-24 max-w-7xl mx-auto px-6 border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="px-3.5 py-1 rounded-full bg-indigo-950 text-indigo-400 text-xs font-semibold border border-indigo-800 mb-4 inline-block shadow-sm">
              Enterprise Grade RBAC
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-6 leading-tight">
              Strict Role-Based Access Control & Workspace Isolation.
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
              Empower Admins, Managers, and Members with precise backend middleware authorization. Keep sensitive project settings and user roles secure.
            </p>

            <ul className="space-y-3">
              {[
                'JWT Authentication & bcrypt password hashing',
                'Workspace multi-tenancy architecture',
                'Automated deadline detection cron jobs',
                'Activity audit log tracking'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <ShieldCheck className="w-8 h-8 text-indigo-400 shrink-0" />
              <div>
                <h4 className="font-bold text-white text-sm">Protected API Routes</h4>
                <p className="text-xs text-slate-400">Server-side token & workspace header validation</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <Lock className="w-8 h-8 text-purple-400 shrink-0" />
              <div>
                <h4 className="font-bold text-white text-sm">3 Access Levels</h4>
                <p className="text-xs text-slate-400">Admin, Manager, and Member fine-grained permissions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-800 mb-4 inline-block shadow-sm">
              Flexible Plans
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display text-white mb-4">
              Simple, transparent pricing for every team.
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Choose the plan that fits your organizational scale. Try full features free with seeded demo access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="p-8 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Starter</h3>
                <p className="text-xs text-slate-400 mb-4">For small teams and side projects</p>
                <div className="text-3xl font-extrabold text-white font-display mb-6">
                  $0 <span className="text-xs text-slate-500 font-normal">/ forever free</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Up to 5 Team Members</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Unlimited Tasks & Projects</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Drag & Drop Kanban Board</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Basic Workspace Analytics</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full py-3 text-center bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors block"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-8 bg-slate-900 border-2 border-indigo-500 rounded-3xl space-y-6 flex flex-col justify-between relative shadow-2xl shadow-indigo-500/20">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                Most Popular
              </span>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Pro Team</h3>
                <p className="text-xs text-slate-400 mb-4">For growing agile engineering teams</p>
                <div className="text-3xl font-extrabold text-white font-display mb-6">
                  $12 <span className="text-xs text-slate-500 font-normal">/ user / month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400 shrink-0" /> Everything in Starter</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400 shrink-0" /> Real-Time Socket.IO Updates</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400 shrink-0" /> Calendar Month/Week/Day Views</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400 shrink-0" /> Advanced Recharts Analytics</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-400 shrink-0" /> Automated Deadline Cron Jobs</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full py-3 text-center bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/40 transition-all block"
              >
                Start Pro Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Enterprise</h3>
                <p className="text-xs text-slate-400 mb-4">For large organizations requiring total control</p>
                <div className="text-3xl font-extrabold text-white font-display mb-6">
                  Custom <span className="text-xs text-slate-500 font-normal">/ annual billing</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Unlimited Workspaces & Members</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Custom System Admin RBAC</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Full Audit Activity Timeline</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-purple-400 shrink-0" /> Priority 24/7 Dedicated Support</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full py-3 text-center bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors block"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-indigo-950/40 via-purple-950/20 to-slate-950 border-t border-slate-800 text-center relative">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-white mb-6">
            Ready to elevate your team's workflow?
          </h2>
          <p className="text-slate-400 text-base mb-8 max-w-xl mx-auto">
            Experience TaskSphere today with pre-seeded demo accounts or create your own custom workspace.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-xl shadow-indigo-600/40 transition-all hover:scale-105"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 TaskSphere SaaS Platform. Built with MERN Stack.</p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-slate-300">Sign In</Link>
            <Link to="/register" className="hover:text-slate-300">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
