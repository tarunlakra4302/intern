import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Debug() {
  const location = useLocation();
  const navigate = useNavigate();

  const testPages = [
    { path: '/admin', name: 'Dashboard' },
    { path: '/admin/drivers', name: 'Drivers' },
    { path: '/admin/vehicles', name: 'Vehicles' },
    { path: '/admin/products', name: 'Products' },
    { path: '/admin/suppliers', name: 'Suppliers' },
    { path: '/admin/documents', name: 'Documents' },
    { path: '/admin/fuel', name: 'Fuel' },
    { path: '/admin/reports', name: 'Reports' },
    { path: '/admin/shifts', name: 'Shifts' },
    { path: '/admin/staff-expenses', name: 'Staff Expenses' },
    { path: '/admin/trailers', name: 'Trailers' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h1 className="card-title text-2xl">🔧 Debug Page</h1>
          <p>Current URL: <code className="bg-base-200 px-2 py-1 rounded">{location.pathname}</code></p>
          <p>Time: {new Date().toLocaleString()}</p>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Test All Admin Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {testPages.map((page) => (
              <button
                key={page.path}
                onClick={() => navigate(page.path)}
                className="btn btn-outline btn-sm"
              >
                Test {page.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">System Info</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Screen Size:</strong> {window.innerWidth} x {window.innerHeight}</p>
            <p><strong>Local Storage:</strong> {Object.keys(localStorage).length} items</p>
            <p><strong>React Version:</strong> {React.version}</p>
          </div>
        </div>
      </div>
    </div>
  );
}