export const clients = [
  {
    id: "CLI-0001",
    name: "Metro Distribution Co.",
    code: "METRO",
    email: "orders@metrodist.com.au",
    phone: "+61 2 9876 5432",
    address: {
      street: "45 Industrial Drive",
      suburb: "Alexandria",
      state: "NSW",
      postcode: "2015",
      country: "Australia"
    },
    contactPerson: "Sarah Mitchell",
    accountManager: "John Williams",
    creditLimit: 50000,
    paymentTerms: "30 days",
    status: "active",
    createdDate: "2022-01-15",
    notes: "Major client, priority handling required"
  },
  {
    id: "CLI-0002",
    name: "Pacific Logistics Ltd",
    code: "PACIFIC",
    email: "logistics@pacificlog.com.au",
    phone: "+61 3 8765 4321",
    address: {
      street: "123 Cargo Way",
      suburb: "Port Melbourne",
      state: "VIC",
      postcode: "3207",
      country: "Australia"
    },
    contactPerson: "Michael Chen",
    accountManager: "Lisa Brown",
    creditLimit: 75000,
    paymentTerms: "14 days",
    status: "active",
    createdDate: "2021-08-20",
    notes: "Reliable payer, regular weekly shipments"
  },
  {
    id: "CLI-0003",
    name: "Brisbane Freight Solutions",
    code: "BRISFRT",
    email: "dispatch@brisfreight.com.au",
    phone: "+61 7 3456 7890",
    address: {
      street: "78 Transport Road",
      suburb: "Eagle Farm",
      state: "QLD",
      postcode: "4009",
      country: "Australia"
    },
    contactPerson: "David Thompson",
    accountManager: "Emma Wilson",
    creditLimit: 35000,
    paymentTerms: "21 days",
    status: "active",
    createdDate: "2023-03-10",
    notes: "New client, monitoring performance"
  },
  {
    id: "CLI-0004",
    name: "Adelaide Supply Chain",
    code: "ADELSC",
    email: "bookings@adelaidelogistics.com.au",
    phone: "+61 8 7654 3210",
    address: {
      street: "156 Logistics Avenue",
      suburb: "Gepps Cross",
      state: "SA",
      postcode: "5094",
      country: "Australia"
    },
    contactPerson: "Rachel Adams",
    accountManager: "Tom Johnson",
    creditLimit: 25000,
    paymentTerms: "30 days",
    status: "on_hold",
    createdDate: "2022-11-05",
    notes: "Payment issues - account on hold pending resolution"
  },
  {
    id: "CLI-0005",
    name: "Perth Mining Transport",
    code: "PERTHMIN",
    email: "operations@perthmining.com.au",
    phone: "+61 8 9876 5432",
    address: {
      street: "89 Mining Circuit",
      suburb: "Kewdale",
      state: "WA",
      postcode: "6105",
      country: "Australia"
    },
    contactPerson: "James Miller",
    accountManager: "Sophie Davis",
    creditLimit: 100000,
    paymentTerms: "45 days",
    status: "active",
    createdDate: "2020-06-18",
    notes: "High volume client, specialized equipment required"
  }
];

export const getClientById = (id) => clients.find(client => client.id === id);

export const getActiveClients = () => clients.filter(client => client.status === 'active');