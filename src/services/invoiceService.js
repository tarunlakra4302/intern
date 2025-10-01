import api from './api';

const invoiceService = {
  getInvoices: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/invoices?${params}`);
    return response.data;
  },

  getInvoiceById: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (data) => {
    const response = await api.post('/invoices', data);
    return response.data;
  },

  updateInvoice: async (id, data) => {
    const response = await api.put(`/invoices/${id}`, data);
    return response.data;
  },

  deleteInvoice: async (id) => {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },

  // Generate invoice PDF
  generatePDF: async (id) => {
    const response = await api.get(`/invoices/${id}/pdf`, {
      responseType: 'blob'
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return response.data;
  },
};

export default invoiceService;
