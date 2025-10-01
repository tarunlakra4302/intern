import { useState } from 'react';
import { format } from 'date-fns';
import { Eye, Edit, Plus, FileText, Truck, User, Package, MapPin, Clock, AlertCircle, Paperclip, Trash2 } from 'lucide-react';
import { DataTable, Toolbar, Badge, Modal, FormField, EmptyState } from '../../components/common';
import { jobs, jobLines, clients, drivers, vehicles, trailers, products } from '../../mocks';

export default function Jobs() {
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [createJobData, setCreateJobData] = useState({
    client: '',
    priority: 'normal',
    scheduledDate: '',
    pickupAddress: '',
    pickupContact: '',
    pickupPhone: '',
    pickupInstructions: '',
    deliveryAddress: '',
    deliveryContact: '',
    deliveryPhone: '',
    deliveryInstructions: '',
    distance: '',
    estimatedHours: '',
    notes: '',
    jobLines: [{
      product: '',
      quantity: '',
      unit: 'tonne',
      driver: '',
      vehicle: '',
      trailer: '',
      pickupTime: '',
      deliveryTime: '',
      docket: '',
      notes: ''
    }]
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterJobs(value, statusFilter, priorityFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    filterJobs(searchTerm, value, priorityFilter);
  };

  const handlePriorityFilter = (value) => {
    setPriorityFilter(value);
    filterJobs(searchTerm, statusFilter, value);
  };

  const filterJobs = (search, status, priority) => {
    let filtered = jobs;

    if (search) {
      filtered = filtered.filter(job =>
        job.refNo.toLowerCase().includes(search.toLowerCase()) ||
        job.id.toLowerCase().includes(search.toLowerCase()) ||
        clients.find(c => c.id === job.clientId)?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status) {
      filtered = filtered.filter(job => job.status === status);
    }

    if (priority) {
      filtered = filtered.filter(job => job.priority === priority);
    }

    setFilteredJobs(filtered);
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowViewModal(true);
  };

  const getJobAggregates = (jobId) => {
    const lines = jobLines.filter(line => line.jobId === jobId);
    const uniqueDrivers = [...new Set(lines.map(line => line.driverId).filter(Boolean))];
    const uniqueVehicles = [...new Set(lines.map(line => line.vehicleId).filter(Boolean))];

    return {
      drivers: uniqueDrivers.map(id => drivers.find(d => d.id === id)).filter(Boolean),
      vehicles: uniqueVehicles.map(id => vehicles.find(v => v.id === id)).filter(Boolean)
    };
  };

  const addJobLine = () => {
    setCreateJobData(prev => ({
      ...prev,
      jobLines: [...prev.jobLines, {
        product: '',
        quantity: '',
        unit: 'tonne',
        driver: '',
        vehicle: '',
        trailer: '',
        pickupTime: '',
        deliveryTime: '',
        docket: '',
        notes: ''
      }]
    }));
  };

  const removeJobLine = (index) => {
    setCreateJobData(prev => ({
      ...prev,
      jobLines: prev.jobLines.filter((_, i) => i !== index)
    }));
  };

  const updateJobLine = (index, field, value) => {
    setCreateJobData(prev => ({
      ...prev,
      jobLines: prev.jobLines.map((line, i) =>
        i === index ? { ...line, [field]: value } : line
      )
    }));
  };

  const handleCreateJob = (e) => {
    e.preventDefault();

    if (!createJobData.client || !createJobData.scheduledDate) {
      alert('Please fill in required fields (Client and Scheduled Date)');
      return;
    }

    const jobToAdd = {
      id: `JOB-2025-${String(jobs.length + 1).padStart(4, '0')}`,
      refNo: `REF${String(100000 + jobs.length + 1)}`,
      clientId: createJobData.client,
      status: 'scheduled',
      priority: createJobData.priority,
      createdDate: new Date().toISOString().split('T')[0],
      scheduledDate: createJobData.scheduledDate,
      completedDate: null,
      pickupLocation: {
        address: createJobData.pickupAddress,
        contact: createJobData.pickupContact,
        phone: createJobData.pickupPhone,
        instructions: createJobData.pickupInstructions
      },
      deliveryLocation: {
        address: createJobData.deliveryAddress,
        contact: createJobData.deliveryContact,
        phone: createJobData.deliveryPhone,
        instructions: createJobData.deliveryInstructions
      },
      distanceKm: parseFloat(createJobData.distance) || 0,
      estimatedHours: parseFloat(createJobData.estimatedHours) || 0,
      actualHours: null,
      totalAmount: 0,
      notes: createJobData.notes,
      attachments: []
    };

    // Add job lines if any
    createJobData.jobLines.forEach((line, index) => {
      if (line.product && line.quantity) {
        const jobLineToAdd = {
          id: `JL-${jobToAdd.id}-${String(index + 1).padStart(3, '0')}`,
          jobId: jobToAdd.id,
          productId: line.product,
          quantity: parseFloat(line.quantity),
          unit: line.unit,
          driverId: line.driver || null,
          vehicleId: line.vehicle || null,
          trailerId: line.trailer || null,
          scheduledPickup: line.pickupTime || null,
          scheduledDelivery: line.deliveryTime || null,
          actualPickup: null,
          actualDelivery: null,
          docketNumber: line.docket || null,
          status: 'pending',
          notes: line.notes
        };
        jobLines.push(jobLineToAdd);
      }
    });

    jobs.push(jobToAdd);
    setFilteredJobs([...jobs]);

    // TODO: Call API
    // jobService.createJob(createJobData)

    setShowCreateModal(false);
    // Reset form
    setCreateJobData({
      client: '',
      priority: 'normal',
      scheduledDate: '',
      pickupAddress: '',
      pickupContact: '',
      pickupPhone: '',
      pickupInstructions: '',
      deliveryAddress: '',
      deliveryContact: '',
      deliveryPhone: '',
      deliveryInstructions: '',
      distance: '',
      estimatedHours: '',
      notes: '',
      jobLines: [{
        product: '',
        quantity: '',
        unit: 'tonne',
        driver: '',
        vehicle: '',
        trailer: '',
        pickupTime: '',
        deliveryTime: '',
        docket: '',
        notes: ''
      }]
    });

    alert('Job created successfully!');
  };

  const columns = [
    {
      key: 'status',
      header: 'Status',
      render: (value) => <Badge variant={value}>{value.replace('_', ' ')}</Badge>
    },
    {
      key: 'refNo',
      header: 'Ref No',
      render: (value, job) => (
        <div>
          <div className="font-mono text-sm font-medium">{value}</div>
          <div className="text-xs text-base-content/60">{job.id}</div>
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
      key: 'pickupLocation',
      header: 'Pickup',
      render: (value) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-success" />
            <span className="truncate max-w-32">{value.address.split(',')[0]}</span>
          </div>
          <div className="text-xs text-base-content/60">{value.contact}</div>
        </div>
      )
    },
    {
      key: 'deliveryLocation',
      header: 'Delivery',
      render: (value) => (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-error" />
            <span className="truncate max-w-32">{value.address.split(',')[0]}</span>
          </div>
          <div className="text-xs text-base-content/60">{value.contact}</div>
        </div>
      )
    },
    {
      key: 'scheduledDate',
      header: 'Scheduled',
      render: (value) => value ? format(new Date(value), 'MMM dd, yyyy') : '-'
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (value) => {
        const colors = {
          low: 'text-success',
          normal: 'text-info',
          high: 'text-warning',
          urgent: 'text-error'
        };
        return <span className={`badge badge-outline ${colors[value]}`}>{value}</span>;
      }
    },
    {
      key: 'id',
      header: 'Resources',
      render: (value) => {
        const { drivers: jobDrivers, vehicles: jobVehicles } = getJobAggregates(value);
        return (
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{jobDrivers.length} driver{jobDrivers.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>{jobVehicles.length} vehicle{jobVehicles.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        );
      }
    },
    {
      key: 'attachments',
      header: 'Files',
      render: (attachments) => (
        <div className="flex items-center gap-1">
          <Paperclip className="w-3 h-3" />
          <span className="text-xs">{attachments?.length || 0}</span>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (_, job) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewJob(job)}
            className="btn btn-ghost btn-sm"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => console.log('Edit job:', job.id)}
            className="btn btn-ghost btn-sm"
            title="Edit Job"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  return (
    <div className="space-y-6">
      {/* Header & Toolbar */}
      <Toolbar
        title="Job Management"
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search jobs, clients..."
        onAddClick={() => setShowCreateModal(true)}
        addButtonText="Create Job"
      >
        <Toolbar.Filter
          label="Status"
          value={statusFilter}
          options={statusOptions}
          onChange={handleStatusFilter}
          placeholder="All Status"
        />
        <Toolbar.Filter
          label="Priority"
          value={priorityFilter}
          options={priorityOptions}
          onChange={handlePriorityFilter}
          placeholder="All Priority"
        />
      </Toolbar>

      {/* Jobs Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          {filteredJobs.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredJobs}
              sortable={true}
            />
          ) : (
            <EmptyState
              title="No jobs found"
              description="No jobs match your current search criteria."
              actionLabel="Create Job"
              onAction={() => setShowCreateModal(true)}
            />
          )}
        </div>
      </div>

      {/* Create Job Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Job"
        size="xl"
      >
        <form onSubmit={handleCreateJob} className="space-y-6">
          {/* Job Details Section */}
          <div>
            <h4 className="font-semibold mb-4 text-base-content">Job Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                label="Client *"
                name="client"
                type="select"
                value={createJobData.client}
                onChange={(e) => setCreateJobData(prev => ({...prev, client: e.target.value}))}
                required
                options={[
                  { value: '', label: 'Select Client' },
                  ...clients.map(client => ({ value: client.id, label: client.name }))
                ]}
              />
              <FormField
                label="Priority"
                name="priority"
                type="select"
                value={createJobData.priority}
                onChange={(e) => setCreateJobData(prev => ({...prev, priority: e.target.value}))}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'high', label: 'High' },
                  { value: 'urgent', label: 'Urgent' }
                ]}
              />
              <FormField
                label="Scheduled Date *"
                name="scheduledDate"
                type="date"
                value={createJobData.scheduledDate}
                onChange={(e) => setCreateJobData(prev => ({...prev, scheduledDate: e.target.value}))}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                label="Distance (km)"
                name="distance"
                type="number"
                value={createJobData.distance}
                onChange={(e) => setCreateJobData(prev => ({...prev, distance: e.target.value}))}
                placeholder="0"
              />
              <FormField
                label="Estimated Hours"
                name="estimatedHours"
                type="number"
                step="0.5"
                value={createJobData.estimatedHours}
                onChange={(e) => setCreateJobData(prev => ({...prev, estimatedHours: e.target.value}))}
                placeholder="0.0"
              />
            </div>
          </div>

          {/* Pickup Location Section */}
          <div>
            <h4 className="font-semibold mb-4 text-base-content flex items-center gap-2">
              <MapPin className="w-4 h-4 text-success" />
              Pickup Location
            </h4>
            <div className="space-y-4">
              <FormField
                label="Address *"
                name="pickupAddress"
                value={createJobData.pickupAddress}
                onChange={(e) => setCreateJobData(prev => ({...prev, pickupAddress: e.target.value}))}
                placeholder="Enter pickup address"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Contact Person"
                  name="pickupContact"
                  value={createJobData.pickupContact}
                  onChange={(e) => setCreateJobData(prev => ({...prev, pickupContact: e.target.value}))}
                  placeholder="Contact name"
                />
                <FormField
                  label="Phone"
                  name="pickupPhone"
                  type="tel"
                  value={createJobData.pickupPhone}
                  onChange={(e) => setCreateJobData(prev => ({...prev, pickupPhone: e.target.value}))}
                  placeholder="Phone number"
                />
              </div>
              <FormField
                label="Special Instructions"
                name="pickupInstructions"
                type="textarea"
                rows={2}
                value={createJobData.pickupInstructions}
                onChange={(e) => setCreateJobData(prev => ({...prev, pickupInstructions: e.target.value}))}
                placeholder="Any special pickup instructions..."
              />
            </div>
          </div>

          {/* Delivery Location Section */}
          <div>
            <h4 className="font-semibold mb-4 text-base-content flex items-center gap-2">
              <MapPin className="w-4 h-4 text-error" />
              Delivery Location
            </h4>
            <div className="space-y-4">
              <FormField
                label="Address *"
                name="deliveryAddress"
                value={createJobData.deliveryAddress}
                onChange={(e) => setCreateJobData(prev => ({...prev, deliveryAddress: e.target.value}))}
                placeholder="Enter delivery address"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Contact Person"
                  name="deliveryContact"
                  value={createJobData.deliveryContact}
                  onChange={(e) => setCreateJobData(prev => ({...prev, deliveryContact: e.target.value}))}
                  placeholder="Contact name"
                />
                <FormField
                  label="Phone"
                  name="deliveryPhone"
                  type="tel"
                  value={createJobData.deliveryPhone}
                  onChange={(e) => setCreateJobData(prev => ({...prev, deliveryPhone: e.target.value}))}
                  placeholder="Phone number"
                />
              </div>
              <FormField
                label="Special Instructions"
                name="deliveryInstructions"
                type="textarea"
                rows={2}
                value={createJobData.deliveryInstructions}
                onChange={(e) => setCreateJobData(prev => ({...prev, deliveryInstructions: e.target.value}))}
                placeholder="Any special delivery instructions..."
              />
            </div>
          </div>

          {/* Job Lines Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-base-content flex items-center gap-2">
                <Package className="w-4 h-4" />
                Job Lines
              </h4>
              <button
                type="button"
                onClick={addJobLine}
                className="btn btn-sm btn-outline btn-primary"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Line
              </button>
            </div>

            <div className="space-y-4">
              {createJobData.jobLines.map((line, index) => (
                <div key={index} className="border border-base-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm">Line {index + 1}</span>
                    {createJobData.jobLines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeJobLine(index)}
                        className="btn btn-ghost btn-sm text-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <FormField
                      label="Product *"
                      type="select"
                      value={line.product}
                      onChange={(e) => updateJobLine(index, 'product', e.target.value)}
                      required
                      options={[
                        { value: '', label: 'Select Product' },
                        ...products.map(product => ({ value: product.id, label: product.name }))
                      ]}
                    />
                    <FormField
                      label="Quantity *"
                      type="number"
                      value={line.quantity}
                      onChange={(e) => updateJobLine(index, 'quantity', e.target.value)}
                      required
                      placeholder="0"
                    />
                    <FormField
                      label="Unit"
                      type="select"
                      value={line.unit}
                      onChange={(e) => updateJobLine(index, 'unit', e.target.value)}
                      options={[
                        { value: 'tonne', label: 'Tonne' },
                        { value: 'litre', label: 'Litre' },
                        { value: 'each', label: 'Each' },
                        { value: 'carton', label: 'Carton' },
                        { value: 'pallet', label: 'Pallet' }
                      ]}
                    />
                    <FormField
                      label="Docket Number"
                      value={line.docket}
                      onChange={(e) => updateJobLine(index, 'docket', e.target.value)}
                      placeholder="Optional"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                    <FormField
                      label="Driver"
                      type="select"
                      value={line.driver}
                      onChange={(e) => updateJobLine(index, 'driver', e.target.value)}
                      options={[
                        { value: '', label: 'Select Driver' },
                        ...drivers.filter(d => d.status === 'active').map(driver => ({ value: driver.id, label: driver.name }))
                      ]}
                    />
                    <FormField
                      label="Vehicle"
                      type="select"
                      value={line.vehicle}
                      onChange={(e) => updateJobLine(index, 'vehicle', e.target.value)}
                      options={[
                        { value: '', label: 'Select Vehicle' },
                        ...vehicles.filter(v => v.status === 'active').map(vehicle => ({ value: vehicle.id, label: `${vehicle.registration} - ${vehicle.make} ${vehicle.model}` }))
                      ]}
                    />
                    <FormField
                      label="Trailer"
                      type="select"
                      value={line.trailer}
                      onChange={(e) => updateJobLine(index, 'trailer', e.target.value)}
                      options={[
                        { value: '', label: 'Select Trailer' },
                        ...trailers.filter(t => t.status === 'active').map(trailer => ({ value: trailer.id, label: `${trailer.registration} - ${trailer.type}` }))
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <FormField
                      label="Pickup Time"
                      type="datetime-local"
                      value={line.pickupTime}
                      onChange={(e) => updateJobLine(index, 'pickupTime', e.target.value)}
                    />
                    <FormField
                      label="Delivery Time"
                      type="datetime-local"
                      value={line.deliveryTime}
                      onChange={(e) => updateJobLine(index, 'deliveryTime', e.target.value)}
                    />
                  </div>

                  <FormField
                    label="Line Notes"
                    type="textarea"
                    rows={2}
                    value={line.notes}
                    onChange={(e) => updateJobLine(index, 'notes', e.target.value)}
                    placeholder="Any specific notes for this line..."
                    className="mt-3"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Job Notes */}
          <div>
            <FormField
              label="Job Notes"
              name="notes"
              type="textarea"
              rows={3}
              value={createJobData.notes}
              onChange={(e) => setCreateJobData(prev => ({...prev, notes: e.target.value}))}
              placeholder="Any additional job notes or special requirements..."
            />
          </div>

          <Modal.Footer>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <FileText className="w-4 h-4 mr-2" />
              Create Job
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* View Job Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Job Details"
        size="xl"
      >
        {selectedJob && (
          <div className="space-y-6">
            {/* Job Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{selectedJob.refNo}</h3>
                <p className="text-base-content/60">{selectedJob.id}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={selectedJob.status}>{selectedJob.status.replace('_', ' ')}</Badge>
                  <span className={`badge badge-outline ${
                    selectedJob.priority === 'urgent' ? 'badge-error' :
                    selectedJob.priority === 'high' ? 'badge-warning' :
                    selectedJob.priority === 'normal' ? 'badge-info' : 'badge-success'
                  }`}>
                    {selectedJob.priority}
                  </span>
                </div>
              </div>
              <div className="text-right text-sm">
                <div><strong>Client:</strong> {clients.find(c => c.id === selectedJob.clientId)?.name}</div>
                <div><strong>Created:</strong> {format(new Date(selectedJob.createdDate), 'MMM dd, yyyy')}</div>
                {selectedJob.scheduledDate && (
                  <div><strong>Scheduled:</strong> {format(new Date(selectedJob.scheduledDate), 'MMM dd, yyyy')}</div>
                )}
              </div>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-success" />
                  Pickup Location
                </h4>
                <div className="space-y-2 text-sm bg-base-200 p-3 rounded">
                  <div><strong>Address:</strong> {selectedJob.pickupLocation.address}</div>
                  <div><strong>Contact:</strong> {selectedJob.pickupLocation.contact}</div>
                  <div><strong>Phone:</strong> {selectedJob.pickupLocation.phone}</div>
                  {selectedJob.pickupLocation.instructions && (
                    <div><strong>Instructions:</strong> {selectedJob.pickupLocation.instructions}</div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-error" />
                  Delivery Location
                </h4>
                <div className="space-y-2 text-sm bg-base-200 p-3 rounded">
                  <div><strong>Address:</strong> {selectedJob.deliveryLocation.address}</div>
                  <div><strong>Contact:</strong> {selectedJob.deliveryLocation.contact}</div>
                  <div><strong>Phone:</strong> {selectedJob.deliveryLocation.phone}</div>
                  {selectedJob.deliveryLocation.instructions && (
                    <div><strong>Instructions:</strong> {selectedJob.deliveryLocation.instructions}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Job Lines */}
            <div>
              <h4 className="font-semibold mb-3">Job Lines</h4>
              <div className="space-y-3">
                {jobLines.filter(line => line.jobId === selectedJob.id).map((line, index) => {
                  const lineDriver = drivers.find(d => d.id === line.driverId);
                  const lineVehicle = vehicles.find(v => v.id === line.vehicleId);
                  const lineTrailer = trailers.find(t => t.id === line.trailerId);
                  const lineProduct = products.find(p => p.id === line.productId);

                  return (
                    <div key={line.id} className="border border-base-300 rounded p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Line {line.lineNumber}</span>
                        <Badge variant={line.status}>{line.status.replace('_', ' ')}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <strong>Product:</strong><br />
                          {lineProduct?.name || 'Unknown'}
                        </div>
                        <div>
                          <strong>Quantity:</strong><br />
                          {line.quantity} {line.unit}
                        </div>
                        <div>
                          <strong>Driver:</strong><br />
                          {lineDriver?.name || 'Not assigned'}
                        </div>
                        <div>
                          <strong>Vehicle:</strong><br />
                          {lineVehicle ? `${lineVehicle.registration}` : 'Not assigned'}
                        </div>
                      </div>

                      {(line.pickupTime || line.deliveryTime) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                          {line.pickupTime && (
                            <div>
                              <strong>Pickup Time:</strong><br />
                              {format(new Date(line.pickupTime), 'MMM dd, yyyy HH:mm')}
                            </div>
                          )}
                          {line.deliveryTime && (
                            <div>
                              <strong>Delivery Time:</strong><br />
                              {format(new Date(line.deliveryTime), 'MMM dd, yyyy HH:mm')}
                            </div>
                          )}
                        </div>
                      )}

                      {line.docketNumber && (
                        <div className="mt-2 text-sm">
                          <strong>Docket:</strong> {line.docketNumber}
                        </div>
                      )}

                      {line.notes && (
                        <div className="mt-2 text-sm">
                          <strong>Notes:</strong> {line.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Job Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-base-200 p-3 rounded">
                <div><strong>Distance:</strong> {selectedJob.distanceKm} km</div>
                <div><strong>Est. Hours:</strong> {selectedJob.estimatedHours}</div>
                {selectedJob.actualHours && (
                  <div><strong>Actual Hours:</strong> {selectedJob.actualHours}</div>
                )}
              </div>
              <div className="bg-base-200 p-3 rounded">
                <div><strong>Total Amount:</strong> ${selectedJob.totalAmount.toLocaleString()}</div>
                {selectedJob.completedDate && (
                  <div><strong>Completed:</strong> {format(new Date(selectedJob.completedDate), 'MMM dd, yyyy')}</div>
                )}
              </div>
              <div className="bg-base-200 p-3 rounded">
                <div><strong>Attachments:</strong> {selectedJob.attachments?.length || 0} files</div>
                {selectedJob.attachments && selectedJob.attachments.length > 0 && (
                  <div className="mt-2">
                    {selectedJob.attachments.map((att, i) => (
                      <div key={i} className="text-xs text-base-content/60">
                        {att.name} ({att.type})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedJob.notes && (
              <div>
                <h4 className="font-semibold mb-2">Job Notes</h4>
                <div className="bg-base-200 p-3 rounded text-sm">
                  {selectedJob.notes}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}