import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/table/data-table-column-header';
import { Checkbox } from '~/components/ui/checkbox';

import type { Profile } from '../../types/profile';
import { DataTableRowActions } from './table-row-actions';

export const columns: ColumnDef<Profile>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        disabled={table.options?.meta?.loading}
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row, table }) => (
      <Checkbox
        disabled={table.options?.meta?.loading}
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'code',
    accessorKey: 'code',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Code" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('code')}</div>,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column, table }) => (
      <DataTableColumnHeader column={column} table={table} title="Name" />
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
