import type { DataItem } from '~/store/data-table-store';
import type { Wallet } from '~/types/wallet';

export const mapWallets = (wallets: Wallet[]): DataItem<Wallet>[] => {
  return wallets.map((wallet) => ({
    // biome-ignore lint/style/noNonNullAssertion: wallet id is guaranteed to exist from API
    id: wallet.code!,
    item: wallet,
    render: () => <span>{wallet.name}</span>,
  }));
};
