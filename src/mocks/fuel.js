export const fuelEntries = [
  {
    id: "FUEL-0001",
    vehicleId: "VEH-0001",
    driverId: "DRV-0001",
    date: "2024-09-28T14:30:00",
    location: "Shell Truckstop - Goulburn",
    address: "123 Hume Highway, Goulburn NSW 2580",
    litres: 285.6,
    pricePerLitre: 1.68,
    totalAmount: 479.81,
    odometer: 89245,
    fuelType: "Diesel",
    cardNumber: "****1234",
    receiptNumber: "REC-001234",
    attendant: "Self Service",
    notes: "Full tank fill - long haul prep",
    attachments: ["receipt_001234.jpg"]
  },
  {
    id: "FUEL-0002",
    vehicleId: "VEH-0002",
    driverId: "DRV-0002",
    date: "2024-09-28T16:45:00",
    location: "BP Connect - Albury",
    address: "456 Pacific Highway, Albury NSW 2640",
    litres: 245.3,
    pricePerLitre: 1.72,
    totalAmount: 421.92,
    odometer: 104987,
    fuelType: "Diesel",
    cardNumber: "****5678",
    receiptNumber: "REC-001235",
    attendant: "John Smith",
    notes: "Mid-route refuel",
    attachments: ["receipt_001235.jpg", "odometer_reading.jpg"]
  },
  {
    id: "FUEL-0003",
    vehicleId: "VEH-0004",
    driverId: "DRV-0004",
    date: "2024-09-29T08:15:00",
    location: "Caltex Woolworths - Perth",
    address: "789 Great Eastern Highway, Perth WA 6004",
    litres: 180.7,
    pricePerLitre: 1.65,
    totalAmount: 298.16,
    odometer: 37892,
    fuelType: "Diesel",
    cardNumber: "****9012",
    receiptNumber: "REC-001236",
    attendant: "Self Service",
    notes: "Start of shift fill-up",
    attachments: ["receipt_001236.jpg"]
  },
  {
    id: "FUEL-0004",
    vehicleId: "VEH-0001",
    driverId: "DRV-0001",
    date: "2024-09-29T18:20:00",
    location: "Ampol Roadhouse - Hunter Valley",
    address: "321 New England Highway, Muswellbrook NSW 2333",
    litres: 198.9,
    pricePerLitre: 1.69,
    totalAmount: 336.14,
    odometer: 89543,
    fuelType: "Diesel",
    cardNumber: "****1234",
    receiptNumber: "REC-001237",
    attendant: "Mary Johnson",
    notes: "Return journey fuel stop",
    attachments: ["receipt_001237.jpg"]
  },
  {
    id: "FUEL-0005",
    vehicleId: "VEH-0003",
    driverId: "DRV-0003",
    date: "2024-09-27T07:30:00",
    location: "United Petroleum - Brisbane",
    address: "567 Ipswich Road, Brisbane QLD 4103",
    litres: 210.4,
    pricePerLitre: 1.64,
    totalAmount: 345.06,
    odometer: 76245,
    fuelType: "Diesel",
    cardNumber: "****3456",
    receiptNumber: "REC-001238",
    attendant: "Self Service",
    notes: "Pre-delivery fuel up",
    attachments: ["receipt_001238.jpg"]
  },
  {
    id: "FUEL-0006",
    vehicleId: "VEH-0002",
    driverId: "DRV-0002",
    date: "2024-09-30T12:00:00",
    location: "Liberty Oil - Geelong",
    address: "234 Princes Highway, Geelong VIC 3220",
    litres: 167.8,
    pricePerLitre: 1.71,
    totalAmount: 286.94,
    odometer: 105298,
    fuelType: "Diesel",
    cardNumber: "****5678",
    receiptNumber: "REC-001239",
    attendant: "Tom Wilson",
    notes: "Mid-job refuel during chemical transport",
    attachments: ["receipt_001239.jpg"]
  }
];

export const getFuelEntryById = (id) => fuelEntries.find(entry => entry.id === id);

export const getFuelEntriesByVehicle = (vehicleId) => fuelEntries.filter(entry => entry.vehicleId === vehicleId);

export const getFuelEntriesByDriver = (driverId) => fuelEntries.filter(entry => entry.driverId === driverId);

export const getFuelEntriesByDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return fuelEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= start && entryDate <= end;
  });
};

export const getTotalFuelCost = () => fuelEntries.reduce((total, entry) => total + entry.totalAmount, 0);

export const getTotalLitres = () => fuelEntries.reduce((total, entry) => total + entry.litres, 0);

// Export fuel data with structure expected by Fuel page
export const fuel = fuelEntries.map(entry => ({
  id: entry.id,
  vehicleId: entry.vehicleId,
  driverId: entry.driverId,
  date: entry.date,
  station: entry.location.split(' - ')[0] || entry.location,
  location: entry.address || entry.location,
  quantity: entry.litres,
  pricePerLiter: entry.pricePerLitre,
  totalCost: entry.totalAmount,
  mileage: entry.odometer,
  fuelType: entry.fuelType.toLowerCase(),
  paymentMethod: entry.cardNumber ? 'fuel_card' : 'cash',
  receiptNumber: entry.receiptNumber,
  notes: entry.notes
}));