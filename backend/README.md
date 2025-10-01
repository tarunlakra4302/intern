# Fleet Management Backend API

RESTful API backend for the Fleet Management MVP system built with Express, PostgreSQL, and Knex.

## Features

- ✅ JWT Authentication
- ✅ Role-based access control (ADMIN, DRIVER)
- ✅ Shift overlap detection
- ✅ Job line conflict validation (driver & vehicle)
- ✅ One-invoice-per-job enforcement
- ✅ PDF invoice generation
- ✅ Email notifications
- ✅ File attachments (stored in database as bytea)
- ✅ Human-readable ID codes (JOB-2025-0001, VEH-0001, etc.)
- ✅ Comprehensive reporting

## Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express 4.x
- **Database**: PostgreSQL 14+
- **Query Builder**: Knex.js
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **PDF Generation**: PDFKit
- **Email**: nodemailer
- **Validation**: express-validator
- **Security**: helmet, cors
- **File Upload**: multer

## Prerequisites

- Node.js >= 16.x
- PostgreSQL >= 14.x
- npm or yarn

## Installation

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fleet_manager
# OR individual connection params:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fleet_manager
DB_USER=postgres
DB_PASSWORD=postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# SMTP (for invoice emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@fleetmanager.com

# Google Maps (for autocomplete/distance)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# File Upload
MAX_FILE_SIZE=10485760
MAX_FILES_PER_ENTITY=20

# Frontend (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup

Create the PostgreSQL database:

```bash
createdb fleet_manager
# or via psql:
psql -U postgres -c "CREATE DATABASE fleet_manager;"
```

Run migrations:

```bash
npm run migrate
```

Seed initial data (optional but recommended):

```bash
npm run seed
```

This will create:
- Admin user: `admin@fleetmanager.com` / `Admin123!`
- Driver user: `driver@fleetmanager.com` / `Driver123!`
- Sample vehicles, client, product, etc.

## Running the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

Check health: `GET http://localhost:5000/api/health`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/password-reset/request` - Request password reset
- `POST /api/auth/password-reset/confirm` - Confirm password reset

### Drivers
- `GET /api/drivers` - List drivers (with search, filters, pagination)
- `POST /api/drivers` - Create driver (ADMIN only)
- `GET /api/drivers/:id` - Get driver by ID
- `PUT /api/drivers/:id` - Update driver (ADMIN only)
- `DELETE /api/drivers/:id` - Delete driver (ADMIN only)

### Vehicles
- `GET /api/vehicles` - List vehicles
- `POST /api/vehicles` - Create vehicle (ADMIN only)
- `GET /api/vehicles/:id` - Get vehicle by ID
- `PUT /api/vehicles/:id` - Update vehicle (ADMIN only)
- `DELETE /api/vehicles/:id` - Delete vehicle (ADMIN only)

### Trailers
- Standard CRUD endpoints (same pattern as vehicles)

### Clients
- Standard CRUD endpoints
- `GET /api/clients?search=&status=&page=&limit=`

### Products
- Standard CRUD endpoints

### Suppliers
- Standard CRUD endpoints

### Fuel Entries
- `GET /api/fuel` - List fuel entries
- `POST /api/fuel` - Create fuel entry
- `GET /api/fuel/:id` - Get fuel entry
- `PUT /api/fuel/:id` - Update fuel entry
- `DELETE /api/fuel/:id` - Delete fuel entry

### Staff Expenses
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/:id` - Get expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Settings
- `GET /api/settings` - Get company settings
- `PUT /api/settings` - Update settings (ADMIN only)

## Database Schema

### Core Tables

- **users** - Authentication and user accounts
- **drivers** - Driver profiles (extends users)
- **vehicles** - Fleet vehicles
- **trailers** - Trailer assets
- **clients** - Customer/client information
- **products** - Product catalog
- **suppliers** - Supplier management
- **shifts** - Driver shift tracking
- **jobs** - Job/order management
- **job_lines** - Individual job line items
- **attachments** - File attachments (bytea storage)
- **fuel_entries** - Fuel consumption tracking
- **staff_expenses** - Driver expense claims
- **invoices** - Invoice headers
- **invoice_items** - Invoice line items
- **documents** - Document library
- **counters** - Auto-incrementing ID counters
- **settings** - Application configuration

### Human-Readable IDs

