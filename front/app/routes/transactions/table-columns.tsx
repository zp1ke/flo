import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/table/data-table-column-header';
import { cn, formatDateTime, formatMoney, moneyClassName } from '~/lib/utils';
import { type Transaction, transactionSchema } from '~/types/transaction';
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
    maxSize: 100,
    minSize: 50,
    size: 75,
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title={t('transactions.code')}
        className="hidden sm:flex"
      />
    ),
    cell: ({ row }) => <div className="truncate">{row.getValue('code')}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'datetime',
    accessorKey: 'datetime',
    maxSize: 500,
    minSize: 200,
    size: 250,
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
      return <div className="truncate font-medium">{formattedDatetime}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    maxSize: 200,
    minSize: 100,
    size: 100,
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
            'truncate font-medium text-right text-lg',
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
    minSize: 150,
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title={t('transactions.description')}
      />
    ),
    cell: ({ row }) => (
      <div className="truncate font-medium">{row.getValue('description')}</div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row, table }) => (
      <DataTableRowActions
        data={transactionSchema.parse(row.original)}
        table={table}
      />
    ),
  },
];
