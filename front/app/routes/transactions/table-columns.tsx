import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/table/data-table-column-header';

import { DataTableRowActions } from './table-row-actions';
import type { Transaction } from '~/types/transaction';

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
      <DataTableColumnHeader column={column} table={table} title={t('transactions.code')} />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('code')}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'datetime',
    accessorKey: 'datetime',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title={t('transactions.datetime')} />
    ),
    cell: ({ row }) => {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      };
      const datetime = new Date(row.getValue('datetime'));
      const formattedDatetime = datetime.toLocaleDateString(language, options);
      return <div className="max-w-[500px] truncate font-medium">{formattedDatetime}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title={t('transactions.amount')} />
    ),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'));
      const formattedAmount = new Intl.NumberFormat(language, {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
      return <div className="max-w-[500px] truncate font-medium">{formattedAmount}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title={t('transactions.description')} />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px] truncate font-medium">{row.getValue('description')}</div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  },
];
