import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/table/data-table-column-header';

import { DataTableRowActions } from './table-row-actions';
import type { Transaction } from '~/types/transaction';

export const tableColumns = ({ t }: { t: (key: string) => string }): ColumnDef<Transaction>[] => [
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
    id: 'datetime',
    accessorKey: 'datetime',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title={t('transactions.datetime')} />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px] truncate font-medium">{row.getValue('datetime')}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title={t('transactions.amount')} />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px] truncate font-medium">{row.getValue('amount')}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  },
];
