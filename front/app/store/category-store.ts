import { create } from 'zustand';
import { fetchCategories } from '~/api/categories';
import type { ApiError } from '~/api/client';
import type { Category } from '~/types/category';
import type { DataPage } from '~/types/page';
import type { DataTableStore } from './data-table-store';
import useUserStore from './user-store';

const useCategoryStore = create<DataTableStore<Category>>()((set, get) => ({
  page: { data: [], total: 0 } as DataPage<Category>,
  loading: false,
  fetchData: async (pageFilters) => {
    set({ loading: true });

    const profile = useUserStore.getState().profile;
    try {
      const response = await fetchCategories(profile?.code ?? '', pageFilters);
      set({ page: response, loading: false });
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
