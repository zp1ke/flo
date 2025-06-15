import type { Row, Table } from '@tanstack/react-table';
import { Loader2, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteTransaction } from '~/api/transactions';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import { cn } from '~/lib/utils';
import { transactionSchema } from '~/types/transaction';
import { EditTransactionForm } from './edit-transaction-form';
import useUserStore from '~/store/user-store';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

export function DataTableRowActions<TData>({ row, table }: DataTableRowActionsProps<TData>) {
  const profile = useUserStore((state) => state.profile);

  const { t } = useTranslation();

  const transaction = transactionSchema.parse(row.original);
  const disabled = table.options?.meta?.isLoading();

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    table.options.meta?.onRefresh();
  }, [profile]);

  const onSavedWallet = async () => {
    table.options.meta?.onRefresh();

    setEditOpen(false);
    setEditing(false);
  };

  const onDelete = async () => {
    setDeleting(true);

    await deleteTransaction(profile?.code ?? '-', transaction);
    table.options.meta?.onRefresh();

    setDeleteOpen(false);
    setDeleting(false);
  };

  return (
    <Dialog
      open={editOpen || deleteOpen}
      onOpenChange={(open) => {
        setEditOpen(open);
        setDeleteOpen(open);
      }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreHorizontal />
            <span className="sr-only">{t('table.openMenu')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem disabled={disabled} onClick={() => setEditOpen(true)}>
            {t('transactions.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={disabled}
            className="text-destructive"
            onClick={() => setDeleteOpen(true)}>
            {t('transactions.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent
        className={cn('sm:max-w-[425px]', (editing || deleting) && '[&>button]:hidden')}
        onInteractOutside={(e) => {
          if (editing || deleting) {
            e.preventDefault();
          }
        }}>
        <DialogHeader>
          <DialogTitle>
            {t(editOpen ? 'transactions.edit' : 'transactions.confirmDelete')}
          </DialogTitle>
          <DialogDescription>
            {t(editOpen ? 'transactions.editDescription' : 'transactions.confirmDeleteMessage', {
              name: transaction.description || transaction.code || '-',
            })}
          </DialogDescription>
        </DialogHeader>
        {editOpen && (
          <EditTransactionForm
            transaction={transaction}
            onSaved={onSavedWallet}
            onProcessing={setEditing}
            onCancel={() => setEditOpen(false)}
          />
        )}
        {deleteOpen && (
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={deleting}>
                {t('transactions.cancel')}
              </Button>
            </DialogClose>
            <Button
              className="ml-auto flex"
              variant="destructive"
              disabled={deleting}
              onClick={onDelete}>
              {deleting && <Loader2 className="animate-spin" />}
              {deleting && t('transactions.deleting')}
              {!deleting && t('transactions.confirm')}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
