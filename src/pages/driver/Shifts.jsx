import { useState } from 'react';
import { format } from 'date-fns';
import { Clock, Calendar, CheckCircle, AlertCircle, PlayCircle, StopCircle, Pause } from 'lucide-react';
import { Badge, KpiCard } from '../../components/common';
import { shifts, vehicles } from '../../mocks';
import { useAuth } from '../../contexts/AuthContext';

export default function Shifts() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('upcoming');

  // Filter shifts for current driver
  const driverShifts = shifts.filter(shift => shift.driverId === user?.driverId);

  const upcomingShifts = driverShifts.filter(shift => {
    const shiftDate = new Date(shift.startTime);
    return shiftDate > new Date() && shift.status === 'scheduled';
  });

  const activeShifts = driverShifts.filter(shift => shift.status === 'active');
  const completedShifts = driverShifts.filter(shift => shift.status === 'completed');

  const getCurrentShift = () => {
    return driverShifts.find(shift => shift.status === 'active');
  };

  const getShiftDuration = (shift) => {
    if (shift.startTime && shift.endTime) {
      const duration = new Date(shift.endTime) - new Date(shift.startTime);
      const hours = Math.floor(duration / (1000 * 60 * 60));
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
    return 'In progress';
  };

  const getVehicle = (vehicleId) => vehicles.find(v => v.id === vehicleId);

  const currentShift = getCurrentShift();

  const displayShifts = viewMode === 'upcoming' ? upcomingShifts :
                      viewMode === 'active' ? activeShifts :
                      completedShifts;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">My Shifts</h1>
          <p className="text-base-content/60 mt-1">Manage your work schedule and time tracking</p>
        </div>
      </div>

      {/* Current Shift Status */}
      {currentShift && (
        <div className="card bg-gradient-to-r from-primary to-primary-focus text-primary-content shadow-lg">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Current Shift</h3>
                <p className="opacity-90">Started: {format(new Date(currentShift.startTime), 'h:mm a')}</p>
                <p className="opacity-90">Vehicle: {getVehicle(currentShift.vehicleId)?.registrationNumber || 'Not assigned'}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button className="btn btn-warning">
                  <Pause className="w-4 h-4 mr-2" />
                  Take Break
                </button>
                <button className="btn btn-success">
                  <StopCircle className="w-4 h-4 mr-2" />
                  End Shift
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="This Week"
          value={driverShifts.filter(s => {
            const shiftDate = new Date(s.startTime);
            const now = new Date();
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
            return shiftDate >= weekStart;
          }).length}
          icon={Calendar}
          color="primary"
        />
        <KpiCard
          title="Hours This Week"
          value={Math.floor(Math.random() * 40) + 30}
          suffix="h"
          icon={Clock}
          color="info"
        />
        <KpiCard
          title="Completed"
          value={completedShifts.length}
          icon={CheckCircle}
          color="success"
        />
        <KpiCard
          title="Upcoming"
          value={upcomingShifts.length}
          icon={AlertCircle}
          color="warning"
        />
      </div>

      {/* View Mode Tabs */}
      <div className="tabs tabs-boxed">
        {[
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'active', label: 'Active' },
          { key: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setViewMode(tab.key)}
            className={`tab ${viewMode === tab.key ? 'tab-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Shifts List */}
      <div className="space-y-4">
        {displayShifts.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
            <h3 className="text-lg font-semibold text-base-content/70">No {viewMode} shifts</h3>
            <p className="text-base-content/50">You don't have any {viewMode} shifts at the moment</p>
          </div>
        ) : (
          displayShifts.map((shift) => {
            const vehicle = getVehicle(shift.vehicleId);

            return (
              <div key={shift.id} className="card bg-base-100 shadow hover:shadow-md transition-shadow">
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{shift.id}</h3>
                        <Badge color={
                          shift.status === 'completed' ? 'success' :
                          shift.status === 'active' ? 'info' :
                          shift.status === 'scheduled' ? 'warning' :
                          'error'
                        }>
                          {shift.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-base-content/60" />
                          <span>Start: {format(new Date(shift.startTime), 'MMM dd, h:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-base-content/60" />
                          <span>End: {shift.endTime ? format(new Date(shift.endTime), 'MMM dd, h:mm a') : 'Not ended'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-base-content/60" />
                          <span>Duration: {getShiftDuration(shift)}</span>
                        </div>
                        {vehicle && (
                          <div className="flex items-center gap-2">
                            <span>Vehicle: {vehicle.registrationNumber}</span>
                          </div>
                        )}
                      </div>

                      {shift.notes && (
                        <div className="mt-3">
                          <p className="text-sm text-base-content/70">
                            <strong>Notes:</strong> {shift.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      {shift.status === 'scheduled' && (
                        <button className="btn btn-primary btn-sm">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Shift
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