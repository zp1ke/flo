import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn, formatDateTime, formatMoney, moneyClassName } from '~/lib/utils';
import type { Transaction } from '~/types/transaction';

interface TransactionsListProps {
  data: Transaction[];
}

export function TransactionsList({ data }: TransactionsListProps) {
  const { i18n } = useTranslation();

  if (data.length === 0) {
    return (
      <div className="text-center text-lg text-muted-foreground h-full flex items-center justify-center">
        {i18n.t('transactions.noTransactions')}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {data.map((transaction) => {
        const isIncome = transaction.amount >= 0;
        const colorClassName = moneyClassName(transaction.amount);

        return (
          <div className="flex items-center" key={transaction.code}>
            {isIncome || (
              <TrendingDownIcon className={cn('h-8 w-8', colorClassName)} />
            )}
            {isIncome && (
              <TrendingUpIcon className={cn('h-8 w-8', colorClassName)} />
            )}
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {transaction.description ?? transaction.code}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(transaction.datetime, i18n.language)}
              </p>
            </div>
            <div
              className={cn('ml-auto font-medium self-start', colorClassName)}
            >
              {formatMoney(transaction.amount, i18n.language)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
