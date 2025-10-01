import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Plus, Edit, Clock, User, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { DataTable, Toolbar, Badge, Modal, FormField, EmptyState, KpiCard } from '../../components/common';
import { shifts, drivers, vehicles } from '../../mocks';

export default function Shifts() {
  const [filteredShifts, setFilteredShifts] = useState(shifts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedShift, setSelectedShift] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    driverId: '',
    vehicleId: '',
    startTime: '',
    endTime: '',
    breakDuration: '30',
    notes: ''
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterShifts(value, statusFilter, dateFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    filterShifts(searchTerm, value, dateFilter);
  };

  const handleDateFilter = (value) => {
    setDateFilter(value);
    filterShifts(searchTerm, statusFilter, value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddShift = (e) => {
    e.preventDefault();

    if (!formData.driverId) {
      alert('Please select a driver');
      return;
    }

    if (!formData.startTime) {
      alert('Please select a start date and time');
      return;
    }

    const driver = drivers.find(d => d.id === formData.driverId);
    const vehicle = vehicles.find(v => v.id === formData.vehicleId);

    // Convert datetime-local format to ISO string for storage
    const startDate = new Date(formData.startTime);
    const endDate = formData.endTime ? new Date(formData.endTime) : null;

    // Calculate duration and hours if end time is provided
    let totalHours = 0;
    let regularHours = 0;
    let overtimeHours = 0;
    const breakTime = parseFloat(formData.breakDuration) / 60 || 0; // Convert minutes to hours

    if (endDate) {
      const durationMs = endDate - startDate;
      const hoursWorked = durationMs / (1000 * 60 * 60) - breakTime; // Subtract break time
      totalHours = parseFloat(hoursWorked.toFixed(1));

      if (totalHours <= 8) {
        regularHours = totalHours;
        overtimeHours = 0;
      } else {
        regularHours = 8;
        overtimeHours = parseFloat((totalHours - 8).toFixed(1));
      }
    }

    const shiftToAdd = {
      id: `SHF-2025-${String(shifts.length + 1).padStart(4, '0')}`,
      driverId: formData.driverId,
      vehicleId: formData.vehicleId || null,
      date: startDate.toISOString().split('T')[0],
      startTime: startDate.toISOString(),
      endTime: endDate ? endDate.toISOString() : null,
      status: formData.endTime ? 'completed' : 'scheduled',
      totalHours: totalHours,
      regularHours: regularHours,
      overtimeHours: overtimeHours,
      breakTime: breakTime,
      startLocation: null,
      endLocation: null,
      startOdometer: null,
      endOdometer: null,
      totalKm: 0,
      fuelUsed: 0,
      attachments: [],
      notes: formData.notes || ''
    };

    shifts.push(shiftToAdd);
    setFilteredShifts([...shifts]);

    // TODO: Call API
    // shiftService.createShift(formData)

    setShowAddModal(false);
    setFormData({
      driverId: '',
      vehicleId: '',
      startTime: '',
      endTime: '',
      breakDuration: '30',
      notes: ''
    });

    alert('Shift created successfully!');
  };

  const filterShifts = (search, status, date) => {
    let filtered = shifts;

    if (search) {
      filtered = filtered.filter(shift => {
        const driver = drivers.find(d => d.id === shift.driverId);
        const vehicle = vehicles.find(v => v.id === shift.vehicleId);
        return (
          shift.id.toLowerCase().includes(search.toLowerCase()) ||
          driver?.name.toLowerCase().includes(search.toLowerCase()) ||
          vehicle?.registrationNumber.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    if (status) {
      filtered = filtered.filter(shift => shift.status === status);
    }

    if (date && date !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter(shift => {
        const shiftDate = new Date(shift.startTime);
        const shiftDateOnly = new Date(shiftDate.getFullYear(), shiftDate.getMonth(), shiftDate.getDate());

        switch (date) {
          case 'today':
            return shiftDateOnly.getTime() === today.getTime();
          case 'tomorrow':
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return shiftDateOnly.getTime() === tomorrow.getTime();
          case 'week':
            const weekFromNow = new Date(today);
            weekFromNow.setDate(weekFromNow.getDate() + 7);
            return shiftDateOnly >= today && shiftDateOnly <= weekFromNow;
          default:
            return true;
        }
      });
    }

    setFilteredShifts(filtered);
  };

  const columns = [
    {
      key: 'id',
      label: 'Shift ID',
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'driverId',
      label: 'Driver',
      render: (value) => {
        const driver = drivers.find(d => d.id === value);
        return (
          <div className="flex items-center gap-2">
            <div className="avatar placeholder">
              <div className="bg-base-200 text-base-content rounded-full w-8 h-8">
                <User className="w-4 h-4" />
              </div>
            </div>
            <span className="font-medium">{driver?.name || 'Unassigned'}</span>
          </div>
        );
      }
    },
    {
      key: 'vehicleId',
      label: 'Vehicle',
      render: (value) => {
        const vehicle = vehicles.find(v => v.id === value);
        return vehicle ? (
          <div>
            <div className="font-medium">{vehicle.rego}</div>
            <div className="text-sm text-base-content/60">{vehicle.make} {vehicle.model}</div>
          </div>
        ) : (
          <span className="text-base-content/60">No vehicle assigned</span>
        );
      }
    },
    {
      key: 'startTime',
      label: 'Start Time',
      sortable: true,
      render: (value) => (
        <div>
          <div className="font-medium">{format(new Date(value), 'MMM dd, yyyy')}</div>
          <div className="text-sm text-base-content/60">{format(new Date(value), 'h:mm a')}</div>
        </div>
      )
    },
    {
      key: 'endTime',
      label: 'End Time',
      render: (value) => value ? (
        <div>
          <div className="font-medium">{format(new Date(value), 'MMM dd, yyyy')}</div>
          <div className="text-sm text-base-content/60">{format(new Date(value), 'h:mm a')}</div>
        </div>
      ) : (
        <span className="text-base-content/60">-</span>
      )
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (_, row) => {
        if (row.startTime && row.endTime) {
          const duration = new Date(row.endTime) - new Date(row.startTime);
          const hours = Math.floor(duration / (1000 * 60 * 60));
          const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
          return <span>{hours}h {minutes}m</span>;
        }
        return <span className="text-base-content/60">-</span>;
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge color={
          value === 'active' ? 'success' :
          value === 'completed' ? 'info' :
          value === 'scheduled' ? 'warning' :
          value === 'cancelled' ? 'error' :
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
              setSelectedShift(row);
              setShowEditModal(true);
            }}
            className="btn btn-sm btn-ghost"
            aria-label="Edit shift"
          >
            <Edit className="w-4 h-4" />
          </button>
          {row.status === 'scheduled' && (
            <button
              className="btn btn-sm btn-ghost text-error"
              aria-label="Cancel shift"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ];

  // Calculate KPIs
  const activeShifts = shifts.filter(s => s.status === 'active').length;
  const scheduledShifts = shifts.filter(s => s.status === 'scheduled').length;
  const completedToday = shifts.filter(s => {
    if (s.status !== 'completed') return false;
    const today = new Date();
    const shiftDate = new Date(s.endTime);
    return shiftDate.toDateString() === today.toDateString();
  }).length;
  const avgDuration = shifts
    .filter(s => s.startTime && s.endTime)
    .reduce((acc, s) => {
      const duration = new Date(s.endTime) - new Date(s.startTime);
      return acc + duration / (1000 * 60 * 60);
    }, 0) / shifts.filter(s => s.endTime).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Shift Management</h1>
          <p className="text-base-content/60 mt-1">Schedule and track driver shifts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Shift
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Shifts"
          value={activeShifts}
          icon={CheckCircle}
          color="success"
          trendLabel="currently active"
        />
        <KpiCard
          title="Scheduled"
          value={scheduledShifts}
          icon={Calendar}
          color="warning"
          trendLabel="upcoming"
        />
        <KpiCard
          title="Completed Today"
          value={completedToday}
          icon={CheckCircle}
          color="info"
        />
        <KpiCard
          title="Avg Duration"
          value={avgDuration.toFixed(1)}
          suffix=" hrs"
          icon={Clock}
          color="primary"
        />
      </div>

      {/* Toolbar */}
      <Toolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search shifts..."
        filters={[
          {
            label: 'Date',
            value: dateFilter,
            onChange: handleDateFilter,
            options: [
              { value: 'all', label: 'All Dates' },
              { value: 'today', label: 'Today' },
              { value: 'tomorrow', label: 'Tomorrow' },
              { value: 'week', label: 'This Week' }
            ]
          },
          {
            label: 'Status',
            value: statusFilter,
            onChange: handleStatusFilter,
            options: [
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'scheduled', label: 'Scheduled' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' }
            ]
          }
        ]}
      />

      {/* Data Table */}
      {filteredShifts.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No shifts found"
          description={searchTerm || statusFilter || dateFilter !== 'all' ?
            "Try adjusting your filters" :
            "Create your first shift to get started"
          }
          action={
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Shift
            </button>
          }
        />
      ) : (
        <div className="card bg-base-100 shadow">
          <DataTable
            columns={columns}
            data={filteredShifts}
            className="table-zebra"
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <Modal
          isOpen={showAddModal || showEditModal}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedShift(null);
          }}
          title={showEditModal ? 'Edit Shift' : 'Create New Shift'}
          size="lg"
        >
          <form onSubmit={handleAddShift}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Driver"
                  name="driverId"
                  type="select"
                  value={formData.driverId}
                  onChange={handleInputChange}
                  required
                  options={[
                    { value: '', label: 'Select Driver' },
                    ...drivers.filter(d => d.status === 'active').map(d => ({ value: d.id, label: d.name }))
                  ]}
                />
                <FormField
                  label="Vehicle"
                  name="vehicleId"
                  type="select"
                  value={formData.vehicleId}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Select Vehicle (Optional)' },
                    ...vehicles.filter(v => v.status === 'active').map(v => ({
                      value: v.id,
                      label: `${v.rego} - ${v.make} ${v.model}`
                    }))
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Start Date & Time"
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="End Date & Time"
                  name="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={handleInputChange}
                />
              </div>

              <FormField
                label="Break Duration (minutes)"
                name="breakDuration"
                type="number"
                placeholder="30"
                min="0"
                value={formData.breakDuration}
                onChange={handleInputChange}
              />

              <FormField
                label="Notes"
                name="notes"
                type="textarea"
                placeholder="Add any notes or special instructions..."
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedShift(null);
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {showEditModal ? 'Update' : 'Create'} Shift
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}