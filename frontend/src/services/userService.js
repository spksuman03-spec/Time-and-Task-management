import api from './api';

export const userService = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  toggleUserStatus: (id) => api.put(`/users/${id}/status`)
};
