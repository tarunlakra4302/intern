export const jobLines = [
  // Job JOB-2025-0001 lines
  {
    id: "JL-0001",
    jobId: "JOB-2025-0001",
    lineNumber: 1,
    productId: "PRD-0001",
    driverId: "DRV-0001",
    vehicleId: "VEH-0001",
    trailerId: "TRL-0001",
    pickupTime: "2024-09-28T08:30:00",
    deliveryTime: "2024-09-28T12:00:00",
    quantity: 25,
    unit: "tonne",
    docketNumber: "DOC-001234",
    status: "completed",
    notes: "Steel coil delivery - handled with care"
  },
  {
    id: "JL-0002",
    jobId: "JOB-2025-0001",
    lineNumber: 2,
    productId: "PRD-0001",
    driverId: "DRV-0001",
    vehicleId: "VEH-0001",
    trailerId: "TRL-0001",
    pickupTime: "2024-09-28T13:00:00",
    deliveryTime: "2024-09-28T16:30:00",
    quantity: 20,
    unit: "tonne",
    docketNumber: "DOC-001235",
    status: "completed",
    notes: "Second load - same route"
  },

  // Job JOB-2025-0002 lines
  {
    id: "JL-0003",
    jobId: "JOB-2025-0002",
    lineNumber: 1,
    productId: "PRD-0002",
    driverId: "DRV-0002",
    vehicleId: "VEH-0002",
    trailerId: "TRL-0002",
    pickupTime: "2024-09-29T09:00:00",
    deliveryTime: null,
    quantity: 500,
    unit: "litre",
    docketNumber: "DOC-001236",
    status: "in_transit",
    notes: "Chemical transport in progress - DG protocols followed"
  },

  // Job JOB-2025-0003 lines
  {
    id: "JL-0004",
    jobId: "JOB-2025-0003",
    lineNumber: 1,
    productId: "PRD-0003",
    driverId: "DRV-0003",
    vehicleId: "VEH-0003",
    trailerId: "TRL-0002",
    pickupTime: null,
    deliveryTime: null,
    quantity: 50,
    unit: "tonne",
    docketNumber: null,
    status: "scheduled",
    notes: "Wheat export delivery scheduled"
  },

  // Job JOB-2025-0004 lines
  {
    id: "JL-0005",
    jobId: "JOB-2025-0004",
    lineNumber: 1,
    productId: "PRD-0004",
    driverId: "DRV-0004",
    vehicleId: "VEH-0001",
    trailerId: "TRL-0001",
    pickupTime: "2024-09-27T06:00:00",
    deliveryTime: "2024-09-27T18:30:00",
    quantity: 1,
    unit: "each",
    docketNumber: "DOC-001237",
    status: "completed",
    notes: "Heavy machinery - oversized load permits used"
  },

  // Additional job lines for variety
  {
    id: "JL-0006",
    jobId: "JOB-2025-0006",
    lineNumber: 1,
    productId: "PRD-0006",
    driverId: "DRV-0001",
    vehicleId: "VEH-0004",
    trailerId: "TRL-0003",
    pickupTime: "2024-09-30T05:00:00",
    deliveryTime: "2024-09-30T07:30:00",
    quantity: 200,
    unit: "carton",
    docketNumber: "DOC-001238",
    status: "completed",
    notes: "Frozen goods delivery - temperature maintained throughout"
  },
  {
    id: "JL-0007",
    jobId: "JOB-2025-0007",
    lineNumber: 1,
    productId: "PRD-0005",
    driverId: "DRV-0002",
    vehicleId: "VEH-0002",
    trailerId: "TRL-0005",
    pickupTime: null,
    deliveryTime: null,
    quantity: 25000,
    unit: "litre",
    docketNumber: null,
    status: "scheduled",
    notes: "Fuel delivery scheduled for next week"
  }
];

export const getJobLineById = (id) => jobLines.find(line => line.id === id);

export const getJobLinesByJob = (jobId) => jobLines.filter(line => line.jobId === jobId);

export const getJobLinesByDriver = (driverId) => jobLines.filter(line => line.driverId === driverId);

export const getActiveJobLines = () => jobLines.filter(line => line.status === 'in_transit' || line.status === 'scheduled');