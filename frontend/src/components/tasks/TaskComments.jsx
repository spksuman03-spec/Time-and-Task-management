import React, { useState, useEffect } from 'react';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { useToast } from '../common/Toast';
import { MessageSquare, Send, Trash2, AtSign } from 'lucide-react';

export const TaskComments = ({ taskId, workspaceMembers = [] }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { addToast } = useToast();

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMentionMenu, setShowMentionMenu] = useState(false);

  const fetchComments = async () => {
    if (!taskId) return;
    try {
      const res = await taskService.getTaskComments(taskId);
      setComments(res.data);
    } catch (err) {
      console.error('[Fetch Comments Error]', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  useEffect(() => {
    if (!socket) return;

    socket.on('comment_added', (newComment) => {
      if (newComment.task === taskId) {
        setComments(prev => [...prev, newComment]);
      }
    });

    return () => {
      socket.off('comment_added');
    };
  }, [socket, taskId]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setContent(val);
    if (val.endsWith('@')) {
      setShowMentionMenu(true);
    } else {
      setShowMentionMenu(false);
    }
  };

  const handleInsertMention = (member) => {
    setContent(prev => `${prev}${member.email} `);
    setShowMentionMenu(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      await taskService.addComment({
        taskId,
        content: content.trim()
      });
      setContent('');
      addToast('Comment posted', 'success');
      fetchComments();
    } catch (err) {
      addToast(err.message || 'Failed to add comment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await taskService.deleteComment(commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
      addToast('Comment deleted', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete comment', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2 font-display">
        <MessageSquare className="w-4 h-4 text-blue-500" />
        Activity & Comments ({comments.length})
      </h4>

      {/* Write Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-2 relative">
        <textarea
          rows="2"
          value={content}
          onChange={handleTextChange}
          placeholder="Add a comment... (Type @ to mention team members)"
          className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/50"
        />

        {/* Mention suggestions dropdown */}
        {showMentionMenu && (
          <div className="absolute left-0 bottom-12 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 py-1 max-h-40 overflow-y-auto">
            <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">Mention Member</div>
            {workspaceMembers.map(m => (
              <button
                type="button"
                key={m._id}
                onClick={() => handleInsertMention(m)}
                className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <Avatar name={m.name} src={m.avatar} size="xs" />
                <span className="font-medium">{m.name} ({m.email})</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <AtSign className="w-3 h-3" /> Supports @mentions
          </span>
          <Button type="submit" size="sm" loading={loading} disabled={!content.trim()}>
            <Send className="w-3.5 h-3.5" /> Post
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3 pt-2">
        {comments.map((c) => (
          <div key={c._id} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar name={c.user?.name} src={c.user?.avatar} size="xs" />
                <span className="font-semibold text-slate-900 dark:text-slate-100">{c.user?.name}</span>
                <span className="text-[10px] text-slate-400">
                  {new Date(c.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
              {(user?.role === 'Admin' || c.user?._id === user?._id) && (
                <button
                  onClick={() => handleDelete(c._id)}
                  className="text-slate-400 hover:text-red-500 p-1"
                  title="Delete comment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-slate-700 dark:text-slate-300 pl-8 leading-relaxed whitespace-pre-wrap">
              {c.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
