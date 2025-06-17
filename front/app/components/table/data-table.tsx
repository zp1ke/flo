import {
  type ColumnDef,
  type ColumnFilter,
  type ColumnFiltersState,
  type ColumnSort,
  type PaginationState,
  type SortingState,
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
import { type HTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router';
import type { PageFilters } from '~/api/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { SortDirection, sortPrefix } from '~/types/sort';

import type { StoreApi, UseBoundStore } from 'zustand';
import type { DataTableStore } from '~/store/data-table-store';
import AddItemButton, { type EditItemForm } from './add-item-button';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

interface DataTableProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<TData, TValue>[];
  dataStore: UseBoundStore<StoreApi<DataTableStore<TData>>>;
  facetedFilters?: DataTableSelectFilter[];
  textFilters?: DataTableFilter[];
  editForm: typeof EditItemForm<TData>;
  addTitle: string;
  addDescription: string;
}

const pageKey = 'page';
const pageSizeKey = 'pageSize';

export function DataTable<TData, TValue>({
  columns,
  dataStore,
  facetedFilters,
  textFilters,
  editForm,
  addTitle,
  addDescription,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const initialPagination = paginationFrom(searchParams);
  const pageSizes = Array.from(new Set([initialPagination.pageSize, 10, 20, 40, 50])).sort();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    filtersFrom(searchParams, columns),
  );
  const [pagination, setPagination] = useState<PaginationState>(initialPagination);
  const [sorting, setSorting] = useState<SortingState>(sortingFrom(searchParams, columns));
  const [rowSelection, setRowSelection] = useState({});

  const page = dataStore((state) => state.page);
  const loading = dataStore((state) => state.loading);
  const fetchData = dataStore((state) => state.fetchData);

  const fetch = () => {
    const sort: Record<string, SortDirection> = {};
    for (const columnSort of sorting) {
      sort[columnSort.id] = columnSort.desc ? SortDirection.Desc : SortDirection.Asc;
    }
    const filters: Record<string, string> = {};
    for (const columnFilter of columnFilters) {
      if (columnFilter.value) {
        filters[columnFilter.id] = columnFilter.value.toString();
      }
    }

    const pageFilters = {
      page: pagination.pageIndex,
      size: pagination.pageSize,
      sort,
      filters,
    } satisfies PageFilters;

    fetchData(pageFilters);
    updateUrlParams();
  };

  const updateUrlParams = () => {
    const params: Record<string, string> = {
      page: String(pagination.pageIndex + 1),
      pageSize: String(pagination.pageSize),
    };
    for (const columnSort of sorting) {
      params[sortPrefix + columnSort.id] = columnSort.desc ? SortDirection.Desc : SortDirection.Asc;
    }
    for (const columnFilter of columnFilters) {
      if (columnFilter.value) {
        params[columnFilter.id] = columnFilter.value.toString();
      }
    }

    const url = new URL(location.pathname, window.location.origin);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    history.pushState({}, '', url);
  };

  const table = useReactTable({
    data: page.data,
    columns: columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    meta: {
      loading: () => loading,
      fetch: fetch,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (state) => {
      setPagination(state);
      fetch();
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: (state) => {
      setSorting(state);
      fetch();
    },
    rowCount: page.total,
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
      <div className="flex items-center">
        <AddItemButton title={addTitle} description={addDescription} form={editForm} />
      </div>
      <DataTableToolbar facetedFilters={facetedFilters} table={table} textFilters={textFilters} />
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
                      <span>{t('table.loading')}</span>
                    </div>
                  ) : (
                    <span>{t(columnFilters.length ? 'table.noResults' : 'table.noData')}</span>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination disabled={loading} pageSizes={pageSizes} table={table} />
    </div>
  );
}

const paginationFrom = (searchParams: URLSearchParams): PaginationState => {
  const pageIndex = searchParams.get(pageKey) ? Number(searchParams.get(pageKey)) - 1 : 0;
  const pageSize = searchParams.get(pageSizeKey) ? Number(searchParams.get(pageSizeKey)) : 10;
  return { pageIndex, pageSize };
};

const sortingFrom = <TData, TValue>(
  searchParams: URLSearchParams,
  columns: ColumnDef<TData, TValue>[],
): SortingState => {
  const sorting: SortingState = [];
  searchParams.forEach((value, key) => {
    if (!key.startsWith(sortPrefix)) {
      return;
    }
    const theKey = key.substring(sortPrefix.length);
    if (
      (value === SortDirection.Asc || value === SortDirection.Desc) &&
      columns.some((column) => column.id === theKey)
    ) {
      sorting.push({
        id: theKey,
        desc: value === SortDirection.Desc,
      } satisfies ColumnSort);
    }
  });
  return sorting;
};

const filtersFrom = <TData, TValue>(
  searchParams: URLSearchParams,
  columns: ColumnDef<TData, TValue>[],
): ColumnFiltersState => {
  const filters: ColumnFilter[] = [];
  searchParams.forEach((value, key) => {
    if (
      !key.startsWith(sortPrefix) &&
      key !== pageKey &&
      key !== pageSizeKey &&
      columns.some((column) => column.id === key)
    ) {
      filters.push({
        id: key,
        value,
      } satisfies ColumnFilter);
    }
  });
  return filters;
};
