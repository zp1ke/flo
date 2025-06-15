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
import { type HTMLAttributes, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import type { PageFilters, ApiError } from '~/api/client';
import { FetchState } from '~/types/fetch-state';
import type { DataPage } from '~/types/page';
import { SortDirection, sortPrefix } from '~/types/sort';

import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';
import type { ListenerManager } from '~/types/listener';
import useUserStore from '~/store/user-store';

interface DataTableProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<TData, TValue>[];
  dataFetcher: (pageFilters: PageFilters) => Promise<DataPage<TData>>;
  facetedFilters?: DataTableSelectFilter[];
  textFilters?: DataTableFilter[];
  listenerManager?: ListenerManager<TData>;
  fetchErrorMessage?: string;
}

const pageKey = 'page';
const pageSizeKey = 'pageSize';

export function DataTable<TData, TValue>({
  columns,
  dataFetcher,
  facetedFilters,
  textFilters,
  listenerManager,
  fetchErrorMessage,
}: DataTableProps<TData, TValue>) {
  const profile = useUserStore((state) => state.profile);

  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const initialPagination = paginationFrom(searchParams);
  const pageSizes = Array.from(new Set([initialPagination.pageSize, 10, 20, 40, 50])).sort();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    filtersFrom(searchParams, columns)
  );
  const [data, setData] = useState<DataPage<TData>>({ data: [], total: 0 });
  const [fetchState, setFetchState] = useState(FetchState.Loading);
  const [pagination, setPagination] = useState<PaginationState>(initialPagination);
  const [sorting, setSorting] = useState<SortingState>(sortingFrom(searchParams, columns));
  const [rowSelection, setRowSelection] = useState({});

  listenerManager?.addListener('data-table', () => {
    setFetchState(FetchState.Loading);
  });

  useEffect(() => {
    if (fetchState === FetchState.Loading) {
      dataFetcher(pageFilters())
        .then((data) => {
          setData(data);
          updateUrlParams();
          setFetchState(FetchState.Success);
        })
        .catch((e) => {
          setData({ data: [], total: 0 });
          setFetchState(FetchState.Error);
          toast.error(fetchErrorMessage ?? t('table.fetchError'), {
            description: t((e as ApiError).message),
            closeButton: true,
          });
        });
    }
  }, [fetchState, profile]);

  const pageFilters = (): PageFilters => {
    const sort: Record<string, SortDirection> = {};
    sorting.forEach((columnSort) => {
      sort[columnSort.id] = columnSort.desc ? SortDirection.Desc : SortDirection.Asc;
    });
    const filters: Record<string, string> = {};
    columnFilters.forEach((columnFilter) => {
      if (columnFilter.value) {
        filters[columnFilter.id] = columnFilter.value.toString();
      }
    });

    return {
      page: pagination.pageIndex,
      size: pagination.pageSize,
      sort,
      filters,
    } satisfies PageFilters;
  };

  const updateUrlParams = () => {
    const params: Record<string, string> = {
      page: String(pagination.pageIndex + 1),
      pageSize: String(pagination.pageSize),
    };
    sorting.forEach((columnSort) => {
      params[sortPrefix + columnSort.id] = columnSort.desc ? SortDirection.Desc : SortDirection.Asc;
    });
    columnFilters.forEach((columnFilter) => {
      if (columnFilter.value) {
        params[columnFilter.id] = columnFilter.value.toString();
      }
    });

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
    manualSorting: true,
    manualFiltering: true,
    meta: {
      fetchState,
      isLoading: () => fetchState === FetchState.Loading,
      onRefresh: () => {
        setFetchState(FetchState.Loading);
      },
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (state) => {
      setPagination(state);
      setFetchState(FetchState.Loading);
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: (state) => {
      setSorting(state);
      setFetchState(FetchState.Loading);
    },
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
        facetedFilters={facetedFilters}
        fetchState={fetchState}
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
                  {fetchState === FetchState.Loading ? (
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
      <DataTablePagination
        disabled={fetchState === FetchState.Loading}
        pageSizes={pageSizes}
        table={table}
      />
    </div>
  );
}

const paginationFrom = (searchParams: URLSearchParams): PaginationState => {
  const pageIndex = searchParams.get(pageKey) ? Number(searchParams.get(pageKey)) - 1 : 0;
  const pageSize = searchParams.get(pageSizeKey) ? Number(searchParams.get(pageSizeKey)) : 10;
  return { pageIndex, pageSize };
};

const sortingFrom = (
  searchParams: URLSearchParams,
  columns: ColumnDef<any, any>[]
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

const filtersFrom = (
  searchParams: URLSearchParams,
  columns: ColumnDef<any, any>[]
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
