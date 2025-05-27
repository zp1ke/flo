import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import useAuth from '~/contexts/auth/use-auth';
import { cn } from '~/lib/utils';
import type { Profile } from '~/types/profile';

import { EditProfileForm } from './edit-profile-form';

interface AddProfileButtonProps {
  onAdded: (profile: Profile) => void;
}

export default function AddProfileButton({ onAdded }: AddProfileButtonProps) {
  const { t } = useTranslation();
  const { activateProfile } = useAuth();

  const [addOpen, setAddOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const onAddProfile = (profile: Profile, setAsDefault: boolean) => {
    if (setAsDefault) {
      activateProfile(profile);
    }
    onAdded(profile);
    setAddOpen(false);
  };

  return (
    <Dialog open={addOpen} onOpenChange={setAddOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
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
        }}>
        <DialogHeader>
          <DialogTitle>{t('profiles.add')}</DialogTitle>
          <DialogDescription>{t('profiles.editDescription')}</DialogDescription>
        </DialogHeader>
        <EditProfileForm onSaved={onAddProfile} onProcessing={setProcessing} />
      </DialogContent>
    </Dialog>
  );
}
