# API Integration Guide

## Overview
This document describes the complete API integration between the frontend and backend of the Fleet Management System.

## Frontend API Services Created

All API services are located in `/src/services/` directory:

### 1. **api.js** - Base Axios Configuration
- Base URL: `http://localhost:5000/api`
- Automatic token injection from localStorage
- Response interceptor for 401 handling

### 2. **authService.js** - Authentication
- `login(email, password)` - User login
- `logout()` - Clear session
- `getCurrentUser()` - Get logged-in user
- `isAuthenticated()` - Check auth status
- `requestPasswordReset(email)` - Request password reset
- `confirmPasswordReset(token, new_password)` - Confirm reset
- `changePassword(current_password, new_password)` - Change password

### 3. **driverService.js** - Driver Management
- `getDrivers(filters)` - GET /drivers
- `getDriverById(id)` - GET /drivers/:id
- `createDriver(data)` - POST /drivers
- `updateDriver(id, data)` - PUT /drivers/:id
- `deleteDriver(id)` - DELETE /drivers/:id

### 4. **vehicleService.js** - Vehicle Management
- `getVehicles(filters)` - GET /vehicles
- `getVehicleById(id)` - GET /vehicles/:id
- `createVehicle(data)` - POST /vehicles
- `updateVehicle(id, data)` - PUT /vehicles/:id
- `deleteVehicle(id)` - DELETE /vehicles/:id

### 5. **trailerService.js** - Trailer Management
- `getTrailers(filters)` - GET /trailers
- `getTrailerById(id)` - GET /trailers/:id
- `createTrailer(data)` - POST /trailers
- `updateTrailer(id, data)` - PUT /trailers/:id
- `deleteTrailer(id)` - DELETE /trailers/:id

### 6. **clientService.js** - Client Management
- `getClients(filters)` - GET /clients
- `getClientById(id)` - GET /clients/:id
- `createClient(data)` - POST /clients
- `updateClient(id, data)` - PUT /clients/:id
- `deleteClient(id)` - DELETE /clients/:id

### 7. **productService.js** - Product Management
- `getProducts(filters)` - GET /products
- `getProductById(id)` - GET /products/:id
- `createProduct(data)` - POST /products
- `updateProduct(id, data)` - PUT /products/:id
- `deleteProduct(id)` - DELETE /products/:id

### 8. **supplierService.js** - Supplier Management
- `getSuppliers(filters)` - GET /suppliers
- `getSupplierById(id)` - GET /suppliers/:id
- `createSupplier(data)` - POST /suppliers
- `updateSupplier(id, data)` - PUT /suppliers/:id
- `deleteSupplier(id)` - DELETE /suppliers/:id

### 9. **fuelService.js** - Fuel Entry Management
- `getFuel(filters)` - GET /fuel
- `getFuelById(id)` - GET /fuel/:id
- `createFuel(data)` - POST /fuel
- `updateFuel(id, data)` - PUT /fuel/:id
- `deleteFuel(id)` - DELETE /fuel/:id

### 10. **expenseService.js** - Expense Management
- `getExpenses(filters)` - GET /expenses
- `getExpenseById(id)` - GET /expenses/:id
- `createExpense(data)` - POST /expenses
- `updateExpense(id, data)` - PUT /expenses/:id
- `deleteExpense(id)` - DELETE /expenses/:id

### 11. **shiftService.js** - Shift Management
- `getShifts(filters)` - GET /shifts
- `getShiftById(id)` - GET /shifts/:id
- `createShift(data)` - POST /shifts
- `updateShift(id, data)` - PUT /shifts/:id
- `deleteShift(id)` - DELETE /shifts/:id
- `startShift(data)` - POST /shifts/start
- `endShift(id, data)` - POST /shifts/:id/end

