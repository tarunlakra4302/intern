import { useState } from 'react';
import { format } from 'date-fns';
import { Receipt, Plus, DollarSign, CreditCard, User, Calendar } from 'lucide-react';
import { DataTable, Toolbar, Badge, Modal, FormField, EmptyState, KpiCard } from '../../components/common';
import { expenses, drivers } from '../../mocks';

export default function StaffExpenses() {
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    driverId: '',
    date: '',
    category: '',
    amount: '',
    description: '',
    receiptNumber: '',
    paymentMethod: 'personal_reimbursement',
    status: 'pending',
    notes: ''
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterExpenses(value, categoryFilter, statusFilter);
  };

  const filterExpenses = (search, category, status) => {
    let filtered = expenses;

    if (search) {
      filtered = filtered.filter(exp =>
        exp.description.toLowerCase().includes(search.toLowerCase()) ||
        exp.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(exp => exp.category === category);
    }

    if (status) {
      filtered = filtered.filter(exp => exp.status === status);
    }

    setFilteredExpenses(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddExpense = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.driverId || !formData.date || !formData.category || !formData.amount || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Generate new ID
    const newId = `EXP-${String(expenses.length + 1).padStart(4, '0')}`;

    // Get driver name for title
    const driver = drivers.find(d => d.id === formData.driverId);
    const title = `${formData.category.charAt(0).toUpperCase() + formData.category.slice(1)} - ${driver?.name || 'Unknown'}`;

    // Create new expense entry matching mock structure
    const newExpense = {
      id: newId,
      driverId: formData.driverId,
      title: title,
      description: formData.description,
      category: formData.category,
      amount: parseFloat(formData.amount),
      currency: 'AUD',
      date: formData.date,
      submittedDate: new Date().toISOString(),
      status: formData.status,
      approvedBy: null,
      approvedDate: null,
      receiptNumber: formData.receiptNumber,
      merchant: '',
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      attachments: []
    };

    // Add to expenses array
    expenses.push(newExpense);

    // Update filtered expenses
    setFilteredExpenses([...filteredExpenses, newExpense]);

    // Reset form
    setFormData({
      driverId: '',
      date: '',
      category: '',
      amount: '',
      description: '',
      receiptNumber: '',
      paymentMethod: 'personal_reimbursement',
      status: 'pending',
      notes: ''
    });

    // Close modal
    setShowAddModal(false);

    // Show success message
    alert('Expense added successfully!');
  };

  const columns = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value) => format(new Date(value), 'MMM dd, yyyy')
    },
    {
      key: 'driverId',
      label: 'Employee',
      render: (value) => {
        const employee = drivers.find(d => d.id === value);
        return (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-base-content/60" />
            <span>{employee?.name || 'Unknown'}</span>
          </div>
        );
      }
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <Badge color={
          value === 'fuel' ? 'info' :
          value === 'meals' ? 'warning' :
          value === 'accommodation' ? 'primary' :
          'default'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => <span className="text-sm">{value}</span>
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value) => <span className="font-semibold">${value.toFixed(2)}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge color={
          value === 'approved' ? 'success' :
          value === 'pending' ? 'warning' :
          value === 'rejected' ? 'error' :
          'default'
        }>
          {value}
        </Badge>
      )
    }
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = expenses.filter(exp => exp.status === 'pending').length;
  const thisMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    const now = new Date();
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
  }).reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Staff Expenses</h1>
          <p className="text-base-content/60 mt-1">Track and manage employee expenses</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Expenses"
          value={totalExpenses}
          prefix="$"
          icon={DollarSign}
          color="primary"
        />
        <KpiCard
          title="This Month"
          value={thisMonthExpenses}
          prefix="$"
          icon={Calendar}
          color="success"
        />
        <KpiCard
          title="Pending Review"
          value={pendingExpenses}
          icon={Receipt}
          color="warning"
        />
        <KpiCard
          title="Avg Per Employee"
          value={(totalExpenses / drivers.length).toFixed(0)}
          prefix="$"
          icon={User}
          color="info"
        />
      </div>

      <Toolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search expenses..."
        filters={[
          {
            label: 'Category',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
              { value: '', label: 'All Categories' },
              { value: 'fuel', label: 'Fuel' },
              { value: 'meals', label: 'Meals' },
              { value: 'accommodation', label: 'Accommodation' },
              { value: 'maintenance', label: 'Maintenance' },
              { value: 'other', label: 'Other' }
            ]
          },
          {
            label: 'Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: '', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' }
            ]
          }
        ]}
      />

      {filteredExpenses.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses found"
          description="No expenses match your current filters"
          action={
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </button>
          }
        />
      ) : (
        <div className="card bg-base-100 shadow">
          <DataTable
            columns={columns}
            data={filteredExpenses}
            className="table-zebra"
          />
        </div>
      )}

      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Expense"
          size="lg"
        >
          <form onSubmit={handleAddExpense} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Staff Member"
                type="select"
                name="driverId"
                value={formData.driverId}
                onChange={handleInputChange}
                required
                options={[
                  { value: '', label: 'Select Staff Member' },
                  ...drivers.map(d => ({ value: d.id, label: d.name }))
                ]}
              />
              <FormField
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Category"
                type="select"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                options={[
                  { value: '', label: 'Select Category' },
                  { value: 'meals', label: 'Meals' },
                  { value: 'accommodation', label: 'Accommodation' },
                  { value: 'parking', label: 'Parking' },
                  { value: 'vehicle_maintenance', label: 'Vehicle Maintenance' },
                  { value: 'communication', label: 'Communication' },
                  { value: 'safety_equipment', label: 'Safety Equipment' },
                  { value: 'other', label: 'Other' }
                ]}
              />
              <FormField
                label="Amount ($)"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
            <FormField
              label="Description"
              type="textarea"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter detailed expense description..."
              required
              rows={3}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Receipt Number"
                type="text"
                name="receiptNumber"
                value={formData.receiptNumber}
                onChange={handleInputChange}
                placeholder="e.g. REC-123456"
              />
              <FormField
                label="Payment Method"
                type="select"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                options={[
                  { value: 'personal_reimbursement', label: 'Personal Reimbursement' },
                  { value: 'company_card', label: 'Company Card' },
                  { value: 'cash', label: 'Cash' },
                  { value: 'invoice', label: 'Invoice' }
                ]}
              />
            </div>
            <FormField
              label="Status"
              type="select"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' }
              ]}
            />
            <FormField
              label="Notes"
              type="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes (optional)..."
              rows={2}
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Expense
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}