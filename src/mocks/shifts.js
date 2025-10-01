export const shifts = [
  {
    id: "SHF-2025-0001",
    driverId: "DRV-0001",
    vehicleId: "VEH-0001",
    date: "2024-09-29",
    startTime: "2024-09-29T06:00:00",
    endTime: "2024-09-29T16:30:00",
    status: "completed",
    totalHours: 10.5,
    regularHours: 8.0,
    overtimeHours: 2.5,
    breakTime: 1.0,
    startLocation: "Sydney Depot",
    endLocation: "Sydney Depot",
    startOdometer: 89245,
    endOdometer: 89543,
    totalKm: 298,
    fuelUsed: 85.4,
    attachments: [
      { name: "timesheet.pdf", type: "timesheet" },
      { name: "fuel_receipt.jpg", type: "fuel" }
    ],
    notes: "Routine delivery run to Newcastle and back"
  },
  {
    id: "SHF-2025-0002",
    driverId: "DRV-0002",
    vehicleId: "VEH-0002",
    date: "2024-09-29",
    startTime: "2024-09-29T05:30:00",
    endTime: "2024-09-29T17:00:00",
    status: "completed",
    totalHours: 11.5,
    regularHours: 8.0,
    overtimeHours: 3.5,
    breakTime: 1.0,
    startLocation: "Melbourne Depot",
    endLocation: "Melbourne Depot",
    startOdometer: 104987,
    endOdometer: 105298,
    totalKm: 311,
    fuelUsed: 92.1,
    attachments: [
      { name: "shift_report.pdf", type: "timesheet" },
      { name: "delivery_receipts.pdf", type: "delivery" }
    ],
    notes: "Long haul to Ballarat with multiple stops"
  },
  {
    id: "SHF-2025-0003",
    driverId: "DRV-0001",
    vehicleId: "VEH-0001",
    date: "2024-09-30",
    startTime: "2024-09-30T07:00:00",
    endTime: null,
    status: "active",
    totalHours: 0,
    regularHours: 0,
    overtimeHours: 0,
    breakTime: 0,
    startLocation: "Sydney Depot",
    endLocation: null,
    startOdometer: 89543,
    endOdometer: null,
    totalKm: 0,
    fuelUsed: 0,
    attachments: [],
    notes: "Current shift in progress"
  },
  {
    id: "SHF-2025-0004",
    driverId: "DRV-0004",
    vehicleId: "VEH-0004",
    date: "2024-09-28",
    startTime: "2024-09-28T08:00:00",
    endTime: "2024-09-28T18:00:00",
    status: "completed",
    totalHours: 10.0,
    regularHours: 8.0,
    overtimeHours: 2.0,
    breakTime: 1.0,
    startLocation: "Perth Depot",
    endLocation: "Perth Depot",
    startOdometer: 37892,
    endOdometer: 38167,
    totalKm: 275,
    fuelUsed: 68.2,
    attachments: [
      { name: "daily_log.pdf", type: "timesheet" }
    ],
    notes: "Local deliveries around Perth metro area"
  },
  {
    id: "SHF-2025-0005",
    driverId: "DRV-0003",
    vehicleId: "VEH-0003",
    date: "2024-10-01",
    startTime: "2024-10-01T06:30:00",
    endTime: null,
    status: "scheduled",
    totalHours: 0,
    regularHours: 0,
    overtimeHours: 0,
    breakTime: 0,
    startLocation: "Brisbane Depot",
    endLocation: null,
    startOdometer: null,
    endOdometer: null,
    totalKm: 0,
    fuelUsed: 0,
    attachments: [],
    notes: "Scheduled for tomorrow - Gold Coast delivery run"
  }
];

export const getShiftById = (id) => shifts.find(shift => shift.id === id);

export const getShiftsByDriver = (driverId) => shifts.filter(shift => shift.driverId === driverId);

export const getActiveShifts = () => shifts.filter(shift => shift.status === 'active');

export const getTodaysShifts = () => {
  const today = new Date().toISOString().split('T')[0];
  return shifts.filter(shift => shift.date === today);
};