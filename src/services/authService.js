import api from './api';

const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.data?.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    const response = await api.post('/auth/password-reset/request', { email });
    return response.data;
  },

  // Confirm password reset
  confirmPasswordReset: async (token, new_password) => {
    const response = await api.post('/auth/password-reset/confirm', { token, new_password });
    return response.data;
  },

  // Change password
  changePassword: async (current_password, new_password) => {
    const response = await api.post('/auth/change-password', { current_password, new_password });
    return response.data;
  },
};

export default authService;
