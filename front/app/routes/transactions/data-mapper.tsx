import type { DataItem } from '~/store/data-table-store';
import type { Transaction } from '~/types/transaction';

export const mapTransactions = (
  transactions: Transaction[],
): DataItem<Transaction>[] => {
  return transactions.map((transaction) => ({
    // biome-ignore lint/style/noNonNullAssertion: transaction id is guaranteed to exist from API
    id: transaction.code!,
    item: transaction,
    render: () => <span>{transaction.description}</span>,
  }));
};
