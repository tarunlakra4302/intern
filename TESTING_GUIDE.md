# Fleet Management - Testing Guide

## Prerequisites Setup

### 1. Start PostgreSQL

**On Windows:**
1. Open Services (Win + R, type `services.msc`)
2. Find "postgresql-x64-17" or similar
3. Right-click → Start
4. Or use pgAdmin and start from there

**On Mac:**
```bash
brew services start postgresql
```

**On Linux:**
```bash
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Open Command Prompt or Git Bash
psql -U postgres
# Then in psql:
CREATE DATABASE fleet_manager;
\q
```

**Or one-liner:**
```bash
psql -U postgres -c "CREATE DATABASE fleet_manager;"
```

### 3. Run Backend Setup

```bash
cd backend

# Install dependencies (already done)
npm install

# Run migrations
npm run migrate

# Seed initial data
npm run seed

# Start server
npm run dev
```

Server should start on http://localhost:5000

### 4. Verify Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T...",
  "uptime": 1.234
}
```

---

## Backend API Testing

### Test 1: Login (Admin)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fleetmanager.com","password":"Admin123!"}'
```

Expected: `{ "success": true, "data": { "user": {...}, "token": "..." } }`

**Save the token** for subsequent requests.

### Test 2: Login (Driver)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"driver@fleetmanager.com","password":"Driver123!"}'
```

### Test 3: List Drivers (Authenticated)

```bash
TOKEN="<paste_your_token_here>"

curl -X GET http://localhost:5000/api/drivers \
  -H "Authorization: Bearer $TOKEN"
```

Expected: `{ "success": true, "data": { "drivers": [...], "pagination": {...} } }`

### Test 4: Create Driver (Admin Only)

```bash
curl -X POST http://localhost:5000/api/drivers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "<need_to_create_user_first>",
    "license_no": "NSW98765432",
    "license_expiry": "2026-12-31",
    "medical_expiry": "2026-12-31"
  }'
```

### Test 5: List Vehicles

```bash
curl -X GET http://localhost:5000/api/vehicles \
  -H "Authorization: Bearer $TOKEN"
```

### Test 6: List Clients

```bash
curl -X GET http://localhost:5000/api/clients \
  -H "Authorization: Bearer $TOKEN"
```

### Test 7: Get Settings

```bash
curl -X GET http://localhost:5000/api/settings \
  -H "Authorization: Bearer $TOKEN"
```

---

## Frontend Testing

### 1. Start Frontend

```bash
# In project root
npm install
npm run dev
```

Frontend should start on http://localhost:5173

### 2. Manual Tests

1. **Login Page**
   - Navigate to http://localhost:5173
   - Try logging in with:
     - Admin: `admin@fleetmanager.com` / `Admin123!`
     - Driver: `driver@fleetmanager.com` / `Driver123!`

2. **Admin Dashboard**
   - After admin login, should redirect to `/admin/dashboard`
   - Check if dashboard loads without errors

3. **Drivers Page**
   - Navigate to `/admin/drivers`
   - Should show list of drivers (at least 1 from seed)
   - Try search/filter functionality

4. **Vehicles Page**
   - Navigate to `/admin/vehicles`
   - Should show 2 vehicles (from seed)

5. **Clients Page**
   - Navigate to `/admin/clients`
   - Should show 1 client (Acme Construction)

6. **Products Page**
   - Should show 1 product (Sand)

7. **Create Operations**
   - Try creating a new driver
   - Try creating a new vehicle
   - Check for validation errors

---

## Common Issues & Fixes

### Issue: "Connection refused" to PostgreSQL

**Fix:**
- Start PostgreSQL service (see Prerequisites)
- Check if PostgreSQL is listening on port 5432:
  ```bash
  netstat -an | grep 5432
  ```

### Issue: "Database does not exist"

**Fix:**
```bash
psql -U postgres -c "CREATE DATABASE fleet_manager;"
```

### Issue: "relation does not exist"

**Fix:** Run migrations
```bash
cd backend
npm run migrate
```

### Issue: "No data showing in UI"

**Fix:** Run seeds
```bash
cd backend
npm run seed
```

### Issue: "JWT malformed" or "Invalid token"

**Fix:**
- Check JWT_SECRET in backend/.env matches
- Try logging in again to get a fresh token

### Issue: "CORS error" in browser

**Fix:**
- Check backend is running on port 5000
- Check FRONTEND_URL in backend/.env is http://localhost:5173
- Restart backend server

### Issue: "Port 5000 already in use"

**Fix:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill the process (replace PID)
taskkill /PID <PID> /F
```

