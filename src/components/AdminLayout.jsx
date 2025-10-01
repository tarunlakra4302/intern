import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppShell, Sidebar, Topbar } from "./ui/index";
import {
  LayoutDashboard,
  Users,
  Truck,
  Package,
  Calendar,
  Briefcase,
  Building2,
  ShoppingCart,
  Factory,
  FileText,
  File,
  Fuel,
  Receipt,
  BarChart3,
  Settings,
  Shield,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const sidebarLinks = [
  { path: "/admin", label: "Dashboard", icon: <LayoutDashboard /> },
  { path: "/admin/drivers", label: "Drivers", icon: <Users /> },
  { path: "/admin/vehicles", label: "Vehicles", icon: <Truck /> },
  { path: "/admin/trailers", label: "Trailers", icon: <Package /> },
  { path: "/admin/shifts", label: "Shifts", icon: <Calendar /> },
  { path: "/admin/jobs", label: "Jobs", icon: <Briefcase /> },
  { path: "/admin/clients", label: "Clients", icon: <Building2 /> },
  { path: "/admin/products", label: "Products", icon: <ShoppingCart /> },
  { path: "/admin/suppliers", label: "Suppliers", icon: <Factory /> },
  { path: "/admin/invoices", label: "Invoices", icon: <FileText /> },
  { path: "/admin/documents", label: "Documents", icon: <File /> },
  { path: "/admin/fuel", label: "Fuel", icon: <Fuel /> },
  { path: "/admin/staff-expenses", label: "Staff Expenses", icon: <Receipt /> },
  { path: "/admin/reports", label: "Reports", icon: <BarChart3 /> },
  { path: "/admin/settings", label: "Settings", icon: <Settings /> },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();

  return (
    <AppShell>
      <div className="flex h-screen bg-base-100">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          links={sidebarLinks}
          title="Admin Portal"
          logo={<Shield className="w-8 h-8 text-primary" />}
          collapsible={true}
          defaultCollapsed={false}
        />
        <div className="flex flex-1 flex-col min-w-0">
          <Topbar
            title="Fleet Management Admin"
            onMenuClick={() => setSidebarOpen(true)}
            showMenuButton={true}
            showSearch={false}
            notifications={3}
            userName={user?.name || 'Admin User'}
            userRole="Administrator"
            onNotificationClick={() => console.log('Notifications clicked')}
            onProfileClick={() => console.log('Profile clicked')}
            onSettingsClick={() => console.log('Settings clicked')}
          />
          <main className="flex-1 overflow-auto bg-base-100 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AppShell>
  );
}

export default AdminLayout;