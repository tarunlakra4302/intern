import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./pages/Login";
import AdminLayout from "./components/AdminLayout";
import DriverLayout from "./components/DriverLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import Drivers from "./pages/admin/Drivers";
import Vehicles from "./pages/admin/Vehicles";
import Trailers from "./pages/admin/Trailers";
import AdminShifts from "./pages/admin/Shifts";
import AdminJobs from "./pages/admin/Jobs";
import Clients from "./pages/admin/Clients";
import Products from "./pages/admin/Products";
import Suppliers from "./pages/admin/Suppliers";
import Invoices from "./pages/admin/Invoices";
import Documents from "./pages/admin/Documents";
import AdminFuel from "./pages/admin/Fuel";
import StaffExpenses from "./pages/admin/StaffExpenses";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import Debug from "./pages/admin/Debug";

// Driver Pages
import DriverHome from "./pages/driver/Home";
import DriverShifts from "./pages/driver/Shifts";
import DriverJobs from "./pages/driver/Jobs";
import Timesheet from "./pages/driver/Timesheet";
import DriverFuel from "./pages/driver/Fuel";
import Profile from "./pages/driver/Profile";

// Common Pages
import NotFound from "./pages/admin/NotFound";

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="trailers" element={<Trailers />} />
            <Route path="shifts" element={<AdminShifts />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="clients" element={<Clients />} />
            <Route path="products" element={<Products />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="documents" element={<Documents />} />
            <Route path="fuel" element={<AdminFuel />} />
            <Route path="staff-expenses" element={<StaffExpenses />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="debug" element={<Debug />} />
          </Route>

          {/* Driver Routes */}
          <Route
            path="/driver"
            element={
              <PrivateRoute requiredRole="driver">
                <DriverLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DriverHome />} />
            <Route path="shifts" element={<DriverShifts />} />
            <Route path="jobs" element={<DriverJobs />} />
            <Route path="timesheet" element={<Timesheet />} />
            <Route path="fuel" element={<DriverFuel />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;