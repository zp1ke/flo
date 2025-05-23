import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  tableToolbar,
  textFilters,
  facetedFilters,
}: {
  tableToolbar: DataTableToolbarProps<TData>;
  textFilters?: { title: string; column: string }[];
  facetedFilters?: { title: string; column: string; options: { label: string; value: string }[] }[];
}) {
  const { table } = tableToolbar;
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {textFilters?.map((filter) => (
          <Input
            key={filter.column}
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
            title={filter.title}
            options={filter.options}
          />
        ))}
        {isFiltered && (
          <Button
            variant="ghost"
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
