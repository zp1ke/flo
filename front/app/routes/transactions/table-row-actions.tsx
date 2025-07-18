import { Loader2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteTransaction } from '~/api/transactions';
import type { DataTableRowActionsProps } from '~/components/table/data-table';
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
import useUserStore from '~/store/user-store';
import type { Transaction } from '~/types/transaction';
import { EditTransactionForm } from './edit-transaction-form';

export function DataTableRowActions({
  data,
  table,
}: DataTableRowActionsProps<Transaction>) {
  const profile = useUserStore((state) => state.profile);

  const { t } = useTranslation();

  const loading = () => table.options?.meta?.loading() ?? false;

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const onDoneTransaction = async (canceled: boolean) => {
    if (!canceled) {
      table.options.meta?.fetch();
    }

    setEditOpen(false);
    setEditing(false);
  };

  const onDelete = async () => {
    setDeleting(true);

    await deleteTransaction(profile?.code ?? '-', data);
    table.options.meta?.fetch();

    setDeleteOpen(false);
    setDeleting(false);
  };

  return (
    <Dialog
      open={editOpen || deleteOpen}
      onOpenChange={(open) => {
        setEditOpen(open);
        setDeleteOpen(open);
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={loading()}>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
            <span className="sr-only">{t('table.openMenu')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            disabled={loading()}
            onClick={() => setEditOpen(true)}
          >
            {t('transactions.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={loading()}
            className="text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            {t('transactions.delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent
        className={cn(
          'sm:max-w-[425px]',
          (editing || deleting) && '[&>button]:hidden',
        )}
        onInteractOutside={(e) => {
          if (editing || deleting) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {t(editOpen ? 'transactions.edit' : 'transactions.confirmDelete')}
          </DialogTitle>
          <DialogDescription>
            {t(
              editOpen
                ? 'transactions.editDescription'
                : 'transactions.confirmDeleteMessage',
              {
                name: data.description || data.code || '-',
              },
            )}
          </DialogDescription>
        </DialogHeader>
        {editOpen && (
          <EditTransactionForm
            transaction={data}
            onDone={onDoneTransaction}
            onProcessing={setEditing}
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
              variant="destructive"
              disabled={deleting}
              onClick={onDelete}
            >
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
