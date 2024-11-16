import React from 'react';
import PropTypes from 'prop-types';
import { ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';

const DataTable = ({
  data,
  columns,
  sortConfig,
  onSort,
  emptyStateProps = {
    icon: AlertCircle,
    title: 'No data found',
    description: 'No records to display',
  },
  rowKeyField = 'id',
}) => {
  const SortIcon = ({ column }) => {
    if (!column.sortable || sortConfig?.key !== column.key) return null;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const handleSort = (column) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  if (!data.length) {
    const { icon: Icon, title, description } = emptyStateProps;
    return (
      <div className="card bg-base-100 shadow">
        <div className="card-body items-center text-center py-8">
          <Icon className="w-12 h-12 text-base-content/50 mb-2" />
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-base-content/70">{description}</p>
        </div>
      </div>
    );
  }

  // Desktop view
  const DesktopTable = () => (
    <div className="rounded-lg border bg-base-100 hidden md:block">
      <table className="table table-zebra w-full">
        <thead className="bg-base-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column)}
                className={
                  column.sortable
                    ? 'cursor-pointer hover:bg-base-300 transition-colors duration-200'
                    : ''
                }
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  <SortIcon column={column} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row[rowKeyField]} className="hover">
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Mobile view
  const MobileView = () => (
    <div className="md:hidden">
      <div className="divide-y divide-base-200">
        {data.map((row) => (
          <div key={row[rowKeyField]} className="bg-base-100 py-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                {columns.map((column, index) => {
                  if (column.hideOnMobile) return null;
                  if (column.key === 'actions') return null;

                  // Primary field (first column) gets special styling
                  if (index === 0) {
                    return (
                      <div key={column.key} className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {column.render ? column.render(row) : row[column.key]}
                        </span>
                        {columns.find((col) => col.mobileSecondary)?.render?.(row)}
                      </div>
                    );
                  }

                  // Skip secondary field as it's already rendered
                  if (column.mobileSecondary) return null;

                  return (
                    <div
                      key={column.key}
                      className={`mt-0.5 text-sm text-base-content/70 ${
                        column.mobileTruncate ? 'truncate' : ''
                      }`}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </div>
                  );
                })}
              </div>
              {/* Render actions column separately */}
              {columns.find((col) => col.key === 'actions') && (
                <div className="flex items-center gap-1 pl-2">
                  {columns.find((col) => col.key === 'actions').render(row)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <DesktopTable />
      <MobileView />
    </div>
  );
};

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      className: PropTypes.string,
      render: PropTypes.func,
      hideOnMobile: PropTypes.bool,
      mobileSecondary: PropTypes.bool,
      mobileTruncate: PropTypes.bool,
    })
  ).isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc']),
  }),
  onSort: PropTypes.func,
  emptyStateProps: PropTypes.shape({
    icon: PropTypes.elementType,
    title: PropTypes.string,
    description: PropTypes.string,
  }),
  rowKeyField: PropTypes.string,
};

export default DataTable;