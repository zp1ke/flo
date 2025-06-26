import type { PageFilters } from '~/api/client';
import type { DataPage } from '~/types/page';

export type DataItem<T> = {
  id: string;
  item: T;
  render: () => React.ReactNode;
};

export interface DataTableStore<T> {
  page: DataPage<DataItem<T>>;
  loading: boolean;
  errorMessage?: string;

  fetchData: (pageFilters: PageFilters) => Promise<void>;
}
