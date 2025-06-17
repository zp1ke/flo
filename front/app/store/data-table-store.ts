import type { PageFilters } from '~/api/client';
import type { DataPage } from '~/types/page';

export interface DataTableStore<T> {
  page: DataPage<T>;
  loading: boolean;
  errorMessage?: string;

  fetchData: (pageFilters: PageFilters) => Promise<void>;
}
