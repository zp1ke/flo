import type { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // biome-ignore lint/correctness/noUnusedVariables: TData is used for type constraint
  interface TableMeta<TData extends RowData> {
    loading: () => boolean;
    fetch: () => void;
    filters: Record<string, string>;
    setFilters: (filters: Record<string, string>) => void;
  }
}
