import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { ApiError } from '~/api/client';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { cn } from '~/lib/utils';
import useUserStore from '~/store/user-store';
import { EditProfileForm } from './edit-profile-form';

export default function AddProfileButton() {
  const { t } = useTranslation();

  const loading = useUserStore((state) => state.loading);
  const loadProfiles = useUserStore((state) => state.loadProfiles);

  const [addOpen, setAddOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const refreshProfiles = async () => {
    try {
      await loadProfiles(true);
    } catch (error) {
      toast.error(t('profiles.fetchError'), {
        description: t((error as ApiError).message),
        closeButton: true,
      });
    }
  };

  return (
    <Dialog open={addOpen} onOpenChange={setAddOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={loading || processing}>
          <PlusIcon className="h-4 w-4" />
          {t('profiles.add')}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn('sm:max-w-[425px]', processing && '[&>button]:hidden')}
        onInteractOutside={(e) => {
          if (processing) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{t('profiles.add')}</DialogTitle>
          <DialogDescription>{t('profiles.editDescription')}</DialogDescription>
        </DialogHeader>
        <EditProfileForm
          onProcessing={setProcessing}
          onDone={(canceled: boolean) => {
            if (!canceled) {
              refreshProfiles().then();
            }
            setAddOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
