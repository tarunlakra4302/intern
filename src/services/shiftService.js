import api from './api';

const shiftService = {
  getShifts: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/shifts?${params}`);
    return response.data;
  },

  getShiftById: async (id) => {
    const response = await api.get(`/shifts/${id}`);
    return response.data;
  },

  createShift: async (data) => {
    const response = await api.post('/shifts', data);
    return response.data;
  },

  updateShift: async (id, data) => {
    const response = await api.put(`/shifts/${id}`, data);
    return response.data;
  },

  deleteShift: async (id) => {
    const response = await api.delete(`/shifts/${id}`);
    return response.data;
  },

  // Start shift
  startShift: async (data) => {
    const response = await api.post('/shifts/start', data);
    return response.data;
  },

  // End shift
  endShift: async (id, data) => {
    const response = await api.post(`/shifts/${id}/end`, data);
    return response.data;
  },
};

export default shiftService;
