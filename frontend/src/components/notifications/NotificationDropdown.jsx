import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Clock, MessageSquare, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useSocket } from '../../context/SocketContext';
import { Link } from 'react-router-dom';

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSocket();

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data);
      setUnreadCount(res.unreadCount);
    } catch (err) {
      console.error('[Notifications Error]', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_notification', (newNotif) => {
      setNotifications(prev => [newNotif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.off('new_notification');
    };
  }, [socket]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'TASK_ASSIGNED':
      case 'TASK_REASSIGNED':
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'TASK_STATUS_CHANGED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'TASK_OVERDUE':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'COMMENT_ADDED':
      case 'USER_MENTIONED':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Notification Center"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold">
                  {unreadCount} new
                </span>
              )}
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAllAsRead();
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkAsRead(n._id)}
                  className={`p-3.5 transition-colors flex items-start gap-3 cursor-pointer ${
                    !n.isRead
                      ? 'bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
