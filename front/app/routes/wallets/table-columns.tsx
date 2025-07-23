import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/table/data-table-column-header';
import { cn, formatMoney, moneyClassName } from '~/lib/utils';
import { type Wallet, walletSchema } from '~/types/wallet';
import { DataTableRowActions } from './table-row-actions';

export const tableColumns = ({
  t,
  language,
}: {
  t: (key: string) => string;
  language: string;
}): ColumnDef<Wallet>[] => [
  {
    id: 'code',
    accessorKey: 'code',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title={t('wallets.code')}
      />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('code')}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title={t('wallets.name')}
      />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px] truncate font-medium">
        {row.getValue('name')}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'balance',
    accessorKey: 'balance',
    maxSize: 200,
    minSize: 100,
    size: 100,
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title={t('wallets.balance')}
      />
    ),
    cell: ({ row }) => {
      const visible = row.getValue('balanceVisible');
      const amount = Number.parseFloat(row.getValue('balance'));
      if (!visible || Number.isNaN(amount)) {
        return <div className="truncate font-medium text-right text-lg">-</div>;
      }

      const formattedAmount = formatMoney(amount, language);
      return (
        <div
          className={cn(
            'truncate font-medium text-right text-lg',
            moneyClassName(amount),
          )}
        >
          {formattedAmount}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row, table }) => (
      <DataTableRowActions
        data={walletSchema.parse(row.original)}
        table={table}
      />
    ),
  },
];
