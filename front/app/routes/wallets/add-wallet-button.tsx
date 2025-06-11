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
import { EditWalletForm } from './edit-wallet-form';
import type { Wallet } from '~/types/wallet';

export default function AddWalletButton({ onAdded }: { onAdded: (wallet: Wallet) => void }) {
  const { t } = useTranslation();

  const [addOpen, setAddOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const onAddedWallet = async (wallet: Wallet) => {
    setAddOpen(false);
    onAdded(wallet);
  };

  return (
    <Dialog open={addOpen} onOpenChange={setAddOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="h-4 w-4" />
          {t('wallets.add')}
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
          <DialogTitle>{t('wallets.add')}</DialogTitle>
          <DialogDescription>{t('wallets.editDescription')}</DialogDescription>
        </DialogHeader>
        <EditWalletForm
          onSaved={onAddedWallet}
          onProcessing={setProcessing}
          onCancel={() => setAddOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
