import { Loader2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteWallet } from '~/api/wallets';
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
import type { Wallet } from '~/types/wallet';
import { EditWalletForm } from './edit-wallet-form';

export function DataTableRowActions({
  data,
  table,
}: DataTableRowActionsProps<Wallet>) {
  const profile = useUserStore((state) => state.profile);

  const { t } = useTranslation();

  const loading = () => table.options?.meta?.loading() ?? false;

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const onDoneWallet = async (canceled: boolean) => {
    if (!canceled) {
      table.options.meta?.fetch();
    }

    setEditOpen(false);
    setEditing(false);
  };

  const onDelete = async () => {
    setDeleting(true);

    await deleteWallet(profile?.code ?? '-', data);
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
            {t('wallets.edit')}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={loading()}
            className="text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            {t('wallets.delete')}
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
            {t(editOpen ? 'wallets.edit' : 'wallets.confirmDelete')}
          </DialogTitle>
          <DialogDescription>
            {t(
              editOpen
                ? 'wallets.editDescription'
                : 'wallets.confirmDeleteMessage',
              {
                name: data.name,
              },
            )}
          </DialogDescription>
        </DialogHeader>
        {editOpen && (
          <EditWalletForm
            wallet={data}
            onDone={onDoneWallet}
            onProcessing={setEditing}
          />
        )}
        {deleteOpen && (
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={deleting}>
                {t('wallets.cancel')}
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={onDelete}
            >
              {deleting && <Loader2 className="animate-spin" />}
              {deleting && t('wallets.deleting')}
              {!deleting && t('wallets.confirm')}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
