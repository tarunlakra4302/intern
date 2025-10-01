export const expenses = [
  {
    id: "EXP-0001",
    driverId: "DRV-0001",
    title: "Accommodation - Newcastle",
    description: "Overnight accommodation during long-haul delivery",
    category: "accommodation",
    amount: 145.00,
    currency: "AUD",
    date: "2024-09-28",
    submittedDate: "2024-09-29T09:15:00",
    status: "approved",
    approvedBy: "fleet_manager",
    approvedDate: "2024-09-29T14:30:00",
    receiptNumber: "HOTEL-123456",
    merchant: "Best Western Newcastle",
    paymentMethod: "company_card",
    notes: "Required overnight stay due to delivery schedule",
    attachments: ["hotel_receipt.pdf", "booking_confirmation.pdf"]
  },
  {
    id: "EXP-0002",
    driverId: "DRV-0002",
    title: "Meals - Long Haul",
    description: "Driver meals during extended delivery run",
    category: "meals",
    amount: 89.50,
    currency: "AUD",
    date: "2024-09-27",
    submittedDate: "2024-09-28T08:30:00",
    status: "pending",
    approvedBy: null,
    approvedDate: null,
    receiptNumber: "MEAL-789012",
    merchant: "Various Roadhouse Stops",
    paymentMethod: "personal_reimbursement",
    notes: "Breakfast, lunch and dinner over 14-hour shift",
    attachments: ["meal_receipts.pdf"]
  },
  {
    id: "EXP-0003",
    driverId: "DRV-0004",
    title: "Parking Fees - Perth Airport",
    description: "Commercial vehicle parking at freight terminal",
    category: "parking",
    amount: 35.00,
    currency: "AUD",
    date: "2024-09-26",
    submittedDate: "2024-09-27T10:45:00",
    status: "approved",
    approvedBy: "fleet_manager",
    approvedDate: "2024-09-27T16:20:00",
    receiptNumber: "PARK-345678",
    merchant: "Perth Airport Freight Parking",
    paymentMethod: "company_card",
    notes: "Required for cargo collection at airport freight terminal",
    attachments: ["parking_receipt.jpg"]
  },
  {
    id: "EXP-0004",
    driverId: "DRV-0001",
    title: "Vehicle Cleaning",
    description: "Commercial vehicle wash after chemical transport",
    category: "vehicle_maintenance",
    amount: 75.00,
    currency: "AUD",
    date: "2024-09-25",
    submittedDate: "2024-09-26T07:20:00",
    status: "rejected",
    approvedBy: "fleet_manager",
    approvedDate: "2024-09-26T11:45:00",
    receiptNumber: "WASH-901234",
    merchant: "Pro Truck Wash",
    paymentMethod: "personal_reimbursement",
    notes: "Standard vehicle cleaning - not eligible for reimbursement as per policy",
    rejectionReason: "Regular vehicle cleaning is covered under maintenance contract",
    attachments: ["wash_receipt.jpg"]
  },
  {
    id: "EXP-0005",
    driverId: "DRV-0003",
    title: "Communication - Satellite Phone",
    description: "Satellite phone usage in remote area",
    category: "communication",
    amount: 45.60,
    currency: "AUD",
    date: "2024-09-24",
    submittedDate: "2024-09-25T13:10:00",
    status: "approved",
    approvedBy: "operations_manager",
    approvedDate: "2024-09-25T15:30:00",
    receiptNumber: "SATCOM-567890",
    merchant: "Telstra Satellite Services",
    paymentMethod: "company_card",
    notes: "Emergency communication required during remote mining site delivery",
    attachments: ["satphone_bill.pdf"]
  },
  {
    id: "EXP-0006",
    driverId: "DRV-0002",
    title: "Tools & Equipment",
    description: "Replacement safety equipment",
    category: "safety_equipment",
    amount: 125.00,
    currency: "AUD",
    date: "2024-09-23",
    submittedDate: "2024-09-24T09:45:00",
    status: "pending",
    approvedBy: null,
    approvedDate: null,
    receiptNumber: "SAFETY-123789",
    merchant: "Industrial Safety Supplies",
    paymentMethod: "personal_reimbursement",
    notes: "Emergency replacement of damaged high-vis vest and hard hat",
    attachments: ["safety_receipt.pdf", "damage_photos.jpg"]
  }
];

export const getExpenseById = (id) => expenses.find(expense => expense.id === id);

export const getExpensesByDriver = (driverId) => expenses.filter(expense => expense.driverId === driverId);

export const getExpensesByStatus = (status) => expenses.filter(expense => expense.status === status);

export const getPendingExpenses = () => expenses.filter(expense => expense.status === 'pending');

export const getTotalExpenseAmount = () => expenses.reduce((total, expense) => total + expense.amount, 0);

export const getExpensesByCategory = (category) => expenses.filter(expense => expense.category === category);

export const getExpensesByDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= start && expenseDate <= end;
  });
};