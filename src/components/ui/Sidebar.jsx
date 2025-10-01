import { Link, useLocation } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function Sidebar({
  isOpen,
  onClose,
  links = [],
  title = "Fleet Management",
  logo,
  collapsible = false,
  defaultCollapsed = false
}) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path) => {
    if (path === '/admin' || path === '/driver') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-full ${sidebarWidth} transform bg-base-200 border-r border-base-300 transition-all duration-300 lg:static lg:z-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-base-300">
            <div className="flex items-center gap-3">
              {logo && <div className="w-8 h-8 flex-shrink-0">{logo}</div>}
              {!isCollapsed && (
                <span className="text-lg font-semibold text-base-content truncate">
                  {title}
                </span>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-square lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Desktop collapse button */}
            {collapsible && (
              <button
                onClick={handleToggleCollapse}
                className="btn btn-ghost btn-sm btn-square hidden lg:flex"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className={`menu menu-vertical gap-1 ${isCollapsed ? 'menu-compact' : ''}`}>
              {links.map((link) => {
                const active = isActive(link.path);

                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`tooltip tooltip-right flex items-center gap-3 ${
                        active ? "active bg-primary text-primary-content" : ""
                      } ${isCollapsed ? 'justify-center px-2' : ''}`}
                      data-tip={isCollapsed ? link.label : ''}
                      onClick={onClose}
                    >
                      {link.icon && (
                        <span className="h-5 w-5 flex-shrink-0">
                          {link.icon}
                        </span>
                      )}
                      {!isCollapsed && (
                        <span className="truncate">{link.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-base-300">
              <div className="text-xs text-base-content/60 text-center">
                Fleet Management System
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}