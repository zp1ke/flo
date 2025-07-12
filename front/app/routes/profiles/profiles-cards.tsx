import {
  Edit2Icon,
  Loader2,
  TrashIcon,
  UserRoundCheckIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { ApiError } from '~/api/client';
import { deleteProfile } from '~/api/profiles';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip';
import { cn } from '~/lib/utils';
import useUserStore from '~/store/user-store';
import type { Profile } from '~/types/profile';
import { EditProfileForm } from './edit-profile-form';

export const ProfilesCards = () => {
  const { t } = useTranslation();

  const loading = useUserStore((state) => state.loading);
  const activeProfile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);
  const profiles = useUserStore((state) => state.profiles);
  const loadProfiles = useUserStore((state) => state.loadProfiles);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const refreshProfiles = async () => {
    setProcessing(true);

    try {
      await loadProfiles(true);
    } catch (error) {
      toast.error(t('profiles.fetchError'), {
        description: t((error as ApiError).message),
        closeButton: true,
      });
    } finally {
      setProcessing(false);
    }
  };

  const onDelete = async (profile: Profile) => {
    setProcessing(true);

    await deleteProfile(profile);
    await refreshProfiles();

    setDeleteOpen(false);
    setProcessing(false);
  };

  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card @container/card">
      {profiles.map((profile) => {
        const isActive = activeProfile?.code === profile.code;

        const editButton = (
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={loading || processing}
                  onClick={() => {
                    setEditOpen(true);
                  }}
                >
                  <Edit2Icon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('profiles.edit')}</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent
              className={cn(
                'sm:max-w-[425px]',
                processing && '[&>button]:hidden',
              )}
              onInteractOutside={(e) => {
                if (processing) {
                  e.preventDefault();
                }
              }}
            >
              <DialogHeader>
                <DialogTitle>{t('profiles.edit')}</DialogTitle>
                <DialogDescription>
                  {t('profiles.editDescription')}
                </DialogDescription>
              </DialogHeader>
              <EditProfileForm
                profile={profile}
                onDone={(canceled: boolean) => {
                  if (!canceled) {
                    refreshProfiles().then();
                  }
                  setEditOpen(false);
                }}
                onProcessing={setProcessing}
              />
            </DialogContent>
          </Dialog>
        );

        const deleteButton = (
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  disabled={loading || processing}
                  onClick={() => {
                    setDeleteOpen(true);
                  }}
                >
                  <TrashIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('profiles.delete')}</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent
              className={cn(
                'sm:max-w-[425px]',
                processing && '[&>button]:hidden',
              )}
              onInteractOutside={(e) => {
                if (processing) {
                  e.preventDefault();
                }
              }}
            >
              <DialogHeader>
                <DialogTitle>{t('profiles.confirmDelete')}</DialogTitle>
                <DialogDescription>
                  {t('profiles.confirmDeleteMessage', { name: profile.name })}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={processing}
                  >
                    {t('profiles.cancel')}
                  </Button>
                </DialogClose>
                <Button
                  className="ml-auto flex"
                  variant="destructive"
                  disabled={processing}
                  onClick={() => onDelete(profile)}
                >
                  {processing && <Loader2 className="animate-spin" />}
                  {processing && t('profiles.deleting')}
                  {!processing && t('profiles.confirm')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );

        return (
          <Card className="@container/card" key={profile.code}>
            <CardHeader className="relative">
              <CardDescription>{profile.code}</CardDescription>
              <CardTitle className="@[250px]/card:text-2xl text-xl font-semibold tabular-nums flex justify-start items-center">
                {profile.name}
              </CardTitle>
              {isActive && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="absolute right-4 top-0">
                      <UserRoundCheckIcon />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('profiles.thisIsActive')}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </CardHeader>
            <CardFooter className="gap-2 flex justify-end items-center">
              {isActive || (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={loading || processing}
                      onClick={() => setProfile(profile)}
                    >
                      <UserRoundCheckIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('profiles.setActive')}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {editButton}
              {isActive || deleteButton}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
