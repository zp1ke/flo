import type { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // biome-ignore lint/correctness/noUnusedVariables: TData is used for type constraint
  interface TableMeta<TData extends RowData> {
    loading: () => boolean;
    fetch: () => void;
  }
}
