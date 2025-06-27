import { create } from 'zustand';
import { fetchCategories } from '~/api/categories';
import type { ApiError } from '~/api/client';
import { mapCategories } from '~/routes/categories/data-mapper';
import type { Category } from '~/types/category';
import type { DataPage } from '~/types/page';
import type { DataItem, DataTableStore } from './data-table-store';
import useUserStore from './user-store';

const useCategoryStore = create<DataTableStore<Category>>()((set, get) => ({
  page: { data: [], total: 0 } as DataPage<DataItem<Category>>,
  loading: false,
  fetchData: async (pageFilters) => {
    set({ loading: true });

    const profile = useUserStore.getState().profile;
    try {
      const page = await fetchCategories(profile?.code ?? '', pageFilters);
      const items = mapCategories(page.data);
      set({ page: { data: items, total: page.total }, loading: false });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      const prevPage = get().page;
      set({
        page: { data: [], total: prevPage.total },
        loading: false,
        errorMessage: (error as ApiError).message,
      });
    }
  },
}));

export default useCategoryStore;
