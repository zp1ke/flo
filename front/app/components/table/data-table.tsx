import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type Updater,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { type HTMLAttributes, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

export type DataPage<TData> = {
  data: TData[];
  total: number;
};

interface DataTableProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<TData, TValue>[];
  dataFetcher: (pagination: PaginationState) => Promise<DataPage<TData>>;
  facetedFilters?: DataTableSelectFilter[];
  textFilters?: DataTableFilter[];
}

export function DataTable<TData, TValue>({
  columns,
  dataFetcher,
  facetedFilters,
  textFilters,
}: DataTableProps<TData, TValue>) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const pageIndex = searchParams.get('page') ? Number(searchParams.get('page')) - 1 : 0;
  const pageSize = searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10;

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [data, setData] = useState<DataPage<TData>>({ data: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex,
    pageSize,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    dataFetcher(pagination).then((data) => {
      setData(data);
      setLoading(false);
    });
  }, [loading]);

  const onPaginationChange = (state: Updater<PaginationState>) => {
    const stateIsFunction = typeof state === 'function';
    const pageIndex = stateIsFunction ? state(pagination).pageIndex : state.pageIndex;
    const pageSize = stateIsFunction ? state(pagination).pageSize : state.pageSize;
    addToUrl({ page: String(pageIndex + 1), pageSize: String(pageSize) });

    setPagination(state);
    setLoading(true);
  };

  const addToUrl = (params: Record<string, string>) => {
    const url = new URL(location.pathname, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    history.pushState({}, '', url);
  };

  const table = useReactTable({
    data: data.data,
    columns: columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    rowCount: data.total,
    state: {
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        loading={loading}
        table={table}
        textFilters={textFilters}
        facetedFilters={facetedFilters}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <span>No results.</span>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination disabled={loading} table={table} />
    </div>
  );
}
