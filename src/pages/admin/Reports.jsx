import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { FileText, Download, Calendar, TrendingUp, DollarSign, Truck, Users, Filter, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import { KpiCard, ChartCard, FormField, EmptyState } from '../../components/common';
import reportService from '../../services/reportService';
import { jobs, invoices, vehicles, drivers, fuel, shifts } from '../../mocks';

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('month');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);

  // Calculate date ranges
  const getDateRange = () => {
    const end = new Date();
    let start = new Date();

    switch (dateRange) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start = startOfMonth(end);
        break;
      case 'quarter':
        start.setMonth(end.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
    }

    return { start, end };
  };

  // Generate mock report data
  const generateMockReportData = (reportType) => {
    switch (reportType) {
      case 'overview':
        return {
          kpis: {
            totalJobs: jobs.length,
            activeJobs: jobs.filter(j => j.status === 'in_progress').length,
            totalRevenue: invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
            fleetUtilization: 85
          },
          revenueData: Array.from({ length: 12 }, (_, i) => ({
            month: format(new Date(2024, i, 1), 'MMM'),
            revenue: Math.floor(Math.random() * 50000) + 30000,
            expenses: Math.floor(Math.random() * 30000) + 15000
          })),
          jobsByStatus: [
            { name: 'Completed', value: jobs.filter(j => j.status === 'completed').length },
            { name: 'In Progress', value: jobs.filter(j => j.status === 'in_progress').length },
            { name: 'Scheduled', value: jobs.filter(j => j.status === 'scheduled').length },
            { name: 'Cancelled', value: jobs.filter(j => j.status === 'cancelled').length }
          ]
        };

      case 'financial':
        return {
          summary: {
            totalRevenue: invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
            totalExpenses: 125000,
            netProfit: 89500,
            profitMargin: 41.6
          },
          monthlyTrend: Array.from({ length: 6 }, (_, i) => ({
            month: format(subMonths(new Date(), 5 - i), 'MMM'),
            revenue: Math.floor(Math.random() * 60000) + 40000,
            expenses: Math.floor(Math.random() * 40000) + 20000,
            profit: Math.floor(Math.random() * 25000) + 15000
          })),
          expenseBreakdown: [
            { category: 'Fuel', amount: 45000 },
            { category: 'Maintenance', amount: 28000 },
            { category: 'Salaries', amount: 35000 },
            { category: 'Insurance', amount: 12000 },
            { category: 'Other', amount: 5000 }
          ]
        };

      case 'fleet':
        return {
          fleetStats: {
            totalVehicles: vehicles.length,
            activeVehicles: vehicles.filter(v => v.status === 'active').length,
            maintenanceVehicles: vehicles.filter(v => v.status === 'maintenance').length,
            avgUtilization: 82
          },
          utilizationData: vehicles.slice(0, 5).map(v => ({
            vehicle: v.rego,
            utilization: Math.floor(Math.random() * 40) + 60,
            distance: Math.floor(Math.random() * 5000) + 3000
          })),
          maintenanceSchedule: vehicles.slice(0, 5).map(v => ({
            vehicle: v.rego,
            lastService: v.lastServiceDate,
            nextService: v.nextServiceDue,
            status: new Date(v.nextServiceDue) < new Date() ? 'Overdue' : 'Scheduled'
          }))
        };

      case 'driver':
        return {
          driverStats: {
            totalDrivers: drivers.length,
            activeDrivers: drivers.filter(d => d.status === 'active').length,
            totalHours: shifts.reduce((sum, s) => sum + (s.totalHours || 0), 0),
            avgRating: 4.5
          },
          performanceData: drivers.slice(0, 5).map(d => ({
            driver: d.name,
            jobsCompleted: Math.floor(Math.random() * 50) + 20,
            hoursWorked: Math.floor(Math.random() * 160) + 120,
            rating: (Math.random() * 1 + 4).toFixed(1)
          })),
          hoursDistribution: Array.from({ length: 7 }, (_, i) => ({
            day: format(new Date(2024, 9, i + 1), 'EEE'),
            hours: Math.floor(Math.random() * 12) + 6
          }))
        };

      case 'fuel':
        return {
          fuelStats: {
            totalCost: fuel.reduce((sum, f) => sum + f.totalCost, 0),
            totalVolume: fuel.reduce((sum, f) => sum + f.quantity, 0),
            avgPrice: fuel.reduce((sum, f) => sum + f.pricePerLiter, 0) / fuel.length,
            avgEfficiency: 3.2
          },
          consumptionTrend: Array.from({ length: 6 }, (_, i) => ({
            month: format(subMonths(new Date(), 5 - i), 'MMM'),
            volume: Math.floor(Math.random() * 2000) + 3000,
            cost: Math.floor(Math.random() * 4000) + 5000
          })),
          byVehicle: vehicles.slice(0, 5).map(v => ({
            vehicle: v.rego,
            consumption: Math.floor(Math.random() * 500) + 300,
            cost: Math.floor(Math.random() * 1000) + 500,
            efficiency: (Math.random() * 1 + 2.5).toFixed(1)
          }))
        };

      default:
        return null;
    }
  };

  // Fetch report data
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);

      // Try API first, fallback to mock data if it fails
      if (!useMockData) {
        try {
          const { start, end } = getDateRange();
          const filters = {
            date_from: start.toISOString().split('T')[0],
            date_to: end.toISOString().split('T')[0],
          };

          let data;
          switch (selectedReport) {
            case 'overview':
              data = await reportService.getOverview(filters);
              break;
            case 'financial':
              data = await reportService.getFinancial(filters);
              break;
            case 'fleet':
              data = await reportService.getFleet(filters);
              break;
            case 'driver':
              data = await reportService.getDriver(filters);
              break;
            case 'fuel':
              data = await reportService.getFuel(filters);
              break;
            default:
              data = null;
          }

          setReportData(data?.data || data);
          setLoading(false);
          return;
        } catch (err) {
          console.warn('API failed, using mock data:', err.message);
          setUseMockData(true);
        }
      }

      // Use mock data
      try {
        const mockData = generateMockReportData(selectedReport);
        setReportData(mockData);
      } catch (err) {
        setError('Failed to generate report data');
        console.error('Error generating mock data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [selectedReport, dateRange, useMockData]);

  // Handle export
  const handleExport = async () => {
    if (useMockData) {
      // Generate mock export for demonstration
      const reportTitle = selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1);
      const fileName = `${reportTitle}_Report_${format(new Date(), 'yyyy-MM-dd')}.${exportFormat}`;

      if (exportFormat === 'pdf') {
        alert(`PDF export is not available in demo mode.\n\nReport: ${reportTitle}\nFormat: ${exportFormat.toUpperCase()}\nFile: ${fileName}\n\nIn production, this would download: ${fileName}`);
      } else if (exportFormat === 'csv') {
        // Generate CSV from report data
        let csvContent = '';

        if (reportData) {
          // Create CSV based on report type
          switch (selectedReport) {
            case 'overview':
              csvContent = 'Metric,Value\n';
              if (reportData.kpis) {
                Object.entries(reportData.kpis).forEach(([key, value]) => {
                  csvContent += `${key},${value}\n`;
                });
              }
              break;
            case 'financial':
              csvContent = 'Month,Revenue,Expenses,Profit\n';
              if (reportData.monthlyTrend) {
                reportData.monthlyTrend.forEach(row => {
                  csvContent += `${row.month},${row.revenue},${row.expenses},${row.profit}\n`;
                });
              }
              break;
            case 'fleet':
              csvContent = 'Vehicle,Utilization,Distance\n';
              if (reportData.utilizationData) {
                reportData.utilizationData.forEach(row => {
                  csvContent += `${row.vehicle},${row.utilization},${row.distance}\n`;
                });
              }
              break;
            case 'driver':
              csvContent = 'Driver,Jobs Completed,Hours Worked,Rating\n';
              if (reportData.performanceData) {
                reportData.performanceData.forEach(row => {
                  csvContent += `${row.driver},${row.jobsCompleted},${row.hoursWorked},${row.rating}\n`;
                });
              }
              break;
            case 'fuel':
              csvContent = 'Vehicle,Consumption,Cost,Efficiency\n';
              if (reportData.byVehicle) {
                reportData.byVehicle.forEach(row => {
                  csvContent += `${row.vehicle},${row.consumption},${row.cost},${row.efficiency}\n`;
                });
              }
              break;
          }
        }

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        alert('CSV report exported successfully!');
      }
    } else {
      // Use API export
      try {
        const { start, end } = getDateRange();
        const filters = {
          date_from: start.toISOString().split('T')[0],
          date_to: end.toISOString().split('T')[0],
        };

        await reportService.exportReport(selectedReport, exportFormat, filters);
        alert('Report exported successfully!');
      } catch (err) {
        console.error('Error exporting report:', err);
        alert('Failed to export report. Using mock data instead.');
        setUseMockData(true);
      }
    }
  };

  // Use real data or fallback to empty
  const kpis = reportData?.kpis || { totalRevenue: 0, netProfit: 0, activeJobs: 0, fleetUtilization: 0 };
  const revenueData = reportData?.revenueData || [];
  const jobsByStatus = reportData?.jobsByStatus || [];
  const fleetUtilization = reportData?.fleetUtilization || [];
  const topVehicles = reportData?.topVehicles || [];
  const driverPerformance = reportData?.driverPerformance || [];
  const fuelConsumption = reportData?.fuelConsumption || [];
  const expenseBreakdown = reportData?.expenseBreakdown || [];

  const reportTypes = [
    { value: 'overview', label: 'Overview Dashboard', icon: BarChart3 },
    { value: 'financial', label: 'Financial Report', icon: DollarSign },
    { value: 'fleet', label: 'Fleet Analytics', icon: Truck },
    { value: 'driver', label: 'Driver Performance', icon: Users },
    { value: 'fuel', label: 'Fuel Consumption', icon: PieChartIcon }
  ];

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      );
    }

    switch (selectedReport) {
      case 'overview':
        return (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KpiCard
                title="Total Revenue"
                value={kpis.totalRevenue}
                prefix="$"
                icon={DollarSign}
                color="success"
                previousValue={kpis.totalRevenue * 0.9}
              />
              <KpiCard
                title="Net Profit"
                value={kpis.netProfit}
                prefix="$"
                icon={TrendingUp}
                color="primary"
                previousValue={kpis.netProfit * 0.85}
              />
              <KpiCard
                title="Active Jobs"
                value={kpis.activeJobs}
                icon={Truck}
                color="info"
              />
              <KpiCard
                title="Fleet Utilization"
                value={kpis.fleetUtilization}
                suffix="%"
                icon={BarChart3}
                color="warning"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <ChartCard title="Revenue Trend" subtitle="Monthly revenue vs expenses">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                      <XAxis dataKey="month" stroke="currentColor" fontSize={12} />
                      <YAxis stroke="currentColor" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--b1))',
                          border: '1px solid hsl(var(--b3))',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              {/* Job Status Distribution */}
              <ChartCard title="Job Status" subtitle="Current job distribution">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={jobsByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {jobsByStatus.map((entry, index) => (
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
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {jobsByStatus.map((item) => (
                    <div key={item.status} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.status} ({item.count})</span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>
          </>
        );

      case 'financial':
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profit Margin */}
              <ChartCard title="Profit Margins" subtitle="Revenue, expenses and profit trends">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                      <XAxis dataKey="month" stroke="currentColor" fontSize={12} />
                      <YAxis stroke="currentColor" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--b1))',
                          border: '1px solid hsl(var(--b3))',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              {/* Expense Breakdown */}
              <ChartCard title="Expense Breakdown" subtitle="Monthly expense categories">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                      <XAxis dataKey="category" stroke="currentColor" fontSize={12} />
                      <YAxis stroke="currentColor" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--b1))',
                          border: '1px solid hsl(var(--b3))',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Bar dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>

            <div className="mt-6">
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title">Financial Summary</h3>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>Category</th>
                          <th className="text-right">This Month</th>
                          <th className="text-right">Last Month</th>
                          <th className="text-right">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenseBreakdown.map((item) => (
                          <tr key={item.category}>
                            <td className="font-medium">{item.category}</td>
                            <td className="text-right">${item.amount.toLocaleString()}</td>
                            <td className="text-right">${(item.amount * 0.9).toLocaleString()}</td>
                            <td className="text-right">
                              <span className="text-success">+10%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'fleet':
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fleet Utilization */}
              <ChartCard title="Fleet Status" subtitle="Vehicle availability">
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fleetUtilization}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label
                      >
                        {fleetUtilization.map((entry, index) => (
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
                <div className="flex justify-center gap-4 mt-4">
                  {fleetUtilization.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </ChartCard>

              {/* Vehicle Performance */}
              <ChartCard title="Top Performing Vehicles" subtitle="By jobs completed">
                <div className="space-y-4">
                  {topVehicles.slice(0, 5).map((vehicle, idx) => (
                    <div key={vehicle.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-base-200 text-base-content rounded w-10 h-10">
                            <span className="text-lg">{idx + 1}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{vehicle.rego_number}</div>
                          <div className="text-sm text-base-content/60">{vehicle.make} {vehicle.model}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{vehicle.job_count} jobs</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>
          </>
        );

      case 'driver':
        return (
          <>
            <ChartCard title="Driver Performance" subtitle="Jobs and hours worked">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={driverPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis dataKey="name" stroke="currentColor" fontSize={12} />
                    <YAxis stroke="currentColor" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--b1))',
                        border: '1px solid hsl(var(--b3))',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="jobs" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="hours" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title">Top Drivers</h3>
                  <div className="space-y-3">
                    {driverPerformance.map((driver, idx) => (
                      <div key={driver.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-10 h-10">
                              <span>{idx + 1}</span>
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">{driver.name}</div>
                            <div className="text-sm text-base-content/60">{driver.jobs} jobs completed</div>
                          </div>
                        </div>
                        <div className="badge badge-success">{driver.rating} ⭐</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title">Driver Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-base-content/60">Total Active Drivers</span>
                      <span className="font-semibold">{drivers.filter(d => d.status === 'active').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/60">Average Jobs/Driver</span>
                      <span className="font-semibold">32</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/60">Average Hours/Week</span>
                      <span className="font-semibold">42</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/60">Average Rating</span>
                      <span className="font-semibold">4.6 ⭐</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'fuel':
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fuel Consumption Trend */}
              <ChartCard title="Fuel Consumption" subtitle="Weekly diesel vs gasoline usage">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fuelConsumption}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                      <XAxis dataKey="week" stroke="currentColor" fontSize={12} />
                      <YAxis stroke="currentColor" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--b1))',
                          border: '1px solid hsl(var(--b3))',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="diesel" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="gasoline" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              {/* Fuel Cost Analysis */}
              <ChartCard title="Fuel Cost Analysis" subtitle="Cost breakdown by vehicle type">
                <div className="space-y-4">
                  <div className="stats stats-vertical w-full">
                    <div className="stat">
                      <div className="stat-title">Total Fuel Cost</div>
                      <div className="stat-value text-primary">${reportData?.totalStats?.totalCost || 0}</div>
                      <div className="stat-desc">This period</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Average Cost/Liter</div>
                      <div className="stat-value text-secondary">${reportData?.totalStats?.avgCostPerLiter || 0}</div>
                      <div className="stat-desc">Average rate</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Total Volume</div>
                      <div className="stat-value">{reportData?.totalStats?.totalLiters || 0}L</div>
                      <div className="stat-desc">Total consumed</div>
                    </div>
                  </div>
                </div>
              </ChartCard>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Reports & Analytics</h1>
          <p className="text-base-content/60 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline">
            <Calendar className="w-4 h-4 mr-2" />
            {dateRange === 'week' ? 'This Week' :
             dateRange === 'month' ? 'This Month' :
             dateRange === 'quarter' ? 'This Quarter' :
             'This Year'}
          </button>
          <button className="btn btn-primary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex flex-wrap gap-2">
        {reportTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelectedReport(type.value)}
            className={`btn ${selectedReport === type.value ? 'btn-primary' : 'btn-outline'}`}
          >
            <type.icon className="w-4 h-4 mr-2" />
            {type.label}
          </button>
        ))}
      </div>

      {/* Report Content */}
      {renderReportContent()}

      {/* Export Options */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="card-title">Export Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Date Range"
              type="select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={[
                { value: 'week', label: 'This Week' },
                { value: 'month', label: 'This Month' },
                { value: 'quarter', label: 'This Quarter' },
                { value: 'year', label: 'This Year' }
              ]}
            />
            <FormField
              label="Report Type"
              type="select"
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              options={reportTypes}
            />
            <FormField
              label="Export Format"
              type="select"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              options={[
                { value: 'pdf', label: 'PDF Document' },
                { value: 'excel', label: 'Excel Spreadsheet' },
                { value: 'csv', label: 'CSV File' }
              ]}
            />
          </div>
          <div className="flex justify-end mt-4">
            <button className="btn btn-primary" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}