import type { Table } from '@tanstack/react-table';
import { Loader2, X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

export function DataTableToolbar<TData>({
  facetedFilters,
  loading = false,
  table,
  textFilters,
}: {
  facetedFilters?: { title: string; column: string; options: { label: string; value: string }[] }[];
  loading?: boolean;
  table: Table<TData>;
  textFilters?: { title: string; column: string }[];
}) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {textFilters?.map((filter) => (
          <Input
            key={filter.column}
            disabled={loading}
            type="search"
            placeholder={`Filter ${filter.title}...`}
            value={(table.getColumn(filter.column)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(filter.column)?.setFilterValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        ))}
        {facetedFilters?.map((filter) => (
          <DataTableFacetedFilter
            key={filter.column}
            column={table.getColumn(filter.column)}
            disabled={loading}
            title={filter.title}
            options={filter.options}
          />
        ))}
        {isFiltered && (
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3">
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
