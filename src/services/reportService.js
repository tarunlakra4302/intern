import api from './api';

const reportService = {
  // Get overview report
  getOverview: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/reports/overview?${params}`);
    return response.data;
  },

  // Get financial report
  getFinancial: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/reports/financial?${params}`);
    return response.data;
  },

  // Get fleet report
  getFleet: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/reports/fleet?${params}`);
    return response.data;
  },

  // Get driver performance report
  getDriver: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/reports/driver?${params}`);
    return response.data;
  },

  // Get fuel consumption report
  getFuel: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/reports/fuel?${params}`);
    return response.data;
  },

  // Export report
  exportReport: async (reportType, format, filters = {}) => {
    const params = new URLSearchParams({ ...filters, format }).toString();
    const response = await api.get(`/reports/${reportType}?${params}`, {
      responseType: format === 'csv' || format === 'pdf' ? 'blob' : 'json'
    });

    if (format === 'csv' || format === 'pdf') {
      const blob = new Blob([response.data], {
        type: format === 'pdf' ? 'application/pdf' : 'text/csv'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}-report.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }

    return response.data;
  },

  // Legacy endpoints
  getDriverTimesheet: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/reports/driver-timesheet?${params}`);
    return response.data;
  },

  getServiceList: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/reports/service-list?${params}`);
    return response.data;
  },

  getJobAttachments: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/reports/job-attachments?${params}`);
    return response.data;
  },
};

export default reportService;
