import api from './api';

export const workspaceService = {
  getWorkspaces: () => api.get('/workspaces'),
  getWorkspaceById: (id) => api.get(`/workspaces/${id}`),
  createWorkspace: (data) => api.post('/workspaces', data),
  inviteMember: (workspaceId, data) => api.post(`/workspaces/${workspaceId}/members`, data),
  updateMemberRole: (workspaceId, memberId, data) => api.put(`/workspaces/${workspaceId}/members/${memberId}/role`, data),
  removeMember: (workspaceId, memberId) => api.delete(`/workspaces/${workspaceId}/members/${memberId}`)
};
