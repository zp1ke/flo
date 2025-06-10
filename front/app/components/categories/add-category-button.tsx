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
import { EditCategoryForm } from './edit-category-form';

export default function AddCategoryButton() {
  const { t } = useTranslation();

  const [addOpen, setAddOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const onAddedCategory = async () => {
    setAddOpen(false);
  };

  return (
    <Dialog open={addOpen} onOpenChange={setAddOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="h-4 w-4" />
          {t('categories.add')}
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
          <DialogTitle>{t('categories.add')}</DialogTitle>
          <DialogDescription>{t('categories.editDescription')}</DialogDescription>
        </DialogHeader>
        <EditCategoryForm
          onSaved={onAddedCategory}
          onProcessing={setProcessing}
          onCancel={() => setAddOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
