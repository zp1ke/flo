import type { Row, Table } from '@tanstack/react-table';
import { Loader2, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import useAuth from '~/contexts/auth/use-auth';
import { deleteProfile } from '~/lib/profiles';

import { profileSchema } from '../../types/profile';
import { EditProfileForm } from './edit-profile-form';
import { cn } from '~/lib/utils';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

export function DataTableRowActions<TData>({ row, table }: DataTableRowActionsProps<TData>) {
  const { activateProfile, refreshUser, user } = useAuth();
  const { t } = useTranslation();

  const profile = profileSchema.parse(row.original);
  const disabled = table.options?.meta?.isLoading();

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    table.options.meta?.onRefresh();
  }, [user]);

  const onSavedProfile = async () => {
    setEditOpen(false);
    setEditing(false);
  };

  const onDelete = async () => {
    setDeleting(true);

    await deleteProfile(profile);
    await refreshUser();

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
            {t('profiles.edit')}
          </DropdownMenuItem>
          {user?.activeProfile?.code !== profile.code && (
            <DropdownMenuItem disabled={disabled} onClick={() => activateProfile(profile)}>
              {t('profiles.defaultProfile')}
            </DropdownMenuItem>
          )}
          {user?.activeProfile?.code !== profile.code && <DropdownMenuSeparator />}
          {user?.activeProfile?.code !== profile.code && (
            <DropdownMenuItem
              disabled={disabled}
              className="text-destructive"
              onClick={() => setDeleteOpen(true)}>
              {t('profiles.delete')}
            </DropdownMenuItem>
          )}
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
          <DialogTitle>{t(editOpen ? 'profiles.edit' : 'profiles.confirmDelete')}</DialogTitle>
          <DialogDescription>
            {t(editOpen ? 'profiles.editDescription' : 'profiles.confirmDeleteMessage', {
              name: profile.name,
            })}
          </DialogDescription>
        </DialogHeader>
        {editOpen && (
          <EditProfileForm
            profile={profile}
            onSaved={onSavedProfile}
            onProcessing={setEditing}
            onCancel={() => setEditOpen(false)}
          />
        )}
        {deleteOpen && (
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={deleting}>
                {t('profiles.cancel')}
              </Button>
            </DialogClose>
            <Button
              className="ml-auto flex"
              variant="destructive"
              disabled={deleting}
              onClick={onDelete}>
              {deleting && <Loader2 className="animate-spin" />}
              {deleting && t('profiles.deleting')}
              {!deleting && t('profiles.confirm')}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
