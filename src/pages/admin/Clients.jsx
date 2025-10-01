import { useState } from 'react';
import { Eye, Edit, Plus, Building2, Mail, Phone, AlertCircle, DollarSign } from 'lucide-react';
import { DataTable, Toolbar, Badge, Modal, FormField, EmptyState } from '../../components/common';
import { clients } from '../../mocks';

export default function Clients() {
  const [filteredClients, setFilteredClients] = useState(clients);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [addClientData, setAddClientData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    contactPerson: '',
    accountManager: '',
    creditLimit: '',
    paymentTerms: '30 days',
    street: '',
    suburb: '',
    state: 'NSW',
    postcode: '',
    country: 'Australia',
    notes: ''
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterClients(value, statusFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    filterClients(searchTerm, value);
  };

  const filterClients = (search, status) => {
    let filtered = clients;

    if (search) {
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.code.toLowerCase().includes(search.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter(client => client.status === status);
    }

    setFilteredClients(filtered);
  };

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setShowViewModal(true);
  };

  const handleAddClient = (e) => {
    e.preventDefault();

    if (!addClientData.name || !addClientData.code || !addClientData.email) {
      alert('Please fill in required fields');
      return;
    }

    const clientToAdd = {
      id: `CLI-${String(clients.length + 1).padStart(4, '0')}`,
      name: addClientData.name,
      code: addClientData.code,
      email: addClientData.email,
      phone: addClientData.phone,
      address: {
        street: addClientData.street,
        suburb: addClientData.suburb,
        state: addClientData.state,
        postcode: addClientData.postcode,
        country: addClientData.country
      },
      contactPerson: addClientData.contactPerson,
      accountManager: addClientData.accountManager,
      creditLimit: parseFloat(addClientData.creditLimit) || 0,
      paymentTerms: addClientData.paymentTerms,
      status: 'active',
      createdDate: new Date().toISOString().split('T')[0],
      notes: addClientData.notes
    };

    clients.push(clientToAdd);
    setFilteredClients([...clients]);

    // TODO: Call API
    // clientService.createClient(addClientData)

    setShowAddModal(false);
    // Reset form
    setAddClientData({
      name: '',
      code: '',
      email: '',
      phone: '',
      contactPerson: '',
      accountManager: '',
      creditLimit: '',
      paymentTerms: '30 days',
      street: '',
      suburb: '',
      state: 'NSW',
      postcode: '',
      country: 'Australia',
      notes: ''
    });

    alert('Client added successfully!');
  };

  const columns = [
    {
      key: 'name',
      header: 'Client',
      render: (value, client) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-base-content/60">{client.code}</div>
        </div>
      )
    },
    {
      key: 'contactPerson',
      header: 'Contact Person',
      render: (value, client) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-base-content/60">{client.accountManager}</div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Contact Info',
      render: (value, client) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-3 h-3" />
            {value}
          </div>
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <Phone className="w-3 h-3" />
            {client.phone}
          </div>
        </div>
      )
    },
    {
      key: 'address',
      header: 'Location',
      render: (value, client) => (
        <div className="text-sm">
          <div>{client.address.suburb}, {client.address.state}</div>
          <div className="text-base-content/60">{client.address.postcode}</div>
        </div>
      )
    },
    {
      key: 'creditLimit',
      header: 'Credit Limit',
      render: (value) => (
        <div className="text-right font-mono">
          ${value.toLocaleString()}
        </div>
      )
    },
    {
      key: 'paymentTerms',
      header: 'Payment Terms',
      render: (value) => (
        <span className="badge badge-outline">{value}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <Badge variant={value}>{value.replace('_', ' ')}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, client) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewClient(client)}
            className="btn btn-ghost btn-sm"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => console.log('Edit client:', client.id)}
            className="btn btn-ghost btn-sm"
            title="Edit Client"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const states = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'];
  const paymentTermsOptions = ['7 days', '14 days', '21 days', '30 days', '45 days', '60 days'];

  return (
    <div className="space-y-6">
      {/* Header & Toolbar */}
      <Toolbar
        title="Client Management"
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search clients..."
        onAddClick={() => setShowAddModal(true)}
        addButtonText="Add Client"
      >
        <Toolbar.Filter
          label="Status"
          value={statusFilter}
          options={statusOptions}
          onChange={handleStatusFilter}
          placeholder="All Status"
        />
      </Toolbar>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-success">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="stat-title">Active Clients</div>
            <div className="stat-value text-success">
              {clients.filter(c => c.status === 'active').length}
            </div>
          </div>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-warning">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="stat-title">On Hold</div>
            <div className="stat-value text-warning">
              {clients.filter(c => c.status === 'on_hold').length}
            </div>
          </div>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-info">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="stat-title">Avg Credit Limit</div>
            <div className="stat-value text-info text-lg">
              ${Math.round(clients.reduce((sum, c) => sum + c.creditLimit, 0) / clients.length).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="stat-title">Total Clients</div>
            <div className="stat-value text-primary">
              {clients.length}
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          {filteredClients.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredClients}
              sortable={true}
            />
          ) : (
            <EmptyState
              title="No clients found"
              description="No clients match your current search criteria."
              actionLabel="Add Client"
              onAction={() => setShowAddModal(true)}
            />
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Client"
        size="lg"
      >
        <form onSubmit={handleAddClient} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="font-semibold mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Company Name *"
                name="name"
                value={addClientData.name}
                onChange={(e) => setAddClientData(prev => ({...prev, name: e.target.value}))}
                required
              />
              <FormField
                label="Client Code *"
                name="code"
                value={addClientData.code}
                onChange={(e) => setAddClientData(prev => ({...prev, code: e.target.value.toUpperCase()}))}
                placeholder="e.g. METRO"
                required
              />
              <FormField
                label="Email *"
                name="email"
                type="email"
                value={addClientData.email}
                onChange={(e) => setAddClientData(prev => ({...prev, email: e.target.value}))}
                required
              />
              <FormField
                label="Phone *"
                name="phone"
                type="tel"
                value={addClientData.phone}
                onChange={(e) => setAddClientData(prev => ({...prev, phone: e.target.value}))}
                required
              />
              <FormField
                label="Contact Person *"
                name="contactPerson"
                value={addClientData.contactPerson}
                onChange={(e) => setAddClientData(prev => ({...prev, contactPerson: e.target.value}))}
                required
              />
              <FormField
                label="Account Manager"
                name="accountManager"
                value={addClientData.accountManager}
                onChange={(e) => setAddClientData(prev => ({...prev, accountManager: e.target.value}))}
              />
            </div>
          </div>

          {/* Business Terms */}
          <div>
            <h4 className="font-semibold mb-4">Business Terms</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Credit Limit ($)"
                name="creditLimit"
                type="number"
                value={addClientData.creditLimit}
                onChange={(e) => setAddClientData(prev => ({...prev, creditLimit: e.target.value}))}
                placeholder="50000"
              />
              <FormField
                label="Payment Terms"
                name="paymentTerms"
                type="select"
                value={addClientData.paymentTerms}
                onChange={(e) => setAddClientData(prev => ({...prev, paymentTerms: e.target.value}))}
                options={paymentTermsOptions.map(term => ({ value: term, label: term }))}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold mb-4">Address</h4>
            <div className="space-y-4">
              <FormField
                label="Street Address *"
                name="street"
                value={addClientData.street}
                onChange={(e) => setAddClientData(prev => ({...prev, street: e.target.value}))}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  label="Suburb *"
                  name="suburb"
                  value={addClientData.suburb}
                  onChange={(e) => setAddClientData(prev => ({...prev, suburb: e.target.value}))}
                  required
                />
                <FormField
                  label="State *"
                  name="state"
                  type="select"
                  value={addClientData.state}
                  onChange={(e) => setAddClientData(prev => ({...prev, state: e.target.value}))}
                  required
                  options={states.map(state => ({ value: state, label: state }))}
                />
                <FormField
                  label="Postcode *"
                  name="postcode"
                  value={addClientData.postcode}
                  onChange={(e) => setAddClientData(prev => ({...prev, postcode: e.target.value}))}
                  required
                />
                <FormField
                  label="Country"
                  name="country"
                  value={addClientData.country}
                  onChange={(e) => setAddClientData(prev => ({...prev, country: e.target.value}))}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <FormField
            label="Notes"
            name="notes"
            type="textarea"
            rows={3}
            value={addClientData.notes}
            onChange={(e) => setAddClientData(prev => ({...prev, notes: e.target.value}))}
            placeholder="Any additional notes about this client..."
          />

          <Modal.Footer>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* View Client Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Client Details"
        size="lg"
      >
        {selectedClient && (
          <div className="space-y-6">
            {/* Client Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{selectedClient.name}</h3>
                <p className="text-base-content/60">{selectedClient.code}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={selectedClient.status}>{selectedClient.status.replace('_', ' ')}</Badge>
                  <span className="badge badge-outline">{selectedClient.paymentTerms}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  ${selectedClient.creditLimit.toLocaleString()}
                </div>
                <div className="text-sm text-base-content/60">Credit Limit</div>
              </div>
            </div>

            {/* Client Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Contact Person:</strong> {selectedClient.contactPerson}</div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <strong>Email:</strong> {selectedClient.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <strong>Phone:</strong> {selectedClient.phone}
                  </div>
                  <div><strong>Account Manager:</strong> {selectedClient.accountManager}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Address</h4>
                <div className="space-y-1 text-sm">
                  <div>{selectedClient.address.street}</div>
                  <div>{selectedClient.address.suburb} {selectedClient.address.state} {selectedClient.address.postcode}</div>
                  <div>{selectedClient.address.country}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Account Details</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Credit Limit:</strong> ${selectedClient.creditLimit.toLocaleString()}</div>
                  <div><strong>Payment Terms:</strong> {selectedClient.paymentTerms}</div>
                  <div><strong>Status:</strong> <Badge variant={selectedClient.status}>{selectedClient.status.replace('_', ' ')}</Badge></div>
                  <div><strong>Client Since:</strong> {new Date(selectedClient.createdDate).toLocaleDateString()}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Quick Actions</h4>
                <div className="flex flex-col gap-2">
                  <button className="btn btn-outline btn-sm">
                    View Jobs
                  </button>
                  <button className="btn btn-outline btn-sm">
                    View Invoices
                  </button>
                  <button className="btn btn-outline btn-sm">
                    Send Email
                  </button>
                </div>
              </div>
            </div>

            {selectedClient.notes && (
              <div>
                <h4 className="font-semibold mb-2">Notes</h4>
                <div className="bg-base-200 p-3 rounded text-sm">
                  {selectedClient.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}