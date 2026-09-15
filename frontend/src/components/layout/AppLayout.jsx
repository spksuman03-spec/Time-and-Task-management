import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { TaskModal } from '../tasks/TaskModal';

export const AppLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenCreateTaskModal={() => setCreateTaskModalOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Global Quick Create Task Modal */}
      <TaskModal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
      />
    </div>
  );
};
