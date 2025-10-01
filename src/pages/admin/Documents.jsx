import { useState } from 'react';
import { format } from 'date-fns';
import { FileText, Plus, Download, Eye, Trash2, Upload, Filter, FolderOpen, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { DataTable, Toolbar, Badge, Modal, FormField, EmptyState, KpiCard } from '../../components/common';
import { documents, drivers, vehicles } from '../../mocks';

export default function Documents() {
  const [filteredDocuments, setFilteredDocuments] = useState(documents);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    entityType: 'company',
    entityId: '',
    referenceNumber: '',
    expiryDate: '',
    notes: '',
    uploadedBy: 'admin'
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterDocuments(value, typeFilter, statusFilter);
  };

  const handleTypeFilter = (value) => {
    setTypeFilter(value);
    filterDocuments(searchTerm, value, statusFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    filterDocuments(searchTerm, typeFilter, value);
  };

  const filterDocuments = (search, type, status) => {
    let filtered = documents;

    if (search) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.referenceNumber?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type) {
      filtered = filtered.filter(doc => doc.type === type);
    }

    if (status) {
      filtered = filtered.filter(doc => doc.status === status);
    }

    setFilteredDocuments(filtered);
  };

  const getEntityName = (entityType, entityId) => {
    if (entityType === 'driver') {
      const driver = drivers.find(d => d.id === entityId);
      return driver ? driver.name : 'Unknown';
    } else if (entityType === 'vehicle') {
      const vehicle = vehicles.find(v => v.id === entityId);
      return vehicle ? vehicle.registrationNumber : 'Unknown';
    }
    return 'Company';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      category: '',
      entityType: 'company',
      entityId: '',
      referenceNumber: '',
      expiryDate: '',
      notes: '',
      uploadedBy: 'admin'
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.type || !formData.entityType) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate entity selection
    if ((formData.entityType === 'driver' || formData.entityType === 'vehicle') && !formData.entityId) {
      alert('Please select a driver or vehicle');
      return;
    }

    // Generate new ID
    const newId = `DOC-${String(documents.length + 1).padStart(4, '0')}`;

    // Determine status based on expiry date
    let status = 'active';
    if (formData.expiryDate) {
      const expiryDate = new Date(formData.expiryDate);
      const now = new Date();
      if (expiryDate < now) {
        status = 'expired';
      }
    }

    // Create new document object matching mock data structure
    const newDocument = {
      id: newId,
      name: formData.name,
      type: formData.type,
      entityType: formData.entityType,
      entityId: formData.entityType === 'company' ? null : formData.entityId,
      referenceNumber: formData.referenceNumber || `REF-${Date.now()}`,
      fileSize: Math.floor(Math.random() * 5000000) + 100000, // Mock file size
      uploadedDate: new Date().toISOString(),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
      status: status,
      uploadedBy: formData.uploadedBy
    };

    // Add to mock array
    documents.push(newDocument);

    // Update filtered state
    setFilteredDocuments([...documents]);
    filterDocuments(searchTerm, typeFilter, statusFilter);

    // Reset form and close modal
    resetForm();
    setShowUploadModal(false);

    // Show success message
    alert('Document uploaded successfully!');
  };

  const columns = [
    {
      key: 'name',
      label: 'Document',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
            <FileText className="w-5 h-5 text-base-content/60" />
          </div>
          <div>
            <div className="font-medium text-base-content">{value}</div>
            <div className="text-sm text-base-content/60">
              {row.referenceNumber} • {(row.fileSize / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value) => (
        <Badge color={
          value === 'license' ? 'primary' :
          value === 'insurance' ? 'warning' :
          value === 'registration' ? 'info' :
          value === 'contract' ? 'success' :
          'default'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: 'entityType',
      label: 'Associated With',
      render: (value, row) => (
        <div>
          <div className="text-sm font-medium capitalize">{value}</div>
          <div className="text-sm text-base-content/60">
            {getEntityName(value, row.entityId)}
          </div>
        </div>
      )
    },
    {
      key: 'uploadedDate',
      label: 'Uploaded',
      sortable: true,
      render: (value) => (
        <div className="text-sm">
          <div>{format(new Date(value), 'MMM dd, yyyy')}</div>
          <div className="text-base-content/60">{format(new Date(value), 'h:mm a')}</div>
        </div>
      )
    },
    {
      key: 'expiryDate',
      label: 'Expires',
      sortable: true,
      render: (value) => {
        if (!value) return <span className="text-base-content/60">-</span>;
        const isExpired = new Date(value) < new Date();
        const isExpiringSoon = new Date(value) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        return (
          <div className="flex items-center gap-2">
            <span className={`text-sm ${
              isExpired ? 'text-error font-medium' :
              isExpiringSoon ? 'text-warning font-medium' :
              ''
            }`}>
              {format(new Date(value), 'MMM dd, yyyy')}
            </span>
            {isExpired && <AlertCircle className="w-4 h-4 text-error" />}
            {!isExpired && isExpiringSoon && <Clock className="w-4 h-4 text-warning" />}
          </div>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge color={
          value === 'active' ? 'success' :
          value === 'expired' ? 'error' :
          value === 'pending' ? 'warning' :
          'default'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedDocument(row);
              setShowViewModal(true);
            }}
            className="btn btn-sm btn-ghost"
            aria-label="View document"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="btn btn-sm btn-ghost"
            aria-label="Download document"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Calculate KPIs
  const totalDocuments = documents.length;
  const expiringDocuments = documents.filter(doc => {
    if (!doc.expiryDate) return false;
    const expiry = new Date(doc.expiryDate);
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return expiry < thirtyDaysFromNow && expiry > new Date();
  }).length;
  const expiredDocuments = documents.filter(doc => {
    if (!doc.expiryDate) return false;
    return new Date(doc.expiryDate) < new Date();
  }).length;
  const activeDocuments = documents.filter(doc => doc.status === 'active').length;

  const documentTypes = [...new Set(documents.map(d => d.type))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Documents</h1>
          <p className="text-base-content/60 mt-1">Manage compliance documents and certificates</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn btn-primary"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Documents"
          value={totalDocuments}
          icon={FileText}
          color="primary"
        />
        <KpiCard
          title="Active"
          value={activeDocuments}
          icon={CheckCircle}
          color="success"
        />
        <KpiCard
          title="Expiring Soon"
          value={expiringDocuments}
          icon={Clock}
          color="warning"
          trendLabel="within 30 days"
        />
        <KpiCard
          title="Expired"
          value={expiredDocuments}
          icon={AlertCircle}
          color="error"
          trendLabel="need renewal"
        />
      </div>

      {/* Toolbar */}
      <Toolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search documents..."
        filters={[
          {
            label: 'Type',
            value: typeFilter,
            onChange: handleTypeFilter,
            options: [
              { value: '', label: 'All Types' },
              ...documentTypes.map(type => ({ value: type, label: type }))
            ]
          },
          {
            label: 'Status',
            value: statusFilter,
            onChange: handleStatusFilter,
            options: [
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'expired', label: 'Expired' },
              { value: 'pending', label: 'Pending' }
            ]
          }
        ]}
      />

      {/* Data Table */}
      {filteredDocuments.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents found"
          description={searchTerm || typeFilter || statusFilter ?
            "Try adjusting your filters" :
            "Upload your first document to get started"
          }
          action={
            <button onClick={() => setShowUploadModal(true)} className="btn btn-primary">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </button>
          }
        />
      ) : (
        <div className="card bg-base-100 shadow">
          <DataTable
            columns={columns}
            data={filteredDocuments}
            className="table-zebra"
          />
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <Modal
          isOpen={showUploadModal}
          onClose={() => {
            setShowUploadModal(false);
            resetForm();
          }}
          title="Upload Document"
          size="lg"
        >
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-base-content/40 mb-4" />
              <p className="text-base-content/80 mb-2">Drag and drop your file here, or click to browse</p>
              <p className="text-sm text-base-content/60">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="btn btn-primary btn-sm mt-4 cursor-pointer">
                Select File
              </label>
            </div>

            <FormField
              label="Document Name"
              type="text"
              name="name"
              placeholder="Enter document name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Document Type"
                type="select"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                options={[
                  { value: '', label: 'Select type' },
                  { value: 'license', label: 'License' },
                  { value: 'insurance', label: 'Insurance' },
                  { value: 'registration', label: 'Registration' },
                  { value: 'contract', label: 'Contract' },
                  { value: 'certificate', label: 'Certificate' },
                  { value: 'other', label: 'Other' }
                ]}
              />
              <FormField
                label="Reference Number"
                type="text"
                name="referenceNumber"
                placeholder="Enter reference number"
                value={formData.referenceNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Associated With"
                type="select"
                name="entityType"
                value={formData.entityType}
                onChange={handleInputChange}
                required
                options={[
                  { value: 'company', label: 'Company' },
                  { value: 'driver', label: 'Driver' },
                  { value: 'vehicle', label: 'Vehicle' }
                ]}
              />
              <FormField
                label="Select Entity"
                type="select"
                name="entityId"
                value={formData.entityId}
                onChange={handleInputChange}
                options={[
                  { value: '', label: 'Select...' },
                  ...(formData.entityType === 'driver'
                    ? drivers.map(driver => ({
                        value: driver.id,
                        label: driver.name
                      }))
                    : formData.entityType === 'vehicle'
                    ? vehicles.map(vehicle => ({
                        value: vehicle.id,
                        label: `${vehicle.registrationNumber} - ${vehicle.make} ${vehicle.model}`
                      }))
                    : [])
                ]}
              />
            </div>

            <FormField
              label="Expiry Date"
              type="date"
              name="expiryDate"
              placeholder="Select expiry date"
              value={formData.expiryDate}
              onChange={handleInputChange}
            />

            <FormField
              label="Notes"
              type="textarea"
              name="notes"
              placeholder="Add any notes about this document..."
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  resetForm();
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Upload Document
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {showViewModal && selectedDocument && (
        <Modal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedDocument(null);
          }}
          title="Document Details"
          size="lg"
        >
          <div className="space-y-6">
            <div className="bg-base-200 rounded-lg p-8 text-center">
              <FileText className="w-16 h-16 mx-auto text-base-content/40 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{selectedDocument.name}</h3>
              <p className="text-sm text-base-content/60">{selectedDocument.referenceNumber}</p>
              <p className="text-sm text-base-content/60">
                {(selectedDocument.fileSize / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-base-content/60">Type</p>
                <p className="font-medium capitalize">{selectedDocument.type}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Status</p>
                <Badge color={
                  selectedDocument.status === 'active' ? 'success' :
                  selectedDocument.status === 'expired' ? 'error' :
                  'warning'
                }>
                  {selectedDocument.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Uploaded</p>
                <p className="font-medium">
                  {format(new Date(selectedDocument.uploadedDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Expires</p>
                <p className="font-medium">
                  {selectedDocument.expiryDate ?
                    format(new Date(selectedDocument.expiryDate), 'MMM dd, yyyy') :
                    'No expiry'
                  }
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedDocument(null);
                }}
                className="btn btn-ghost"
              >
                Close
              </button>
              <button className="btn btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}