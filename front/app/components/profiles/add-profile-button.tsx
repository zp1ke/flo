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
import { cn } from '~/lib/utils';

import { EditProfileForm } from './edit-profile-form';

export default function AddProfileButton() {
  const { t } = useTranslation();

  const [addOpen, setAddOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const onAddedProfile = async () => {
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
        <EditProfileForm onSaved={onAddedProfile} onProcessing={setProcessing} />
      </DialogContent>
    </Dialog>
  );
}
