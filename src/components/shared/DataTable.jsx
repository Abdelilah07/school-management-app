import React from 'react';
import PropTypes from 'prop-types';
import {
  ChevronUp,
  ChevronDown,
  AlertCircle as DefaultAlertCircle,
} from 'lucide-react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import Pagination from './Pagination';

const TanStackDataTable = ({
  data = [],
  columns: originalColumns,
  sortConfig,
  onSort,
  emptyStateProps = {
    icon: DefaultAlertCircle,
    title: 'No data found',
    description: 'No records to display',
  },
  rowKeyField = 'id',
  itemsPerPage = 9,
}) => {
  // TanStack Table's sorting state, derived from the sortConfig prop
  const [sorting, setSorting] = React.useState(
    sortConfig && sortConfig.key
      ? [{ id: sortConfig.key, desc: sortConfig.direction === 'desc' }]
      : []
  );

  // Effect to update TanStack's sorting state if the external sortConfig prop changes
  React.useEffect(() => {
    setSorting(
      sortConfig && sortConfig.key
        ? [{ id: sortConfig.key, desc: sortConfig.direction === 'desc' }]
        : []
    );
  }, [sortConfig]);

  const tableColumns = React.useMemo(
    () =>
      originalColumns.map((col) => ({
        id: col.key,
        accessorKey: col.key, // Assumes col.key is a direct accessor.
        // For complex data, use accessorFn: (row) => row[col.key] or more complex logic
        header: () => col.label,
        cell: (info) => {
          // info.getValue() gets the value from accessorKey
          // info.row.original is the full original row data object
          return col.render
            ? col.render(info.row.original)
            : info.getValue();
        },
        enableSorting: col.sortable !== false, // Default to true if sortable is not explicitly false
        meta: { // Pass along all original column properties for custom rendering needs
          ...col,
        },
      })),
    [originalColumns]
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting, // Controlled by the sortConfig prop via the local sorting state
    },
    initialState: {
      pagination: {
        pageIndex: 0, // TanStack Table is 0-indexed for pageIndex
        pageSize: itemsPerPage,
      },
    },
    manualSorting: true, // IMPORTANT: Parent component handles sorting and provides sorted data
    // onSortingChange is not used to call `onSort` here because of manualSorting.
    // Header click directly calls the `onSort` prop.
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // Processes sorting based on `state.sorting` (for display, data is pre-sorted)
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (originalRow) => originalRow[rowKeyField],
    autoResetPageIndex: true, // Resets to first page when data changes, default is true
    // debugTable: process.env.NODE_ENV === 'development', // Optional: for debugging
  });

  // Empty State
  if (!data || data.length === 0) {
    const { icon: IconComponent, title, description } = emptyStateProps;
    return (
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body items-center text-center py-8">
          <IconComponent className="w-12 h-12 text-base-content/50 mb-2" />
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-base-content/70">{description}</p>
        </div>
      </div>
    );
  }

  // Sort Icon Component
  const SortIconDisplay = ({ column }) => {
    const sortDirection = column.getIsSorted();
    if (!sortDirection) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  // Desktop Table View
  const DesktopTable = () => (
    <div className="bg-base-100 hidden md:block">
      <table className="table table-zebra w-full">
        <thead className="bg-base-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              <th className="w-16">#</th>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={
                    header.column.getCanSort() && onSort
                      ? () => onSort(header.column.id) // Call original onSort prop
                      : undefined
                  }
                  className={
                    header.column.getCanSort() && onSort
                      ? 'cursor-pointer hover:bg-base-300 transition-colors duration-200'
                      : ''
                  }
                // TanStack can also handle column sizing via columnDef.size if needed
                >
                  <div className="flex items-center gap-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    {header.column.getCanSort() && <SortIconDisplay column={header.column} />}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, rowIndex) => (
            <tr key={row.id} className="hover">
              <td>
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                  rowIndex +
                  1}
              </td>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={cell.column.columnDef.meta?.className}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Mobile View
  const MobileView = () => (
    <div className="md:hidden">
      <div className="divide-y divide-base-200">
        {table.getRowModel().rows.map((row) => { // `row` is a TanStack Row object
          let isFirstMobileColumnRendered = false;
          const primaryDisplayElements = [];
          const secondaryDisplayElements = [];
          let actionsDisplayContent = null;

          const actionsColConfig = originalColumns.find(c => c.key === 'actions');
          if (actionsColConfig) {
            const cell = row.getVisibleCells().find(c => c.column.id === actionsColConfig.key);
            if (cell) {
              actionsDisplayContent = flexRender(cell.column.columnDef.cell, cell.getContext());
            } else if (actionsColConfig.render) { // Fallback if actions column uses render but might not be "visible" in TanStack's default cell list
              actionsDisplayContent = actionsColConfig.render(row.original);
            }
          }

          originalColumns.forEach(oCol => {
            if (oCol.key === 'actions' || oCol.hideOnMobile) {
              return;
            }

            const cell = row.getVisibleCells().find(c => c.column.id === oCol.key);
            let cellRenderedContent;

            if (cell) {
              cellRenderedContent = flexRender(cell.column.columnDef.cell, cell.getContext());
            } else if (oCol.render) { // Fallback if column has render but not in visible cells (e.g. complex setup)
              cellRenderedContent = oCol.render(row.original);
            } else {
              cellRenderedContent = row.original[oCol.key];
            }

            if (cellRenderedContent === null || typeof cellRenderedContent === 'undefined') return;


            if (!isFirstMobileColumnRendered) {
              primaryDisplayElements.push(
                <span key={`${oCol.key}-main`} className="font-medium truncate">
                  {cellRenderedContent}
                </span>
              );
              const secondaryPairConfig = originalColumns.find(
                (sc) => sc.mobileSecondary && !sc.hideOnMobile && sc.key !== oCol.key
              );
              if (secondaryPairConfig) {
                const secondaryPairCell = row.getVisibleCells().find(c => c.column.id === secondaryPairConfig.key);
                let secondaryPairValue;
                if (secondaryPairCell) {
                  secondaryPairValue = flexRender(secondaryPairCell.column.columnDef.cell, secondaryPairCell.getContext());
                } else if (secondaryPairConfig.render) {
                  secondaryPairValue = secondaryPairConfig.render(row.original);
                } else {
                  secondaryPairValue = row.original[secondaryPairConfig.key];
                }
                if (secondaryPairValue) {
                  primaryDisplayElements.push(
                    <span key={`${secondaryPairConfig.key}-secondarypair`} className="ml-2 text-sm text-base-content/70 truncate">
                      {secondaryPairValue}
                    </span>
                  );
                }
              }
              isFirstMobileColumnRendered = true;
            } else if (!oCol.mobileSecondary) {
              secondaryDisplayElements.push(
                <div
                  key={oCol.key}
                  className={`mt-0.5 text-sm text-base-content/70 ${oCol.mobileTruncate ? 'truncate' : ''}`}
                >
                  <span className="font-semibold">{oCol.label}: </span>
                  {cellRenderedContent}
                </div>
              );
            }
          });

          return (
            <div key={row.id} className="bg-base-100 py-3 px-2">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  {primaryDisplayElements.length > 0 && (
                    <div className="flex items-baseline gap-2 mb-1">
                      {primaryDisplayElements}
                    </div>
                  )}
                  {secondaryDisplayElements}
                </div>
                {actionsDisplayContent && (
                  <div className="flex items-center gap-1 pl-2 shrink-0">
                    {actionsDisplayContent}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full">
      <DesktopTable />
      <MobileView />
      {table.getPageCount() > 1 && (
        <Pagination
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          setCurrentPage={(page) => table.setPageIndex(page - 1)} // TanStack is 0-indexed
          // For enhanced pagination, you can also pass these:
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
          onPrevious={() => table.previousPage()}
          onNext={() => table.nextPage()}
        // totalItems={data.length} // If your component needs it
        // itemsPerPage={table.getState().pagination.pageSize} // If your component needs it
        />
      )}
    </div>
  );
};

TanStackDataTable.propTypes = {
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
  onSort: PropTypes.func, // (key: string) => void; Parent updates sortConfig
  emptyStateProps: PropTypes.shape({
    icon: PropTypes.elementType,
    title: PropTypes.string,
    description: PropTypes.string,
  }),
  rowKeyField: PropTypes.string,
  itemsPerPage: PropTypes.number,
};

export default TanStackDataTable;