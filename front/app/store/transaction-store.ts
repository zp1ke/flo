import { create } from 'zustand';
import type { ApiError } from '~/api/client';
import { fetchTransactions } from '~/api/transactions';
import type { DataPage } from '~/types/page';
import type { Transaction } from '~/types/transaction';
import type { DataTableStore } from './data-table-store';
import useUserStore from './user-store';

const useTransactionStore = create<DataTableStore<Transaction>>()(
  (set, get) => ({
    page: { data: [], total: 0 } as DataPage<Transaction>,
    loading: false,
    fetchData: async (pageFilters) => {
      set({ loading: true });

      const profile = useUserStore.getState().profile;
      try {
        const response = await fetchTransactions(
          profile?.code ?? '',
          pageFilters,
        );
        set({ page: response, loading: false });
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        const prevPage = get().page;
        set({
          page: { data: [], total: prevPage.total },
          loading: false,
          errorMessage: (error as ApiError).message,
        });
      }
    },
  }),
);

export default useTransactionStore;
