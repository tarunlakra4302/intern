import api from './api';

const driverService = {
  // Get all drivers with filters
  getDrivers: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/drivers?${params}`);
    return response.data;
  },

  // Get driver by ID
  getDriverById: async (id) => {
    const response = await api.get(`/drivers/${id}`);
    return response.data;
  },

  // Create new driver
  createDriver: async (data) => {
    const response = await api.post('/drivers', data);
    return response.data;
  },

  // Update driver
  updateDriver: async (id, data) => {
    const response = await api.put(`/drivers/${id}`, data);
    return response.data;
  },

  // Delete driver
  deleteDriver: async (id) => {
    const response = await api.delete(`/drivers/${id}`);
    return response.data;
  },
};

export default driverService;
