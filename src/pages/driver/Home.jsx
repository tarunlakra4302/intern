import { useState } from 'react';
import { format, isToday } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, Briefcase, MapPin, Fuel, AlertCircle, CheckCircle, Play, Pause, Square, Plus, DollarSign, User, TrendingUp } from 'lucide-react';
import { Badge, KpiCard } from '../../components/common';
import { shifts, jobs, jobLines, drivers, vehicles } from '../../mocks';
import { useAuth } from '../../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentShiftStatus, setCurrentShiftStatus] = useState('not_started'); // not_started, active, break, ended
  const [shiftStartTime, setShiftStartTime] = useState(null);
  const [breakStartTime, setBreakStartTime] = useState(null);
  const [totalBreakTime, setTotalBreakTime] = useState(0);

  // Mock current driver - in real app this would come from auth context
  const currentDriver = drivers[0]; // John Smith

  // Get current driver's data
  const driverShifts = shifts.filter(shift => shift.driverId === currentDriver.id);
  const todaysShift = driverShifts.find(shift => isToday(new Date(shift.date)));

  // Get today's jobs for this driver
  const todaysJobs = jobs.filter(job => {
    if (!isToday(new Date(job.scheduledDate))) return false;
    const jobLinesForJob = jobLines.filter(line => line.jobId === job.id);
    return jobLinesForJob.some(line => line.driverId === currentDriver.id);
  });

  // Get active job lines for this driver
  const activeJobLines = jobLines.filter(line =>
    line.driverId === currentDriver.id &&
    (line.status === 'in_transit' || line.status === 'scheduled')
  );

  // Calculate shift duration
  const getShiftDuration = () => {
    if (!shiftStartTime) return '00:00';
    const now = new Date();
    const duration = now - shiftStartTime - totalBreakTime;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleShiftAction = (action) => {
    const now = new Date();

    switch (action) {
      case 'start':
        setShiftStartTime(now);
        setCurrentShiftStatus('active');
        break;
      case 'break':
        setBreakStartTime(now);
        setCurrentShiftStatus('break');
        break;
      case 'resume':
        if (breakStartTime) {
          setTotalBreakTime(prev => prev + (now - breakStartTime));
        }
        setBreakStartTime(null);
        setCurrentShiftStatus('active');
        break;
      case 'end':
        setCurrentShiftStatus('ended');
        break;
      default:
        break;
    }
  };

  const getJobStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'in_progress': return 'text-info';
      case 'cancelled': return 'text-error';
      default: return 'text-base-content';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-base-content">
          {getGreeting()}, {currentDriver.name.split(' ')[0]}!
        </h1>
        <p className="text-base-content/60 mt-1">
          {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </p>
      </div>

      {/* Current Shift Card */}
      <div className="card bg-gradient-to-br from-primary via-primary to-secondary text-primary-content shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="card-body relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <h2 className="card-title flex items-center gap-3 text-xl mb-2">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Clock className="w-6 h-6" />
                  </div>
                  Current Shift
                </h2>
                <p className="opacity-90 text-lg">
                  {currentShiftStatus === 'not_started' && 'Ready to start your shift'}
                  {currentShiftStatus === 'active' && `Active - Working for ${getShiftDuration()}`}
                  {currentShiftStatus === 'break' && `On Break - Total time: ${getShiftDuration()}`}
                  {currentShiftStatus === 'ended' && 'Shift Completed - Great work today!'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold mb-1 font-mono tracking-wider">
                  {currentShiftStatus === 'not_started' ? '--:--' : getShiftDuration()}
                </div>
                <div className="text-sm opacity-90 font-medium">Hours Today</div>
                <div className={`text-xs mt-1 px-2 py-1 rounded-full font-semibold ${
                  currentShiftStatus === 'active' ? 'bg-green-400/20 text-green-100' :
                  currentShiftStatus === 'break' ? 'bg-yellow-400/20 text-yellow-100' :
                  currentShiftStatus === 'ended' ? 'bg-blue-400/20 text-blue-100' :
                  'bg-white/20 text-white'
                }`}>
                  {currentShiftStatus === 'active' ? '🟢 Active' :
                   currentShiftStatus === 'break' ? '🟡 On Break' :
                   currentShiftStatus === 'ended' ? '🔵 Completed' :
                   '⭕ Not Started'}
                </div>
              </div>
            </div>
          </div>

          {/* Shift Controls */}
          <div className="relative z-10">
            <div className="flex justify-center gap-3 mt-4">
              {currentShiftStatus === 'not_started' && (
                <button
                  onClick={() => handleShiftAction('start')}
                  className="btn btn-accent btn-lg px-8 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Shift
                </button>
              )}
              {currentShiftStatus === 'active' && (
                <>
                  <button
                    onClick={() => handleShiftAction('break')}
                    className="btn btn-warning btn-lg px-6 hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Take Break
                  </button>
                  <button
                    onClick={() => handleShiftAction('end')}
                    className="btn btn-error btn-lg px-6 hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <Square className="w-5 h-5 mr-2" />
                    End Shift
                  </button>
                </>
              )}
              {currentShiftStatus === 'break' && (
                <button
                  onClick={() => handleShiftAction('resume')}
                  className="btn btn-success btn-lg px-8 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Resume Shift
                </button>
              )}
              {currentShiftStatus === 'ended' && (
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                  <CheckCircle className="w-6 h-6 text-green-200" />
                  <span className="text-lg font-semibold">Shift completed successfully! 🎉</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Jobs Today"
          value={todaysJobs.length}
          icon={Briefcase}
          color="info"
          trendLabel="assigned"
        />
        <KpiCard
          title="Active Jobs"
          value={activeJobLines.length}
          icon={MapPin}
          color="warning"
          trendLabel="in progress"
        />
        <KpiCard
          title="This Week"
          value={driverShifts.length}
          icon={Calendar}
          color="success"
          trendLabel="shifts"
        />
      </div>

      {/* Today's Jobs */}
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Today's Jobs
              <Badge color="primary" variant="outline" className="ml-2">
                {todaysJobs.length}
              </Badge>
            </h3>
            <button
              onClick={() => navigate('/driver/jobs')}
              className="btn btn-ghost btn-sm hover:btn-primary transition-all duration-200"
            >
              View All
            </button>
          </div>

          {todaysJobs.length > 0 ? (
            <div className="space-y-3 mt-4">
              {todaysJobs.map((job) => {
                const jobLinesForJob = jobLines.filter(line =>
                  line.jobId === job.id && line.driverId === currentDriver.id
                );
                const vehicle = vehicles.find(v => v.id === jobLinesForJob[0]?.vehicleId);

                return (
                  <div key={job.id} className="border border-base-300 hover:border-primary/50 rounded-xl p-5 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-base-100 to-base-200/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-mono font-bold text-lg bg-primary/10 text-primary px-3 py-1 rounded-lg">
                            {job.refNo}
                          </span>
                          <Badge color={
                            job.status === 'completed' ? 'success' :
                            job.status === 'in_progress' ? 'info' :
                            job.status === 'scheduled' ? 'warning' : 'error'
                          }>
                            {job.status.replace('_', ' ')}
                          </Badge>
                          <Badge color={
                            job.priority === 'urgent' ? 'error' :
                            job.priority === 'high' ? 'warning' :
                            job.priority === 'normal' ? 'info' : 'success'
                          } variant="outline">
                            {job.priority} priority
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-3 h-3 text-success" />
                              <strong>Pickup:</strong>
                            </div>
                            <div className="text-base-content/70 ml-5">
                              {job.pickupLocation.address.split(',')[0]}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-3 h-3 text-error" />
                              <strong>Delivery:</strong>
                            </div>
                            <div className="text-base-content/70 ml-5">
                              {job.deliveryLocation.address.split(',')[0]}
                            </div>
                          </div>
                        </div>

                        {vehicle && (
                          <div className="mt-2 text-sm">
                            <strong>Vehicle:</strong> {vehicle.rego} - {vehicle.make} {vehicle.model}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => navigate('/driver/jobs')}
                          className="btn btn-primary btn-sm hover:scale-105 transition-transform duration-200"
                        >
                          View Details
                        </button>
                        {job.status === 'scheduled' && (
                          <button
                            onClick={() => alert(`Starting job ${job.refNo}...`)}
                            className="btn btn-success btn-sm hover:scale-105 transition-transform duration-200"
                          >
                            Start Job
                          </button>
                        )}
                        {job.status === 'in_progress' && (
                          <button
                            onClick={() => alert(`Completing job ${job.refNo}...`)}
                            className="btn btn-warning btn-sm hover:scale-105 transition-transform duration-200"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Job Lines Preview */}
                    {jobLinesForJob.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-base-300">
                        <div className="text-sm text-base-content/70">
                          {jobLinesForJob.length} line{jobLinesForJob.length !== 1 ? 's' : ''} assigned
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-base-content/60">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No jobs scheduled for today</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="card-body">
          <h3 className="card-title flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <button
              onClick={() => navigate('/driver/fuel')}
              className="btn btn-outline hover:btn-primary flex-col h-24 gap-3 group transition-all duration-300"
            >
              <Fuel className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-medium">Add Fuel</span>
            </button>
            <button
              onClick={() => navigate('/driver/shifts')}
              className="btn btn-outline hover:btn-secondary flex-col h-24 gap-3 group transition-all duration-300"
            >
              <Calendar className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-medium">View Schedule</span>
            </button>
            <button
              onClick={() => navigate('/driver/timesheet')}
              className="btn btn-outline hover:btn-accent flex-col h-24 gap-3 group transition-all duration-300"
            >
              <Clock className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-medium">Timesheet</span>
            </button>
            <button
              onClick={() => navigate('/driver/profile')}
              className="btn btn-outline hover:btn-info flex-col h-24 gap-3 group transition-all duration-300"
            >
              <User className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-medium">Profile</span>
            </button>
          </div>

          {/* Additional Quick Actions Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <button
              onClick={() => navigate('/driver/jobs')}
              className="btn btn-ghost hover:btn-primary flex items-center gap-2 justify-start transition-all duration-300"
            >
              <Briefcase className="w-5 h-5" />
              <span>My Jobs</span>
            </button>
            <button
              onClick={() => alert('Expense reporting coming soon!')}
              className="btn btn-ghost hover:btn-warning flex items-center gap-2 justify-start transition-all duration-300"
            >
              <DollarSign className="w-5 h-5" />
              <span>Add Expense</span>
            </button>
            <button
              onClick={() => alert('Support system coming soon!')}
              className="btn btn-ghost hover:btn-error flex items-center gap-2 justify-start transition-all duration-300"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Need Help?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {driverShifts.length > 0 && (
        <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title flex items-center gap-2">
                <Clock className="w-5 h-5 text-secondary" />
                Recent Activity
              </h3>
              <button
                onClick={() => navigate('/driver/shifts')}
                className="btn btn-ghost btn-sm hover:btn-secondary transition-all duration-200"
              >
                View History
              </button>
            </div>
            <div className="space-y-3">
              {driverShifts.slice(0, 3).map((shift, index) => (
                <div key={shift.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-base-200/50 to-base-300/30 hover:from-base-300/50 hover:to-base-200/50 rounded-xl transition-all duration-300 hover:shadow-sm">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${
                      shift.status === 'completed' ? 'bg-success shadow-lg shadow-success/25' :
                      shift.status === 'active' ? 'bg-info shadow-lg shadow-info/25' : 'bg-warning shadow-lg shadow-warning/25'
                    }`}></div>
                    {index < driverShifts.slice(0, 3).length - 1 && (
                      <div className="w-px h-8 bg-base-300"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-base">
                      Shift on {format(new Date(shift.date), 'MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-base-content/60 mt-1">
                      {shift.startTime} - {shift.endTime || 'In progress'} • {shift.totalHours || 0} hours
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge color={
                      shift.status === 'completed' ? 'success' :
                      shift.status === 'active' ? 'info' : 'warning'
                    }>
                      {shift.status}
                    </Badge>
                    <span className="text-xs text-base-content/50">
                      {shift.totalHours || 0}h worked
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}