The system generates human-readable IDs with year prefixes:
- Jobs: `JOB-2025-0001`, `JOB-2025-0002`, etc.
- Shifts: `SHF-2025-0001`
- Invoices: `INV-2025-0001`
- Vehicles: `VEH-0001` (no year)
- Drivers: `DRV-0001` (no year)
- Clients: `CLI-0001` (no year)
- Products: `PRD-0001` (no year)
- Trailers: `TRL-0001` (no year)

## Business Logic

### Shift Overlap Detection
Prevents drivers from having overlapping shifts using PostgreSQL `tstzrange` overlap detection.

### Job Line Conflicts
Validates that within a shift, no driver or vehicle has overlapping job-line time windows.

### One Invoice Per Job
Enforces that each completed job can only have one invoice created from it.

### File Upload Limits
- Max file size: 10 MB
- Max files per entity: 20
- Allowed types: PDF, JPEG, JPG, PNG
- Storage: Database (bytea)

### Invoice Generation
- Creates invoices from completed jobs
- Mirrors job lines as invoice items
- Calculates GST (10%)
- Generates PDF using PDFKit
- Sends via email with nodemailer

## Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test -- --coverage
```

## Database Migrations

Create a new migration:

```bash
npm run migrate:make migration_name
```

Run pending migrations:

```bash
npm run migrate
```

Rollback last batch:

```bash
npm run migrate:rollback
```

## Database Seeds

Create a new seed:

```bash
npm run seed:make seed_name
```

Run seeds:

```bash
npm run seed
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js           # Database config (legacy)
│   │   ├── env.js          # Environment loader
│   │   └── migrate.js      # Migration runner (legacy)
│   ├── controllers/        # Route controllers
│   │   ├── authController.js (planned)
│   │   ├── driversController.js
│   │   ├── vehiclesController.js
│   │   └── ... (etc)
│   ├── db/
│   │   └── knex.js         # Knex instance
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT auth & RBAC
│   │   ├── errorHandler.js      # Error handling
│   │   └── validate.js          # Validation helpers
│   ├── models/             # Database models (optional/legacy)
│   ├── routes/             # Express routes
│   │   ├── index.js        # Route aggregator
│   │   ├── auth.js
│   │   ├── drivers.js
│   │   └── ... (etc)
│   ├── services/           # Business logic
│   │   ├── authService.js
│   │   ├── driversService.js
│   │   ├── fileService.js
│   │   ├── idService.js
│   │   ├── invoiceService.js
│   │   ├── jobService.js
│   │   ├── reportService.js
│   │   ├── shiftService.js
│   │   └── ... (etc)
│   ├── tests/              # Test files
│   ├── utils/              # Utility functions
│   │   ├── logger.js       # Winston logger
│   │   └── response.js     # Response helpers
│   └── server.js           # Express app entry
├── migrations/             # Knex migrations
│   └── 20250101000000_init_core.js
├── seeds/                  # Database seeds
│   └── 001_initial_data.js
├── .env.example            # Example environment
├── .gitignore
├── generate-backend.js     # Code generator script
├── knexfile.cjs            # Knex configuration
├── package.json
└── README.md              # This file
```

## Error Handling

All errors return JSON in the format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

Common error codes:
- `AUTHENTICATION_ERROR` - Invalid credentials
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `VALIDATION_ERROR` - Invalid input
- `NOT_FOUND_ERROR` - Resource not found
- `CONFLICT_ERROR` - Business rule violation
- `DATABASE_ERROR` - Database operation failed

## Security

- Helmet for HTTP security headers
- CORS configured for frontend origin
- JWT tokens with configurable expiry
- Bcrypt password hashing (10 rounds)
- SQL injection protection via parameterized queries
- Rate limiting (TODO)
- Input validation on all endpoints

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET` (min 32 characters)
3. Configure PostgreSQL with SSL
4. Set up SMTP for invoice emails
5. Configure proper CORS origin
6. Set up process manager (PM2, systemd)
7. Configure reverse proxy (nginx)
8. Enable HTTPS
9. Set up database backups
10. Monitor logs and errors

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql
# or on Mac:
brew services list

# Test connection
psql -h localhost -U postgres -d fleet_manager
```

### Migration Errors
```bash
# Rollback and re-run
npm run migrate:rollback
npm run migrate
```

### Port Already in Use
```bash
# Find process on port 5000
lsof -i :5000
# Kill it
kill -9 <PID>
```

## Contributing

1. Create feature branch
2. Make changes
3. Write tests
4. Run linter: `npm run lint`
5. Run tests: `npm test`
6. Submit PR

## License

ISC

## Support

For issues or questions, please create an issue in the repository.