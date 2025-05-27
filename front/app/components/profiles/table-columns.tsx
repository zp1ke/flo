import type { ColumnDef } from '@tanstack/react-table';
import { CheckCircleIcon, CircleIcon } from 'lucide-react';
import { DataTableColumnHeader } from '~/components/table/data-table-column-header';
import { Checkbox } from '~/components/ui/checkbox';
import type { User } from '~/types/user';

import type { Profile } from '../../types/profile';
import { DataTableRowActions } from './table-row-actions';

export const tableColumns = ({
  user,
  t,
}: {
  user: User | null;
  t: (key: string) => string;
}): ColumnDef<Profile>[] => [
  {
    id: 'active',
    header: () => <></>,
    cell: ({ row }) => (
      <>
        {user?.activeProfile?.code === row.getValue('code') && <CheckCircleIcon />}
        {user?.activeProfile?.code !== row.getValue('code') && <CircleIcon />}
      </>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title={t('profiles.code')} />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('code')}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title={t('profiles.name')} />
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
