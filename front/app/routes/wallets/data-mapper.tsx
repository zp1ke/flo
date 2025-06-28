import type { Table } from '@tanstack/react-table';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { DataTableRowActions } from '~/routes/wallets/table-row-actions';
import type { DataItem } from '~/store/data-table-store';
import type { Wallet } from '~/types/wallet';

export const mapWallets = (wallets: Wallet[]): DataItem<Wallet>[] => {
  return wallets.map((wallet) => ({
    // biome-ignore lint/style/noNonNullAssertion: wallet id is guaranteed to exist from API
    id: wallet.code!,
    item: wallet,
    render: (table: Table<Wallet>) => (
      <Card className="@container/card" key={wallet.code}>
        <CardHeader className="relative">
          <CardDescription>{wallet.code}</CardDescription>
          <CardTitle className="@[250px]/card:text-2xl text-xl font-semibold tabular-nums flex justify-start items-center">
            {wallet.name}
          </CardTitle>
        </CardHeader>
        <CardFooter className="gap-2 flex justify-end items-center">
          <DataTableRowActions data={wallet} table={table} />
        </CardFooter>
      </Card>
    ),
  }));
};
