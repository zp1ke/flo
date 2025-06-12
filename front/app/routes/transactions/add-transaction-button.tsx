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
import { EditTransactionForm } from './edit-transaction-form';
import type { Transaction } from '~/types/transaction';

export default function AddTransactionButton({
  onAdded,
}: {
  onAdded: (transaction: Transaction) => void;
}) {
  const { t } = useTranslation();

  const [addOpen, setAddOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const onAddedTransaction = async (transaction: Transaction) => {
    setAddOpen(false);
    onAdded(transaction);
  };

  return (
    <Dialog open={addOpen} onOpenChange={setAddOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="h-4 w-4" />
          {t('transactions.add')}
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
          <DialogTitle>{t('transactions.add')}</DialogTitle>
          <DialogDescription>{t('transactions.editDescription')}</DialogDescription>
        </DialogHeader>
        <EditTransactionForm
          onSaved={onAddedTransaction}
          onProcessing={setProcessing}
          onCancel={() => setAddOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
