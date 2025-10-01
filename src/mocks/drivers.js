export const drivers = [
  {
    id: "DRV-0001",
    name: "John Smith",
    email: "john.smith@fleetco.com",
    phone: "+61 400 123 456",
    licenseNumber: "LIC123456789",
    licenseExpiry: "2025-08-15",
    medicalExpiry: "2025-12-20",
    status: "active",
    hireDate: "2022-03-15",
    address: "123 Main St, Sydney NSW 2000",
    emergencyContact: {
      name: "Jane Smith",
      phone: "+61 400 987 654"
    },
    totalHours: 2240,
    totalKm: 125000
  },
  {
    id: "DRV-0002",
    name: "Michael Johnson",
    email: "mike.johnson@fleetco.com",
    phone: "+61 400 234 567",
    licenseNumber: "LIC987654321",
    licenseExpiry: "2024-11-30",
    medicalExpiry: "2025-06-10",
    status: "active",
    hireDate: "2021-09-20",
    address: "456 Oak Ave, Melbourne VIC 3000",
    emergencyContact: {
      name: "Sarah Johnson",
      phone: "+61 400 876 543"
    },
    totalHours: 3520,
    totalKm: 180000
  },
  {
    id: "DRV-0003",
    name: "David Wilson",
    email: "david.wilson@fleetco.com",
    phone: "+61 400 345 678",
    licenseNumber: "LIC456789123",
    licenseExpiry: "2025-03-22",
    medicalExpiry: "2024-10-05",
    status: "on_leave",
    hireDate: "2023-01-10",
    address: "789 Pine St, Brisbane QLD 4000",
    emergencyContact: {
      name: "Lisa Wilson",
      phone: "+61 400 765 432"
    },
    totalHours: 1680,
    totalKm: 95000
  },
  {
    id: "DRV-0004",
    name: "Robert Brown",
    email: "rob.brown@fleetco.com",
    phone: "+61 400 456 789",
    licenseNumber: "LIC789123456",
    licenseExpiry: "2024-12-15",
    medicalExpiry: "2025-09-18",
    status: "active",
    hireDate: "2020-05-08",
    address: "321 Elm St, Perth WA 6000",
    emergencyContact: {
      name: "Emma Brown",
      phone: "+61 400 654 321"
    },
    totalHours: 4200,
    totalKm: 220000
  },
  {
    id: "DRV-0005",
    name: "James Davis",
    email: "james.davis@fleetco.com",
    phone: "+61 400 567 890",
    licenseNumber: "LIC321654987",
    licenseExpiry: "2025-07-08",
    medicalExpiry: "2025-11-25",
    status: "inactive",
    hireDate: "2023-06-12",
    address: "654 Maple Ave, Adelaide SA 5000",
    emergencyContact: {
      name: "Maria Davis",
      phone: "+61 400 543 210"
    },
    totalHours: 980,
    totalKm: 52000
  }
];

export const getDriverById = (id) => drivers.find(driver => driver.id === id);

export const getActiveDrivers = () => drivers.filter(driver => driver.status === 'active');