### 12. **jobService.js** - Job Management
- `getJobs(filters)` - GET /jobs
- `getJobById(id)` - GET /jobs/:id
- `createJob(data)` - POST /jobs
- `updateJob(id, data)` - PUT /jobs/:id
- `deleteJob(id)` - DELETE /jobs/:id
- `updateJobStatus(id, status)` - PATCH /jobs/:id/status

### 13. **invoiceService.js** - Invoice Management
- `getInvoices(filters)` - GET /invoices
- `getInvoiceById(id)` - GET /invoices/:id
- `createInvoice(data)` - POST /invoices
- `updateInvoice(id, data)` - PUT /invoices/:id
- `deleteInvoice(id)` - DELETE /invoices/:id
- `generatePDF(id)` - GET /invoices/:id/pdf

### 14. **documentService.js** - Document Management
- `getDocuments(filters)` - GET /documents
- `getDocumentById(id)` - GET /documents/:id
- `uploadDocument(formData)` - POST /documents
- `updateDocument(id, data)` - PUT /documents/:id
- `deleteDocument(id)` - DELETE /documents/:id
- `downloadDocument(id, filename)` - GET /documents/:id/download

### 15. **settingService.js** - Settings Management
- `getSettings()` - GET /settings
- `updateSettings(data)` - PUT /settings
- `getSetting(key)` - GET /settings/:key
- `updateSetting(key, value)` - PUT /settings/:key

### 16. **reportService.js** - Reports & Analytics
- `getOverview(filters)` - GET /reports/overview
- `getFinancial(filters)` - GET /reports/financial
- `getFleet(filters)` - GET /reports/fleet
- `getDriver(filters)` - GET /reports/driver
- `getFuel(filters)` - GET /reports/fuel
- `exportReport(reportType, format, filters)` - Export with format (PDF/CSV)

### 17. **dashboardService.js** - Dashboard Data
- `getStats(filters)` - GET /admin/dashboard/stats
- `getRecentActivities(limit)` - GET /admin/dashboard/activities
- `getAlerts()` - GET /admin/dashboard/alerts

## Backend API Endpoints

All endpoints are prefixed with `/api`

### Authentication (`/auth`)
- POST `/auth/login` - Login
- POST `/auth/password-reset/request` - Request password reset
- POST `/auth/password-reset/confirm` - Confirm password reset
- POST `/auth/change-password` - Change password (authenticated)

### Drivers (`/drivers`)
- GET `/drivers` - List all drivers
- GET `/drivers/:id` - Get driver by ID
- POST `/drivers` - Create driver
- PUT `/drivers/:id` - Update driver
- DELETE `/drivers/:id` - Delete driver

### Vehicles (`/vehicles`)
- GET `/vehicles` - List all vehicles
- GET `/vehicles/:id` - Get vehicle by ID
- POST `/vehicles` - Create vehicle
- PUT `/vehicles/:id` - Update vehicle
- DELETE `/vehicles/:id` - Delete vehicle

### Trailers (`/trailers`)
- GET `/trailers` - List all trailers
- GET `/trailers/:id` - Get trailer by ID
- POST `/trailers` - Create trailer
- PUT `/trailers/:id` - Update trailer
- DELETE `/trailers/:id` - Delete trailer

### Clients (`/clients`)
- GET `/clients` - List all clients
- GET `/clients/:id` - Get client by ID
- POST `/clients` - Create client
- PUT `/clients/:id` - Update client
- DELETE `/clients/:id` - Delete client

### Products (`/products`)
- GET `/products` - List all products
- GET `/products/:id` - Get product by ID
- POST `/products` - Create product
- PUT `/products/:id` - Update product
- DELETE `/products/:id` - Delete product

### Suppliers (`/suppliers`)
- GET `/suppliers` - List all suppliers
- GET `/suppliers/:id` - Get supplier by ID
- POST `/suppliers` - Create supplier
- PUT `/suppliers/:id` - Update supplier
- DELETE `/suppliers/:id` - Delete supplier

