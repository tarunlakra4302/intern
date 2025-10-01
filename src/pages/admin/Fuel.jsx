import { useState } from 'react';
import { format } from 'date-fns';
import { Fuel as FuelIcon, Plus, TrendingUp, DollarSign, Gauge, MapPin, CreditCard, FileText } from 'lucide-react';
import { DataTable, Toolbar, Badge, Modal, FormField, EmptyState, KpiCard } from '../../components/common';
import { fuel, fuelEntries, vehicles, drivers } from '../../mocks';

export default function Fuel() {
  const [filteredFuelRecords, setFilteredFuelRecords] = useState(fuel);
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    date: '',
    location: '',
    address: '',
    litres: '',
    pricePerLitre: '',
    odometer: '',
    fuelType: 'diesel',
    cardNumber: '',
    receiptNumber: '',
    attendant: '',
    notes: ''
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterRecords(value, vehicleFilter, dateFilter);
  };

  const handleVehicleFilter = (value) => {
    setVehicleFilter(value);
    filterRecords(searchTerm, value, dateFilter);
  };

  const handleDateFilter = (value) => {
    setDateFilter(value);
    filterRecords(searchTerm, vehicleFilter, value);
  };

  const filterRecords = (search, vehicle, date) => {
    let filtered = fuel;

    if (search) {
      filtered = filtered.filter(record => {
        const vehicleData = vehicles.find(v => v.id === record.vehicleId);
        const driverData = drivers.find(d => d.id === record.driverId);
        return (
          record.station.toLowerCase().includes(search.toLowerCase()) ||
          vehicleData?.rego.toLowerCase().includes(search.toLowerCase()) ||
          driverData?.name.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    if (vehicle) {
      filtered = filtered.filter(record => record.vehicleId === vehicle);
    }

    if (date && date !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (date) {
        case '7days':
          filterDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          filterDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          filterDate.setDate(now.getDate() - 90);
          break;
      }

      filtered = filtered.filter(record => new Date(record.date) >= filterDate);
    }

    setFilteredFuelRecords(filtered);
  };

  const columns = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value) => (
        <div>
          <div className="font-medium">{format(new Date(value), 'MMM dd, yyyy')}</div>
          <div className="text-sm text-base-content/60">{format(new Date(value), 'h:mm a')}</div>
        </div>
      )
    },
    {
      key: 'vehicleId',
      label: 'Vehicle',
      render: (value) => {
        const vehicle = vehicles.find(v => v.id === value);
        return (
          <div className="flex items-center gap-2">
            <div className="avatar placeholder">
              <div className="bg-base-200 text-base-content rounded w-8 h-8">
                <span className="text-xs">🚛</span>
              </div>
            </div>
            <div>
              <div className="font-medium">{vehicle?.rego}</div>
              <div className="text-sm text-base-content/60">{vehicle?.make} {vehicle?.model}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'driverId',
      label: 'Driver',
      render: (value) => {
        const driver = drivers.find(d => d.id === value);
        return (
          <span className="font-medium">{driver?.name || 'Unknown'}</span>
        );
      }
    },
    {
      key: 'station',
      label: 'Station',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-base-content/60" />
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-base-content/60">{row.location}</div>
          </div>
        </div>
      )
    },
    {
      key: 'fuelType',
      label: 'Fuel Type',
      render: (value) => (
        <Badge color={
          value === 'diesel' ? 'info' :
          value === 'gasoline' ? 'warning' :
          'default'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: 'quantity',
      label: 'Quantity',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value} L</div>
          <div className="text-sm text-base-content/60">
            {row.mileage.toLocaleString()} km
          </div>
        </div>
      )
    },
    {
      key: 'pricePerLiter',
      label: 'Price/L',
      sortable: true,
      render: (value) => <span className="font-medium">${value.toFixed(2)}</span>
    },
    {
      key: 'totalCost',
      label: 'Total Cost',
      sortable: true,
      render: (value) => (
        <span className="font-semibold text-lg">${value.toFixed(2)}</span>
      )
    },
    {
      key: 'paymentMethod',
      label: 'Payment',
      render: (value) => (
        <Badge color={
          value === 'fuel_card' ? 'primary' :
          value === 'credit_card' ? 'info' :
          value === 'cash' ? 'success' :
          'default'
        }>
          {value.replace('_', ' ')}
        </Badge>
      )
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFuel = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.vehicleId || !formData.driverId || !formData.date ||
        !formData.litres || !formData.pricePerLitre || !formData.odometer) {
      alert('Please fill in all required fields');
      return;
    }

    // Calculate total amount
    const totalAmount = parseFloat(formData.litres) * parseFloat(formData.pricePerLitre);

    // Generate new ID
    const newId = `FUEL-${String(fuelEntries.length + 1).padStart(4, '0')}`;

    // Create new fuel entry matching mock structure
    const newFuelEntry = {
      id: newId,
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      date: formData.date,
      location: formData.location,
      address: formData.address,
      litres: parseFloat(formData.litres),
      pricePerLitre: parseFloat(formData.pricePerLitre),
      totalAmount: totalAmount,
      odometer: parseInt(formData.odometer),
      fuelType: formData.fuelType.charAt(0).toUpperCase() + formData.fuelType.slice(1),
      cardNumber: formData.cardNumber,
      receiptNumber: formData.receiptNumber,
      attendant: formData.attendant || 'Self Service',
      notes: formData.notes,
      attachments: []
    };

    // Create fuel record for display (matching fuel export structure)
    const newFuelRecord = {
      id: newId,
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      date: formData.date,
      station: formData.location.split(' - ')[0] || formData.location,
      location: formData.address || formData.location,
      quantity: parseFloat(formData.litres),
      pricePerLiter: parseFloat(formData.pricePerLitre),
      totalCost: totalAmount,
      mileage: parseInt(formData.odometer),
      fuelType: formData.fuelType.toLowerCase(),
      paymentMethod: formData.cardNumber ? 'fuel_card' : 'cash',
      receiptNumber: formData.receiptNumber,
      notes: formData.notes
    };

    // Add to arrays
    fuelEntries.push(newFuelEntry);
    fuel.push(newFuelRecord);

    // Update filtered records
    setFilteredFuelRecords([...filteredFuelRecords, newFuelRecord]);

    // Reset form
    setFormData({
      vehicleId: '',
      driverId: '',
      date: '',
      location: '',
      address: '',
      litres: '',
      pricePerLitre: '',
      odometer: '',
      fuelType: 'diesel',
      cardNumber: '',
      receiptNumber: '',
      attendant: '',
      notes: ''
    });

    // Close modal
    setShowAddModal(false);

    // Show success message
    alert('Fuel record added successfully!');
  };

  // Calculate KPIs
  const totalFuelCost = fuel.reduce((sum, r) => sum + r.totalCost, 0);
  const totalFuelVolume = fuel.reduce((sum, r) => sum + r.quantity, 0);
  const avgPricePerLiter = fuel.reduce((sum, r) => sum + r.pricePerLiter, 0) / fuel.length;
  const thisMonthCost = fuel
    .filter(r => {
      const recordDate = new Date(r.date);
      const now = new Date();
      return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, r) => sum + r.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Fuel Management</h1>
          <p className="text-base-content/60 mt-1">Track fuel consumption and expenses</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Fuel Record
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Fuel Cost"
          value={totalFuelCost}
          prefix="$"
          icon={DollarSign}
          color="primary"
        />
        <KpiCard
          title="This Month"
          value={thisMonthCost}
          prefix="$"
          icon={TrendingUp}
          color="success"
          previousValue={thisMonthCost * 0.9}
        />
        <KpiCard
          title="Total Volume"
          value={totalFuelVolume}
          suffix=" L"
          icon={FuelIcon}
          color="info"
        />
        <KpiCard
          title="Avg Price/L"
          value={avgPricePerLiter.toFixed(2)}
          prefix="$"
          icon={Gauge}
          color="warning"
        />
      </div>

      {/* Toolbar */}
      <Toolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search by vehicle, driver, or station..."
        filters={[
          {
            label: 'Vehicle',
            value: vehicleFilter,
            onChange: handleVehicleFilter,
            options: [
              { value: '', label: 'All Vehicles' },
              ...vehicles.map(v => ({ value: v.id, label: v.rego }))
            ]
          },
          {
            label: 'Period',
            value: dateFilter,
            onChange: handleDateFilter,
            options: [
              { value: 'all', label: 'All Time' },
              { value: '7days', label: 'Last 7 Days' },
              { value: '30days', label: 'Last 30 Days' },
              { value: '90days', label: 'Last 90 Days' }
            ]
          }
        ]}
      />

      {/* Data Table */}
      {filteredFuelRecords.length === 0 ? (
        <EmptyState
          icon={FuelIcon}
          title="No fuel records found"
          description={searchTerm || vehicleFilter || (dateFilter !== 'all') ?
            "Try adjusting your filters" :
            "Add your first fuel record to get started"
          }
          action={
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Fuel Record
            </button>
          }
        />
      ) : (
        <div className="card bg-base-100 shadow">
          <DataTable
            columns={columns}
            data={filteredFuelRecords}
            className="table-zebra"
          />
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Fuel Record"
          size="lg"
        >
          <form onSubmit={handleAddFuel} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Vehicle"
                type="select"
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleInputChange}
                required
                options={[
                  { value: '', label: 'Select Vehicle' },
                  ...vehicles.map(v => ({ value: v.id, label: `${v.rego} - ${v.make} ${v.model}` }))
                ]}
              />
              <FormField
                label="Driver"
                type="select"
                name="driverId"
                value={formData.driverId}
                onChange={handleInputChange}
                required
                options={[
                  { value: '', label: 'Select Driver' },
                  ...drivers.map(d => ({ value: d.id, label: d.name }))
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Date & Time"
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Current Odometer (km)"
                type="number"
                name="odometer"
                value={formData.odometer}
                onChange={handleInputChange}
                placeholder="Enter current odometer reading"
                min="0"
                required
              />
            </div>

            <div className="divider">Fuel Details</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Station Name"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Shell Truckstop - Goulburn"
                required
              />
              <FormField
                label="Address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Full address of station"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Fuel Type"
                type="select"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                required
                options={[
                  { value: 'diesel', label: 'Diesel' },
                  { value: 'gasoline', label: 'Gasoline' },
                  { value: 'premium', label: 'Premium' }
                ]}
              />
              <FormField
                label="Litres"
                type="number"
                name="litres"
                value={formData.litres}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
              <FormField
                label="Price per Litre ($)"
                type="number"
                name="pricePerLitre"
                value={formData.pricePerLitre}
                onChange={handleInputChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Card Number"
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="e.g. ****1234"
              />
              <FormField
                label="Receipt Number"
                type="text"
                name="receiptNumber"
                value={formData.receiptNumber}
                onChange={handleInputChange}
                placeholder="Enter receipt number"
              />
            </div>

            <FormField
              label="Attendant"
              type="text"
              name="attendant"
              value={formData.attendant}
              onChange={handleInputChange}
              placeholder="Self Service or attendant name"
            />

            <FormField
              label="Notes"
              type="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes..."
              rows={3}
            />

            <div className="alert alert-info">
              <FileText className="w-4 h-4" />
              <span>Remember to attach the receipt photo for expense tracking</span>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Record
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}