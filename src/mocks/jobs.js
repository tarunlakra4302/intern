export const jobs = [
  {
    id: "JOB-2025-0001",
    refNo: "REF001234",
    clientId: "CLI-0001",
    status: "completed",
    priority: "normal",
    createdDate: "2024-09-25",
    scheduledDate: "2024-09-28",
    completedDate: "2024-09-28",
    pickupLocation: {
      address: "123 Industrial Drive, Alexandria NSW 2015",
      contact: "John Manager",
      phone: "+61 2 9876 5432",
      instructions: "Loading dock B, ask for John"
    },
    deliveryLocation: {
      address: "456 Warehouse St, Newcastle NSW 2300",
      contact: "Mary Supervisor",
      phone: "+61 2 4567 8901",
      instructions: "Rear entrance, security code 1234"
    },
    distanceKm: 162,
    estimatedHours: 4.5,
    actualHours: 4.2,
    totalAmount: 850.00,
    notes: "Standard steel coil delivery, completed on time",
    attachments: [
      { name: "delivery_receipt.pdf", type: "delivery" },
      { name: "weight_docket.pdf", type: "weighbridge" }
    ]
  },
  {
    id: "JOB-2025-0002",
    refNo: "REF001235",
    clientId: "CLI-0002",
    status: "in_progress",
    priority: "high",
    createdDate: "2024-09-28",
    scheduledDate: "2024-09-29",
    completedDate: null,
    pickupLocation: {
      address: "789 Chemical Plant Rd, Altona VIC 3018",
      contact: "Dr. Amanda Clarke",
      phone: "+61 3 8765 9876",
      instructions: "DG certified driver required, PPE mandatory"
    },
    deliveryLocation: {
      address: "321 Factory Ave, Geelong VIC 3220",
      contact: "Tom Wilson",
      phone: "+61 3 5432 1098",
      instructions: "Dangerous goods bay, follow all safety protocols"
    },
    distanceKm: 78,
    estimatedHours: 3.0,
    actualHours: null,
    totalAmount: 650.00,
    notes: "Chemical transport - DG certified equipment and driver required",
    attachments: []
  },
  {
    id: "JOB-2025-0003",
    refNo: "REF001236",
    clientId: "CLI-0003",
    status: "scheduled",
    priority: "normal",
    createdDate: "2024-09-29",
    scheduledDate: "2024-10-01",
    completedDate: null,
    pickupLocation: {
      address: "567 Farm Rd, Toowoomba QLD 4350",
      contact: "Peter Mackenzie",
      phone: "+61 7 4123 5678",
      instructions: "Bulk grain loading - covered trailer required"
    },
    deliveryLocation: {
      address: "890 Port Access Rd, Brisbane QLD 4178",
      contact: "Lisa Parker",
      phone: "+61 7 3456 7890",
      instructions: "Export terminal - follow port security procedures"
    },
    distanceKm: 134,
    estimatedHours: 5.0,
    actualHours: null,
    totalAmount: 1200.00,
    notes: "Grain export delivery - port clearance required",
    attachments: []
  },
  {
    id: "JOB-2025-0004",
    refNo: "REF001237",
    clientId: "CLI-0005",
    status: "completed",
    priority: "high",
    createdDate: "2024-09-26",
    scheduledDate: "2024-09-27",
    completedDate: "2024-09-27",
    pickupLocation: {
      address: "234 Mining Equipment Way, Kewdale WA 6105",
      contact: "Tony Rodriguez",
      phone: "+61 8 9876 1234",
      instructions: "Oversized load - permits and escort required"
    },
    deliveryLocation: {
      address: "678 Mine Site Access Rd, Kalgoorlie WA 6430",
      contact: "Mike Stevens",
      phone: "+61 8 9012 3456",
      instructions: "Mine site delivery - safety induction required"
    },
    distanceKm: 595,
    estimatedHours: 12.0,
    actualHours: 11.5,
    totalAmount: 2850.00,
    notes: "Heavy machinery transport - successful delivery despite weather delays",
    attachments: [
      { name: "oversize_permit.pdf", type: "permit" },
      { name: "delivery_confirmation.pdf", type: "delivery" },
      { name: "photos.zip", type: "photos" }
    ]
  },
  {
    id: "JOB-2025-0005",
    refNo: "REF001238",
    clientId: "CLI-0001",
    status: "cancelled",
    priority: "low",
    createdDate: "2024-09-24",
    scheduledDate: "2024-09-26",
    completedDate: null,
    pickupLocation: {
      address: "345 Steel Works Dr, Port Kembla NSW 2505",
      contact: "Mark Stevens",
      phone: "+61 2 9123 4567",
      instructions: "Standard loading procedures"
    },
    deliveryLocation: {
      address: "123 Construction St, Wollongong NSW 2500",
      contact: "James Builder",
      phone: "+61 2 4321 8765",
      instructions: "Crane unloading available"
    },
    distanceKm: 15,
    estimatedHours: 2.0,
    actualHours: null,
    totalAmount: 0,
    notes: "Cancelled by client - rescheduled to next week",
    attachments: []
  }
];

export const getJobById = (id) => jobs.find(job => job.id === id);

export const getJobsByStatus = (status) => jobs.filter(job => job.status === status);

export const getJobsByClient = (clientId) => jobs.filter(job => job.clientId === clientId);

export const getActiveJobs = () => jobs.filter(job => job.status === 'in_progress' || job.status === 'scheduled');