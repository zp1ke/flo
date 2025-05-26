import type { ColumnFilter, Table } from '@tanstack/react-table';
import { Loader2, RefreshCwIcon, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import useDebounce from '~/hooks/use-debounce';
import { FetchState } from '~/types/fetch-state';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableViewOptions<TData> {
  addElement?: React.ReactNode;
  facetedFilters?: DataTableSelectFilter[];
  fetchState?: FetchState;
  table: Table<TData>;
  textFilters?: DataTableFilter[];
}

export function DataTableToolbar<TData>({
  addElement,
  facetedFilters,
  fetchState,
  table,
  textFilters,
}: DataTableViewOptions<TData>) {
  const { t } = useTranslation();

  const [filters, setFilters] = useState<Record<string, string>>(
    parseFilters(table.getState().columnFilters)
  );
  const debouncedFilters = useDebounce<Record<string, string>>(filters, 1000);

  useEffect(() => {
    for (const [column, value] of Object.entries(debouncedFilters)) {
      table.getColumn(column)?.setFilterValue(value ? value.trim() : undefined);
    }
    table.options?.meta?.onRefresh?.();
  }, [debouncedFilters]);

  return (
    <>
      {addElement && <div className="flex items-center">{addElement}</div>}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            disabled={fetchState === FetchState.Loading}
            onClick={() => table.options.meta?.onRefresh()}>
            {fetchState === FetchState.Loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {fetchState !== FetchState.Loading && <RefreshCwIcon className="h-4 w-4" />}
          </Button>
          {textFilters?.map((filter) => (
            <Input
              key={filter.column}
              disabled={fetchState === FetchState.Loading}
              type="search"
              placeholder={`${t('table.filter')} ${filter.title}...`}
              value={filters[filter.column] ?? ''}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, [filter.column]: event.target.value }))
              }
              className="w-[150px] lg:w-[250px]"
            />
          ))}
          {facetedFilters?.map((filter) => (
            <DataTableFacetedFilter
              key={filter.column}
              column={table.getColumn(filter.column)}
              disabled={fetchState === FetchState.Loading}
              title={filter.title}
              options={filter.options}
            />
          ))}
          {Object.entries(debouncedFilters).length > 0 && (
            <Button
              variant="outline"
              disabled={fetchState === FetchState.Loading}
              onClick={() => {
                table.resetColumnFilters();
                table.options?.meta?.onRefresh?.();
              }}>
              {t('table.reset')}
              <X />
            </Button>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
    </>
  );
}

const parseFilters = (filters: ColumnFilter[]): Record<string, string> => {
  return filters.reduce(
    (acc, filter) => {
      if (filter.id && filter.value) {
        acc[filter.id] = String(filter.value).trim();
      }
      return acc;
    },
    {} as Record<string, string>
  );
};
