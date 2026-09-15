import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token & Active Workspace Header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const activeWorkspaceId = localStorage.getItem('activeWorkspaceId');
  if (activeWorkspaceId) {
    config.headers['x-workspace-id'] = activeWorkspaceId;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle Unauthorized / Expired Tokens
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if unauthenticated
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response ? error.response.data : { message: 'Network error or server unreachable' });
  }
);

export default api;
