import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Activity from '../models/Activity.js';

export const autoSeed = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`[AutoSeed] Database initialized with ${userCount} existing users.`);
      return;
    }

    console.log('[AutoSeed] Database is empty. Auto-seeding demo users and workspace...');

    const admin = await User.create({
      name: 'Sarah Connor',
      email: 'admin@tasksphere.com',
      password: 'password123',
      role: 'Admin',
      bio: 'Platform Owner & Lead System Architect',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    });

    const manager = await User.create({
      name: 'Arun Kumar',
      email: 'manager@tasksphere.com',
      password: 'password123',
      role: 'Manager',
      bio: 'Senior Product & Engineering Manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    });

    const member1 = await User.create({
      name: 'Priya Sharma',
      email: 'member@tasksphere.com',
      password: 'password123',
      role: 'Member',
      bio: 'Fullstack UI/UX Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });

    const member2 = await User.create({
      name: 'David Miller',
      email: 'david@tasksphere.com',
      password: 'password123',
      role: 'Member',
      bio: 'Backend & Cloud Infrastructure Engineer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    });

    const workspace = await Workspace.create({
      name: 'Acme Corp Engineering',
      slug: 'acme-corp-eng',
      description: 'Central Workspace for Acme Product Development & Cloud Operations',
      owner: admin._id,
      icon: 'briefcase',
      isDefault: true
    });

    await WorkspaceMember.create({ workspace: workspace._id, user: admin._id, role: 'Admin' });
    await WorkspaceMember.create({ workspace: workspace._id, user: manager._id, role: 'Manager' });
    await WorkspaceMember.create({ workspace: workspace._id, user: member1._id, role: 'Member' });
    await WorkspaceMember.create({ workspace: workspace._id, user: member2._id, role: 'Member' });

    const project1 = await Project.create({
      name: 'TaskSphere Platform v2.0',
      key: 'TS',
      description: 'Next-generation real-time task & project management SaaS platform.',
      workspace: workspace._id,
      owner: manager._id,
      members: [admin._id, manager._id, member1._id, member2._id],
      status: 'Active',
      priority: 'High',
      color: '#3b82f6',
      startDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    const project2 = await Project.create({
      name: 'Mobile iOS & Android App',
      key: 'MOB',
      description: 'Native mobile client apps for instant team notifications.',
      workspace: workspace._id,
      owner: manager._id,
      members: [manager._id, member1._id],
      status: 'Planning',
      priority: 'Medium',
      color: '#10b981',
      startDate: new Date(),
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
    });

    const task1 = await Task.create({
      taskId: 'TS-101',
      title: 'Design Dark Mode Design System',
      description: 'Implement slate-900 based dark theme design tokens.',
      project: project1._id,
      workspace: workspace._id,
      assignee: member1._id,
      createdBy: manager._id,
      priority: 'High',
      status: 'Completed',
      tags: ['UI/UX', 'Tailwind'],
      orderPosition: 0,
      completedAt: new Date(),
      checklist: [{ text: 'Define color tokens', completed: true }],
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    });

    const task2 = await Task.create({
      taskId: 'TS-102',
      title: 'Setup Socket.IO Real-Time Engine',
      description: 'Broadcast task updates across active workspace rooms.',
      project: project1._id,
      workspace: workspace._id,
      assignee: member2._id,
      createdBy: manager._id,
      priority: 'Urgent',
      status: 'In Progress',
      tags: ['Backend', 'Socket.IO'],
      orderPosition: 0,
      checklist: [{ text: 'Initialize socket server', completed: true }],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    });

    await Activity.create({
      workspace: workspace._id,
      project: project1._id,
      task: task1._id,
      user: admin._id,
      action: 'TASK_COMPLETED',
      details: 'Marked task "Design Dark Mode Design System" as Completed'
    });

    console.log('[AutoSeed] Demo users and workspace successfully initialized!');
  } catch (err) {
    console.error('[AutoSeed Error]', err);
  }
};
