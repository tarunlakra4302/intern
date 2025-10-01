import api from './api';

const trailerService = {
  getTrailers: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/trailers?${params}`);
    return response.data;
  },

  getTrailerById: async (id) => {
    const response = await api.get(`/trailers/${id}`);
    return response.data;
  },

  createTrailer: async (data) => {
    const response = await api.post('/trailers', data);
    return response.data;
  },

  updateTrailer: async (id, data) => {
    const response = await api.put(`/trailers/${id}`, data);
    return response.data;
  },

  deleteTrailer: async (id) => {
    const response = await api.delete(`/trailers/${id}`);
    return response.data;
  },
};

export default trailerService;
