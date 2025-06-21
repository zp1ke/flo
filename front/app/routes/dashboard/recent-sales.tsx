import { BadgeDollarSignIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDateTime, formatMoney } from '~/lib/utils';
import type { Transaction } from '~/types/transaction';

interface RecentSalesProps {
  data: Transaction[];
}

export function RecentSales({ data }: RecentSalesProps) {
  const { i18n } = useTranslation();

  return (
    <div className="space-y-8">
      {data.map((transaction) => (
        <div className="flex items-center" key={transaction.code}>
          <BadgeDollarSignIcon className="h-8 w-8" />
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.description ?? transaction.code}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(transaction.datetime, i18n.language)}
            </p>
          </div>
          {/* TODO: colors depending on amount */}
          <div className="ml-auto font-medium">
            {formatMoney(transaction.amount, i18n.language)}
          </div>
        </div>
      ))}
    </div>
  );
}
