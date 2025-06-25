import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/table/data-table-column-header';
import { cn, formatDateTime, formatMoney, moneyClassName } from '~/lib/utils';
import type { Transaction } from '~/types/transaction';
import { DataTableRowActions } from './table-row-actions';

export const tableColumns = ({
  t,
  language,
}: {
  t: (key: string) => string;
  language: string;
}): ColumnDef<Transaction>[] => [
  {
    id: 'code',
    accessorKey: 'code',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title={t('transactions.code')}
        className="hidden sm:flex"
      />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('code')}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'datetime',
    accessorKey: 'datetime',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title={t('transactions.datetime')}
      />
    ),
    cell: ({ row }) => {
      const formattedDatetime = formatDateTime(
        row.getValue('datetime'),
        language,
      );
      return (
        <div className="max-w-[500px] truncate font-medium">
          {formattedDatetime}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title={t('transactions.amount')}
      />
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'));
      const formattedAmount = formatMoney(amount, language);
      return (
        <div
          className={cn(
            'max-w-[500px] truncate font-medium',
            moneyClassName(amount),
          )}
        >
          {formattedAmount}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title={t('transactions.description')}
      />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px] truncate font-medium">
        {row.getValue('description')}
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  },
];
