import type { Table } from '@tanstack/react-table';
import { Loader2, RefreshCwIcon, SearchIcon, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import type {
  DataTableCustomFilter,
  DataTableCustomFilterRenderProps,
  DataTableFilter,
  DataTableSelectFilter,
} from './data-filter';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableProps<TData> {
  customFilters?: DataTableCustomFilter[];
  facetedFilters?: DataTableSelectFilter[];
  table: Table<TData>;
  textFilters?: DataTableFilter[];
}

export function DataTableToolbar<TData>({
  customFilters,
  facetedFilters,
  table,
  textFilters,
}: DataTableProps<TData>) {
  const { t } = useTranslation();

  const [filters, setFilters] = useState<Record<string, string>>(
    Object.entries(table.options?.meta?.filters ?? {}).reduce(
      (acc, [key, value]) => {
        if (value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  const setFilter = (key: string, value: string) => {
    const newFilters = { ...filters };
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    setFilters(newFilters);
  };

  const loading = (): boolean => table.options?.meta?.loading?.() ?? false;

  const fetch = () => {
    table.options?.meta?.fetch?.();
  };

  const reset = () => {
    setFilters({});
    search({});
  };

  const search = (values: Record<string, string>) => {
    table.options?.meta?.setFilters?.(values);
  };

  return (
    <div className="flex justify-between flex-col sm:flex-row">
      <div className="flex flex-1 space-x-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
        {textFilters?.map((filter) => (
          <Input
            key={filter.column}
            disabled={loading()}
            type="search"
            placeholder={`${t('table.filter')} ${filter.title}...`}
            value={filters[filter.column] ?? ''}
            onChange={(event) => setFilter(filter.column, event.target.value)}
            className="w-[150px] lg:w-[250px]"
          />
        ))}
        {customFilters?.map((filter) => {
          const props: DataTableCustomFilterRenderProps = {
            value: filters[filter.column],
            disabled: loading(),
            onChange: (value) => setFilter(filter.column, value),
          };
          return filter.render(props);
        })}
        {facetedFilters?.map((filter) => (
          <DataTableFacetedFilter
            key={filter.column}
            column={table.getColumn(filter.column)}
            disabled={loading()}
            title={filter.title}
            options={filter.options}
          />
        ))}
        {Object.entries(filters).length > 0 && (
          <Button variant="outline" disabled={loading()} onClick={reset}>
            {t('table.reset')}
            <X />
          </Button>
        )}
        {(textFilters?.length ||
          facetedFilters?.length ||
          customFilters?.length) && (
          <Button
            variant="outline"
            size="icon"
            disabled={loading()}
            onClick={() => search(filters)}
          >
            {loading() && <Loader2 className="h-4 w-4 animate-spin" />}
            {!loading() && <SearchIcon className="h-4 w-4" />}
          </Button>
        )}
      </div>
      <div className="flex items-center justify-end gap-1 mt-2 sm:mt-0">
        <DataTableViewOptions table={table} />
        <Button
          variant="outline"
          size="icon"
          disabled={loading()}
          onClick={fetch}
        >
          {loading() && <Loader2 className="h-4 w-4 animate-spin" />}
          {!loading() && <RefreshCwIcon />}
        </Button>
      </div>
    </div>
  );
}
