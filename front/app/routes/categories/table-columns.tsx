import type { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/table/data-table-column-header';

import { type Category, categorySchema } from '~/types/category';
import { DataTableRowActions } from './table-row-actions';

export const tableColumns = ({
  t,
}: {
  t: (key: string) => string;
}): ColumnDef<Category>[] => [
  {
    id: 'code',
    accessorKey: 'code',
    header: ({ column, table }) => (
      <DataTableColumnHeader
        column={column}
        table={table}
        title={t('categories.code')}
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
        title={t('categories.name')}
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
    id: 'actions',
    cell: ({ row, table }) => (
      <DataTableRowActions
        data={categorySchema.parse(row.original)}
        table={table}
      />
    ),
  },
];
