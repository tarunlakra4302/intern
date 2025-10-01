import { useState } from 'react';
import { format } from 'date-fns';
import { Eye, Edit, UserPlus, Phone, Mail, AlertTriangle } from 'lucide-react';
import { DataTable, Toolbar, Badge, Modal, FormField, EmptyState } from '../../components/common';
import { drivers } from '../../mocks';

export default function Drivers() {
  const [filteredDrivers, setFilteredDrivers] = useState(drivers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: '',
    medicalExpiry: '',
    address: ''
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterDrivers(value, statusFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    filterDrivers(searchTerm, value);
  };

  const filterDrivers = (search, status) => {
    let filtered = drivers;

    if (search) {
      filtered = filtered.filter(driver =>
        driver.name.toLowerCase().includes(search.toLowerCase()) ||
        driver.email.toLowerCase().includes(search.toLowerCase()) ||
        driver.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter(driver => driver.status === status);
    }

    setFilteredDrivers(filtered);
  };

  const isExpiringWithin30Days = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const handleViewDriver = (driver) => {
    setSelectedDriver(driver);
    setShowViewModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDriver(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddDriver = (e) => {
    e.preventDefault();

    // Create new driver object
    const driverToAdd = {
      id: `DRV-${String(drivers.length + 1).padStart(4, '0')}`,
      name: `${newDriver.firstName} ${newDriver.lastName}`,
      email: newDriver.email,
      phone: newDriver.phone,
      licenseNumber: newDriver.licenseNumber,
      licenseExpiry: newDriver.licenseExpiry,
      medicalExpiry: newDriver.medicalExpiry,
      address: newDriver.address,
      status: 'active',
      rating: 0,
      totalJobs: 0
    };

    // Add to drivers array (in real app, this would be API call)
    drivers.push(driverToAdd);

    // Update filtered drivers to show the new driver
    setFilteredDrivers([...drivers]);

    // TODO: Call API to add driver
    // driverService.createDriver(newDriver)

    // Close modal and reset form
    setShowAddModal(false);
    setNewDriver({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      licenseNumber: '',
      licenseExpiry: '',
      medicalExpiry: '',
      address: ''
    });

    // Show success message (optional)
    alert('Driver added successfully!');
  };

  const columns = [
    {
      key: 'id',
      header: 'Driver ID',
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'name',
      header: 'Name',
      render: (value, driver) => (
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
              {value.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-base-content/60">{driver.id}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Contact',
      render: (value, driver) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-3 h-3" />
            {value}
          </div>
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <Phone className="w-3 h-3" />
            {driver.phone}
          </div>
        </div>
      )
    },
    {
      key: 'licenseExpiry',
      header: 'License Expiry',
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {format(new Date(value), 'MMM dd, yyyy')}
          </span>
          {isExpiringWithin30Days(value) && (
            <AlertTriangle className="w-4 h-4 text-warning" title="Expires within 30 days" />
          )}
        </div>
      )
    },
    {
      key: 'medicalExpiry',
      header: 'Medical Expiry',
      render: (value) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {format(new Date(value), 'MMM dd, yyyy')}
          </span>
          {isExpiringWithin30Days(value) && (
            <AlertTriangle className="w-4 h-4 text-warning" title="Expires within 30 days" />
          )}
        </div>
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
      render: (_, driver) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewDriver(driver)}
            className="btn btn-ghost btn-sm"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => console.log('Edit driver:', driver.id)}
            className="btn btn-ghost btn-sm"
            title="Edit Driver"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'on_leave', label: 'On Leave' }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Toolbar */}
      <Toolbar
        title="Driver Management"
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search drivers..."
        onAddClick={() => setShowAddModal(true)}
        addButtonText="Add Driver"
      >
        <Toolbar.Filter
          label="Status"
          value={statusFilter}
          options={statusOptions}
          onChange={handleStatusFilter}
          placeholder="All Status"
        />
      </Toolbar>

      {/* Drivers Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          {filteredDrivers.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredDrivers}
              sortable={true}
            />
          ) : (
            <EmptyState
              title="No drivers found"
              description="No drivers match your current search criteria."
              actionLabel="Add Driver"
              onAction={() => setShowAddModal(true)}
            />
          )}
        </div>
      </div>

      {/* Add Driver Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Driver"
        size="md"
      >
        <form onSubmit={handleAddDriver}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                name="firstName"
                value={newDriver.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                required
              />
              <FormField
                label="Last Name"
                name="lastName"
                value={newDriver.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                required
              />
            </div>

            <FormField
              label="Email"
              name="email"
              type="email"
              value={newDriver.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
            />

            <FormField
              label="Phone"
              name="phone"
              type="tel"
              value={newDriver.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              required
            />

            <FormField
              label="License Number"
              name="licenseNumber"
              value={newDriver.licenseNumber}
              onChange={handleInputChange}
              placeholder="Enter license number"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="License Expiry"
                name="licenseExpiry"
                type="date"
                value={newDriver.licenseExpiry}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Medical Expiry"
                name="medicalExpiry"
                type="date"
                value={newDriver.medicalExpiry}
                onChange={handleInputChange}
                required
              />
            </div>

            <FormField
              label="Address"
              name="address"
              type="textarea"
              value={newDriver.address}
              onChange={handleInputChange}
              placeholder="Enter full address"
              rows={3}
            />
          </div>

          <Modal.Footer>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Driver
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* View Driver Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Driver Details"
        size="lg"
      >
        {selectedDriver && (
          <div className="space-y-6">
            {/* Driver Header */}
            <div className="flex items-start gap-4">
              <div className="avatar">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-content flex items-center justify-center text-xl font-bold">
                  {selectedDriver.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{selectedDriver.name}</h3>
                <p className="text-base-content/60">{selectedDriver.id}</p>
                <div className="mt-2">
                  <Badge variant={selectedDriver.status}>
                    {selectedDriver.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Driver Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Email:</strong> {selectedDriver.email}</div>
                  <div><strong>Phone:</strong> {selectedDriver.phone}</div>
                  <div><strong>Address:</strong> {selectedDriver.address}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">License & Medical</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>License:</strong> {selectedDriver.licenseNumber}
                  </div>
                  <div className="flex items-center gap-2">
                    <strong>License Expiry:</strong>
                    {format(new Date(selectedDriver.licenseExpiry), 'MMM dd, yyyy')}
                    {isExpiringWithin30Days(selectedDriver.licenseExpiry) && (
                      <AlertTriangle className="w-4 h-4 text-warning" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <strong>Medical Expiry:</strong>
                    {format(new Date(selectedDriver.medicalExpiry), 'MMM dd, yyyy')}
                    {isExpiringWithin30Days(selectedDriver.medicalExpiry) && (
                      <AlertTriangle className="w-4 h-4 text-warning" />
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Employment</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Hire Date:</strong>
                    {format(new Date(selectedDriver.hireDate), 'MMM dd, yyyy')}
                  </div>
                  <div><strong>Total Hours:</strong> {selectedDriver.totalHours.toLocaleString()}</div>
                  <div><strong>Total KM:</strong> {selectedDriver.totalKm.toLocaleString()}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Emergency Contact</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Name:</strong> {selectedDriver.emergencyContact.name}</div>
                  <div><strong>Phone:</strong> {selectedDriver.emergencyContact.phone}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}