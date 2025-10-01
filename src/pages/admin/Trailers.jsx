import { useState } from 'react';
import { format } from 'date-fns';
import { Truck, Plus, Edit, Wrench, Calendar } from 'lucide-react';
import { DataTable, Toolbar, Badge, Modal, FormField, EmptyState, KpiCard } from '../../components/common';
import { trailers } from '../../mocks';

export default function Trailers() {
  const [filteredTrailers, setFilteredTrailers] = useState(trailers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    registrationNumber: '',
    vin: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'flatbed',
    capacity: '',
    capacityUnit: 'tons',
    status: 'active'
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterTrailers(value, statusFilter, typeFilter);
  };

  const filterTrailers = (search, status, type) => {
    let filtered = trailers;

    if (search) {
      filtered = filtered.filter(trailer =>
        trailer.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
        trailer.make.toLowerCase().includes(search.toLowerCase()) ||
        trailer.model.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter(trailer => trailer.status === status);
    }

    if (type) {
      filtered = filtered.filter(trailer => trailer.type === type);
    }

    setFilteredTrailers(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTrailer = (e) => {
    e.preventDefault();

    const nextMaintenanceDate = new Date();
    nextMaintenanceDate.setMonth(nextMaintenanceDate.getMonth() + 6);

    const trailerToAdd = {
      id: `TRL-${String(trailers.length + 1).padStart(4, '0')}`,
      registrationNumber: formData.registrationNumber,
      vin: formData.vin,
      make: formData.make,
      model: formData.model,
      year: parseInt(formData.year),
      type: formData.type,
      capacity: parseFloat(formData.capacity),
      capacityUnit: formData.capacityUnit,
      status: formData.status,
      lastMaintenance: new Date().toISOString(),
      nextMaintenance: nextMaintenanceDate.toISOString()
    };

    trailers.push(trailerToAdd);
    setFilteredTrailers([...trailers]);

    // TODO: Call API
    // trailerService.createTrailer(formData)

    setShowAddModal(false);
    setFormData({
      registrationNumber: '',
      vin: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      type: 'flatbed',
      capacity: '',
      capacityUnit: 'tons',
      status: 'active'
    });

    alert('Trailer added successfully!');
  };

  const columns = [
    {
      key: 'registrationNumber',
      label: 'Registration',
      sortable: true,
      render: (value) => <span className="font-mono">{value}</span>
    },
    {
      key: 'make',
      label: 'Make & Model',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value} {row.model}</div>
          <div className="text-sm text-base-content/60">{row.year}</div>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <Badge color={
          value === 'flatbed' ? 'primary' :
          value === 'refrigerated' ? 'info' :
          value === 'tanker' ? 'warning' :
          'default'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: 'capacity',
      label: 'Capacity',
      render: (value, row) => (
        <span>{value} {row.capacityUnit}</span>
      )
    },
    {
      key: 'lastMaintenance',
      label: 'Last Service',
      render: (value) => value ? format(new Date(value), 'MMM dd, yyyy') : 'Never'
    },
    {
      key: 'nextMaintenance',
      label: 'Next Service',
      render: (value) => {
        if (!value) return 'Not scheduled';
        const date = new Date(value);
        const isOverdue = date < new Date();
        return (
          <span className={isOverdue ? 'text-error font-medium' : ''}>
            {format(date, 'MMM dd, yyyy')}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge color={
          value === 'active' ? 'success' :
          value === 'maintenance' ? 'warning' :
          value === 'retired' ? 'error' :
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
              setSelectedTrailer(row);
              setShowEditModal(true);
            }}
            className="btn btn-sm btn-ghost"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button className="btn btn-sm btn-ghost">
            <Wrench className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const totalTrailers = trailers.length;
  const activeTrailers = trailers.filter(t => t.status === 'active').length;
  const maintenanceTrailers = trailers.filter(t => t.status === 'maintenance').length;
  const avgAge = trailers.reduce((sum, t) => sum + (2024 - t.year), 0) / trailers.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Trailers</h1>
          <p className="text-base-content/60 mt-1">Manage trailer fleet and maintenance</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Trailer
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Trailers"
          value={totalTrailers}
          icon={Truck}
          color="primary"
        />
        <KpiCard
          title="Active"
          value={activeTrailers}
          icon={Truck}
          color="success"
        />
        <KpiCard
          title="In Maintenance"
          value={maintenanceTrailers}
          icon={Wrench}
          color="warning"
        />
        <KpiCard
          title="Average Age"
          value={avgAge.toFixed(1)}
          suffix=" years"
          icon={Calendar}
          color="info"
        />
      </div>

      <Toolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search trailers..."
        filters={[
          {
            label: 'Type',
            value: typeFilter,
            onChange: setTypeFilter,
            options: [
              { value: '', label: 'All Types' },
              { value: 'flatbed', label: 'Flatbed' },
              { value: 'refrigerated', label: 'Refrigerated' },
              { value: 'tanker', label: 'Tanker' },
              { value: 'container', label: 'Container' }
            ]
          },
          {
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'maintenance', label: 'Maintenance' },
              { value: 'retired', label: 'Retired' }
            ]
          }
        ]}
      />

      {filteredTrailers.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No trailers found"
          description="No trailers match your current filters"
        />
      ) : (
        <div className="card bg-base-100 shadow">
          <DataTable
            columns={columns}
            data={filteredTrailers}
            className="table-zebra"
          />
        </div>
      )}

      {(showAddModal || showEditModal) && (
        <Modal
          isOpen={showAddModal || showEditModal}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedTrailer(null);
          }}
          title={showEditModal ? 'Edit Trailer' : 'Add New Trailer'}
          size="lg"
        >
          <form onSubmit={handleAddTrailer}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Registration Number"
                  name="registrationNumber"
                  type="text"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="VIN"
                  name="vin"
                  type="text"
                  value={formData.vin}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Make"
                  name="make"
                  type="text"
                  value={formData.make}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="Model"
                  name="model"
                  type="text"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="Year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Type"
                  name="type"
                  type="select"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  options={[
                    { value: 'flatbed', label: 'Flatbed' },
                    { value: 'refrigerated', label: 'Refrigerated' },
                    { value: 'tanker', label: 'Tanker' },
                    { value: 'container', label: 'Container' }
                  ]}
                />
                <FormField
                  label="Capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="Capacity Unit"
                  name="capacityUnit"
                  type="select"
                  value={formData.capacityUnit}
                  onChange={handleInputChange}
                  options={[
                    { value: 'tons', label: 'Tons' },
                    { value: 'liters', label: 'Liters' },
                    { value: 'cubic_meters', label: 'Cubic Meters' }
                  ]}
                />
              </div>
              <FormField
                label="Status"
                name="status"
                type="select"
                value={formData.status}
                onChange={handleInputChange}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'maintenance', label: 'Maintenance' },
                  { value: 'retired', label: 'Retired' }
                ]}
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedTrailer(null);
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {showEditModal ? 'Update' : 'Add'} Trailer
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}