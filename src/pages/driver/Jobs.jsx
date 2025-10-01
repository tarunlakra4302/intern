import { useState } from 'react';
import { format } from 'date-fns';
import { Truck, MapPin, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';
import { Badge, KpiCard } from '../../components/common';
import { jobs, clients, vehicles } from '../../mocks';
import { useAuth } from '../../contexts/AuthContext';

export default function Jobs() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter jobs for current driver
  const driverJobs = jobs.filter(job => job.driverId === user?.driverId);

  const filteredJobs = statusFilter === 'all' ?
    driverJobs :
    driverJobs.filter(job => job.status === statusFilter);

  const todayJobs = driverJobs.filter(job => {
    const jobDate = new Date(job.scheduledDate);
    const today = new Date();
    return jobDate.toDateString() === today.toDateString();
  });

  const upcomingJobs = driverJobs.filter(job => {
    const jobDate = new Date(job.scheduledDate);
    return jobDate > new Date() && job.status === 'scheduled';
  });

  const getClient = (clientId) => clients.find(c => c.id === clientId);
  const getVehicle = (vehicleId) => vehicles.find(v => v.id === vehicleId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">My Jobs</h1>
          <p className="text-base-content/60 mt-1">View and manage your assigned jobs</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Today's Jobs"
          value={todayJobs.length}
          icon={Clock}
          color="primary"
        />
        <KpiCard
          title="Upcoming"
          value={upcomingJobs.length}
          icon={Truck}
          color="warning"
        />
        <KpiCard
          title="Completed"
          value={driverJobs.filter(j => j.status === 'completed').length}
          icon={CheckCircle}
          color="success"
        />
        <KpiCard
          title="In Progress"
          value={driverJobs.filter(j => j.status === 'in_progress').length}
          icon={AlertCircle}
          color="info"
        />
      </div>

      {/* Filter Tabs */}
      <div className="tabs tabs-boxed">
        {[
          { key: 'all', label: 'All Jobs' },
          { key: 'scheduled', label: 'Scheduled' },
          { key: 'in_progress', label: 'In Progress' },
          { key: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`tab ${statusFilter === tab.key ? 'tab-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
            <h3 className="text-lg font-semibold text-base-content/70">No jobs found</h3>
            <p className="text-base-content/50">No jobs match your current filter</p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const client = getClient(job.clientId);
            const vehicle = getVehicle(job.vehicleId);

            return (
              <div key={job.id} className="card bg-base-100 shadow hover:shadow-md transition-shadow">
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="card-title text-lg">{job.id}</h3>
                        <Badge color={
                          job.status === 'completed' ? 'success' :
                          job.status === 'in_progress' ? 'info' :
                          job.status === 'scheduled' ? 'warning' :
                          'error'
                        }>
                          {job.status.replace('_', ' ')}
                        </Badge>
                        <Badge color={
                          job.priority === 'high' ? 'error' :
                          job.priority === 'medium' ? 'warning' :
                          'success'
                        } variant="outline">
                          {job.priority} priority
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-base-content/60" />
                          <span>Client: {client?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-base-content/60" />
                          <span>Scheduled: {format(new Date(job.scheduledDate), 'MMM dd, yyyy h:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-base-content/60" />
                          <span>Pickup: {job.pickupLocation?.address || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-base-content/60" />
                          <span>Delivery: {job.deliveryLocation?.address || 'Not specified'}</span>
                        </div>
                        {vehicle && (
                          <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-base-content/60" />
                            <span>Vehicle: {vehicle.registrationNumber}</span>
                          </div>
                        )}
                      </div>

                      {job.notes && (
                        <div className="mt-3">
                          <p className="text-sm text-base-content/70">
                            <strong>Notes:</strong> {job.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {job.status === 'scheduled' && (
                        <button className="btn btn-primary btn-sm">
                          Start Job
                        </button>
                      )}
                      {job.status === 'in_progress' && (
                        <button className="btn btn-success btn-sm">
                          Complete Job
                        </button>
                      )}
                      <button className="btn btn-outline btn-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}