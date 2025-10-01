import { Outlet, Link, useLocation } from "react-router-dom";
import { AppShell, Topbar } from "./ui/index";
import { Home, Calendar, Briefcase, Clock, Fuel, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const bottomNavLinks = [
  { path: "/driver", label: "Home", icon: <Home /> },
  { path: "/driver/shifts", label: "Shifts", icon: <Calendar /> },
  { path: "/driver/jobs", label: "Jobs", icon: <Briefcase /> },
  { path: "/driver/timesheet", label: "Timesheet", icon: <Clock /> },
  { path: "/driver/fuel", label: "Fuel", icon: <Fuel /> },
  { path: "/driver/profile", label: "Profile", icon: <User /> },
];

function DriverLayout() {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <AppShell className="flex flex-col min-h-screen">
      <Topbar title="Fleet Driver" showMenuButton={false}>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {user?.name || 'Driver'}</span>
          <button
            onClick={logout}
            className="btn btn-ghost btn-sm"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </Topbar>
      <main className="flex-1 overflow-auto bg-base-200 p-4 pb-20 lg:pb-4">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="btm-nav lg:hidden">
        {bottomNavLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={location.pathname === link.path ? "active" : ""}
          >
            <span className="h-5 w-5">{link.icon}</span>
            <span className="btm-nav-label">{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex justify-center p-4 bg-base-100 shadow-md">
        <ul className="menu menu-horizontal gap-2">
          {bottomNavLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={location.pathname === link.path ? "active" : ""}
              >
                <span className="h-5 w-5">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </AppShell>
  );
}

export default DriverLayout;