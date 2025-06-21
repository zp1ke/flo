import {
  type ColumnDef,
  type ColumnSort,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { type HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { PageFilters } from '~/api/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import type { DataTableStore } from '~/store/data-table-store';
import useUserStore from '~/store/user-store';
import { SortDirection, sortPrefix } from '~/types/sort';
import AddItemButton, { type EditItemForm } from './add-item-button';
import type {
  DataTableCustomFilter,
  DataTableFilter,
  DataTableSelectFilter,
} from './data-filter';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

interface DataTableProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<TData, TValue>[];
  dataStore: UseBoundStore<StoreApi<DataTableStore<TData>>>;
  customFilters?: DataTableCustomFilter[];
  facetedFilters?: DataTableSelectFilter[];
  textFilters?: DataTableFilter[];
  editForm: typeof EditItemForm;
  addTitle: string;
  addDescription: string;
}

const pageKey = 'page';
const pageSizeKey = 'pageSize';

export const DataTable = <TData, TValue>({
  columns,
  dataStore,
  customFilters,
  facetedFilters,
  textFilters,
  editForm,
  addTitle,
  addDescription,
}: DataTableProps<TData, TValue>) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState<Record<string, string>>(
    parseUrlFilters(searchParams),
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>(
    paginationFrom(searchParams),
  );
  const [sorting, setSorting] = useState<SortingState>(
    sortingFrom(searchParams, columns),
  );
  const [rowSelection, setRowSelection] = useState({});

  const profile = useUserStore((state) => state.profile);
  const page = dataStore((state) => state.page);
  const loading = dataStore((state) => state.loading);
  const fetchData = dataStore((state) => state.fetchData);

  const updateUrlParams = useCallback(() => {
    const params = paramsOf(pagination, sorting, filters);

    const url = new URL(location.pathname, window.location.origin);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    history.pushState({}, '', url);
  }, [location.pathname, pagination, sorting, filters]);

  const fetch = useCallback(() => {
    updateUrlParams();
    fetchData(pageFiltersOf(pagination, sorting, filters));
  }, [sorting, filters, pagination, fetchData, updateUrlParams]);

  useEffect(() => {
    if (profile) {
      fetch();
    }
  }, [profile, fetch]);

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
      filters: filters,
      setFilters: (newFilters: Record<string, string>) => {
        setFilters(newFilters);
        fetch();
      },
    },
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
      columnVisibility,
      pagination,
      rowSelection,
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <AddItemButton
          title={addTitle}
          description={addDescription}
          form={editForm}
          table={table}
        />
      </div>
      <DataTableToolbar
        customFilters={customFilters}
        facetedFilters={facetedFilters}
        table={table}
        textFilters={textFilters}
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
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t('table.loading')}</span>
                    </div>
                  ) : (
                    <span>
                      {t(filters.length ? 'table.noResults' : 'table.noData')}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        disabled={loading}
        pageSizes={Array.from(
          new Set([pagination.pageSize, 10, 20, 40, 50]),
        ).sort()}
        table={table}
      />
    </div>
  );
};

const paginationFrom = (searchParams: URLSearchParams): PaginationState => {
  const pageIndex = searchParams.get(pageKey)
    ? Number(searchParams.get(pageKey)) - 1
    : 0;
  const pageSize = searchParams.get(pageSizeKey)
    ? Number(searchParams.get(pageSizeKey))
    : 10;
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

const parseUrlFilters = (
  searchParams: URLSearchParams,
): Record<string, string> => {
  const filters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (!key.startsWith(sortPrefix) && key !== pageKey && key !== pageSizeKey) {
      filters[key] = value.trim();
    }
  });
  return filters;
};

const paramsOf = (
  pagination: PaginationState,
  sorting: SortingState,
  filters: Record<string, string>,
): Record<string, string> => {
  const params: Record<string, string> = {
    page: String(pagination.pageIndex + 1),
    pageSize: String(pagination.pageSize),
  };
  for (const columnSort of sorting) {
    params[sortPrefix + columnSort.id] = columnSort.desc
      ? SortDirection.Desc
      : SortDirection.Asc;
  }
  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      params[key] = value.toString();
    }
  }

  return params;
};

const pageFiltersOf = (
  pagination: PaginationState,
  sorting: SortingState,
  filters: Record<string, string>,
): PageFilters => {
  const sort: Record<string, SortDirection> = {};
  for (const columnSort of sorting) {
    sort[columnSort.id] = columnSort.desc
      ? SortDirection.Desc
      : SortDirection.Asc;
  }

  return {
    page: pagination.pageIndex,
    size: pagination.pageSize,
    sort,
    filters,
  } satisfies PageFilters;
};
