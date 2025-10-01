import { useState } from 'react';
import { format } from 'date-fns';
import { Eye, Edit, Plus, Truck, AlertTriangle, Calendar, Wrench, FileText, Fuel } from 'lucide-react';
import { DataTable, Toolbar, Badge, Modal, FormField, EmptyState } from '../../components/common';
import { vehicles } from '../../mocks';

export default function Vehicles() {
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [addVehicleData, setAddVehicleData] = useState({
    rego: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    type: 'Prime Mover',
    fuelType: 'Diesel',
    color: '',
    engineNumber: '',
    chassisNumber: '',
    regoExpiry: '',
    insuranceExpiry: '',
    currentKm: '',
    notes: ''
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterVehicles(value, statusFilter, serviceFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    filterVehicles(searchTerm, value, serviceFilter);
  };

  const handleServiceFilter = (value) => {
    setServiceFilter(value);
    filterVehicles(searchTerm, statusFilter, value);
  };

  const filterVehicles = (search, status, service) => {
    let filtered = vehicles;

    if (search) {
      filtered = filtered.filter(vehicle =>
        vehicle.rego.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.make.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.id.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter(vehicle => vehicle.status === status);
    }

    if (service) {
      if (service === 'overdue') {
        filtered = filtered.filter(vehicle => vehicle.kmToNextService <= 0);
      } else if (service === 'due_soon') {
        filtered = filtered.filter(vehicle => vehicle.kmToNextService > 0 && vehicle.kmToNextService <= 1000);
      }
    }

    setFilteredVehicles(filtered);
  };

  const isExpiringWithin30Days = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  const getServiceStatus = (kmToNext) => {
    if (kmToNext <= 0) return { status: 'overdue', color: 'text-error', label: 'Overdue' };
    if (kmToNext <= 1000) return { status: 'due_soon', color: 'text-warning', label: 'Due Soon' };
    return { status: 'ok', color: 'text-success', label: 'OK' };
  };

  const handleViewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowViewModal(true);
  };

  const handleAddVehicle = (e) => {
    e.preventDefault();

    // Create new vehicle object
    const serviceDueDate = new Date();
    serviceDueDate.setDate(serviceDueDate.getDate() + 90);

    const vehicleToAdd = {
      id: `VEH-${String(vehicles.length + 1).padStart(4, '0')}`,
      rego: addVehicleData.rego,
      make: addVehicleData.make,
      model: addVehicleData.model,
      year: parseInt(addVehicleData.year),
      type: addVehicleData.type,
      fuelType: addVehicleData.fuelType,
      color: addVehicleData.color,
      engineNumber: addVehicleData.engineNumber,
      chassisNumber: addVehicleData.chassisNumber,
      regoExpiry: addVehicleData.regoExpiry,
      insuranceExpiry: addVehicleData.insuranceExpiry || addVehicleData.regoExpiry,
      currentKm: parseInt(addVehicleData.currentKm) || 0,
      kmToNextService: 5000, // Default service interval
      serviceDue: serviceDueDate.toISOString(),
      status: 'active',
      notes: addVehicleData.notes || ''
    };

    // Add to vehicles array
    vehicles.push(vehicleToAdd);

    // Update filtered vehicles to show the new vehicle
    setFilteredVehicles([...vehicles]);

    // TODO: Call API to add vehicle
    // vehicleService.createVehicle(addVehicleData)

    // Close modal and reset form
    setShowAddModal(false);
    setAddVehicleData({
      rego: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      type: 'Prime Mover',
      fuelType: 'Diesel',
      color: '',
      engineNumber: '',
      chassisNumber: '',
      regoExpiry: '',
      insuranceExpiry: '',
      currentKm: '',
      notes: ''
    });

    // Show success message
    alert('Vehicle added successfully!');
  };

  const columns = [
    {
      key: 'rego',
      header: 'Registration',
      render: (value, vehicle) => (
        <div>
          <div className="font-mono font-bold text-primary">{value}</div>
          <div className="text-xs text-base-content/60">{vehicle.id}</div>
        </div>
      )
    },
    {
      key: 'make',
      header: 'Vehicle',
      render: (value, vehicle) => (
        <div>
          <div className="font-medium">{value} {vehicle.model}</div>
          <div className="text-xs text-base-content/60">{vehicle.year} • {vehicle.type}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => <Badge variant={value}>{value}</Badge>
    },
    {
      key: 'regoExpiry',
      header: 'Registration Expiry',
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
      key: 'nextServiceDue',
      header: 'Next Service',
      render: (value, vehicle) => {
        const serviceStatus = getServiceStatus(vehicle.kmToNextService);
        return (
          <div className="space-y-1">
            <div className="text-sm">
              {format(new Date(value), 'MMM dd, yyyy')}
            </div>
            <div className={`text-xs font-medium ${serviceStatus.color}`}>
              {Math.abs(vehicle.kmToNextService).toLocaleString()}km {serviceStatus.label.toLowerCase()}
            </div>
          </div>
        );
      }
    },
    {
      key: 'currentKm',
      header: 'Odometer',
      render: (value) => (
        <div className="text-sm font-mono">
          {value.toLocaleString()} km
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, vehicle) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewVehicle(vehicle)}
            className="btn btn-ghost btn-sm"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => console.log('Edit vehicle:', vehicle.id)}
            className="btn btn-ghost btn-sm"
            title="Edit Vehicle"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => console.log('Service history:', vehicle.id)}
            className="btn btn-ghost btn-sm"
            title="Service History"
          >
            <Wrench className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const serviceOptions = [
    { value: 'overdue', label: 'Service Overdue' },
    { value: 'due_soon', label: 'Due Soon (≤1000km)' }
  ];

  const vehicleTypes = [
    'Prime Mover',
    'Rigid Truck',
    'Light Truck',
    'Van',
    'Utility'
  ];

  const fuelTypes = [
    'Diesel',
    'Petrol',
    'Electric',
    'Hybrid'
  ];

  return (
    <div className="space-y-6">
      {/* Header & Toolbar */}
      <Toolbar
        title="Vehicle Management"
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search vehicles..."
        onAddClick={() => setShowAddModal(true)}
        addButtonText="Add Vehicle"
      >
        <Toolbar.Filter
          label="Status"
          value={statusFilter}
          options={statusOptions}
          onChange={handleStatusFilter}
          placeholder="All Status"
        />
        <Toolbar.Filter
          label="Service"
          value={serviceFilter}
          options={serviceOptions}
          onChange={handleServiceFilter}
          placeholder="All Vehicles"
        />
      </Toolbar>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-success">
              <Truck className="w-6 h-6" />
            </div>
            <div className="stat-title">Active</div>
            <div className="stat-value text-success">
              {vehicles.filter(v => v.status === 'active').length}
            </div>
          </div>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-warning">
              <Wrench className="w-6 h-6" />
            </div>
            <div className="stat-title">Maintenance</div>
            <div className="stat-value text-warning">
              {vehicles.filter(v => v.status === 'maintenance').length}
            </div>
          </div>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-error">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="stat-title">Service Overdue</div>
            <div className="stat-value text-error">
              {vehicles.filter(v => v.kmToNextService <= 0).length}
            </div>
          </div>
        </div>
        <div className="stats shadow bg-base-100">
          <div className="stat">
            <div className="stat-figure text-info">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="stat-title">Rego Expiring</div>
            <div className="stat-value text-info">
              {vehicles.filter(v => isExpiringWithin30Days(v.regoExpiry)).length}
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          {filteredVehicles.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredVehicles}
              sortable={true}
            />
          ) : (
            <EmptyState
              title="No vehicles found"
              description="No vehicles match your current search criteria."
              actionLabel="Add Vehicle"
              onAction={() => setShowAddModal(true)}
            />
          )}
        </div>
      </div>

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Vehicle"
        size="lg"
      >
        <form onSubmit={handleAddVehicle} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="font-semibold mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Registration *"
                name="rego"
                value={addVehicleData.rego}
                onChange={(e) => setAddVehicleData(prev => ({...prev, rego: e.target.value}))}
                placeholder="ABC123"
                required
              />
              <FormField
                label="Make *"
                name="make"
                value={addVehicleData.make}
                onChange={(e) => setAddVehicleData(prev => ({...prev, make: e.target.value}))}
                placeholder="Volvo"
                required
              />
              <FormField
                label="Model *"
                name="model"
                value={addVehicleData.model}
                onChange={(e) => setAddVehicleData(prev => ({...prev, model: e.target.value}))}
                placeholder="FH16"
                required
              />
              <FormField
                label="Year *"
                name="year"
                type="number"
                min="1990"
                max={new Date().getFullYear() + 1}
                value={addVehicleData.year}
                onChange={(e) => setAddVehicleData(prev => ({...prev, year: parseInt(e.target.value)}))}
                required
              />
              <FormField
                label="Vehicle Type *"
                name="type"
                type="select"
                value={addVehicleData.type}
                onChange={(e) => setAddVehicleData(prev => ({...prev, type: e.target.value}))}
                required
                options={[
                  ...vehicleTypes.map(type => ({ value: type, label: type }))
                ]}
              />
              <FormField
                label="Fuel Type *"
                name="fuelType"
                type="select"
                value={addVehicleData.fuelType}
                onChange={(e) => setAddVehicleData(prev => ({...prev, fuelType: e.target.value}))}
                required
                options={[
                  ...fuelTypes.map(fuel => ({ value: fuel, label: fuel }))
                ]}
              />
              <FormField
                label="Color"
                name="color"
                value={addVehicleData.color}
                onChange={(e) => setAddVehicleData(prev => ({...prev, color: e.target.value}))}
                placeholder="White"
              />
              <FormField
                label="Current Odometer (km)"
                name="currentKm"
                type="number"
                value={addVehicleData.currentKm}
                onChange={(e) => setAddVehicleData(prev => ({...prev, currentKm: e.target.value}))}
                placeholder="0"
              />
            </div>
          </div>

          {/* Technical Details */}
          <div>
            <h4 className="font-semibold mb-4">Technical Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Engine Number"
                name="engineNumber"
                value={addVehicleData.engineNumber}
                onChange={(e) => setAddVehicleData(prev => ({...prev, engineNumber: e.target.value}))}
                placeholder="ENG123456789"
              />
              <FormField
                label="Chassis Number"
                name="chassisNumber"
                value={addVehicleData.chassisNumber}
                onChange={(e) => setAddVehicleData(prev => ({...prev, chassisNumber: e.target.value}))}
                placeholder="CHS987654321"
              />
            </div>
          </div>

          {/* Registration & Insurance */}
          <div>
            <h4 className="font-semibold mb-4">Registration & Insurance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Registration Expiry *"
                name="regoExpiry"
                type="date"
                value={addVehicleData.regoExpiry}
                onChange={(e) => setAddVehicleData(prev => ({...prev, regoExpiry: e.target.value}))}
                required
              />
              <FormField
                label="Insurance Expiry"
                name="insuranceExpiry"
                type="date"
                value={addVehicleData.insuranceExpiry}
                onChange={(e) => setAddVehicleData(prev => ({...prev, insuranceExpiry: e.target.value}))}
              />
            </div>
          </div>

          {/* Notes */}
          <FormField
            label="Notes"
            name="notes"
            type="textarea"
            rows={3}
            value={addVehicleData.notes}
            onChange={(e) => setAddVehicleData(prev => ({...prev, notes: e.target.value}))}
            placeholder="Any additional notes about this vehicle..."
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
              Add Vehicle
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* View Vehicle Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Vehicle Details"
        size="lg"
      >
        {selectedVehicle && (
          <div className="space-y-6">
            {/* Vehicle Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{selectedVehicle.rego}</h3>
                <p className="text-base-content/60">{selectedVehicle.id}</p>
                <p className="text-lg font-medium mt-1">
                  {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={selectedVehicle.status}>{selectedVehicle.status}</Badge>
                  <span className="text-sm text-base-content/60">{selectedVehicle.type}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-primary">
                  {selectedVehicle.currentKm.toLocaleString()} km
                </div>
                <div className="text-sm text-base-content/60">Current Odometer</div>
              </div>
            </div>

            {/* Service Status Alert */}
            {selectedVehicle.kmToNextService <= 1000 && (
              <div className={`alert ${
                selectedVehicle.kmToNextService <= 0 ? 'alert-error' : 'alert-warning'
              }`}>
                <AlertTriangle className="w-5 h-5" />
                <span>
                  {selectedVehicle.kmToNextService <= 0 ?
                    `Service overdue by ${Math.abs(selectedVehicle.kmToNextService).toLocaleString()}km` :
                    `Service due in ${selectedVehicle.kmToNextService.toLocaleString()}km`
                  }
                </span>
              </div>
            )}

            {/* Vehicle Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Vehicle Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Fuel Type:</strong> {selectedVehicle.fuelType}</div>
                  <div><strong>Color:</strong> {selectedVehicle.color}</div>
                  <div><strong>Engine:</strong> {selectedVehicle.engineNumber}</div>
                  <div><strong>Chassis:</strong> {selectedVehicle.chassisNumber}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Registration & Insurance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <strong>Registration Expiry:</strong>
                    {format(new Date(selectedVehicle.regoExpiry), 'MMM dd, yyyy')}
                    {isExpiringWithin30Days(selectedVehicle.regoExpiry) && (
                      <AlertTriangle className="w-4 h-4 text-warning" />
                    )}
                  </div>
                  <div><strong>Insurance Expiry:</strong> {format(new Date(selectedVehicle.insuranceExpiry), 'MMM dd, yyyy')}</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Service Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Last Service:</strong> {format(new Date(selectedVehicle.lastServiceDate), 'MMM dd, yyyy')}</div>
                  <div><strong>Next Service Due:</strong> {format(new Date(selectedVehicle.nextServiceDue), 'MMM dd, yyyy')}</div>
                  <div><strong>Next Service KM:</strong> {selectedVehicle.nextServiceKm.toLocaleString()}</div>
                  <div className={`font-medium ${
                    selectedVehicle.kmToNextService <= 0 ? 'text-error' :
                    selectedVehicle.kmToNextService <= 1000 ? 'text-warning' : 'text-success'
                  }`}>
                    <strong>KM to Service:</strong> {selectedVehicle.kmToNextService.toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Quick Actions</h4>
                <div className="flex flex-col gap-2">
                  <button className="btn btn-outline btn-sm">
                    <Wrench className="w-4 h-4 mr-2" />
                    Service History
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Documents
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <Fuel className="w-4 h-4 mr-2" />
                    Fuel Records
                  </button>
                </div>
              </div>
            </div>

            {selectedVehicle.notes && (
              <div>
                <h4 className="font-semibold mb-2">Notes</h4>
                <div className="bg-base-200 p-3 rounded text-sm">
                  {selectedVehicle.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}