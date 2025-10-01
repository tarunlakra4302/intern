import { useState } from 'react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval } from 'date-fns';
import { Calendar, Clock, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import { Badge, KpiCard } from '../../components/common';
import { shifts } from '../../mocks';
import { useAuth } from '../../contexts/AuthContext';

export default function Timesheet() {
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Filter shifts for current driver
  const driverShifts = shifts.filter(shift => shift.driverId === user?.driverId);

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getShiftsForDay = (date) => {
    return driverShifts.filter(shift => {
      const shiftDate = new Date(shift.startTime);
      return shiftDate.toDateString() === date.toDateString();
    });
  };

  const getDayHours = (date) => {
    const dayShifts = getShiftsForDay(date);
    return dayShifts.reduce((total, shift) => {
      if (shift.startTime && shift.endTime) {
        const duration = new Date(shift.endTime) - new Date(shift.startTime);
        return total + (duration / (1000 * 60 * 60));
      }
      return total;
    }, 0);
  };

  const getWeeklyHours = () => {
    return weekDays.reduce((total, day) => total + getDayHours(day), 0);
  };

  const getOvertimeHours = () => {
    const weeklyHours = getWeeklyHours();
    return Math.max(0, weeklyHours - 40);
  };

  const previousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const nextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours % 1) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Timesheet</h1>
          <p className="text-base-content/60 mt-1">Track your working hours and attendance</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="btn btn-primary btn-sm">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="This Week"
          value={formatHours(getWeeklyHours())}
          icon={Clock}
          color="primary"
        />
        <KpiCard
          title="Regular Hours"
          value={formatHours(Math.min(40, getWeeklyHours()))}
          icon={Calendar}
          color="success"
        />
        <KpiCard
          title="Overtime"
          value={formatHours(getOvertimeHours())}
          icon={Clock}
          color="warning"
        />
        <KpiCard
          title="Days Worked"
          value={weekDays.filter(day => getDayHours(day) > 0).length}
          icon={Calendar}
          color="info"
        />
      </div>

      {/* Week Navigation */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={previousWeek}
                className="btn btn-circle btn-outline btn-sm"
                aria-label="Previous week"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
                </h3>
                <p className="text-sm text-base-content/60">Week of {format(weekStart, 'MMM dd')}</p>
              </div>
              <button
                onClick={nextWeek}
                className="btn btn-circle btn-outline btn-sm"
                aria-label="Next week"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={goToCurrentWeek}
              className="btn btn-outline btn-sm"
            >
              Current Week
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Timesheet */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="text-lg font-semibold mb-4">Weekly Timesheet</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Date</th>
                  <th>Shifts</th>
                  <th>Hours Worked</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {weekDays.map((day) => {
                  const dayShifts = getShiftsForDay(day);
                  const dayHours = getDayHours(day);
                  const isToday = day.toDateString() === new Date().toDateString();

                  return (
                    <tr key={day.toISOString()} className={isToday ? 'bg-base-200' : ''}>
                      <td className="font-medium">
                        {format(day, 'EEEE')}
                        {isToday && <Badge color="primary" size="sm" className="ml-2">Today</Badge>}
                      </td>
                      <td>{format(day, 'MMM dd')}</td>
                      <td>
                        {dayShifts.length === 0 ? (
                          <span className="text-base-content/60">No shifts</span>
                        ) : (
                          <div className="space-y-1">
                            {dayShifts.map((shift) => (
                              <div key={shift.id} className="text-sm">
                                <span className="font-mono">{shift.id}</span>
                                <br />
                                <span className="text-base-content/60">
                                  {format(new Date(shift.startTime), 'h:mm a')} -
                                  {shift.endTime ? format(new Date(shift.endTime), 'h:mm a') : 'Active'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>
                        {dayHours > 0 ? (
                          <span className={`font-medium ${
                            dayHours > 8 ? 'text-warning' : dayHours >= 6 ? 'text-success' : 'text-info'
                          }`}>
                            {formatHours(dayHours)}
                          </span>
                        ) : (
                          <span className="text-base-content/60">0h 0m</span>
                        )}
                      </td>
                      <td>
                        {dayShifts.some(s => s.status === 'active') ? (
                          <Badge color="info">Working</Badge>
                        ) : dayHours > 0 ? (
                          <Badge color="success">Completed</Badge>
                        ) : dayShifts.some(s => s.status === 'scheduled') ? (
                          <Badge color="warning">Scheduled</Badge>
                        ) : (
                          <Badge color="default">Off</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-base-200 font-semibold">
                  <td colSpan="3">Weekly Total</td>
                  <td>{formatHours(getWeeklyHours())}</td>
                  <td>
                    {getOvertimeHours() > 0 && (
                      <Badge color="warning">OT: {formatHours(getOvertimeHours())}</Badge>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Weekly Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Regular Hours (40h max)</span>
                <span className="font-medium">{formatHours(Math.min(40, getWeeklyHours()))}</span>
              </div>
              <div className="flex justify-between">
                <span>Overtime Hours</span>
                <span className="font-medium text-warning">{formatHours(getOvertimeHours())}</span>
              </div>
              <div className="divider my-2"></div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Hours</span>
                <span>{formatHours(getWeeklyHours())}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Attendance</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Days Worked</span>
                <span className="font-medium">{weekDays.filter(day => getDayHours(day) > 0).length}/7</span>
              </div>
              <div className="flex justify-between">
                <span>Average Hours/Day</span>
                <span className="font-medium">
                  {formatHours(getWeeklyHours() / weekDays.filter(day => getDayHours(day) > 0).length || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Completion Rate</span>
                <span className="font-medium text-success">
                  {Math.round((weekDays.filter(day => getDayHours(day) > 0).length / 7) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}