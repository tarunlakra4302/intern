import { useState } from 'react';
import { format } from 'date-fns';
import { Package, Plus, Edit, Trash2, Search, Filter, Archive, TrendingUp, AlertTriangle } from 'lucide-react';
import { DataTable, Toolbar, Badge, Modal, FormField, EmptyState, KpiCard } from '../../components/common';
import { products, suppliers } from '../../mocks';

export default function Products() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    category: '',
    unit: '',
    unitPrice: '',
    hazardous: false,
    weight: '',
    supplier: '',
    status: 'active',
    notes: ''
  });

  const handleSearch = (value) => {
    setSearchTerm(value);
    filterProducts(value, categoryFilter, statusFilter);
  };

  const handleCategoryFilter = (value) => {
    setCategoryFilter(value);
    filterProducts(searchTerm, value, statusFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    filterProducts(searchTerm, categoryFilter, value);
  };

  const filterProducts = (search, category, status) => {
    let filtered = products;

    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.code.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }

    if (status) {
      filtered = filtered.filter(product => product.status === status);
    }

    setFilteredProducts(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (!formData.code || !formData.name || !formData.category) {
      alert('Please fill in required fields (Code, Name, Category)');
      return;
    }

    const productToAdd = {
      id: `PRD-${String(products.length + 1).padStart(4, '0')}`,
      code: formData.code,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      unit: formData.unit,
      unitPrice: parseFloat(formData.unitPrice) || 0,
      hazardous: formData.hazardous,
      weight: parseFloat(formData.weight) || 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0
      },
      status: formData.status,
      supplier: formData.supplier || null,
      notes: formData.notes
    };

    products.push(productToAdd);
    setFilteredProducts([...products]);

    // TODO: Call API
    // productService.createProduct(formData)

    setShowAddModal(false);
    setFormData({
      code: '',
      name: '',
      description: '',
      category: '',
      unit: '',
      unitPrice: '',
      hazardous: false,
      weight: '',
      supplier: '',
      status: 'active',
      notes: ''
    });

    alert('Product added successfully!');
  };

  const columns = [
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-base-content">{value}</div>
          <div className="text-sm text-base-content/60">{row.description}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value) => (
        <Badge color={
          value === 'chemicals' ? 'warning' :
          value === 'equipment' ? 'info' :
          value === 'parts' ? 'primary' :
          'default'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: 'supplier',
      label: 'Supplier',
      render: (value) => {
        const supplier = suppliers.find(s => s.id === value);
        return supplier ? supplier.name : '-';
      }
    },
    {
      key: 'currentStock',
      label: 'Stock Level',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span className={value <= row.minStock ? 'text-error font-medium' : ''}>
            {value} {row.unit}
          </span>
          {value <= row.minStock && (
            <AlertTriangle className="w-4 h-4 text-error" />
          )}
        </div>
      )
    },
    {
      key: 'unitPrice',
      label: 'Unit Price',
      sortable: true,
      render: (value) => <span className="font-medium">${value.toFixed(2)}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge color={
          value === 'active' ? 'success' :
          value === 'discontinued' ? 'error' :
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
              setSelectedProduct(row);
              setShowEditModal(true);
            }}
            className="btn btn-sm btn-ghost"
            aria-label="Edit product"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setSelectedProduct(row);
              setShowDeleteConfirm(true);
            }}
            className="btn btn-sm btn-ghost text-error"
            aria-label="Delete product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Calculate KPIs
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.currentStock <= p.minStock).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.currentStock * p.unitPrice), 0);
  const activeProducts = products.filter(p => p.status === 'active').length;

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">Products</h1>
          <p className="text-base-content/60 mt-1">Manage inventory and product catalog</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          color="primary"
        />
        <KpiCard
          title="Low Stock Alert"
          value={lowStockProducts}
          icon={AlertTriangle}
          color="warning"
          trendLabel="need reordering"
        />
        <KpiCard
          title="Inventory Value"
          value={totalInventoryValue}
          prefix="$"
          icon={TrendingUp}
          color="success"
        />
        <KpiCard
          title="Active Products"
          value={activeProducts}
          icon={Archive}
          color="info"
          trendLabel="currently active"
        />
      </div>

      {/* Toolbar */}
      <Toolbar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search products..."
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
              { value: 'discontinued', label: 'Discontinued' },
              { value: 'out_of_stock', label: 'Out of Stock' }
            ]
          }
        ]}
      />

      {/* Data Table */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description={searchTerm || categoryFilter || statusFilter ?
            "Try adjusting your filters" :
            "Add your first product to get started"
          }
          action={
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
          }
        />
      ) : (
        <div className="card bg-base-100 shadow">
          <DataTable
            columns={columns}
            data={filteredProducts}
            className="table-zebra"
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <Modal
          isOpen={showAddModal || showEditModal}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          title={showEditModal ? 'Edit Product' : 'Add New Product'}
          size="lg"
        >
          <form onSubmit={handleAddProduct}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Product Code"
                  name="code"
                  type="text"
                  placeholder="STEEL001"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                />
                <FormField
                  label="Product Name"
                  name="name"
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <FormField
                label="Description"
                name="description"
                type="textarea"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Category"
                  name="category"
                  type="select"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  options={[
                    { value: '', label: 'Select Category' },
                    { value: 'Steel Products', label: 'Steel Products' },
                    { value: 'Chemicals', label: 'Chemicals' },
                    { value: 'Equipment', label: 'Equipment' },
                    { value: 'Parts', label: 'Parts' }
                  ]}
                />
                <FormField
                  label="Supplier"
                  name="supplier"
                  type="select"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  options={[
                    { value: '', label: 'Select Supplier' },
                    ...suppliers.map(s => ({ value: s.id, label: s.name }))
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Unit"
                  name="unit"
                  type="text"
                  placeholder="tonne, litre, kg"
                  value={formData.unit}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  placeholder="0"
                  value={formData.weight}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Unit Price ($)"
                  name="unitPrice"
                  type="number"
                  placeholder="0.00"
                  value={formData.unitPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
                <FormField
                  label="Status"
                  name="status"
                  type="select"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'discontinued', label: 'Discontinued' }
                  ]}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedProduct(null);
                  }}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {showEditModal ? 'Update' : 'Add'} Product
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <Modal
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setSelectedProduct(null);
          }}
          title="Delete Product"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-base-content/80">
              Are you sure you want to delete <strong>{selectedProduct?.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedProduct(null);
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button className="btn btn-error">
                Delete Product
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}