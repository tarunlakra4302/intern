import { Menu, Moon, Sun, Search, Bell, User, Settings } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState } from "react";

export function Topbar({
  onMenuClick,
  title = "Fleet Management",
  showMenuButton = true,
  showSearch = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  notifications = 0,
  userName = "Admin User",
  userRole = "Administrator",
  onNotificationClick,
  onProfileClick,
  onSettingsClick
}) {
  const { theme, toggleTheme, themes, setTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setShowUserMenu(false);
  };

  return (
    <header className="navbar bg-base-100 shadow-md border-b border-base-300 sticky top-0 z-30">
      <div className="flex-1">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="btn btn-ghost btn-square lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <span className="text-xl font-semibold text-base-content ml-2 lg:ml-0">
          {title}
        </span>
      </div>

      {/* Search Bar (optional) */}
      {showSearch && (
        <div className="flex-none hidden sm:flex mx-4">
          <div className="form-control">
            <div className="input-group">
              <span className="bg-base-200">
                <Search className="h-4 w-4 text-base-content/60" />
              </span>
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="input input-bordered w-64"
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex-none gap-2">
        {/* Notifications */}
        <div className="dropdown dropdown-end">
          <button
            className="btn btn-ghost btn-square"
            onClick={onNotificationClick}
            aria-label={`Notifications ${notifications > 0 ? `(${notifications})` : ''}`}
          >
            <div className="indicator">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="badge badge-xs badge-primary indicator-item">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-square"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>

        {/* User Menu */}
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
          </label>
          {showUserMenu && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 border border-base-300"
            >
              <li className="menu-title">
                <span>
                  <div className="font-semibold">{userName}</div>
                  <div className="text-xs text-base-content/60">{userRole}</div>
                </span>
              </li>
              <li>
                <button onClick={onProfileClick} className="justify-between">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </span>
                </button>
              </li>
              <li>
                <button onClick={onSettingsClick} className="justify-between">
                  <span className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </span>
                </button>
              </li>
              <li className="menu-title">
                <span>Theme</span>
              </li>
              {themes?.map((themeName) => (
                <li key={themeName}>
                  <button
                    onClick={() => handleThemeChange(themeName)}
                    className={`justify-between ${theme === themeName ? 'active' : ''}`}
                  >
                    <span className="capitalize">{themeName}</span>
                    {theme === themeName && <span className="text-primary">✓</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}