### Fuel (`/fuel`)
- GET `/fuel` - List all fuel entries
- GET `/fuel/:id` - Get fuel entry by ID
- POST `/fuel` - Create fuel entry
- PUT `/fuel/:id` - Update fuel entry
- DELETE `/fuel/:id` - Delete fuel entry

### Expenses (`/expenses`)
- GET `/expenses` - List all expenses
- GET `/expenses/:id` - Get expense by ID
- POST `/expenses` - Create expense
- PUT `/expenses/:id` - Update expense
- DELETE `/expenses/:id` - Delete expense

### Shifts (`/shifts`)
- GET `/shifts` - List all shifts
- GET `/shifts/:id` - Get shift by ID
- POST `/shifts` - Create shift
- POST `/shifts/start` - Start a shift
- POST `/shifts/:id/end` - End a shift
- PUT `/shifts/:id` - Update shift
- DELETE `/shifts/:id` - Delete shift

### Jobs (`/jobs`)
- GET `/jobs` - List all jobs
- GET `/jobs/:id` - Get job by ID
- POST `/jobs` - Create job
- PUT `/jobs/:id` - Update job
- PATCH `/jobs/:id/status` - Update job status
- DELETE `/jobs/:id` - Delete job

### Invoices (`/invoices`)
- GET `/invoices` - List all invoices
- GET `/invoices/:id` - Get invoice by ID
- GET `/invoices/:id/pdf` - Generate invoice PDF
- POST `/invoices` - Create invoice
- PUT `/invoices/:id` - Update invoice
- DELETE `/invoices/:id` - Delete invoice

### Documents (`/documents`)
- GET `/documents` - List all documents
- GET `/documents/:id` - Get document by ID
- GET `/documents/:id/download` - Download document
- POST `/documents` - Upload document
- PUT `/documents/:id` - Update document metadata
- DELETE `/documents/:id` - Delete document

### Settings (`/settings`)
- GET `/settings` - Get all settings
- GET `/settings/:key` - Get setting by key
- PUT `/settings` - Update all settings
- PUT `/settings/:key` - Update single setting

### Reports (`/reports`)
- GET `/reports/overview` - Overview dashboard report
- GET `/reports/financial` - Financial report
- GET `/reports/fleet` - Fleet analytics report
- GET `/reports/driver` - Driver performance report
- GET `/reports/fuel` - Fuel consumption report
- All support `?format=json|csv|pdf` query parameter

### Health Check
- GET `/health` - API health status

## Usage in Frontend Components

### Example: Using Driver Service

```javascript
import { driverService } from '../services';

// In a React component
const [drivers, setDrivers] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await driverService.getDrivers({
        page: 1,
        limit: 50,
        status: 'ACTIVE'
      });
      setDrivers(response.data.drivers);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchDrivers();
}, []);
```

### Example: Creating a Resource

```javascript
const handleCreateDriver = async (formData) => {
  try {
    const response = await driverService.createDriver(formData);
    alert('Driver created successfully!');
    // Refresh list or navigate
  } catch (error) {
    alert('Error creating driver: ' + error.message);
  }
};
```

## Environment Variables

Create a `.env` file in the frontend root:

```
VITE_API_URL=http://localhost:5000/api
```

## Authentication Flow

1. User logs in via `authService.login()`
2. Token stored in localStorage
3. All subsequent API calls include token in Authorization header
4. On 401 error, user redirected to login page

## Error Handling

All services throw errors that can be caught:

```javascript
try {
  await driverService.createDriver(data);
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.response?.status === 400) {
    // Handle validation errors
  } else {
    // Handle other errors
  }
}
```

## Next Steps for Integration

1. Update each frontend page component to use respective service
2. Replace mock data with real API calls
3. Add loading states and error handling
4. Implement proper form validation
5. Add success/error notifications
6. Test all CRUD operations

## Testing

Start backend server:
```bash
cd backend
npm run dev
```

Start frontend server:
```bash
npm run dev
```

Access app at: `http://localhost:5173`
