import type { Table } from '@tanstack/react-table';
import { CheckIcon, Loader2, RefreshCwIcon, TriangleAlertIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { FetchState } from '~/types/fetch-state';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableViewOptions<TData> {
  facetedFilters?: DataTableSelectFilter[];
  fetchState?: FetchState;
  table: Table<TData>;
  textFilters?: DataTableFilter[];
}

export function DataTableToolbar<TData>({
  facetedFilters,
  fetchState,
  table,
  textFilters,
}: DataTableViewOptions<TData>) {
  const { t } = useTranslation();

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Button
          variant="ghost"
          className="mr-2 p-0"
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
            value={(table.getColumn(filter.column)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(filter.column)?.setFilterValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
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
        {isFiltered && (
          <Button
            variant="ghost"
            disabled={fetchState === FetchState.Loading}
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3">
            {t('table.reset')}
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
