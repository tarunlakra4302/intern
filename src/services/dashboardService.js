import api from './api';

const dashboardService = {
  // Get dashboard statistics
  getStats: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/admin/dashboard/stats?${params}`);
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    const response = await api.get(`/admin/dashboard/activities?limit=${limit}`);
    return response.data;
  },

  // Get alerts
  getAlerts: async () => {
    const response = await api.get('/admin/dashboard/alerts');
    return response.data;
  },
};

export default dashboardService;
