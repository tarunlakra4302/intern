export const products = [
  {
    id: "PRD-0001",
    code: "STEEL001",
    name: "Steel Coil",
    description: "Hot-rolled steel coil, 1.2mm thickness",
    category: "Steel Products",
    unit: "tonne",
    unitPrice: 850.00,
    hazardous: false,
    weight: 2500,
    dimensions: {
      length: 1500,
      width: 1200,
      height: 800
    },
    status: "active",
    supplier: "CLI-0001",
    notes: "Requires careful handling, no exposure to moisture"
  },
  {
    id: "PRD-0002",
    code: "CHEM001",
    name: "Industrial Solvent",
    description: "Multi-purpose industrial cleaning solvent",
    category: "Chemicals",
    unit: "litre",
    unitPrice: 12.50,
    hazardous: true,
    weight: 25,
    dimensions: {
      length: 400,
      width: 300,
      height: 350
    },
    status: "active",
    supplier: "CLI-0002",
    notes: "Dangerous goods - requires DG certified driver and vehicle"
  },
  {
    id: "PRD-0003",
    code: "GRAIN001",
    name: "Premium Wheat",
    description: "Grade A wheat for export",
    category: "Agricultural",
    unit: "tonne",
    unitPrice: 320.00,
    hazardous: false,
    weight: 1000,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    status: "active",
    supplier: "CLI-0003",
    notes: "Bulk product - requires covered trailer"
  },
  {
    id: "PRD-0004",
    code: "MACH001",
    name: "Excavator Component",
    description: "Heavy machinery hydraulic arm assembly",
    category: "Machinery",
    unit: "each",
    unitPrice: 15000.00,
    hazardous: false,
    weight: 3200,
    dimensions: {
      length: 4500,
      width: 800,
      height: 1200
    },
    status: "active",
    supplier: "CLI-0005",
    notes: "Oversized load - requires special permits and escort"
  },
  {
    id: "PRD-0005",
    code: "FUEL001",
    name: "Diesel Fuel",
    description: "Ultra-low sulfur diesel fuel",
    category: "Fuel",
    unit: "litre",
    unitPrice: 1.68,
    hazardous: true,
    weight: 0.85,
    dimensions: {
      length: 0,
      width: 0,
      height: 0
    },
    status: "active",
    supplier: "CLI-0004",
    notes: "Liquid bulk - requires specialized tank trailer"
  },
  {
    id: "PRD-0006",
    code: "FOOD001",
    name: "Frozen Vegetables",
    description: "Mixed frozen vegetables for retail",
    category: "Food & Beverage",
    unit: "carton",
    unitPrice: 28.50,
    hazardous: false,
    weight: 15,
    dimensions: {
      length: 600,
      width: 400,
      height: 300
    },
    status: "active",
    supplier: "CLI-0001",
    notes: "Temperature controlled - requires refrigerated transport"
  }
];

export const getProductById = (id) => products.find(product => product.id === id);

export const getActiveProducts = () => products.filter(product => product.status === 'active');

export const getHazardousProducts = () => products.filter(product => product.hazardous === true);