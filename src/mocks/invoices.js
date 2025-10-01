export const invoices = [
  {
    id: "INV-2025-0001",
    number: "INV-001234",
    clientId: "CLI-0001",
    jobId: "JOB-2025-0001",
    issueDate: "2024-09-29",
    dueDate: "2024-10-29",
    status: "sent",
    subtotal: 850.00,
    gst: 85.00,
    total: 935.00,
    paidAmount: 0,
    balanceOwing: 935.00,
    paymentTerms: "30 days",
    emailSent: true,
    emailSentDate: "2024-09-29T14:30:00",
    notes: "Steel delivery job - payment due 30 days",
    lineItems: [
      {
        description: "Steel coil transport - Sydney to Newcastle",
        quantity: 45,
        unit: "tonne",
        unitPrice: 18.89,
        amount: 850.00
      }
    ]
  },
  {
    id: "INV-2025-0002",
    number: "INV-001235",
    clientId: "CLI-0005",
    jobId: "JOB-2025-0004",
    issueDate: "2024-09-28",
    dueDate: "2024-11-12",
    status: "paid",
    subtotal: 2850.00,
    gst: 285.00,
    total: 3135.00,
    paidAmount: 3135.00,
    balanceOwing: 0,
    paymentTerms: "45 days",
    emailSent: true,
    emailSentDate: "2024-09-28T16:45:00",
    paidDate: "2024-09-30",
    notes: "Heavy machinery transport - oversized load",
    lineItems: [
      {
        description: "Excavator component transport - Perth to Kalgoorlie",
        quantity: 1,
        unit: "each",
        unitPrice: 2850.00,
        amount: 2850.00
      }
    ]
  },
  {
    id: "INV-2025-0003",
    number: "INV-001236",
    clientId: "CLI-0002",
    jobId: "JOB-2025-0002",
    issueDate: "2024-09-30",
    dueDate: "2024-10-14",
    status: "draft",
    subtotal: 650.00,
    gst: 65.00,
    total: 715.00,
    paidAmount: 0,
    balanceOwing: 715.00,
    paymentTerms: "14 days",
    emailSent: false,
    emailSentDate: null,
    notes: "Chemical transport job - awaiting completion",
    lineItems: [
      {
        description: "Chemical transport - Melbourne to Geelong",
        quantity: 500,
        unit: "litre",
        unitPrice: 1.30,
        amount: 650.00
      }
    ]
  },
  {
    id: "INV-2025-0004",
    number: "INV-001237",
    clientId: "CLI-0001",
    jobId: "JOB-2025-0008",
    issueDate: "2024-09-15",
    dueDate: "2024-10-15",
    status: "overdue",
    subtotal: 1200.00,
    gst: 120.00,
    total: 1320.00,
    paidAmount: 0,
    balanceOwing: 1320.00,
    paymentTerms: "30 days",
    emailSent: true,
    emailSentDate: "2024-09-15T10:00:00",
    notes: "OVERDUE - Follow up required with client",
    lineItems: [
      {
        description: "Multi-drop delivery service",
        quantity: 8,
        unit: "drop",
        unitPrice: 150.00,
        amount: 1200.00
      }
    ]
  },
  {
    id: "INV-2025-0005",
    number: "INV-001238",
    clientId: "CLI-0003",
    jobId: "JOB-2025-0003",
    issueDate: "2024-10-01",
    dueDate: "2024-10-22",
    status: "sent",
    subtotal: 1200.00,
    gst: 120.00,
    total: 1320.00,
    paidAmount: 0,
    balanceOwing: 1320.00,
    paymentTerms: "21 days",
    emailSent: true,
    emailSentDate: "2024-10-01T09:15:00",
    notes: "Grain export delivery - port handling included",
    lineItems: [
      {
        description: "Grain transport - Toowoomba to Brisbane Port",
        quantity: 50,
        unit: "tonne",
        unitPrice: 24.00,
        amount: 1200.00
      }
    ]
  }
];

export const getInvoiceById = (id) => invoices.find(invoice => invoice.id === id);

export const getInvoicesByClient = (clientId) => invoices.filter(invoice => invoice.clientId === clientId);

export const getInvoicesByStatus = (status) => invoices.filter(invoice => invoice.status === status);

export const getOverdueInvoices = () => invoices.filter(invoice => invoice.status === 'overdue');

export const getTotalOutstanding = () => invoices.reduce((total, invoice) => total + invoice.balanceOwing, 0);