---

## Integration Test Checklist

- [ ] Backend server starts without errors
- [ ] Health endpoint responds
- [ ] Admin can login
- [ ] Driver can login
- [ ] Drivers list loads
- [ ] Vehicles list loads
- [ ] Clients list loads
- [ ] Products list loads
- [ ] Suppliers list loads
- [ ] Fuel entries list loads
- [ ] Expenses list loads
- [ ] Settings loads
- [ ] Can create new driver
- [ ] Can create new vehicle
- [ ] Can create new client
- [ ] Frontend connects to backend
- [ ] No CORS errors
- [ ] Authentication works end-to-end

---

## Database Verification

Check data was seeded correctly:

```bash
psql -U postgres -d fleet_manager
```

```sql
-- Check users
SELECT id, email, role, status FROM users;

-- Check drivers
SELECT d.id, u.name, d.license_no FROM drivers d
JOIN users u ON u.id = d.user_id;

-- Check vehicles
SELECT id, veh_code, rego, make, model FROM vehicles;

-- Check clients
SELECT id, code, name, email FROM clients;

-- Check counters
SELECT * FROM counters;
```

---

## Expected Seed Data

| Entity | Count | Details |
|--------|-------|---------|
| Users | 2 | 1 Admin, 1 Driver |
| Drivers | 1 | John Smith |
| Vehicles | 2 | Toyota Hilux (ABC123), Isuzu NPR (DEF456) |
| Trailers | 1 | Flatbed (TRL123) |
| Clients | 1 | Acme Construction |
| Products | 1 | Sand ($50/tonne) |
| Suppliers | 1 | ABC Supplies |
| Settings | 1 | Default company settings |

---

## Next Steps After Testing

1. **Fix Issues Found** - Document and fix any bugs discovered
2. **Add Missing Routes** - Shifts, Jobs, Invoices, Attachments, Reports
3. **Enhance Validation** - Add more robust input validation
4. **Error Handling** - Improve error messages
5. **Frontend Integration** - Replace mock data with API calls
6. **UI Polish** - Fix any UI/UX issues
7. **Performance** - Optimize queries if needed
8. **Security** - Review auth, validate all inputs
9. **Documentation** - Update API docs
10. **Deployment** - Prepare for production

---

## Quick Test Script

Save this as `test-backend.sh` in the root directory:

```bash
#!/bin/bash

echo "Testing Fleet Management Backend..."
echo

# Test health
echo "1. Testing health endpoint..."
curl -s http://localhost:5000/api/health | jq '.'
echo

# Test login
echo "2. Testing admin login..."
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fleetmanager.com","password":"Admin123!"}' \
  | jq -r '.data.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "✅ Login successful"
  echo "Token: ${TOKEN:0:50}..."
else
  echo "❌ Login failed"
  exit 1
fi
echo

# Test drivers
echo "3. Testing drivers endpoint..."
curl -s -X GET http://localhost:5000/api/drivers \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.success'
echo

# Test vehicles
echo "4. Testing vehicles endpoint..."
curl -s -X GET http://localhost:5000/api/vehicles \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.success'
echo

# Test clients
echo "5. Testing clients endpoint..."
curl -s -X GET http://localhost:5000/api/clients \
  -H "Authorization: Bearer $TOKEN" \
  | jq '.success'
echo

echo "✅ All basic tests passed!"
```

Run with:
```bash
chmod +x test-backend.sh
./test-backend.sh
```