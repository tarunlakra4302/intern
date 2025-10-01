export const documents = [
  {
    id: "DOC-0001",
    name: "Fleet Management Company Policy 2024.pdf",
    type: "license",
    entityType: "company",
    entityId: null,
    referenceNumber: "POL-2024-001",
    fileSize: 2456789,
    uploadedDate: "2024-01-15T09:30:00",
    expiryDate: "2024-12-31T23:59:59",
    status: "active",
    uploadedBy: "admin"
  },
  {
    id: "DOC-0002",
    name: "Driver Safety Manual v3.2.pdf",
    type: "certificate",
    entityType: "company",
    entityId: null,
    referenceNumber: "SAF-2024-001",
    fileSize: 5678901,
    uploadedDate: "2024-03-10T14:15:00",
    expiryDate: null,
    status: "active",
    uploadedBy: "admin"
  },
  {
    id: "DOC-0003",
    name: "Vehicle Inspection Checklist.xlsx",
    type: "other",
    entityType: "company",
    entityId: null,
    referenceNumber: "FORM-2024-001",
    fileSize: 89456,
    uploadedDate: "2024-02-20T11:45:00",
    expiryDate: null,
    status: "active",
    uploadedBy: "maintenance_manager"
  },
  {
    id: "DOC-0004",
    name: "Fleet Insurance Certificate 2024.pdf",
    type: "insurance",
    entityType: "company",
    entityId: null,
    referenceNumber: "INS-2024-001",
    fileSize: 345678,
    uploadedDate: "2024-07-01T16:20:00",
    expiryDate: "2025-06-30T23:59:59",
    status: "active",
    uploadedBy: "finance_manager"
  },
  {
    id: "DOC-0005",
    name: "Driver License - John Smith.pdf",
    type: "license",
    entityType: "driver",
    entityId: "DRV-0001",
    referenceNumber: "DL-12345678",
    fileSize: 234567,
    uploadedDate: "2024-05-15T10:30:00",
    expiryDate: "2026-05-15T23:59:59",
    status: "active",
    uploadedBy: "hr_manager"
  },
  {
    id: "DOC-0006",
    name: "Vehicle Registration - ABC-123.pdf",
    type: "registration",
    entityType: "vehicle",
    entityId: "VEH-0001",
    referenceNumber: "REG-ABC123-2024",
    fileSize: 156789,
    uploadedDate: "2024-01-05T08:15:00",
    expiryDate: "2025-01-05T23:59:59",
    status: "active",
    uploadedBy: "maintenance_manager"
  },
  {
    id: "DOC-0007",
    name: "Emergency Response Procedures.pdf",
    type: "certificate",
    entityType: "company",
    entityId: null,
    referenceNumber: "ERP-2024-001",
    fileSize: 1234567,
    uploadedDate: "2024-04-22T13:45:00",
    expiryDate: null,
    status: "active",
    uploadedBy: "safety_officer"
  },
  {
    id: "DOC-0008",
    name: "Fuel Card Usage Policy.docx",
    type: "other",
    entityType: "company",
    entityId: null,
    referenceNumber: "FUEL-POL-2024",
    fileSize: 98765,
    uploadedDate: "2024-06-10T15:30:00",
    expiryDate: null,
    status: "active",
    uploadedBy: "fleet_manager"
  },
  {
    id: "DOC-0009",
    name: "Driver License - Mike Johnson.pdf",
    type: "license",
    entityType: "driver",
    entityId: "DRV-0002",
    referenceNumber: "DL-87654321",
    fileSize: 245678,
    uploadedDate: "2024-03-20T09:15:00",
    expiryDate: "2025-12-20T23:59:59",
    status: "pending",
    uploadedBy: "hr_manager"
  },
  {
    id: "DOC-0010",
    name: "Commercial Vehicle Insurance.pdf",
    type: "insurance",
    entityType: "vehicle",
    entityId: "VEH-0002",
    referenceNumber: "CVI-2024-002",
    fileSize: 456789,
    uploadedDate: "2024-08-01T14:30:00",
    expiryDate: "2024-10-15T23:59:59",
    status: "expired",
    uploadedBy: "insurance_manager"
  }
];

export const getDocumentById = (id) => documents.find(doc => doc.id === id);

export const getDocumentsByCategory = (category) => documents.filter(doc => doc.type === category);

export const getDocumentsByEntity = (entityType, entityId) =>
  documents.filter(doc => doc.entityType === entityType && doc.entityId === entityId);

export const getExpiringDocuments = (days = 30) => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return documents.filter(doc => {
    if (!doc.expiryDate) return false;
    const expiry = new Date(doc.expiryDate);
    return expiry <= futureDate && expiry > new Date();
  });
};

export const getExpiredDocuments = () => {
  const now = new Date();
  return documents.filter(doc => {
    if (!doc.expiryDate) return false;
    return new Date(doc.expiryDate) < now;
  });
};