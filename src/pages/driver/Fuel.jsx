import { useState } from 'react';
import { format } from 'date-fns';
import { Fuel as FuelIcon, Plus, Upload, MapPin, Receipt, DollarSign, Gauge } from 'lucide-react';
import { FormField, Badge, KpiCard } from '../../components/common';
import { fuel, vehicles } from '../../mocks';
import { useAuth } from '../../contexts/AuthContext';

export default function Fuel() {
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [fuelEntry, setFuelEntry] = useState({
    datetime: new Date().toISOString().slice(0, 16),
    vehicle: '',
    location: '',
    litres: '',
    amount: '',
    odometer: '',
    fuelType: 'Diesel',
    pumpNumber: '',
    receipt: null,
    notes: ''
  });

  // Get current driver's fuel entries (mock - would filter by driver ID)
  const driverFuelEntries = fuel.slice(0, 10); // Show recent entries

  // Calculate stats
  const thisMonthEntries = driverFuelEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const now = new Date();
    return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
  });

  const thisMonthLitres = thisMonthEntries.reduce((sum, entry) => sum + (entry.quantity || 0), 0);
  const thisMonthAmount = thisMonthEntries.reduce((sum, entry) => sum + (entry.totalCost || 0), 0);
  const averagePrice = thisMonthLitres > 0 ? thisMonthAmount / thisMonthLitres : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Adding fuel entry:', fuelEntry);
    // Reset form and close
    setFuelEntry({
      datetime: new Date().toISOString().slice(0, 16),
      vehicle: '',
      location: '',
      litres: '',
      amount: '',
      odometer: '',
      fuelType: 'Diesel',
      pumpNumber: '',
      receipt: null,
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFuelEntry(prev => ({ ...prev, receipt: file.name }));
    }
  };

  const calculateTotal = () => {
    if (fuelEntry.litres && averagePrice) {
      return (parseFloat(fuelEntry.litres) * averagePrice).toFixed(2);
    }
    return '0.00';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Fuel Management</h1>
          <p className="text-base-content/60 mt-1">
            Record fuel purchases and track consumption
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Fuel Entry
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="This Month"
          value={thisMonthEntries.length}
          icon={FuelIcon}
          color="info"
          trendLabel="fuel stops"
        />
        <KpiCard
          title="Litres"
          value={Math.round(thisMonthLitres)}
          icon={Gauge}
          color="primary"
          trendLabel="this month"
        />
        <KpiCard
          title="Amount"
          value={Math.round(thisMonthAmount)}
          prefix="$"
          icon={DollarSign}
          color="success"
          trendLabel="this month"
        />
        <KpiCard
          title="Avg Price"
          value={averagePrice.toFixed(2)}
          prefix="$"
          suffix="/L"
          icon={Receipt}
          color="warning"
          trendLabel="per litre"
        />
      </div>

      {/* Add Fuel Form */}
      {showAddForm && (
        <div className="card bg-base-100 shadow-lg border-l-4 border-l-primary">
          <div className="card-body">
            <h3 className="card-title flex items-center gap-2">
              <FuelIcon className="w-5 h-5 text-primary" />
              Add Fuel Entry
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* DateTime and Vehicle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Date & Time *"
                  name="datetime"
                  type="datetime-local"
                  value={fuelEntry.datetime}
                  onChange={(e) => setFuelEntry(prev => ({...prev, datetime: e.target.value}))}
                  required
                />
                <FormField
                  label="Vehicle *"
                  name="vehicle"
                  type="select"
                  value={fuelEntry.vehicle}
                  onChange={(e) => setFuelEntry(prev => ({...prev, vehicle: e.target.value}))}
                  required
                  options={[
                    { value: '', label: 'Select Vehicle' },
                    ...vehicles.filter(v => v.status === 'active').map(vehicle => ({
                      value: vehicle.id,
                      label: `${vehicle.rego} - ${vehicle.make} ${vehicle.model}`
                    }))
                  ]}
                />
              </div>

              {/* Location and Fuel Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Location *"
                  name="location"
                  value={fuelEntry.location}
                  onChange={(e) => setFuelEntry(prev => ({...prev, location: e.target.value}))}
                  placeholder="e.g. Shell Mascot, 123 Main St"
                  required
                />
                <FormField
                  label="Fuel Type"
                  name="fuelType"
                  type="select"
                  value={fuelEntry.fuelType}
                  onChange={(e) => setFuelEntry(prev => ({...prev, fuelType: e.target.value}))}
                  options={[
                    { value: 'Diesel', label: 'Diesel' },
                    { value: 'Petrol', label: 'Petrol' },
                    { value: 'AdBlue', label: 'AdBlue' }
                  ]}
                />
              </div>

              {/* Quantities */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Litres *"
                  name="litres"
                  type="number"
                  step="0.01"
                  value={fuelEntry.litres}
                  onChange={(e) => setFuelEntry(prev => ({...prev, litres: e.target.value}))}
                  placeholder="0.00"
                  required
                />
                <FormField
                  label="Amount ($) *"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={fuelEntry.amount}
                  onChange={(e) => setFuelEntry(prev => ({...prev, amount: e.target.value}))}
                  placeholder="0.00"
                  required
                />
                <FormField
                  label="Odometer (km) *"
                  name="odometer"
                  type="number"
                  value={fuelEntry.odometer}
                  onChange={(e) => setFuelEntry(prev => ({...prev, odometer: e.target.value}))}
                  placeholder="Current km reading"
                  required
                />
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Pump Number"
                  name="pumpNumber"
                  value={fuelEntry.pumpNumber}
                  onChange={(e) => setFuelEntry(prev => ({...prev, pumpNumber: e.target.value}))}
                  placeholder="e.g. Pump 3"
                />
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Receipt</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleReceiptUpload}
                      className="file-input file-input-bordered flex-1"
                    />
                    <button type="button" className="btn btn-outline btn-square">
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  {fuelEntry.receipt && (
                    <div className="label">
                      <span className="label-text-alt text-success">✓ {fuelEntry.receipt}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <FormField
                label="Notes"
                name="notes"
                type="textarea"
                rows={3}
                value={fuelEntry.notes}
                onChange={(e) => setFuelEntry(prev => ({...prev, notes: e.target.value}))}
                placeholder="Any additional notes about this fuel purchase..."
              />

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-base-300">
                <div className="text-sm text-base-content/60">
                  {fuelEntry.litres && averagePrice > 0 && (
                    <span>Estimated cost: ${calculateTotal()}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FuelIcon className="w-4 h-4 mr-2" />
                    Add Entry
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recent Fuel Entries */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            Recent Fuel Entries
          </h3>

          <div className="space-y-4 mt-4">
            {driverFuelEntries.map((entry) => {
              const vehicle = vehicles.find(v => v.id === entry.vehicleId);
              const pricePerLitre = entry.quantity > 0 ? entry.totalCost / entry.quantity : 0;

              return (
                <div key={entry.id} className="border border-base-300 rounded-lg p-4 hover:bg-base-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <FuelIcon className="w-4 h-4 text-primary" />
                          <span className="font-medium">
                            {vehicle ? `${vehicle.rego} - ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle'}
                          </span>
                        </div>
                        <Badge variant="info">{entry.fuelType}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-base-content/70">
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <MapPin className="w-3 h-3" />
                            <strong>Location:</strong>
                          </div>
                          <div>{entry.location}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <Gauge className="w-3 h-3" />
                            <strong>Fuel:</strong>
                          </div>
                          <div>{entry.quantity}L @ ${pricePerLitre.toFixed(2)}/L</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <DollarSign className="w-3 h-3" />
                            <strong>Cost:</strong>
                          </div>
                          <div className="font-bold">${entry.totalCost.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-base-content/60">
                        {format(new Date(entry.date), 'MMM dd, yyyy HH:mm')} • {entry.mileage.toLocaleString()} km
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="text-lg font-bold">${entry.totalCost.toFixed(2)}</div>
                      {entry.receiptNumber && (
                        <div className="badge badge-success badge-sm">
                          <Receipt className="w-3 h-3 mr-1" />
                          Receipt
                        </div>
                      )}
                      <button className="btn btn-ghost btn-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {driverFuelEntries.length === 0 && (
            <div className="text-center py-8 text-base-content/60">
              <FuelIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No fuel entries recorded yet</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn btn-primary btn-sm mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Entry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}