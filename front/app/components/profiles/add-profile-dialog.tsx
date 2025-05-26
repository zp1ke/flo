import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { cn } from '~/lib/utils';
import { type Profile } from '~/types/profile';

import { EditProfileForm } from '../form/edit-profile-form';

export function AddProfileDialog({
  onSaved,
  children,
}: {
  onSaved: (profile: Profile, setDefault: boolean) => void;
  children?: React.ReactNode;
}) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
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
        <EditProfileForm onSaved={onSaved} onProcessing={setProcessing} />
      </DialogContent>
    </Dialog>
  );
}
