import api from './api';

export const taskService = {
  getTasks: (params) => api.get('/tasks', { params }),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  updateTaskStatus: (id, data) => api.put(`/tasks/${id}/status`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getTaskComments: (taskId) => api.get(`/comments/task/${taskId}`),
  addComment: (data) => api.post('/comments', data),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`)
};
