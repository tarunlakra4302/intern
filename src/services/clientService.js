import api from './api';

const clientService = {
  getClients: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/clients?${params}`);
    return response.data;
  },

  getClientById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  createClient: async (data) => {
    const response = await api.post('/clients', data);
    return response.data;
  },

  updateClient: async (id, data) => {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },

  deleteClient: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};

export default clientService;
