import { create } from 'zustand';
import { fetchCategories } from '~/api/categories';
import type { ApiError } from '~/api/client';
import type { Category } from '~/types/category';
import type { DataPage } from '~/types/page';
import type { DataItem, DataTableStore } from './data-table-store';
import useUserStore from './user-store';

const mapCategories = (categories: Category[]): DataItem<Category>[] => {
  return categories.map((category) => ({
    // biome-ignore lint/style/noNonNullAssertion: category code is guaranteed to exist from API
    id: category.code!,
    item: category,
    render: () => <span>{category.name}</span>,
  }));
};

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
