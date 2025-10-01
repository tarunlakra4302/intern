import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Truck, Calendar, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import { KpiCard, ChartCard } from '../../components/common';
import { drivers, vehicles, shifts, jobs, invoices } from '../../mocks';

// Mock chart data
const monthlyRevenueData = [
  { month: 'Jan', revenue: 125000, jobs: 85 },
  { month: 'Feb', revenue: 132000, jobs: 92 },
  { month: 'Mar', revenue: 118000, jobs: 78 },
  { month: 'Apr', revenue: 145000, jobs: 98 },
  { month: 'May', revenue: 158000, jobs: 105 },
  { month: 'Jun', revenue: 142000, jobs: 89 }
];

const vehicleUtilizationData = [
  { name: 'Active', value: vehicles.filter(v => v.status === 'active').length, color: '#10b981' },
  { name: 'Maintenance', value: vehicles.filter(v => v.status === 'maintenance').length, color: '#f59e0b' },
  { name: 'Inactive', value: vehicles.filter(v => v.status === 'inactive').length, color: '#ef4444' }
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate KPIs
  const activeShifts = shifts.filter(shift => shift.status === 'active').length;
  const todaysJobs = jobs.filter(job => job.status === 'in_progress' || job.status === 'scheduled').length;
  const vehiclesDueService = vehicles.filter(vehicle => vehicle.kmToNextService <= 1000).length;
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceOwing, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <KpiCard key={i} loading={true} />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard loading={true} />
          <ChartCard loading={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
          <p className="text-base-content/60 mt-1">
            Welcome back! Here's what's happening with your fleet today.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Active Shifts"
          value={activeShifts}
          previousValue={5}
          icon={Calendar}
          color="info"
          trendLabel="currently active"
        />

        <KpiCard
          title="Jobs Today"
          value={todaysJobs}
          previousValue={8}
          icon={Users}
          color="primary"
          trendLabel="in progress"
        />

        <KpiCard
          title="Service Due"
          value={vehiclesDueService}
          icon={AlertTriangle}
          color="warning"
          trendLabel="vehicles need attention"
        />

        <KpiCard
          title="Outstanding"
          value={totalOutstanding}
          previousValue={45000}
          prefix="$"
          icon={DollarSign}
          color="success"
          trendLabel="invoices pending"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <ChartCard
          title="Monthly Revenue"
          subtitle="Revenue and job count trends"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                <XAxis
                  dataKey="month"
                  stroke="currentColor"
                  fontSize={12}
                />
                <YAxis stroke="currentColor" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--b1))',
                    border: '1px solid hsl(var(--b3))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Vehicle Utilization Chart */}
        <ChartCard
          title="Vehicle Status"
          subtitle="Current fleet utilization"
        >
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleUtilizationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vehicleUtilizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--b1))',
                    border: '1px solid hsl(var(--b3))',
                    borderRadius: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 mt-4">
            {vehicleUtilizationData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-base-content/70">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title text-base-content">Recent Activity</h3>
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-4 p-3 bg-base-200 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-base-content">
                  Job JOB-2025-0001 completed successfully
                </p>
                <p className="text-xs text-base-content/60">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-base-200 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-warning"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-base-content">
                  Vehicle VEH-0003 requires service
                </p>
                <p className="text-xs text-base-content/60">4 hours ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-base-200 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-info"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-base-content">
                  New driver DRV-0005 added to system
                </p>
                <p className="text-xs text-base-content/60">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}