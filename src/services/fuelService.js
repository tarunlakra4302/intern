import api from './api';

const fuelService = {
  getFuel: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/fuel?${params}`);
    return response.data;
  },

  getFuelById: async (id) => {
    const response = await api.get(`/fuel/${id}`);
    return response.data;
  },

  createFuel: async (data) => {
    const response = await api.post('/fuel', data);
    return response.data;
  },

  updateFuel: async (id, data) => {
    const response = await api.put(`/fuel/${id}`, data);
    return response.data;
  },

  deleteFuel: async (id) => {
    const response = await api.delete(`/fuel/${id}`);
    return response.data;
  },
};

export default fuelService;
