import { useState } from 'react';
import { format } from 'date-fns';
import { Eye, Edit, Plus, FileText, Mail, DollarSign, AlertCircle, Download, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import { DataTable, Toolbar, Badge, Modal, FormField, EmptyState } from '../../components/common';
import { invoices, clients, jobs } from '../../mocks';

export default function Invoices() {
  const [filteredInvoices, setFilteredInvoices] = useState(invoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    jobId: '',
    issueDate: '',
    dueDate: '',
    status: 'draft',
    paymentTerms: '30 days',
    notes: '',
    lineItems: [
      {
        description: '',
        quantity: 1,
        unit: 'each',
        unitPrice: 0
      }
    ]
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterInvoices(value, statusFilter, clientFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    filterInvoices(searchTerm, value, clientFilter);
  };

  const handleClientFilter = (value) => {
    setClientFilter(value);
    filterInvoices(searchTerm, statusFilter, value);
  };

  const filterInvoices = (search, status, client) => {
    let filtered = invoices;

    if (search) {
      filtered = filtered.filter(invoice =>
        invoice.number.toLowerCase().includes(search.toLowerCase()) ||
        invoice.id.toLowerCase().includes(search.toLowerCase()) ||
        clients.find(c => c.id === invoice.clientId)?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter(invoice => invoice.status === status);
    }

    if (client) {
      filtered = filtered.filter(invoice => invoice.clientId === client);
    }

    setFilteredInvoices(filtered);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleViewPdf = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPdfModal(true);
  };

  const handleIssueInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowIssueModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-error" />;
      case 'sent':
        return <Mail className="w-4 h-4 text-info" />;
      case 'draft':
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...formData.lineItems];
    updatedLineItems[index][field] = value;
    setFormData(prev => ({
      ...prev,
      lineItems: updatedLineItems
    }));
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        {
          description: '',
          quantity: 1,
          unit: 'each',
          unitPrice: 0
        }
      ]
    }));
  };

  const removeLineItem = (index) => {
    if (formData.lineItems.length > 1) {
      const updatedLineItems = formData.lineItems.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        lineItems: updatedLineItems
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      jobId: '',
      issueDate: '',
      dueDate: '',
      status: 'draft',
      paymentTerms: '30 days',
      notes: '',
      lineItems: [
        {
          description: '',
          quantity: 1,
          unit: 'each',
          unitPrice: 0
        }
      ]
    });
  };

  const handleCreate = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.clientId || !formData.jobId || !formData.issueDate || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate line items
    const hasValidLineItems = formData.lineItems.some(item => item.description && item.quantity > 0);
    if (!hasValidLineItems) {
      alert('Please add at least one valid line item');
      return;
    }

    // Calculate totals
    const subtotal = formData.lineItems.reduce((sum, item) => {
      const amount = parseFloat(item.quantity) * parseFloat(item.unitPrice || 0);
      return sum + amount;
    }, 0);
    const gst = subtotal * 0.1; // 10% GST
    const total = subtotal + gst;

    // Generate new ID and number
    const newId = `INV-2025-${String(invoices.length + 1).padStart(4, '0')}`;
    const newNumber = `INV-${String(100000 + invoices.length + 1)}`;

    // Create line items with calculated amounts
    const lineItems = formData.lineItems
      .filter(item => item.description && item.quantity > 0)
      .map(item => ({
        description: item.description,
        quantity: parseFloat(item.quantity),
        unit: item.unit,
        unitPrice: parseFloat(item.unitPrice || 0),
        amount: parseFloat(item.quantity) * parseFloat(item.unitPrice || 0)
      }));

    // Create new invoice object matching mock data structure
    const newInvoice = {
      id: newId,
      number: newNumber,
      clientId: formData.clientId,
      jobId: formData.jobId,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      status: formData.status,
      subtotal: subtotal,
      gst: gst,
      total: total,
      paidAmount: 0,
      balanceOwing: total,
      paymentTerms: formData.paymentTerms,
      emailSent: false,
      emailSentDate: null,
      notes: formData.notes || '',
      lineItems: lineItems
    };

    // Add to mock array
    invoices.push(newInvoice);

    // Update filtered state
    setFilteredInvoices([...invoices]);
    filterInvoices(searchTerm, statusFilter, clientFilter);

    // Reset form and close modal
    resetForm();
    setShowCreateModal(false);

    // Show success message
    alert('Invoice created successfully!');
  };

  const columns = [
    {
      key: 'number',
      header: 'Invoice',
      render: (value, invoice) => (
        <div>
          <div className="font-mono font-bold">{value}</div>
          <div className="text-xs text-base-content/60">{invoice.id}</div>
        </div>
      )
    },
    {
      key: 'clientId',
      header: 'Client',
      render: (value) => {
        const client = clients.find(c => c.id === value);
        return (
          <div>
            <div className="font-medium">{client?.name || 'Unknown'}</div>
            <div className="text-xs text-base-content/60">{client?.code}</div>
          </div>
        );
      }
    },
    {
      key: 'jobId',
      header: 'Job Reference',
      render: (value) => {
        const job = jobs.find(j => j.id === value);
        return (
          <div className="font-mono text-sm">
            {job?.refNo || value}
          </div>
        );
      }
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      render: (value) => format(new Date(value), 'MMM dd, yyyy')
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (value) => format(new Date(value), 'MMM dd, yyyy')
    },
    {
      key: 'status',
      header: 'Status',
      render: (value, invoice) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(value)}
          <Badge variant={value}>{value}</Badge>
        </div>
      )
    },
    {
      key: 'total',
      header: 'Total',
      render: (value) => (
        <div className="text-right font-mono font-bold">
          ${value.toFixed(2)}
        </div>
      )
    },
    {
      key: 'balanceOwing',
      header: 'Balance',
      render: (value) => (
        <div className={`text-right font-mono font-bold ${
          value > 0 ? 'text-error' : 'text-success'
        }`}>
          ${value.toFixed(2)}
        </div>
      )
    },
    {
      key: 'emailSent',
      header: 'Email Status',
      render: (value, invoice) => (
        <div className="text-center">
          {value ? (
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-xs text-success">Sent</span>
            </div>
          ) : (
            <XCircle className="w-4 h-4 text-base-content/40" />
          )}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, invoice) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewInvoice(invoice)}
            className="btn btn-ghost btn-sm"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleViewPdf(invoice)}
            className="btn btn-ghost btn-sm"
            title="View PDF"
          >
            <FileText className="w-4 h-4" />
          </button>
          {invoice.status === 'draft' && (
            <button
              onClick={() => handleIssueInvoice(invoice)}
              className="btn btn-ghost btn-sm text-primary"
              title="Issue Invoice"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => console.log('Edit invoice:', invoice.id)}
            className="btn btn-ghost btn-sm"
            title="Edit Invoice"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' }
  ];

  const activeClients = clients.filter(c => c.status === 'active');

  // Calculate totals for summary
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceOwing, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.balanceOwing, 0);
  const draftCount = invoices.filter(inv => inv.status === 'draft').length;
  const paidThisMonth = invoices.filter(inv => {
    const paidDate = inv.paidDate;
    if (!paidDate) return false;
    const paid = new Date(paidDate);
    const now = new Date();
    return paid.getMonth() === now.getMonth() && paid.getFullYear() === now.getFullYear();
  }).reduce((sum, inv) => sum + inv.paidAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header & Toolbar */}
      <Toolbar
        title="Invoice Management"
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search invoices, clients..."
        onAddClick={() => setShowCreateModal(true)}
        addButtonText="Create Invoice"
      >
        <Toolbar.Filter
          label="Status"
          value={statusFilter}
          options={statusOptions}
          onChange={handleStatusFilter}
          placeholder="All Status"
        />
        <Toolbar.Filter
          label="Client"
          value={clientFilter}
          options={activeClients.map(client => ({ value: client.id, label: client.name }))}
          onChange={handleClientFilter}
          placeholder="All Clients"
        />
      </Toolbar>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-error">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="stat-title">Outstanding</div>
            <div className="stat-value text-error text-lg">
              ${totalOutstanding.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-error">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="stat-title">Overdue</div>
            <div className="stat-value text-error text-lg">
              ${overdueAmount.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-warning">
              <Clock className="w-6 h-6" />
            </div>
            <div className="stat-title">Draft</div>
            <div className="stat-value text-warning">
              {draftCount}
            </div>
          </div>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-success">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="stat-title">Paid This Month</div>
            <div className="stat-value text-success text-lg">
              ${paidThisMonth.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          {filteredInvoices.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredInvoices}
              sortable={true}
            />
          ) : (
            <EmptyState
              title="No invoices found"
              description="No invoices match your current search criteria."
              actionLabel="Create Invoice"
              onAction={() => setShowCreateModal(true)}
            />
          )}
        </div>
      </div>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Create New Invoice"
        size="xl"
      >
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Client"
              type="select"
              name="clientId"
              value={formData.clientId}
              onChange={handleInputChange}
              required
              options={[
                { value: '', label: 'Select client' },
                ...clients.filter(c => c.status === 'active').map(client => ({
                  value: client.id,
                  label: `${client.name} (${client.code})`
                }))
              ]}
            />
            <FormField
              label="Job"
              type="select"
              name="jobId"
              value={formData.jobId}
              onChange={handleInputChange}
              required
              options={[
                { value: '', label: 'Select job' },
                ...jobs.filter(j => j.status === 'completed' || j.status === 'in_progress').map(job => ({
                  value: job.id,
                  label: `${job.refNo} - ${job.pickupLocation.address.split(',')[0]} to ${job.deliveryLocation.address.split(',')[0]}`
                }))
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Issue Date"
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleInputChange}
              required
            />
            <FormField
              label="Due Date"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Payment Terms"
              type="text"
              name="paymentTerms"
              placeholder="e.g., 30 days"
              value={formData.paymentTerms}
              onChange={handleInputChange}
            />
            <FormField
              label="Status"
              type="select"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'sent', label: 'Sent' },
                { value: 'paid', label: 'Paid' },
                { value: 'overdue', label: 'Overdue' }
              ]}
            />
          </div>

          <div className="divider">Line Items</div>

          <div className="space-y-3">
            {formData.lineItems.map((item, index) => (
              <div key={index} className="p-4 border border-base-300 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Item {index + 1}</h4>
                  {formData.lineItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLineItem(index)}
                      className="btn btn-sm btn-ghost btn-circle text-error"
                    >
                      ×
                    </button>
                  )}
                </div>
                <FormField
                  label="Description"
                  type="text"
                  name={`lineItems[${index}].description`}
                  placeholder="Enter item description"
                  value={item.description}
                  onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <FormField
                    label="Quantity"
                    type="number"
                    name={`lineItems[${index}].quantity`}
                    placeholder="0"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                    min="0"
                    step="0.01"
                    required
                  />
                  <FormField
                    label="Unit"
                    type="text"
                    name={`lineItems[${index}].unit`}
                    placeholder="each, kg, hour"
                    value={item.unit}
                    onChange={(e) => handleLineItemChange(index, 'unit', e.target.value)}
                  />
                  <FormField
                    label="Unit Price"
                    type="number"
                    name={`lineItems[${index}].unitPrice`}
                    placeholder="0.00"
                    value={item.unitPrice}
                    onChange={(e) => handleLineItemChange(index, 'unitPrice', e.target.value)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="text-right">
                  <span className="text-sm text-base-content/60">Amount: </span>
                  <span className="font-bold">
                    ${((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addLineItem}
            className="btn btn-outline btn-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Line Item
          </button>

          <FormField
            label="Notes"
            type="textarea"
            name="notes"
            placeholder="Additional notes about this invoice..."
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* View Invoice Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Invoice Details"
        size="lg"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{selectedInvoice.number}</h3>
                <p className="text-base-content/60">{selectedInvoice.id}</p>
                <div className="flex items-center gap-2 mt-2">
                  {getStatusIcon(selectedInvoice.status)}
                  <Badge variant={selectedInvoice.status}>{selectedInvoice.status}</Badge>
                  {selectedInvoice.emailSent && (
                    <span className="badge badge-success badge-outline">Email Sent</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  ${selectedInvoice.total.toFixed(2)}
                </div>
                <div className="text-sm text-base-content/60">Total Amount</div>
                {selectedInvoice.balanceOwing > 0 && (
                  <div className="text-lg font-bold text-error mt-1">
                    ${selectedInvoice.balanceOwing.toFixed(2)} owing
                  </div>
                )}
              </div>
            </div>

            {/* Client & Job Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Client Information</h4>
                <div className="space-y-2 text-sm">
                  {(() => {
                    const client = clients.find(c => c.id === selectedInvoice.clientId);
                    return client ? (
                      <>
                        <div><strong>Name:</strong> {client.name}</div>
                        <div><strong>Code:</strong> {client.code}</div>
                        <div><strong>Contact:</strong> {client.contactPerson}</div>
                        <div><strong>Email:</strong> {client.email}</div>
                        <div><strong>Terms:</strong> {selectedInvoice.paymentTerms}</div>
                      </>
                    ) : (
                      <div>Client information not available</div>
                    );
                  })()}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Job Information</h4>
                <div className="space-y-2 text-sm">
                  {(() => {
                    const job = jobs.find(j => j.id === selectedInvoice.jobId);
                    return job ? (
                      <>
                        <div><strong>Job Ref:</strong> {job.refNo}</div>
                        <div><strong>Status:</strong> <Badge variant={job.status}>{job.status}</Badge></div>
                        <div><strong>Distance:</strong> {job.distanceKm} km</div>
                        <div><strong>Hours:</strong> {job.actualHours || job.estimatedHours}</div>
                      </>
                    ) : (
                      <div>Job information not available</div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Invoice Timeline */}
            <div>
              <h4 className="font-semibold mb-3">Timeline</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Issue Date:</strong> {format(new Date(selectedInvoice.issueDate), 'MMM dd, yyyy')}</div>
                <div><strong>Due Date:</strong> {format(new Date(selectedInvoice.dueDate), 'MMM dd, yyyy')}</div>
                {selectedInvoice.emailSent && selectedInvoice.emailSentDate && (
                  <div><strong>Email Sent:</strong> {format(new Date(selectedInvoice.emailSentDate), 'MMM dd, yyyy HH:mm')}</div>
                )}
                {selectedInvoice.paidDate && (
                  <div><strong>Paid Date:</strong> {format(new Date(selectedInvoice.paidDate), 'MMM dd, yyyy')}</div>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h4 className="font-semibold mb-3">Line Items</h4>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th className="text-right">Qty</th>
                      <th className="text-right">Unit Price</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.lineItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.description}</td>
                        <td className="text-right">{item.quantity} {item.unit}</td>
                        <td className="text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                        <td className="text-right font-mono font-bold">${item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Invoice Totals */}
              <div className="flex justify-end mt-4">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-t border-base-300">
                    <span>Subtotal:</span>
                    <span className="font-mono">${selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>GST:</span>
                    <span className="font-mono">${selectedInvoice.gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-base-300 font-bold text-lg">
                    <span>Total:</span>
                    <span className="font-mono">${selectedInvoice.total.toFixed(2)}</span>
                  </div>
                  {selectedInvoice.paidAmount > 0 && (
                    <>
                      <div className="flex justify-between py-2 text-success">
                        <span>Paid:</span>
                        <span className="font-mono">-${selectedInvoice.paidAmount.toFixed(2)}</span>
                      </div>
                      <div className={`flex justify-between py-2 border-t border-base-300 font-bold ${
                        selectedInvoice.balanceOwing > 0 ? 'text-error' : 'text-success'
                      }`}>
                        <span>Balance:</span>
                        <span className="font-mono">${selectedInvoice.balanceOwing.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {selectedInvoice.notes && (
              <div>
                <h4 className="font-semibold mb-2">Notes</h4>
                <div className="bg-base-200 p-3 rounded text-sm">
                  {selectedInvoice.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* PDF View Modal */}
      <Modal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        title="Invoice PDF Preview"
        size="xl"
      >
        {selectedInvoice && (
          <div className="text-center py-12">
            <FileText className="w-24 h-24 mx-auto text-base-content/40 mb-6" />
            <h3 className="text-xl font-bold mb-2">PDF Preview</h3>
            <p className="text-base-content/60 mb-6">
              Invoice {selectedInvoice.number} - ${selectedInvoice.total.toFixed(2)}
            </p>
            <div className="flex justify-center gap-4">
              <button className="btn btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
              <button className="btn btn-outline">
                <Mail className="w-4 h-4 mr-2" />
                Email to Client
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Issue Invoice Modal */}
      <Modal
        isOpen={showIssueModal}
        onClose={() => setShowIssueModal(false)}
        title="Issue Invoice"
        size="md"
      >
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="alert alert-info">
              <Send className="w-5 h-5" />
              <span>This will issue invoice {selectedInvoice.number} and send it to the client.</span>
            </div>

            <div className="bg-base-200 p-4 rounded">
              <h4 className="font-semibold mb-2">Invoice Summary</h4>
              <div className="space-y-1 text-sm">
                <div><strong>Number:</strong> {selectedInvoice.number}</div>
                <div><strong>Client:</strong> {clients.find(c => c.id === selectedInvoice.clientId)?.name}</div>
                <div><strong>Amount:</strong> ${selectedInvoice.total.toFixed(2)}</div>
                <div><strong>Due Date:</strong> {format(new Date(selectedInvoice.dueDate), 'MMM dd, yyyy')}</div>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Message</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                rows={4}
                placeholder="Optional message to include with the invoice..."
              />
            </div>

            <Modal.Footer>
              <button
                type="button"
                onClick={() => setShowIssueModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Issue invoice:', selectedInvoice.id);
                  setShowIssueModal(false);
                }}
                className="btn btn-primary"
              >
                <Send className="w-4 h-4 mr-2" />
                Issue & Send
              </button>
            </Modal.Footer>
          </div>
        )}
      </Modal>
    </div>
  );
}