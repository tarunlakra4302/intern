import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const DataTable = ({
  columns,
  data,
  sortable = true,
  onSort,
  className = "",
  emptyMessage = "No data available"
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const handleSort = (key) => {
    if (!sortable) return;

    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }

    setSortConfig({ key, direction });

    if (onSort) {
      onSort(key, direction);
    }
  };

  const getSortIcon = (key) => {
    if (!sortable || sortConfig.key !== key) {
      return <div className="w-4 h-4" />;
    }

    if (sortConfig.direction === 'asc') {
      return <ChevronUp className="w-4 h-4" />;
    } else if (sortConfig.direction === 'desc') {
      return <ChevronDown className="w-4 h-4" />;
    }

    return <div className="w-4 h-4" />;
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-base-content/60">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="table table-zebra w-full">
        <thead>
          <tr className="border-base-300">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${sortable && column.sortable !== false ? 'cursor-pointer hover:bg-base-200' : ''} bg-base-100`}
                onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-base-content">
                    {column.header}
                  </span>
                  {sortable && column.sortable !== false && getSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index} className="hover:bg-base-200/50">
              {columns.map((column) => (
                <td key={`${row.id || index}-${column.key}`} className="py-3">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;