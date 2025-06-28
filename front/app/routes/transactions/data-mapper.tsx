import type { Table } from '@tanstack/react-table';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { cn, formatDateTime, formatMoney, moneyClassName } from '~/lib/utils';
import type { DataItem } from '~/store/data-table-store';
import type { Transaction } from '~/types/transaction';
import { DataTableRowActions } from './table-row-actions';

export const mapTransactions = (
  transactions: Transaction[],
): DataItem<Transaction>[] => {
  return transactions.map((transaction) => ({
    // biome-ignore lint/style/noNonNullAssertion: transaction id is guaranteed to exist from API
    id: transaction.code!,
    item: transaction,
    render: (table: Table<Transaction>, language?: string) => {
      const isIncome = transaction.amount >= 0;
      const colorClassName = moneyClassName(transaction.amount);

      return (
        <Card className="@container/card gap-2" key={transaction.code}>
          <CardHeader className="relative">
            <CardDescription>
              {formatDateTime(transaction.datetime, language)}
            </CardDescription>
            <CardTitle className="@[250px]/card:text-2xl text-xl font-semibold tabular-nums flex justify-start items-center gap-2">
              {isIncome || (
                <TrendingDownIcon className={cn('h-8 w-8', colorClassName)} />
              )}
              {isIncome && (
                <TrendingUpIcon className={cn('h-8 w-8', colorClassName)} />
              )}
              {transaction.description || transaction.code || '-'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className={cn('text-xl font-semibold', colorClassName)}>
              {formatMoney(transaction.amount, language)}
            </div>
            <DataTableRowActions data={transaction} table={table} />
          </CardContent>
        </Card>
      );
    },
  }));
};
