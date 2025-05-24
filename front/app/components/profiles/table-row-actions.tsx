import type { Row, Table } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import { profileSchema } from '../../types/profile';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

export function DataTableRowActions<TData>({ row, table }: DataTableRowActionsProps<TData>) {
  const profile = profileSchema.parse(row.original);
  const disabled = table.options?.meta?.loading;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem disabled={disabled}>Edit</DropdownMenuItem>
        <DropdownMenuItem disabled={disabled}>Make a copy</DropdownMenuItem>
        <DropdownMenuItem disabled={disabled}>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={disabled}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
