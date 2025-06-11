import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/ui/table/data-table-column-header';

import { DataTableRowActions } from './table-row-actions';
import type { Wallet } from '~/types/wallet';

export const tableColumns = ({ t }: { t: (key: string) => string }): ColumnDef<Wallet>[] => [
  {
    id: 'code',
    accessorKey: 'code',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title={t('wallets.code')} />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('code')}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title={t('wallets.name')} />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px] truncate font-medium">{row.getValue('name')}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  },
];
