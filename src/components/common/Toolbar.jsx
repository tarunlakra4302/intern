import { Search, Filter, Plus } from 'lucide-react';

const Toolbar = ({
  title,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  onAddClick,
  addButtonText = "Add New",
  showAddButton = true,
  children,
  className = ""
}) => {
  return (
    <div className={`bg-base-100 p-4 border-b border-base-300 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          {title && (
            <h2 className="text-xl font-semibold text-base-content mb-2 sm:mb-0">
              {title}
            </h2>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/60 w-4 h-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue || ''}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="input input-bordered pl-10 w-full sm:w-64"
            />
          </div>

          {/* Additional Toolbar Content */}
          {children}

          {/* Add Button */}
          {showAddButton && onAddClick && (
            <button
              onClick={onAddClick}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              {addButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ToolbarFilter = ({ label, value, options, onChange, placeholder = "All" }) => {
  return (
    <div className="form-control">
      {label && (
        <label className="label">
          <span className="label-text text-sm font-medium">{label}</span>
        </label>
      )}
      <select
        className="select select-bordered select-sm"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const ToolbarDateRange = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={startDate || ''}
        onChange={(e) => onStartDateChange?.(e.target.value)}
        className="input input-bordered input-sm"
      />
      <span className="text-base-content/60">to</span>
      <input
        type="date"
        value={endDate || ''}
        onChange={(e) => onEndDateChange?.(e.target.value)}
        className="input input-bordered input-sm"
      />
    </div>
  );
};

Toolbar.Filter = ToolbarFilter;
Toolbar.DateRange = ToolbarDateRange;

export default Toolbar;