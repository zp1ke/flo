import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import type { DataItem } from '~/store/data-table-store';
import type { Wallet } from '~/types/wallet';

export const mapWallets = (wallets: Wallet[]): DataItem<Wallet>[] => {
  return wallets.map((wallet) => ({
    // biome-ignore lint/style/noNonNullAssertion: wallet id is guaranteed to exist from API
    id: wallet.code!,
    item: wallet,
    render: () => (
      <Card className="@container/card" key={wallet.code}>
        <CardHeader className="relative">
          <CardDescription>{wallet.code}</CardDescription>
          <CardTitle className="@[250px]/card:text-2xl text-xl font-semibold tabular-nums flex justify-start items-center">
            {wallet.name}
          </CardTitle>
        </CardHeader>
        <CardFooter className="gap-2 flex justify-end items-center">
          <span>ACTIONS TODO</span>
        </CardFooter>
      </Card>
    ),
  }));
};
