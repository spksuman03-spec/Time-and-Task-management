import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB, closeDB } from '../config/db.js';
import User from '../models/User.js';
import Workspace from '../models/Workspace.js';
import WorkspaceMember from '../models/WorkspaceMember.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';
import Activity from '../models/Activity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    await connectDB();
    console.log('[Seeder] Clearing existing database collections...');

    await User.deleteMany();
    await Workspace.deleteMany();
    await WorkspaceMember.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    await Comment.deleteMany();
    await Notification.deleteMany();
    await Activity.deleteMany();

    console.log('[Seeder] Creating demo users (Admin, Manager, Member)...');

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

    console.log('[Seeder] Creating sample Workspace...');

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

    console.log('[Seeder] Creating sample Projects...');

    const project1 = await Project.create({
      name: 'TaskSphere Platform v2.0',
      key: 'TS',
      description: 'Next-generation real-time task & project management SaaS platform built with MERN stack.',
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
      description: 'Native mobile client apps for instant team notifications and offline Kanban board sync.',
      workspace: workspace._id,
      owner: manager._id,
      members: [manager._id, member1._id],
      status: 'Planning',
      priority: 'Medium',
      color: '#10b981',
      startDate: new Date(),
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
    });

    console.log('[Seeder] Creating sample Tasks...');

    const task1 = await Task.create({
      taskId: 'TS-101',
      title: 'Design Dark Mode Design System',
      description: 'Implement slate-900 based dark theme design tokens, glassmorphism card elevation, and dynamic CSS variables.',
      project: project1._id,
      workspace: workspace._id,
      assignee: member1._id,
      createdBy: manager._id,
      priority: 'High',
      status: 'Completed',
      tags: ['UI/UX', 'Tailwind', 'Design System'],
      orderPosition: 0,
      completedAt: new Date(),
      checklist: [
        { text: 'Define HSL color palette tokens', completed: true },
        { text: 'Configure Tailwind theme extension', completed: true },
        { text: 'Add dynamic theme toggler context', completed: true }
      ],
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    });

    const task2 = await Task.create({
      taskId: 'TS-102',
      title: 'Setup Socket.IO Real-Time Engine',
      description: 'Broadcast task updates, status movements, and comments in real-time across active workspace rooms.',
      project: project1._id,
      workspace: workspace._id,
      assignee: member2._id,
      createdBy: manager._id,
      priority: 'Urgent',
      status: 'In Progress',
      tags: ['Backend', 'Socket.IO', 'Real-Time'],
      orderPosition: 0,
      checklist: [
        { text: 'Initialize socket server attached to HTTP listener', completed: true },
        { text: 'Implement room joining logic per workspace ID', completed: true },
        { text: 'Integrate live notification alerts in top navbar', completed: false }
      ],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    });

    const task3 = await Task.create({
      taskId: 'TS-103',
      title: 'Build Drag-and-Drop Kanban Board',
      description: 'Interactive HTML5 drag-and-drop board allowing columns re-ordering and status updates automatically saved to MongoDB.',
      project: project1._id,
      workspace: workspace._id,
      assignee: member1._id,
      createdBy: manager._id,
      priority: 'High',
      status: 'Review',
      tags: ['Frontend', 'Kanban', 'React'],
      orderPosition: 0,
      checklist: [
        { text: 'Setup hello-pangea/dnd columns', completed: true },
        { text: 'Implement backend status update handler', completed: true }
      ],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    });

    const task4 = await Task.create({
      taskId: 'TS-104',
      title: 'Automated Deadline Reminder Cron Job',
      description: 'Scheduled backend cron to periodically scan approaching due dates and trigger in-app notifications.',
      project: project1._id,
      workspace: workspace._id,
      assignee: member2._id,
      createdBy: admin._id,
      priority: 'Medium',
      status: 'Todo',
      tags: ['Backend', 'Cron', 'Notifications'],
      orderPosition: 0,
      checklist: [
        { text: 'Create node-cron hourly check schedule', completed: true },
        { text: 'Format overdue and due-today notification messages', completed: false }
      ],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    const task5 = await Task.create({
      taskId: 'MOB-101',
      title: 'React Native Project Initialization',
      description: 'Setup Expo / React Native scaffolding with TypeScript and Tailwind/NativeWind UI foundation.',
      project: project2._id,
      workspace: workspace._id,
      assignee: member1._id,
      createdBy: manager._id,
      priority: 'Low',
      status: 'Backlog',
      tags: ['Mobile', 'React Native'],
      orderPosition: 0,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    });

    console.log('[Seeder] Creating sample Comments...');

    await Comment.create({
      task: task2._id,
      user: manager._id,
      content: 'Priya Sharma make sure the socket connection auto-reconnects when network status changes!',
      mentions: [member1._id]
    });

    await Comment.create({
      task: task2._id,
      user: member2._id,
      content: 'Added automatic exponential backoff reconnection logic on client-side socket listener!'
    });

    console.log('[Seeder] Creating sample Activities...');

    await Activity.create({
      workspace: workspace._id,
      project: project1._id,
      task: task1._id,
      user: admin._id,
      action: 'TASK_COMPLETED',
      details: 'Marked task "Design Dark Mode Design System" as Completed'
    });

    await Activity.create({
      workspace: workspace._id,
      project: project1._id,
      task: task2._id,
      user: manager._id,
      action: 'TASK_STATUS_CHANGED',
      details: 'Moved task "Setup Socket.IO Real-Time Engine" to In Progress'
    });

    console.log('[Seeder] Database seeding completed successfully!');
    console.log('----------------------------------------------------');
    console.log('DEMO LOGIN CREDENTIALS:');
    console.log('  Admin User:   admin@tasksphere.com    / password123');
    console.log('  Manager User: manager@tasksphere.com  / password123');
    console.log('  Member User:  member@tasksphere.com   / password123');
    console.log('----------------------------------------------------');

    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Failed]', error);
    process.exit(1);
  }
};

seedData();
