import type { RowData } from '@tanstack/react-table';
import type { FetchState } from '~/types/fetch-state';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    fetchState: FetchState;
    isLoading: () => boolean;
    onRefresh: () => void;
  }
}
