import type { ColumnFilter, Table } from '@tanstack/react-table';
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
    table.options?.meta?.filters ?? {},
  );

  const loading = (): boolean => table.options?.meta?.loading?.() ?? false;

  const fetch = () => {
    table.options?.meta?.fetch?.();
  };

  const reset = () => {
    setFilters({});
    search();
  };

  const search = () => {
    table.options?.meta?.setFilters?.(filters);
    setTimeout(fetch, 100);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-1">
        {textFilters?.map((filter) => (
          <Input
            key={filter.column}
            disabled={loading()}
            type="search"
            placeholder={`${t('table.filter')} ${filter.title}...`}
            value={filters[filter.column] ?? ''}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                [filter.column]: event.target.value,
              }))
            }
            className="w-[150px] lg:w-[250px]"
          />
        ))}
        {customFilters?.map((filter) => {
          const props: DataTableCustomFilterRenderProps = {
            value: filters[filter.column],
            disabled: loading(),
            onChange: (value) => {
              setFilters((prev) => ({
                ...prev,
                [filter.column]: value,
              }));
            },
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
        {Object.keys(filters).length > 0 && (
          <Button variant="outline" disabled={loading()} onClick={reset}>
            {t('table.reset')}
            <X />
          </Button>
        )}
        {(textFilters?.length || facetedFilters?.length) && (
          <Button
            variant="outline"
            size="icon"
            disabled={loading()}
            onClick={search}
          >
            {loading() && <Loader2 className="h-4 w-4 animate-spin" />}
            {!loading() && <SearchIcon className="h-4 w-4" />}
          </Button>
        )}
      </div>
      <div className="flex items-center justify-end gap-1">
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
