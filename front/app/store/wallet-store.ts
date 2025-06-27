import { create } from 'zustand';
import type { ApiError } from '~/api/client';
import { fetchWallets } from '~/api/wallets';
import { mapWallets } from '~/routes/wallets/data-mapper';
import type { DataPage } from '~/types/page';
import type { Wallet } from '~/types/wallet';
import type { DataItem, DataTableStore } from './data-table-store';
import useUserStore from './user-store';

const useWalletStore = create<DataTableStore<Wallet>>()((set, get) => ({
  page: { data: [], total: 0 } as DataPage<DataItem<Wallet>>,
  loading: false,
  fetchData: async (pageFilters) => {
    set({ loading: true });

    const profile = useUserStore.getState().profile;
    try {
      const page = await fetchWallets(profile?.code ?? '', pageFilters);
      const items = mapWallets(page.data);
      set({ page: { data: items, total: page.total }, loading: false });
    } catch (error) {
      console.error('Failed to fetch wallets:', error);
      const prevPage = get().page;
      set({
        page: { data: [], total: prevPage.total },
        loading: false,
        errorMessage: (error as ApiError).message,
      });
    }
  },
}));

export default useWalletStore;
