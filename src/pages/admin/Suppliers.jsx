import { useState } from 'react';
import { format } from 'date-fns';
import { Building2, Plus, Edit, Trash2, Phone, Mail, MapPin, Globe, Star, Package } from 'lucide-react';
import { DataTable, Toolbar, Badge, Modal, FormField, EmptyState, KpiCard } from '../../components/common';
import { suppliers, products } from '../../mocks';

export default function Suppliers() {
  const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: {
      street: '',
      suburb: '',
      state: '',
      postcode: '',
      country: ''
    },
    category: '',
    paymentTerms: '',
    status: 'active',
    notes: ''
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterSuppliers(value, categoryFilter, statusFilter);
  };

  const handleCategoryFilter = (value) => {
    setCategoryFilter(value);
    filterSuppliers(searchTerm, value, statusFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    filterSuppliers(searchTerm, categoryFilter, value);
  };

  const filterSuppliers = (search, category, status) => {
    let filtered = suppliers;

    if (search) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(search.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
        supplier.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(supplier => supplier.category === category);
    }

    if (status) {
      filtered = filtered.filter(supplier => supplier.status === status);
    }

    setFilteredSuppliers(filtered);
  };

  const getSupplierProducts = (supplierId) => {
    return products.filter(p => p.supplier === supplierId).length;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested address object
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: {
        street: '',
        suburb: '',
        state: '',
        postcode: '',
        country: ''
      },
      category: '',
      paymentTerms: '',
      status: 'active',
      notes: ''
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.code || !formData.contactPerson ||
        !formData.email || !formData.phone || !formData.address.street ||
        !formData.address.suburb || !formData.address.state ||
        !formData.address.postcode || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    // Generate new ID
    const newId = `SUP-${String(suppliers.length + 1).padStart(4, '0')}`;

    // Create new supplier object matching mock data structure
    const newSupplier = {
      id: newId,
      name: formData.name,
      code: formData.code,
      email: formData.email,
      phone: formData.phone,
      address: {
        street: formData.address.street,
        suburb: formData.address.suburb,
        state: formData.address.state,
        postcode: formData.address.postcode,
        country: formData.address.country || 'Australia'
      },
      contactPerson: formData.contactPerson,
      accountManager: 'Unassigned',
      paymentTerms: formData.paymentTerms || '30 days',
      status: formData.status,
      category: formData.category,
      createdDate: new Date().toISOString().split('T')[0],
      notes: formData.notes || ''
    };

    // Add to mock array
    suppliers.push(newSupplier);

    // Update filtered state
    setFilteredSuppliers([...suppliers]);
    filterSuppliers(searchTerm, categoryFilter, statusFilter);

    // Reset form and close modal
    resetForm();
    setShowAddModal(false);

    // Show success message
    alert('Supplier added successfully!');
  };

  const columns = [
    {
      key: 'name',
      label: 'Supplier',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-10 h-10">
              <span className="text-sm">{value.substring(0, 2).toUpperCase()}</span>
            </div>
          </div>
          <div>
            <div className="font-medium text-base-content">{value}</div>
            <div className="text-sm text-base-content/60">{row.category}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contactPerson',
      label: 'Contact Person',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-base-content/60 flex items-center gap-2 mt-1">
            <Phone className="w-3 h-3" />
            {row.phone}
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => (
        <a href={`mailto:${value}`} className="link link-primary flex items-center gap-1">
          <Mail className="w-3 h-3" />
          {value}
        </a>
      )
    },
    {
      key: 'products',
      label: 'Products',
      render: (_, row) => {
        const count = getSupplierProducts(row.id);
        return (
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-base-content/60" />
            <span>{count} products</span>
          </div>
        );
      }
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < value ? 'fill-warning text-warning' : 'text-base-content/30'}`}
            />
          ))}
          <span className="text-sm ml-1">({value})</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge color={
          value === 'active' ? 'success' :
          value === 'inactive' ? 'error' :
          'warning'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedSupplier(row);
              setShowViewModal(true);
            }}
            className="btn btn-sm btn-ghost"
            aria-label="View supplier"
          >
            View
          </button>
          <button
            onClick={() => {
              setSelectedSupplier(row);
              setShowEditModal(true);
            }}
            className="btn btn-sm btn-ghost"
            aria-label="Edit supplier"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Calculate KPIs
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  const avgRating = suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length;
  const categories = [...new Set(suppliers.map(s => s.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Suppliers</h1>
          <p className="text-base-content/60 mt-1">Manage supplier relationships and contacts</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Suppliers"
          value={totalSuppliers}
          icon={Building2}
          color="primary"
        />
        <KpiCard
          title="Active Suppliers"
          value={activeSuppliers}
          icon={Building2}
          color="success"
          trendLabel="currently active"
        />
        <KpiCard
          title="Categories"
          value={categories.length}
          icon={Package}
          color="info"
        />
        <KpiCard
          title="Avg Rating"
          value={avgRating.toFixed(1)}
          icon={Star}
          color="warning"
          suffix="/5"
        />
      </div>

      {/* Toolbar */}
      <Toolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search suppliers..."
        filters={[
          {
            label: 'Category',
            value: categoryFilter,
            onChange: handleCategoryFilter,
            options: [
              { value: '', label: 'All Categories' },
              ...categories.map(cat => ({ value: cat, label: cat }))
            ]
          },
          {
            label: 'Status',
            value: statusFilter,
            onChange: handleStatusFilter,
            options: [
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'pending', label: 'Pending' }
            ]
          }
        ]}
      />

      {/* Data Table */}
      {filteredSuppliers.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No suppliers found"
          description={searchTerm || categoryFilter || statusFilter ?
            "Try adjusting your filters" :
            "Add your first supplier to get started"
          }
          action={
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </button>
          }
        />
      ) : (
        <div className="card bg-base-100 shadow">
          <DataTable
            columns={columns}
            data={filteredSuppliers}
            className="table-zebra"
          />
        </div>
      )}

      {/* View Supplier Modal */}
      {showViewModal && selectedSupplier && (
        <Modal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedSupplier(null);
          }}
          title="Supplier Details"
          size="lg"
        >
          <div className="space-y-6">
            {/* Supplier Header */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-16 h-16">
                  <span className="text-xl">
                    {selectedSupplier.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{selectedSupplier.name}</h3>
                <Badge color={
                  selectedSupplier.status === 'active' ? 'success' :
                  selectedSupplier.status === 'inactive' ? 'error' :
                  'warning'
                }>
                  {selectedSupplier.status}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < selectedSupplier.rating ? 'fill-warning text-warning' : 'text-base-content/30'}`}
                  />
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-semibold mb-3">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-base-content/60" />
                  </div>
                  <div>
                    <div className="text-sm text-base-content/60">Contact Person</div>
                    <div className="font-medium">{selectedSupplier.contactPerson}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-base-content/60" />
                  </div>
                  <div>
                    <div className="text-sm text-base-content/60">Phone</div>
                    <div className="font-medium">{selectedSupplier.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-base-content/60" />
                  </div>
                  <div>
                    <div className="text-sm text-base-content/60">Email</div>
                    <div className="font-medium">{selectedSupplier.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-base-content/60" />
                  </div>
                  <div>
                    <div className="text-sm text-base-content/60">Website</div>
                    <div className="font-medium">
                      {selectedSupplier.website || 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h4 className="font-semibold mb-3">Address</h4>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-base-content/60" />
                </div>
                <div>
                  <div className="font-medium">{selectedSupplier.address}</div>
                  <div className="text-base-content/60">
                    {selectedSupplier.city}, {selectedSupplier.state} {selectedSupplier.zipCode}
                  </div>
                  <div className="text-base-content/60">{selectedSupplier.country}</div>
                </div>
              </div>
            </div>

            {/* Products Supplied */}
            <div>
              <h4 className="font-semibold mb-3">Products Supplied</h4>
              <div className="bg-base-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-base-content/60" />
                  <span className="font-medium">
                    {getSupplierProducts(selectedSupplier.id)} products
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedSupplier(null);
                }}
                className="btn btn-ghost"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setShowEditModal(true);
                }}
                className="btn btn-primary"
              >
                Edit Supplier
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <Modal
          isOpen={showAddModal || showEditModal}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedSupplier(null);
            resetForm();
          }}
          title={showEditModal ? 'Edit Supplier' : 'Add New Supplier'}
          size="lg"
        >
          <form onSubmit={handleAdd} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Company Name"
                type="text"
                name="name"
                placeholder="Enter company name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Supplier Code"
                type="text"
                name="code"
                placeholder="Enter supplier code"
                value={formData.code}
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
                  { value: '', label: 'Select category' },
                  { value: 'Steel Products', label: 'Steel Products' },
                  { value: 'Chemicals', label: 'Chemicals' },
                  { value: 'Agricultural', label: 'Agricultural' },
                  { value: 'Machinery', label: 'Machinery' },
                  { value: 'Food & Beverage', label: 'Food & Beverage' },
                  { value: 'Fuel', label: 'Fuel' }
                ]}
              />
              <FormField
                label="Contact Person"
                type="text"
                name="contactPerson"
                placeholder="Enter contact name"
                value={formData.contactPerson}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Phone"
                type="tel"
                name="phone"
                placeholder="+61 2 1234 5678"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Email"
                type="email"
                name="email"
                placeholder="supplier@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="divider">Address Information</div>

            <FormField
              label="Street Address"
              type="text"
              name="address.street"
              placeholder="123 Main Street"
              value={formData.address.street}
              onChange={handleInputChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Suburb"
                type="text"
                name="address.suburb"
                placeholder="Sydney"
                value={formData.address.suburb}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="State"
                type="text"
                name="address.state"
                placeholder="NSW"
                value={formData.address.state}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Postcode"
                type="text"
                name="address.postcode"
                placeholder="2000"
                value={formData.address.postcode}
                onChange={handleInputChange}
                required
              />
              <FormField
                label="Country"
                type="text"
                name="address.country"
                placeholder="Australia"
                value={formData.address.country}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Payment Terms"
                type="text"
                name="paymentTerms"
                placeholder="e.g., 30 days, 14 days"
                value={formData.paymentTerms}
                onChange={handleInputChange}
              />
              <FormField
                label="Status"
                type="select"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'pending', label: 'Pending' }
                ]}
              />
            </div>

            <FormField
              label="Notes"
              type="textarea"
              name="notes"
              placeholder="Additional notes about this supplier..."
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedSupplier(null);
                  resetForm();
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {showEditModal ? 'Update' : 'Add'} Supplier
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}