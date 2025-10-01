export const suppliers = [
  {
    id: "SUP-0001",
    name: "Industrial Steel Group",
    code: "INDSTEEL",
    email: "procurement@industrialsteel.com.au",
    phone: "+61 2 9123 4567",
    address: {
      street: "24 Steel Works Drive",
      suburb: "Port Kembla",
      state: "NSW",
      postcode: "2505",
      country: "Australia"
    },
    contactPerson: "Mark Stevens",
    accountManager: "Jennifer Taylor",
    paymentTerms: "14 days",
    status: "active",
    category: "Steel Products",
    createdDate: "2020-03-12",
    notes: "Primary steel supplier, excellent quality and delivery"
  },
  {
    id: "SUP-0002",
    name: "ChemTech Solutions",
    code: "CHEMTECH",
    email: "orders@chemtechsol.com.au",
    phone: "+61 3 8765 9876",
    address: {
      street: "67 Chemical Court",
      suburb: "Altona",
      state: "VIC",
      postcode: "3018",
      country: "Australia"
    },
    contactPerson: "Dr. Amanda Clarke",
    accountManager: "Robert Lee",
    paymentTerms: "30 days",
    status: "active",
    category: "Chemicals",
    createdDate: "2021-07-25",
    notes: "Specialized chemical supplier, handles dangerous goods"
  },
  {
    id: "SUP-0003",
    name: "Queensland Grains Co.",
    code: "QLDGRAINS",
    email: "sales@qldgrains.com.au",
    phone: "+61 7 4123 5678",
    address: {
      street: "158 Harvest Road",
      suburb: "Toowoomba",
      state: "QLD",
      postcode: "4350",
      country: "Australia"
    },
    contactPerson: "Peter Mackenzie",
    accountManager: "Kate Wilson",
    paymentTerms: "21 days",
    status: "active",
    category: "Agricultural",
    createdDate: "2019-11-08",
    notes: "Seasonal supplier, peak periods during harvest"
  },
  {
    id: "SUP-0004",
    name: "Heavy Machinery Parts",
    code: "HEAVYMACH",
    email: "parts@heavymachinery.com.au",
    phone: "+61 8 9876 1234",
    address: {
      street: "89 Industrial Park Way",
      suburb: "Welshpool",
      state: "WA",
      postcode: "6106",
      country: "Australia"
    },
    contactPerson: "Tony Rodriguez",
    accountManager: "Michelle Brown",
    paymentTerms: "45 days",
    status: "active",
    category: "Machinery",
    createdDate: "2022-01-30",
    notes: "Mining equipment specialist, custom orders available"
  },
  {
    id: "SUP-0005",
    name: "Fresh Foods Distribution",
    code: "FRESHFOOD",
    email: "logistics@freshfoods.com.au",
    phone: "+61 8 8234 5679",
    address: {
      street: "45 Cold Storage Lane",
      suburb: "Regency Park",
      state: "SA",
      postcode: "5010",
      country: "Australia"
    },
    contactPerson: "Helen Chang",
    accountManager: "David Martinez",
    paymentTerms: "7 days",
    status: "active",
    category: "Food & Beverage",
    createdDate: "2023-04-15",
    notes: "Temperature sensitive products, tight delivery windows"
  },
  {
    id: "SUP-0006",
    name: "Fuel Direct Australia",
    code: "FUELDIRECT",
    email: "supply@fueldirect.com.au",
    phone: "+61 2 9876 4321",
    address: {
      street: "12 Refinery Circuit",
      suburb: "Botany",
      state: "NSW",
      postcode: "2019",
      country: "Australia"
    },
    contactPerson: "Craig Johnson",
    accountManager: "Sarah Thompson",
    paymentTerms: "Immediate",
    status: "inactive",
    category: "Fuel",
    createdDate: "2021-09-14",
    notes: "Contract expired - seeking new agreement"
  }
];

export const getSupplierById = (id) => suppliers.find(supplier => supplier.id === id);

export const getActiveSuppliers = () => suppliers.filter(supplier => supplier.status === 'active');